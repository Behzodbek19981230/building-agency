import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createDiskStorage, imageFileFilter } from '../../common/utils/upload.util';
import { WorkersService } from './workers.service';
import {
  CreateWorkerProfileDto,
  UpdateWorkerProfileDto,
  WorkerQueryDto,
  CreatePortfolioDto,
  UpdateStatusDto,
} from './dto/worker.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('workers')
@Controller('workers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkersController {
  constructor(private workersService: WorkersService) {}

  @Post('profile')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Create worker profile' })
  createProfile(@CurrentUser('id') userId: string, @Body() dto: CreateWorkerProfileDto) {
    return this.workersService.createProfile(userId, dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Search workers' })
  findAll(@Query() query: WorkerQueryDto) {
    return this.workersService.findAll(query);
  }

  @Get('my/profile')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Get my worker profile' })
  getMyProfile(@CurrentUser('id') userId: string) {
    return this.workersService.findByUserId(userId);
  }

  @Get('my/stats')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Get worker earnings & stats' })
  getStats(@CurrentUser('id') userId: string) {
    return this.workersService.getWorkerStats(userId);
  }

  @Get('saved')
  @Roles('CLIENT')
  @ApiOperation({ summary: 'Get saved workers (Client)' })
  getSavedWorkers(@CurrentUser('id') clientId: string) {
    return this.workersService.getSavedWorkers(clientId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get worker by profile ID' })
  findOne(@Param('id') id: string) {
    return this.workersService.findOne(id);
  }

  @Put('profile')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Update worker profile' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateWorkerProfileDto) {
    return this.workersService.updateProfile(userId, dto);
  }

  @Patch('status')
  @Roles('WORKER')
  @ApiOperation({ summary: 'Update availability status' })
  updateStatus(@CurrentUser('id') userId: string, @Body() dto: UpdateStatusDto) {
    return this.workersService.updateStatus(userId, dto);
  }

  @Post('portfolio')
  @Roles('WORKER')
  @UseInterceptors(FilesInterceptor('images', 10, { storage: createDiskStorage('portfolio'), fileFilter: imageFileFilter }))
  @ApiOperation({ summary: 'Add portfolio item' })
  addPortfolio(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePortfolioDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.workersService.addPortfolio(userId, dto, files);
  }

  @Post(':workerId/save')
  @Roles('CLIENT')
  @ApiOperation({ summary: 'Save/unsave worker (Client)' })
  saveWorker(@CurrentUser('id') clientId: string, @Param('workerId') workerId: string) {
    return this.workersService.saveWorker(clientId, workerId);
  }
}
