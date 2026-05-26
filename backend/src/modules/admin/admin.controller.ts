import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard stats' })
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers(page, limit, search, role);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status' })
  updateUserStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Get('workers/pending')
  @ApiOperation({ summary: 'Get pending worker verifications' })
  getPendingVerifications() {
    return this.adminService.getPendingVerifications();
  }

  @Patch('workers/:id/verify')
  @ApiOperation({ summary: 'Verify or reject worker' })
  verifyWorker(
    @Param('id') id: string,
    @Body('status') status: any,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.verifyWorker(id, status, reason);
  }

  @Patch('disputes/:id/resolve')
  @ApiOperation({ summary: 'Resolve dispute' })
  resolveDispute(
    @Param('id') id: string,
    @Body('resolution') resolution: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.adminService.resolveDispute(id, resolution, adminId);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get platform analytics' })
  getAnalytics(@Query('period') period?: 'week' | 'month' | 'year') {
    return this.adminService.getAnalytics(period);
  }

  @Patch('projects/:id/assign')
  @ApiOperation({ summary: 'Admin: assign worker to project directly' })
  assignWorker(
    @Param('id') projectId: string,
    @Body('workerUserId') workerUserId: string,
    @Body('finalPrice') finalPrice: number,
    @Body('commissionPercent') commissionPercent: number,
  ) {
    return this.adminService.assignWorkerToProject(projectId, workerUserId, Number(finalPrice), Number(commissionPercent));
  }

  @Get('projects')
  @ApiOperation({ summary: 'Admin: get all projects with any status' })
  getAllProjects(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllProjects(page, limit, status);
  }
}
