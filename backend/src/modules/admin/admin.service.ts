import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { UserStatus, VerificationStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalWorkers,
      totalProjects,
      totalRevenue,
      activeProjects,
      pendingVerifications,
      openDisputes,
      recentProjects,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.workerProfile.count(),
      this.prisma.project.count(),
      this.prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { commission: true } }),
      this.prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.workerProfile.count({ where: { verificationStatus: 'PENDING' } }),
      this.prisma.dispute.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } } }),
      this.prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { client: { select: { firstName: true, lastName: true } }, category: true },
      }),
    ]);

    return {
      data: {
        stats: {
          totalUsers,
          totalWorkers,
          totalProjects,
          totalRevenue: totalRevenue._sum.commission || 0,
          activeProjects,
          pendingVerifications,
          openDisputes,
        },
        recentProjects,
      },
    };
  }

  async getUsers(page = 1, limit = 20, search?: string, role?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, firstName: true, lastName: true,
          role: true, status: true, emailVerified: true, createdAt: true,
          workerProfile: { select: { id: true, verificationStatus: true, rating: true } },
        },
      }),
    ]);

    return { data: users, meta: { total, page, limit } };
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.update({ where: { id: userId }, data: { status } });
    return { message: `User status updated to ${status}` };
  }

  async verifyWorker(workerId: string, status: VerificationStatus, reason?: string) {
    const profile = await this.prisma.workerProfile.findUnique({ where: { id: workerId } });
    if (!profile) throw new NotFoundException('Worker profile not found');

    await this.prisma.workerProfile.update({
      where: { id: workerId },
      data: {
        verificationStatus: status,
        isVerified: status === 'VERIFIED',
        status: status === 'VERIFIED' ? 'AVAILABLE' : 'OFFLINE',
      },
    });

    return { message: `Worker ${status.toLowerCase()} successfully` };
  }

  async getPendingVerifications() {
    const workers = await this.prisma.workerProfile.findMany({
      where: { verificationStatus: 'PENDING' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, createdAt: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return { data: workers };
  }

  async resolveDispute(disputeId: string, resolution: string, adminId: string) {
    const dispute = await this.prisma.dispute.findUnique({ where: { id: disputeId } });
    if (!dispute) throw new NotFoundException('Dispute not found');

    await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: 'RESOLVED',
        resolution,
        resolvedAt: new Date(),
        resolvedBy: adminId,
      },
    });

    return { message: 'Dispute resolved' };
  }

  async getAnalytics(period: 'week' | 'month' | 'year' = 'month') {
    const analytics = await this.prisma.analytics.findMany({
      orderBy: { date: 'desc' },
      take: period === 'week' ? 7 : period === 'month' ? 30 : 365,
    });
    return { data: analytics };
  }

  async assignWorkerToProject(projectId: string, workerUserId: string, finalPrice?: number) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (!['OPEN', 'DRAFT'].includes(project.status)) {
      throw new BadRequestException('Project must be OPEN or DRAFT to assign a worker');
    }

    const workerProfile = await this.prisma.workerProfile.findUnique({ where: { userId: workerUserId } });
    if (!workerProfile) throw new NotFoundException('Worker profile not found for this user');

    await this.prisma.$transaction([
      this.prisma.project.update({
        where: { id: projectId },
        data: {
          status: 'IN_PROGRESS',
          assignedWorkerId: workerUserId,
          ...(finalPrice ? { finalPrice } : {}),
        },
      }),
      this.prisma.chat.upsert({
        where: { projectId },
        create: { projectId },
        update: { isActive: true },
      }),
    ]);

    return { message: 'Worker assigned to project by admin' };
  }

  async getAllProjects(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [total, items] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          client: { select: { id: true, firstName: true, lastName: true } },
          _count: { select: { bids: true } },
        },
      }),
    ]);

    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
