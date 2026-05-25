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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createDiskStorage, imageFileFilter } from '../../common/utils/upload.util';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './dto/project.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @Roles('CLIENT')
  @UseInterceptors(FilesInterceptor('images', 10, { storage: createDiskStorage('projects'), fileFilter: imageFileFilter }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create new project (Client)' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProjectDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.projectsService.create(userId, dto, files);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all open projects' })
  findAll(@Query() query: ProjectQueryDto, @CurrentUser('id') userId?: string) {
    return this.projectsService.findAll(query, userId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my projects (Client or Worker)' })
  getMyProjects(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Query('status') status?: any,
  ) {
    return this.projectsService.getMyProjects(userId, status, role);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  findOne(@Param('id') id: string, @CurrentUser('id') userId?: string) {
    return this.projectsService.findOne(id, userId);
  }

  @Put(':id')
  @Roles('CLIENT')
  @ApiOperation({ summary: 'Update project (Client)' })
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, userId, dto);
  }

  @Patch(':id/assign/:workerId')
  @Roles('CLIENT')
  @ApiOperation({ summary: 'Assign worker to project (Client)' })
  assignWorker(
    @Param('id') projectId: string,
    @Param('workerId') workerId: string,
    @Body('bidId') bidId: string,
    @CurrentUser('id') clientId: string,
  ) {
    return this.projectsService.assignWorker(projectId, workerId, bidId, clientId);
  }

  @Patch(':id/complete')
  @Roles('CLIENT')
  @ApiOperation({ summary: 'Mark project as completed (Client)' })
  completeProject(@Param('id') id: string, @CurrentUser('id') clientId: string) {
    return this.projectsService.completeProject(id, clientId);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel project' })
  cancel(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: any,
  ) {
    return this.projectsService.cancel(id, userId, role);
  }
}
