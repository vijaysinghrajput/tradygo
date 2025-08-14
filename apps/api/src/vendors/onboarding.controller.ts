import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { 
  OnboardingService, 
  CreateVendorOnboardingDto, 
  CreateAddressDto, 
  CreateBankAccountDto, 
  CreateKycDocumentDto,
  CompleteOnboardingDto 
} from './onboarding.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('admin/vendor-onboarding')
@ApiBearerAuth()
@Controller('admin/vendor-onboarding')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start vendor onboarding process' })
  @ApiResponse({ status: 201, description: 'Vendor onboarding started successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Vendor already exists' })
  async startOnboarding(@Body() vendorData: CreateVendorOnboardingDto) {
    return this.onboardingService.startOnboarding(vendorData);
  }

  @Post(':vendorId/address')
  @ApiOperation({ summary: 'Add address to vendor during onboarding' })
  @ApiResponse({ status: 201, description: 'Address added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async addAddress(
    @Param('vendorId') vendorId: string,
    @Body() addressData: CreateAddressDto
  ) {
    return this.onboardingService.addAddress(vendorId, addressData);
  }

  @Post(':vendorId/bank-account')
  @ApiOperation({ summary: 'Add bank account to vendor during onboarding' })
  @ApiResponse({ status: 201, description: 'Bank account added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async addBankAccount(
    @Param('vendorId') vendorId: string,
    @Body() bankData: CreateBankAccountDto
  ) {
    return this.onboardingService.addBankAccount(vendorId, bankData);
  }

  @Post(':vendorId/kyc-documents')
  @ApiOperation({ summary: 'Add KYC documents to vendor during onboarding' })
  @ApiResponse({ status: 201, description: 'KYC documents added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async addKycDocuments(
    @Param('vendorId') vendorId: string,
    @Body() kycDocuments: CreateKycDocumentDto[]
  ) {
    return this.onboardingService.addKycDocuments(vendorId, kycDocuments);
  }

  @Post('complete')
  @ApiOperation({ summary: 'Complete vendor onboarding in one step' })
  @ApiResponse({ status: 201, description: 'Vendor onboarding completed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Vendor already exists' })
  async completeOnboarding(@Body() onboardingData: CompleteOnboardingDto) {
    return this.onboardingService.completeOnboarding(onboardingData);
  }

  @Get(':vendorId/progress')
  @ApiOperation({ summary: 'Get vendor onboarding progress' })
  @ApiResponse({ status: 200, description: 'Onboarding progress retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async getOnboardingProgress(@Param('vendorId') vendorId: string) {
    return this.onboardingService.getOnboardingProgress(vendorId);
  }

  @Get(':vendorId/validate')
  @ApiOperation({ summary: 'Validate vendor onboarding completion' })
  @ApiResponse({ status: 200, description: 'Onboarding validation completed' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async validateOnboardingCompletion(@Param('vendorId') vendorId: string) {
    return this.onboardingService.validateOnboardingCompletion(vendorId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get onboarding statistics' })
  @ApiResponse({ status: 200, description: 'Onboarding statistics retrieved successfully' })
  async getOnboardingStats() {
    return this.onboardingService.getOnboardingStats();
  }
}