import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkerCategory, WorkerStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateWorkerProfileDto {
  @ApiProperty({ enum: WorkerCategory })
  @IsEnum(WorkerCategory)
  category: WorkerCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  @Type(() => Number)
  experience?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  hourlyRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  dailyRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minProjectBudget?: number;

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

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}

export class UpdateWorkerProfileDto extends CreateWorkerProfileDto {}

export class WorkerQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: WorkerCategory })
  @IsOptional()
  @IsEnum(WorkerCategory)
  category?: WorkerCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minRating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isVerified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxRate?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 12;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy?: string = 'rating';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class CreatePortfolioDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ enum: WorkerCategory })
  @IsEnum(WorkerCategory)
  category: WorkerCategory;
}

export class UpdateStatusDto {
  @ApiProperty({ enum: WorkerStatus })
  @IsEnum(WorkerStatus)
  status: WorkerStatus;
}
