import { Controller, Get, Post, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('project/:projectId/initiate')
  @Roles('CLIENT')
  @ApiOperation({ summary: 'Initiate payment for project (Escrow)' })
  initiate(@CurrentUser('id') clientId: string, @Param('projectId') projectId: string) {
    return this.paymentsService.initiatePayment(clientId, projectId);
  }

  @Patch(':id/release')
  @Roles('CLIENT', 'ADMIN')
  @ApiOperation({ summary: 'Release escrow to worker' })
  release(@Param('id') id: string) {
    return this.paymentsService.releasePayment(id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my payments' })
  getMyPayments(@CurrentUser('id') userId: string) {
    return this.paymentsService.getMyPayments(userId);
  }
}
