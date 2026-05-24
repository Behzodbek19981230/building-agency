import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewsService, CreateReviewDto } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post('project/:projectId/user/:revieweeId')
  @ApiOperation({ summary: 'Create review for a completed project' })
  create(
    @CurrentUser('id') reviewerId: string,
    @Param('projectId') projectId: string,
    @Param('revieweeId') revieweeId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(reviewerId, projectId, revieweeId, dto);
  }

  @Public()
  @Get('worker/:workerId')
  @ApiOperation({ summary: 'Get worker reviews' })
  getWorkerReviews(
    @Param('workerId') workerId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewsService.getWorkerReviews(workerId, page, limit);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get project reviews' })
  getProjectReviews(@Param('projectId') projectId: string) {
    return this.reviewsService.getProjectReviews(projectId);
  }
}
