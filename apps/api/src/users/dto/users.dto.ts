import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone?: string;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiProperty({ example: 'male', enum: ['male', 'female', 'other'], required: false })
  @IsOptional()
  @IsString()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentPassword123' })
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @ApiProperty({ example: 'newPassword123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword: string;
}

export class CreateAddressDto {
  @ApiProperty({ example: 'home', enum: ['home', 'work', 'other'] })
  @IsString()
  @IsEnum(['home', 'work', 'other'])
  type: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  street: string;

  @ApiProperty({ example: '123 Main Street', required: false })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  addressLine?: string;

  @ApiProperty({ example: 'Near Central Park', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  landmark?: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'NY' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  state: string;

  @ApiProperty({ example: '110001' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  postalCode: string;

  @ApiProperty({ example: '110001', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  pincode?: string;

  @ApiProperty({ example: 'India' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  country: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @ApiProperty({ example: 'home', enum: ['home', 'work', 'other'], required: false })
  @IsOptional()
  @IsString()
  @IsEnum(['home', 'work', 'other'])
  type?: string;

  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({ example: '+919876543210', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone?: string;

  @ApiProperty({ example: '123 Main Street', required: false })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  street?: string;

  @ApiProperty({ example: '123 Main Street', required: false })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  addressLine?: string;

  @ApiProperty({ example: 'Near Central Park', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  landmark?: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city?: string;

  @ApiProperty({ example: 'NY', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  state?: string;

  @ApiProperty({ example: '110001', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  postalCode?: string;

  @ApiProperty({ example: '110001', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  pincode?: string;

  @ApiProperty({ example: 'India', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  country?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}