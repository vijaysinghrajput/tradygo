import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IsEmail, IsOptional, IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVendorOnboardingDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  legalName?: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  gstNumber?: string;

  @IsOptional()
  @IsString()
  panNumber?: string;
}

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  line1!: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;

  @IsNotEmpty()
  @IsString()
  country!: string;

  @IsNotEmpty()
  @IsString()
  postalCode!: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  isDefault?: boolean;
}

export class CreateBankAccountDto {
  @IsNotEmpty()
  @IsString()
  accountHolder!: string;

  @IsNotEmpty()
  @IsString()
  accountNumber!: string;

  @IsNotEmpty()
  @IsString()
  ifsc!: string;

  @IsNotEmpty()
  @IsString()
  bankName!: string;

  @IsOptional()
  @IsString()
  branch?: string;
}

export class CreateKycDocumentDto {
  @IsNotEmpty()
  @IsString()
  docType!: string;

  @IsNotEmpty()
  @IsString()
  docUrl!: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CompleteOnboardingDto {
  @ValidateNested()
  @Type(() => CreateVendorOnboardingDto)
  vendor!: CreateVendorOnboardingDto;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address!: CreateAddressDto;

  @ValidateNested()
  @Type(() => CreateBankAccountDto)
  bankAccount!: CreateBankAccountDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateKycDocumentDto)
  kycDocuments?: CreateKycDocumentDto[];
}

