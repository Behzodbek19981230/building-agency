import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  MinLength,
  MaxLength,
  Min,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectUrgency } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({ example: 'Kitchen renovation' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Need full kitchen renovation including...' })
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ enum: ProjectUrgency })
  @IsEnum(ProjectUrgency)
  urgency: ProjectUrgency;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  budgetMin?: number;

  @ApiPropertyOptional({ example: 15000000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  budgetMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({ enum: ProjectUrgency })
  @IsOptional()
  @IsEnum(ProjectUrgency)
  urgency?: ProjectUrgency;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  budgetMax?: number;
}

export class ProjectQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ enum: ProjectUrgency })
  @IsOptional()
  @IsEnum(ProjectUrgency)
  urgency?: ProjectUrgency;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  budgetMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  budgetMax?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
