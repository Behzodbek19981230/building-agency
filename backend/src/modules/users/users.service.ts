import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

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
}
