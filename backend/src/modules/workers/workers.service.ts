import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { toFileUrl } from '../../common/utils/upload.util';
import { PrismaService } from '../../config/prisma.service';
import {
  CreateWorkerProfileDto,
  UpdateWorkerProfileDto,
  WorkerQueryDto,
  CreatePortfolioDto,
  UpdateStatusDto,
} from './dto/worker.dto';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: string, dto: CreateWorkerProfileDto) {
    const existing = await this.prisma.workerProfile.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('Worker profile already exists');

    const { skills, ...profileData } = dto;

    const profile = await this.prisma.workerProfile.create({
      data: {
        userId,
        ...profileData,
        skills: skills
          ? {
              create: skills.map((s) => ({
                name: s.name,
                items: s.items?.length
                  ? { create: s.items.map((i) => ({ name: i.name, price: i.price })) }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        skills: { include: { items: true } },
        user: { select: { id: true, firstName: true, lastName: true, avatar: true, email: true } },
      },
    });

    return { data: profile, message: 'Worker profile created' };
  }

  async findAll(query: WorkerQueryDto) {
    const { page = 1, limit = 10, search, category, city, minRating, isVerified, maxRate, sortBy = 'rating', sortOrder = 'desc', status } = query;
    const skip = (page - 1) * limit;

    const where: any = status
      ? { verificationStatus: 'VERIFIED', status }
      : { verificationStatus: 'VERIFIED', status: { not: 'OFFLINE' } };

    if (search) {
      where.OR = [
        { bio: { contains: search, mode: 'insensitive' } },
        { user: { OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ]}},
      ];
    }
    if (category) where.category = category;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (minRating) where.rating = { gte: minRating };
    if (isVerified !== undefined) where.isVerified = isVerified;
    if (maxRate) where.hourlyRate = { lte: maxRate };

    const [total, items] = await Promise.all([
      this.prisma.workerProfile.count({ where }),
      this.prisma.workerProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          skills: { include: { items: true } },
          portfolio: { take: 3, select: { id: true, title: true, images: true } },
        },
      }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const profile = await this.prisma.workerProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true, phone: true, createdAt: true } },
        skills: { include: { items: true } },
        portfolio: { orderBy: { createdAt: 'desc' } },
        availability: true,
      },
    });

    if (!profile) throw new NotFoundException('Worker not found');

    const activeProjects = await this.prisma.project.findMany({
      where: { assignedWorkerId: profile.userId, status: 'IN_PROGRESS' },
      select: {
        id: true,
        title: true,
        status: true,
        startDate: true,
        endDate: true,
        city: true,
        address: true,
        urgency: true,
        category: { select: { nameUz: true, nameRu: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    return { data: { ...profile, activeProjects } };
  }

  async findByUserId(userId: string) {
    const profile = await this.prisma.workerProfile.findUnique({
      where: { userId },
      include: {
        skills: { include: { items: true } },
        portfolio: true,
        availability: true,
        user: { select: { id: true, firstName: true, lastName: true, avatar: true, email: true } },
      },
    });

    if (!profile) throw new NotFoundException('Worker profile not found');
    return { data: profile };
  }

  async updateProfile(userId: string, dto: UpdateWorkerProfileDto) {
    const profile = await this.prisma.workerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Worker profile not found');

    const { skills, ...profileData } = dto;

    const updated = await this.prisma.workerProfile.update({
      where: { userId },
      data: profileData,
      include: { skills: { include: { items: true } } },
    });

    if (skills) {
      await this.prisma.workerSkill.deleteMany({ where: { workerProfileId: profile.id } });
      for (const s of skills) {
        await this.prisma.workerSkill.create({
          data: {
            workerProfileId: profile.id,
            name: s.name,
            items: s.items?.length
              ? { create: s.items.map((i) => ({ name: i.name, price: i.price })) }
              : undefined,
          },
        });
      }
    }

    return { data: updated, message: 'Profile updated' };
  }

  async updateStatus(userId: string, dto: UpdateStatusDto) {
    const profile = await this.prisma.workerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Worker profile not found');

    await this.prisma.workerProfile.update({
      where: { userId },
      data: { status: dto.status },
    });

    return { message: `Status updated to ${dto.status}` };
  }

  async addPortfolio(userId: string, dto: CreatePortfolioDto, files?: Express.Multer.File[]) {
    const profile = await this.prisma.workerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Worker profile not found');

    const images = files?.map(toFileUrl) ?? [];

    const portfolio = await this.prisma.portfolio.create({
      data: {
        workerProfileId: profile.id,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        images,
      },
    });

    return { data: portfolio, message: 'Portfolio added' };
  }

  async getWorkerStats(userId: string) {
    const profile = await this.prisma.workerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Worker profile not found');

    const [activeProjects, pendingBids, totalEarnings] = await Promise.all([
      this.prisma.project.count({ where: { assignedWorkerId: userId, status: 'IN_PROGRESS' } }),
      this.prisma.bid.count({ where: { workerId: userId, status: 'PENDING' } }),
      this.prisma.workerProfile.findUnique({ where: { userId }, select: { totalEarnings: true } }),
    ]);

    return {
      data: {
        rating: profile.rating,
        reviewCount: profile.reviewCount,
        completedProjects: profile.completedProjects,
        activeProjects,
        pendingBids,
        totalEarnings: totalEarnings?.totalEarnings || 0,
        isVerified: profile.isVerified,
        status: profile.status,
      },
    };
  }

  async saveWorker(clientId: string, workerId: string) {
    const workerUser = await this.prisma.user.findUnique({ where: { id: workerId } });
    if (!workerUser) throw new NotFoundException('Worker not found');

    const existing = await this.prisma.savedWorker.findUnique({
      where: { clientId_workerId: { clientId, workerId } },
    });

    if (existing) {
      await this.prisma.savedWorker.delete({ where: { id: existing.id } });
      return { message: 'Worker removed from saved', saved: false };
    }

    await this.prisma.savedWorker.create({ data: { clientId, workerId } });
    return { message: 'Worker saved', saved: true };
  }

  async getSavedWorkers(clientId: string) {
    const saved = await this.prisma.savedWorker.findMany({
      where: { clientId },
      include: {
        worker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            workerProfile: { select: { id: true, category: true, rating: true, isVerified: true, city: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: saved };
  }
}
