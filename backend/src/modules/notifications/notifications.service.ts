import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, type: NotificationType, title: string, body: string, data?: any) {
    return this.prisma.notification.create({
      data: { userId, type, title, body, data },
    });
  }

  async getAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, notifications] = await Promise.all([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { data: notifications, meta: { total, page, limit } };
  }

  async markRead(notificationId: string, userId: string) {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
    return { message: 'Marked as read' };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { message: 'All notifications marked as read' };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { data: { count } };
  }

  async deleteOld(daysOld = 30) {
    const date = new Date();
    date.setDate(date.getDate() - daysOld);
    await this.prisma.notification.deleteMany({
      where: { createdAt: { lt: date }, isRead: true },
    });
  }
}
