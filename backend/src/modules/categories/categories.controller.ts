import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  findAll(@Query('lang') lang?: string) {
    return this.categoriesService.findAll(lang);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: get all categories including inactive' })
  findAllAdmin() {
    return this.categoriesService.findAllAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: create category' })
  create(@Body() dto: any) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: update category' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: deactivate category' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
