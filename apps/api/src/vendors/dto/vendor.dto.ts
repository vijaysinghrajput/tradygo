import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumberString, IsNumber, IsInt, Min, IsUUID } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsInt()
  @Min(1)
  limit: number = 20;

  @IsOptional()
  @IsString()
  search?: string;
}

export enum VendorStatusDto {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  legalName?: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  gstNumber?: string;

  @IsOptional()
  @IsString()
  panNumber?: string;
}

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  legalName?: string;
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsString()
  gstNumber?: string;
  @IsOptional()
  @IsString()
  panNumber?: string;
}

export class UpdateVendorStatusDto {
  @IsEnum(VendorStatusDto)
  status!: VendorStatusDto;
}

export class CreateAddressDto {
  @IsString() line1!: string;
  @IsOptional() @IsString() line2?: string;
  @IsString() city!: string;
  @IsString() state!: string;
  @IsString() country!: string;
  @IsString() postalCode!: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsBoolean() isDefault?: boolean;
}

export class UpdateAddressDto {
  @IsOptional() @IsString() line1?: string;
  @IsOptional() @IsString() line2?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() postalCode?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsBoolean() isDefault?: boolean;
}

export enum BankAccountStatusDto {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export class CreateBankDto {
  @IsString() accountHolder!: string;
  @IsString() accountNumber!: string;
  @IsString() ifsc!: string;
  @IsString() bankName!: string;
  @IsOptional() @IsString() branch?: string;
}

export class UpdateBankDto {
  @IsOptional() @IsString() accountHolder?: string;
  @IsOptional() @IsString() accountNumber?: string;
  @IsOptional() @IsString() ifsc?: string;
  @IsOptional() @IsString() bankName?: string;
  @IsOptional() @IsString() branch?: string;
  @IsOptional() @IsEnum(BankAccountStatusDto) status?: BankAccountStatusDto;
}

export class VerifyBankDto {
  @IsBoolean() verified!: boolean;
}

export class CreateKycDto {
  @IsString() docType!: string;
  @IsString() docUrl!: string;
}

export class UpdateKycDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() remarks?: string;
}

export class CreateCommissionDto {
  @IsString() type!: string; // PERCENTAGE | FLAT
  @IsNumber() value!: number;
  @IsOptional() @IsString() category?: string;
}

export class UpdateCommissionDto {
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsNumber() value?: number;
  @IsOptional() @IsString() category?: string;
}

export class FinalizeStatementDto {
  @IsBoolean() finalize!: boolean;
}

export class CreatePayoutDto {
  @IsNumber() amount!: number;
  @IsOptional() @IsString() reference?: string;
}

export class CompletePayoutDto {
  @IsBoolean() complete!: boolean;
}

export class CreateIssueDto {
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
}

export class UpdateIssueDto {
  @IsOptional() @IsString() status?: string;
}


