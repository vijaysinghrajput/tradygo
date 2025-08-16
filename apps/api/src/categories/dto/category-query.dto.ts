import { IsOptional, IsEnum, IsString, IsInt, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CategoryStatus } from '@prisma/client';

export class CategoryQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  level?: number;

  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isVisible?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  includeChildren?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: string = 'sortOrder';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}