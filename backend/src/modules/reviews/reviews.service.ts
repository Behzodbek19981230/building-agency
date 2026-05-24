import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(reviewerId: string, projectId: string, revieweeId: string, dto: CreateReviewDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.status !== 'COMPLETED') throw new BadRequestException('Project must be completed to leave a review');

    const isParticipant = project.clientId === reviewerId || project.assignedWorkerId === reviewerId;
    if (!isParticipant) throw new ForbiddenException('You are not a participant of this project');

    const existing = await this.prisma.review.findUnique({
      where: { projectId_reviewerId: { projectId, reviewerId } },
    });
    if (existing) throw new ConflictException('You already reviewed this project');

    const review = await this.prisma.review.create({
      data: {
        projectId,
        reviewerId,
        revieweeId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        reviewer: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
    });

    // Update worker rating
    const workerProfile = await this.prisma.workerProfile.findUnique({ where: { userId: revieweeId } });
    if (workerProfile) {
      const reviews = await this.prisma.review.findMany({
        where: { revieweeId, isPublic: true },
        select: { rating: true },
      });
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await this.prisma.workerProfile.update({
        where: { userId: revieweeId },
        data: { rating: Math.round(avg * 10) / 10, reviewCount: reviews.length },
      });
    }

    return { data: review, message: 'Review submitted' };
  }

  async getWorkerReviews(workerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [total, reviews] = await Promise.all([
      this.prisma.review.count({ where: { revieweeId: workerId, isPublic: true } }),
      this.prisma.review.findMany({
        where: { revieweeId: workerId, isPublic: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reviewer: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          project: { select: { id: true, title: true } },
        },
      }),
    ]);

    return { data: reviews, meta: { total, page, limit } };
  }

  async getProjectReviews(projectId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { projectId },
      include: {
        reviewer: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        reviewee: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
    });
    return { data: reviews };
  }
}
