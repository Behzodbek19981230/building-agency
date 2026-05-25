import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { ProjectStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        avatar: true, role: true, status: true, phone: true,
        emailVerified: true, phoneVerified: true, createdAt: true,
        workerProfile: { select: { id: true, category: true, rating: true, isVerified: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return { data: user };
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true },
    });
    return { data: user, message: 'Profile updated' };
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { avatar: avatarUrl } });
    return { message: 'Avatar updated', avatarUrl };
  }

  async getPublicProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, firstName: true, lastName: true, avatar: true,
        role: true, createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const [projects, reviewsReceived] = await Promise.all([
      this.prisma.project.findMany({
        where: { clientId: id },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true, title: true, status: true, createdAt: true,
          budgetMin: true, budgetMax: true, finalPrice: true,
          city: true,
          category: { select: { nameUz: true } },
          _count: { select: { bids: true } },
        },
      }),
      this.prisma.review.findMany({
        where: { revieweeId: id, isPublic: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          reviewer: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          project: { select: { id: true, title: true } },
        },
      }),
    ]);

    const avgRating =
      reviewsReceived.length > 0
        ? reviewsReceived.reduce((s, r) => s + r.rating, 0) / reviewsReceived.length
        : null;

    return { data: { ...user, projects, reviewsReceived, avgRating } };
  }
}
