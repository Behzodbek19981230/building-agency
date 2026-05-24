import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BidsService, CreateBidDto } from './bids.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('bids')
@Controller('bids')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BidsController {
  constructor(private bidsService: BidsService) {}

  @Post('project/:projectId')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Place a bid on project (Worker)' })
  create(
    @CurrentUser('id') workerId: string,
    @Param('projectId') projectId: string,
    @Body() dto: CreateBidDto,
  ) {
    return this.bidsService.create(workerId, projectId, dto);
  }

  @Get('project/:projectId')
  @Roles('CLIENT')
  @ApiOperation({ summary: 'Get project bids (Client)' })
  getProjectBids(@Param('projectId') projectId: string, @CurrentUser('id') userId: string) {
    return this.bidsService.getProjectBids(projectId, userId);
  }

  @Get('my')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Get my bids (Worker)' })
  getMyBids(@CurrentUser('id') workerId: string) {
    return this.bidsService.getMyBids(workerId);
  }

  @Put(':id')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Update bid (Worker)' })
  update(@Param('id') id: string, @CurrentUser('id') workerId: string, @Body() dto: Partial<CreateBidDto>) {
    return this.bidsService.updateBid(id, workerId, dto);
  }

  @Delete(':id')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Withdraw bid (Worker)' })
  withdraw(@Param('id') id: string, @CurrentUser('id') workerId: string) {
    return this.bidsService.withdrawBid(id, workerId);
  }
}
