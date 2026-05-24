import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

export class CreateBidDto {
  amount: number;
  message: string;
  duration?: number;
  durationUnit?: string;
}

@Injectable()
export class BidsService {
  constructor(private prisma: PrismaService) {}

  async create(workerId: string, projectId: string, dto: CreateBidDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.status !== 'OPEN') throw new BadRequestException('Project is not accepting bids');

    const workerProfile = await this.prisma.workerProfile.findUnique({ where: { userId: workerId } });
    if (!workerProfile) throw new NotFoundException('Worker profile not found');
    if (!workerProfile.isVerified) throw new ForbiddenException('Your profile must be verified to bid');

    const existing = await this.prisma.bid.findUnique({
      where: { projectId_workerId: { projectId, workerId } },
    });
    if (existing) throw new ConflictException('You already placed a bid on this project');

    const bid = await this.prisma.bid.create({
      data: {
        projectId,
        workerId,
        workerProfileId: workerProfile.id,
        amount: dto.amount,
        message: dto.message,
        duration: dto.duration,
        durationUnit: dto.durationUnit,
      },
      include: {
        worker: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        workerProfile: { select: { id: true, rating: true, completedProjects: true, isVerified: true, category: true } },
      },
    });

    await this.prisma.project.update({
      where: { id: projectId },
      data: { bidCount: { increment: 1 } },
    });

    return { data: bid, message: 'Bid placed successfully' };
  }

  async getProjectBids(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.clientId !== userId) throw new ForbiddenException('Not your project');

    const bids = await this.prisma.bid.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        worker: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        workerProfile: {
          select: {
            id: true, rating: true, completedProjects: true, isVerified: true,
            category: true, experience: true, bio: true, city: true,
          },
        },
      },
    });

    return { data: bids };
  }

  async getMyBids(workerId: string) {
    const bids = await this.prisma.bid.findMany({
      where: { workerId },
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          include: {
            images: { take: 1 },
            category: true,
            client: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          },
        },
      },
    });

    return { data: bids };
  }

  async updateBid(bidId: string, workerId: string, dto: Partial<CreateBidDto>) {
    const bid = await this.prisma.bid.findUnique({ where: { id: bidId } });
    if (!bid) throw new NotFoundException('Bid not found');
    if (bid.workerId !== workerId) throw new ForbiddenException('Not your bid');
    if (bid.status !== 'PENDING') throw new BadRequestException('Cannot update non-pending bid');

    const updated = await this.prisma.bid.update({
      where: { id: bidId },
      data: dto,
    });

    return { data: updated, message: 'Bid updated' };
  }

  async withdrawBid(bidId: string, workerId: string) {
    const bid = await this.prisma.bid.findUnique({ where: { id: bidId } });
    if (!bid) throw new NotFoundException('Bid not found');
    if (bid.workerId !== workerId) throw new ForbiddenException('Not your bid');
    if (bid.status !== 'PENDING') throw new BadRequestException('Cannot withdraw non-pending bid');

    await this.prisma.bid.update({ where: { id: bidId }, data: { status: 'WITHDRAWN' } });
    await this.prisma.project.update({
      where: { id: bid.projectId },
      data: { bidCount: { decrement: 1 } },
    });

    return { message: 'Bid withdrawn' };
  }
}
