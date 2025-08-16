import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum, IsDecimal, Min, Max } from 'class-validator';
import { CommissionType } from '@prisma/client';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsNumber()
  @IsOptional()
  @Min(0)
  displayOrder?: number = 0;

  // Commission fields
  @IsEnum(CommissionType)
  @IsOptional()
  commissionType?: CommissionType = CommissionType.PERCENTAGE;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  commissionValue?: number = 0;

  @IsBoolean()
  @IsOptional()
  hasCustomCommission?: boolean = false;

  // SEO fields
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  metaKeywords?: string;
}