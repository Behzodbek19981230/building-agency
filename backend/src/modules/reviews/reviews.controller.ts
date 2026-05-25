import {
  Controller, Get, Post, Body, Param, Query, UseGuards,
  UseInterceptors, UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createDiskStorage, imageFileFilter } from '../../common/utils/upload.util';
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
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: createDiskStorage('reviews'),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create review for a completed project (with optional images)' })
  create(
    @CurrentUser('id') reviewerId: string,
    @Param('projectId') projectId: string,
    @Param('revieweeId') revieweeId: string,
    @Body() dto: CreateReviewDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.reviewsService.createReview(reviewerId, projectId, revieweeId, dto, files);
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

  @Public()
  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get client reviews received' })
  getClientReviews(
    @Param('clientId') clientId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewsService.getClientReviews(clientId, page, limit);
  }

  @Public()
  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get project reviews' })
  getProjectReviews(@Param('projectId') projectId: string) {
    return this.reviewsService.getProjectReviews(projectId);
  }
}
