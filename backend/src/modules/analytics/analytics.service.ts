import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async recordDailyMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [newUsers, newProjects, completedProjects, revenue] = await Promise.all([
      this.prisma.user.count({ where: { createdAt: { gte: today } } }),
      this.prisma.project.count({ where: { createdAt: { gte: today } } }),
      this.prisma.project.count({ where: { status: 'COMPLETED', updatedAt: { gte: today } } }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED', updatedAt: { gte: today } },
        _sum: { commission: true },
      }),
    ]);

    const metrics = [
      { metric: 'new_users', value: newUsers },
      { metric: 'new_projects', value: newProjects },
      { metric: 'completed_projects', value: completedProjects },
      { metric: 'revenue', value: Number(revenue._sum.commission || 0) },
    ];

    for (const m of metrics) {
      await this.prisma.analytics.upsert({
        where: { date_metric: { date: today, metric: m.metric } },
        create: { date: today, metric: m.metric, value: m.value },
        update: { value: m.value },
      });
    }
  }
}
