import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get my profile' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update profile' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: { firstName?: string; lastName?: string; phone?: string },
  ) {
    return this.usersService.updateProfile(userId, body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