export interface OnboardingProgress {
  vendorId: string;
  currentStep: 'business' | 'address' | 'bank' | 'kyc' | 'completed';
  completedSteps: string[];
  businessInfo?: any;
  addressInfo?: any;
  bankAccountInfo?: any;
  kycDocuments?: any[];
}

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  // Start vendor onboarding process
  async startOnboarding(vendorData: CreateVendorOnboardingDto) {
    try {
      // Check if vendor with email already exists
      const existingVendor = await (this.prisma as any).vendor.findUnique({
        where: { email: vendorData.email },
      });

      if (existingVendor) {
        throw new ConflictException('Vendor with this email already exists');
      }

      // Check GST and PAN uniqueness if provided
      if (vendorData.gstNumber) {
        const existingGst = await (this.prisma as any).vendor.findUnique({
          where: { gstNumber: vendorData.gstNumber },
        });
        if (existingGst) {
          throw new ConflictException('Vendor with this GST number already exists');
        }
      }

      if (vendorData.panNumber) {
        const existingPan = await (this.prisma as any).vendor.findUnique({
          where: { panNumber: vendorData.panNumber },
        });
        if (existingPan) {
          throw new ConflictException('Vendor with this PAN number already exists');
        }
      }

      // Create vendor with PENDING status
      const vendor = await (this.prisma as any).vendor.create({
        data: {
          ...vendorData,
          status: 'PENDING',
          settings: {
            create: {
              autoPayout: false,
              defaultCommissionType: 'PERCENTAGE',
              defaultCommissionValue: new Prisma.Decimal(5),
            },
          },
        },
        include: {
          settings: true,
        },
      });

      return {
        vendor,
        progress: {
          vendorId: vendor.id,
          currentStep: 'address',
          completedSteps: ['business'],
          businessInfo: vendorData,
        },
      };
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw error;
      }
      // Prisma unique constraint
      if (error?.code === 'P2002') {
        const target = Array.isArray(error?.meta?.target) ? error.meta.target.join(', ') : 'unique field';
        throw new ConflictException(`Vendor with this ${target} already exists`);
      }
      throw new BadRequestException(error?.message || 'Failed to start vendor onboarding. Please ensure database is properly configured.');
    }
  }

  // Add address to vendor
  async addAddress(vendorId: string, addressData: CreateAddressDto) {
    try {
      // Verify vendor exists
      const vendor = await (this.prisma as any).vendor.findUnique({
        where: { id: vendorId },
      });

      if (!vendor) {
        throw new BadRequestException('Vendor not found');
      }

      // If this is set as default, unset other defaults
      if (addressData.isDefault) {
        await (this.prisma as any).vendorAddress.updateMany({
          where: { vendorId },
          data: { isDefault: false },
        });
      }

      const address = await (this.prisma as any).vendorAddress.create({
        data: {
          vendorId,
          ...addressData,
          type: addressData.type || 'BUSINESS',
          isDefault: addressData.isDefault ?? true,
        },
      });

      return {
        address,
        progress: {
          vendorId,
          currentStep: 'bank',
          completedSteps: ['business', 'address'],
          addressInfo: addressData,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to add address. Please ensure database is properly configured.');
    }
  }

  // Add bank account to vendor
  async addBankAccount(vendorId: string, bankData: CreateBankAccountDto) {
    try {
      // Verify vendor exists
      const vendor = await (this.prisma as any).vendor.findUnique({
        where: { id: vendorId },
      });

      if (!vendor) {
        throw new BadRequestException('Vendor not found');
      }

      const bankAccount = await (this.prisma as any).vendorBankAccount.create({
        data: {
          vendorId,
          ...bankData,
          status: 'UNVERIFIED',
        },
      });

      return {
        bankAccount,
        progress: {
          vendorId,
          currentStep: 'kyc',
          completedSteps: ['business', 'address', 'bank'],
          bankAccountInfo: bankData,
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to add bank account. Please ensure database is properly configured.');
    }
  }

  // Add KYC documents to vendor
  async addKycDocuments(vendorId: string, kycDocuments: CreateKycDocumentDto[]) {
    try {
      // Verify vendor exists
      const vendor = await (this.prisma as any).vendor.findUnique({
        where: { id: vendorId },
      });

      if (!vendor) {
        throw new BadRequestException('Vendor not found');
      }

      const createdDocuments = await Promise.all(
        kycDocuments.map(doc => 
          (this.prisma as any).vendorKyc.create({
            data: {
              vendorId,
              ...doc,
              status: 'PENDING',
            },
          })
        )
      );

      return {
        kycDocuments: createdDocuments,
        progress: {
          vendorId,
          currentStep: 'completed',
          completedSteps: ['business', 'address', 'bank', 'kyc'],
          kycDocuments: createdDocuments,
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to add KYC documents. Please ensure database is properly configured.');
    }
  }

  // Complete onboarding in one step
  async completeOnboarding(onboardingData: CompleteOnboardingDto) {
    try {
      // Start transaction-like process
      const vendorResult = await this.startOnboarding(onboardingData.vendor);
      const vendorId = vendorResult.vendor.id;

      // Add address
      await this.addAddress(vendorId, onboardingData.address);

      // Add bank account
      await this.addBankAccount(vendorId, onboardingData.bankAccount);

      // Add KYC documents if provided
      let kycResult = null;
      if (onboardingData.kycDocuments && onboardingData.kycDocuments.length > 0) {
        kycResult = await this.addKycDocuments(vendorId, onboardingData.kycDocuments);
      }

      // Get complete vendor data
      const completeVendor = await (this.prisma as any).vendor.findUnique({
        where: { id: vendorId },
        include: {
          addresses: true,
          bankAccounts: true,
          kyc: true,
          settings: true,
        },
      });

      return {
        vendor: completeVendor,
        progress: {
          vendorId,
          currentStep: 'completed',
          completedSteps: ['business', 'address', 'bank', 'kyc'],
        },
        message: 'Vendor onboarding completed successfully',
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to complete vendor onboarding. Please ensure database is properly configured.');
    }
  }

  // Get onboarding progress
  async getOnboardingProgress(vendorId: string): Promise<OnboardingProgress> {
    try {
      const vendor = await (this.prisma as any).vendor.findUnique({
        where: { id: vendorId },
        include: {
          addresses: true,
          bankAccounts: true,
          kyc: true,
        },
      });

      if (!vendor) {
        throw new BadRequestException('Vendor not found');
      }

      const completedSteps = ['business']; // Business info is always completed if vendor exists
      let currentStep: OnboardingProgress['currentStep'] = 'address';

      if (vendor.addresses && vendor.addresses.length > 0) {
        completedSteps.push('address');
        currentStep = 'bank';
      }

      if (vendor.bankAccounts && vendor.bankAccounts.length > 0) {
        completedSteps.push('bank');
        currentStep = 'kyc';
      }

      if (vendor.kyc && vendor.kyc.length > 0) {
        completedSteps.push('kyc');
        currentStep = 'completed';
      }

      return {
        vendorId: vendor.id,
        currentStep,
        completedSteps,
        businessInfo: {
          name: vendor.name,
          legalName: vendor.legalName,
          email: vendor.email,
          phone: vendor.phone,
          gstNumber: vendor.gstNumber,
          panNumber: vendor.panNumber,
        },
        addressInfo: vendor.addresses?.[0] || null,
        bankAccountInfo: vendor.bankAccounts?.[0] || null,
        kycDocuments: vendor.kyc || [],
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to get onboarding progress. Please ensure database is properly configured.');
    }
  }

  // Validate onboarding completion
  async validateOnboardingCompletion(vendorId: string) {
    try {
      const progress = await this.getOnboardingProgress(vendorId);
      
      const isComplete = progress.completedSteps.includes('business') &&
                        progress.completedSteps.includes('address') &&
                        progress.completedSteps.includes('bank');
      
      const hasKyc = progress.completedSteps.includes('kyc');
      
      return {
        isComplete,
        hasKyc,
        missingSteps: ['business', 'address', 'bank', 'kyc'].filter(
          step => !progress.completedSteps.includes(step)
        ),
        progress,
      };
    } catch (error) {
      throw new BadRequestException('Failed to validate onboarding completion. Please ensure database is properly configured.');
    }
  }

  // Get onboarding statistics
  async getOnboardingStats() {
    try {
      const [totalVendors, pendingVendors, incompleteOnboarding] = await Promise.all([
        (this.prisma as any).vendor.count(),
        (this.prisma as any).vendor.count({ where: { status: 'PENDING' } }),
        (this.prisma as any).vendor.count({
          where: {
            OR: [
              { addresses: { none: {} } },
              { bankAccounts: { none: {} } },
            ],
          },
        }),
      ]);

      return {
        totalVendors,
        pendingVendors,
        incompleteOnboarding,
        completedOnboarding: totalVendors - incompleteOnboarding,
      };
    } catch (error) {
      throw new BadRequestException('Failed to get onboarding statistics. Please ensure database is properly configured.');
    }
  }
}