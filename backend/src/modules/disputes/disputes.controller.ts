import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DisputesService } from './disputes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('disputes')
@Controller('disputes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DisputesController {
  constructor(private disputesService: DisputesService) {}

  @Post('project/:projectId')
  create(
    @CurrentUser('id') userId: string,
    @Param('projectId') projectId: string,
    @Body('reason') reason: string,
    @Body('description') description: string,
  ) {
    return this.disputesService.create(userId, projectId, reason, description);
  }

  @Get('my')
  getMyDisputes(@CurrentUser('id') userId: string) {
    return this.disputesService.getMyDisputes(userId);
  }

  @Get()
  @Roles('ADMIN')
  getAllDisputes(@Query('status') status?: string) {
    return this.disputesService.getAllDisputes(status);
  }
}
