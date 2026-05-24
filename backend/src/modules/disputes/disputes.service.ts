import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, projectId: string, reason: string, description: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const isParticipant = project.clientId === userId || project.assignedWorkerId === userId;
    if (!isParticipant) throw new ForbiddenException('Not a participant');

    const dispute = await this.prisma.dispute.create({
      data: { projectId, openedById: userId, reason, description },
    });

    await this.prisma.project.update({ where: { id: projectId }, data: { status: 'DISPUTED' } });

    return { data: dispute, message: 'Dispute opened' };
  }

  async getMyDisputes(userId: string) {
    const disputes = await this.prisma.dispute.findMany({
      where: { openedById: userId },
      include: { project: { select: { id: true, title: true, status: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { data: disputes };
  }

  async getAllDisputes(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    const disputes = await this.prisma.dispute.findMany({
      where,
      include: {
        project: { select: { id: true, title: true } },
        openedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { data: disputes };
  }
}
