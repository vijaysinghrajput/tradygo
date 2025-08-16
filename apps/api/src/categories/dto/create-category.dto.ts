import { IsString, IsOptional, IsEnum, IsInt, IsBoolean, IsDecimal, IsUrl, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CategoryStatus, CommissionType } from '@prisma/client';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @Transform(({ value }) => value?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  level?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;

  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @IsOptional()
  @IsEnum(CommissionType)
  commissionType?: CommissionType;

  @IsOptional()
  @IsDecimal({ decimal_digits: '2' })
  @Transform(({ value }) => parseFloat(value))
  commissionValue?: number;

  @IsOptional()
  @IsBoolean()
  inheritCommission?: boolean;
}