import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async initiatePayment(clientId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const clientRate = this.config.get<number>('commission.clientRate', 0.05);
    const workerRate = this.config.get<number>('commission.workerRate', 0.10);
    const amount = Number(project.finalPrice) || 0;
    const commission = amount * (clientRate + workerRate);
    const netAmount = amount - amount * workerRate;

    const payment = await this.prisma.payment.create({
      data: {
        projectId,
        payerId: clientId,
        amount,
        commission,
        netAmount,
        status: 'PENDING',
      },
    });

    await this.prisma.escrowTransaction.create({
      data: { paymentId: payment.id, amount },
    });

    return { data: payment, message: 'Payment initiated. Funds held in escrow.' };
  }

  async releasePayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { escrowTransaction: true, project: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    await this.prisma.$transaction([
      this.prisma.payment.update({ where: { id: paymentId }, data: { status: 'COMPLETED' } }),
      this.prisma.escrowTransaction.update({
        where: { paymentId },
        data: { status: 'RELEASED', releasedAt: new Date() },
      }),
      this.prisma.workerProfile.update({
        where: { userId: payment.project.assignedWorkerId },
        data: {
          totalEarnings: { increment: Number(payment.netAmount) },
          completedProjects: { increment: 1 },
        },
      }),
    ]);

    return { message: 'Payment released to worker' };
  }

  async getMyPayments(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { payerId: userId },
      include: {
        project: { select: { id: true, title: true } },
        escrowTransaction: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { data: payments };
  }
}
