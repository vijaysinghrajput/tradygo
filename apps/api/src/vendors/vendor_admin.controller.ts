import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { VendorService } from './vendor.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  PaginationDto,
  CreateVendorDto,
  UpdateVendorDto,
  UpdateVendorStatusDto,
  CreateAddressDto,
  UpdateAddressDto,
  CreateBankDto,
  UpdateBankDto,
  VerifyBankDto,
  CreateKycDto,
  UpdateKycDto,
  CreateCommissionDto,
  UpdateCommissionDto,
  FinalizeStatementDto,
  CreatePayoutDto,
  CompletePayoutDto,
  CreateIssueDto,
  UpdateIssueDto,
} from './dto/vendor.dto';
import { Body as ReqBody } from '@nestjs/common';
import { VendorService } from './vendor.service';

@ApiTags('admin/vendors')
@ApiBearerAuth()
@Controller('admin/vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@SkipThrottle()
export class VendorAdminController {
  constructor(private readonly vendorService: VendorService) {}

  // Vendors CRUD
  @Get()
  @ApiOperation({ summary: 'Get all vendors with pagination and search' })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully' })
  async getVendors(@Query() pagination: PaginationDto) {
    return this.vendorService.findAll(pagination);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor created successfully' })
  async createVendor(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiResponse({ status: 200, description: 'Vendor retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async getVendor(@Param('id') id: string) {
    return this.vendorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vendor' })
  @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async updateVendor(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(id, updateVendorDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update vendor status' })
  @ApiResponse({ status: 200, description: 'Vendor status updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async updateVendorStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateVendorStatusDto) {
    return this.vendorService.updateStatus(id, updateStatusDto);
  }

  // Addresses
  @Get(':id/addresses')
  @ApiOperation({ summary: 'Get vendor addresses' })
  async getVendorAddresses(@Param('id') vendorId: string) {
    return this.vendorService.getAddresses(vendorId);
  }

  @Post(':id/addresses')
  @ApiOperation({ summary: 'Add vendor address' })
  async addVendorAddress(@Param('id') vendorId: string, @Body() createAddressDto: CreateAddressDto) {
    return this.vendorService.createAddress(vendorId, createAddressDto);
  }

  @Patch('addresses/:addressId')
  @ApiOperation({ summary: 'Update vendor address' })
  async updateVendorAddress(@Param('addressId') addressId: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.vendorService.updateAddress(addressId, updateAddressDto);
  }

  @Delete('addresses/:addressId')
  @ApiOperation({ summary: 'Delete vendor address' })
  async deleteVendorAddress(@Param('addressId') addressId: string) {
    return this.vendorService.deleteAddress(addressId);
  }

  // Bank Accounts
  @Get(':id/bank-accounts')
  @ApiOperation({ summary: 'Get vendor bank accounts' })
  async getVendorBankAccounts(@Param('id') vendorId: string) {
    return this.vendorService.getBankAccounts(vendorId);
  }

  @Post(':id/bank-accounts')
  @ApiOperation({ summary: 'Add vendor bank account' })
  async addVendorBankAccount(@Param('id') vendorId: string, @Body() createBankDto: CreateBankDto) {
    return this.vendorService.createBankAccount(vendorId, createBankDto);
  }

  @Patch('bank-accounts/:bankId')
  @ApiOperation({ summary: 'Update vendor bank account' })
  async updateVendorBankAccount(@Param('bankId') bankId: string, @Body() updateBankDto: UpdateBankDto) {
    return this.vendorService.updateBankAccount(bankId, updateBankDto);
  }

  @Patch('bank-accounts/:bankId/verify')
  @ApiOperation({ summary: 'Verify vendor bank account' })
  async verifyVendorBankAccount(@Param('bankId') bankId: string, @Body() verifyBankDto: VerifyBankDto) {
    return this.vendorService.verifyBankAccount(bankId, verifyBankDto);
  }

  @Delete('bank-accounts/:bankId')
  @ApiOperation({ summary: 'Delete vendor bank account' })
  async deleteVendorBankAccount(@Param('bankId') bankId: string) {
    return this.vendorService.deleteBankAccount(bankId);
  }

  // KYC
  @Get(':id/kyc')
  @ApiOperation({ summary: 'Get vendor KYC documents' })
  async getVendorKyc(@Param('id') vendorId: string) {
    return this.vendorService.getKyc(vendorId);
  }

  @Post(':id/kyc')
  @ApiOperation({ summary: 'Upload vendor KYC document' })
  async addVendorKyc(@Param('id') vendorId: string, @Body() createKycDto: CreateKycDto) {
    return this.vendorService.createKyc(vendorId, createKycDto);
  }

  @Patch('kyc/:kycId')
  @ApiOperation({ summary: 'Update vendor KYC document' })
  async updateVendorKyc(@Param('kycId') kycId: string, @Body() updateKycDto: UpdateKycDto) {
    return this.vendorService.updateKyc(kycId, updateKycDto);
  }

  @Delete('kyc/:kycId')
  @ApiOperation({ summary: 'Delete vendor KYC document' })
  async deleteVendorKyc(@Param('kycId') kycId: string) {
    return this.vendorService.deleteKyc(kycId);
  }

  // Commission Rules
  @Get(':id/commissions')
  @ApiOperation({ summary: 'Get vendor commission rules' })
  async getVendorCommissions(@Param('id') vendorId: string) {
    return this.vendorService.getCommissions(vendorId);
  }

  @Post(':id/commissions')
  @ApiOperation({ summary: 'Create vendor commission rule' })
  async createVendorCommission(@Param('id') vendorId: string, @Body() createCommissionDto: CreateCommissionDto) {
    return this.vendorService.createCommission(vendorId, createCommissionDto);
  }

  @Patch('commissions/:ruleId')
  @ApiOperation({ summary: 'Update vendor commission rule' })
  async updateVendorCommission(@Param('ruleId') ruleId: string, @Body() updateCommissionDto: UpdateCommissionDto) {
    return this.vendorService.updateCommission(ruleId, updateCommissionDto);
  }

  @Delete('commissions/:ruleId')
  @ApiOperation({ summary: 'Delete vendor commission rule' })
  async deleteVendorCommission(@Param('ruleId') ruleId: string) {
    return this.vendorService.deleteCommission(ruleId);
  }

  // Statements
  @Get(':id/statements')
  @ApiOperation({ summary: 'Get vendor statements' })
  async getVendorStatements(@Param('id') vendorId: string) {
    return this.vendorService.getStatements(vendorId);
  }

  @Patch('statements/:id/finalize')
  @ApiOperation({ summary: 'Finalize vendor statement' })
  async finalizeVendorStatement(@Param('id') statementId: string, @Body() finalizeDto: FinalizeStatementDto) {
    return this.vendorService.finalizeStatement(statementId, finalizeDto);
  }

  // Payouts
  @Get(':id/payouts')
  @ApiOperation({ summary: 'Get vendor payouts' })
  async getVendorPayouts(@Param('id') vendorId: string) {
    return this.vendorService.getPayouts(vendorId);
  }

  @Post(':id/payouts')
  @ApiOperation({ summary: 'Create vendor payout' })
  async createVendorPayout(@Param('id') vendorId: string, @Body() createPayoutDto: CreatePayoutDto) {
    return this.vendorService.createPayout(vendorId, createPayoutDto);
  }

  @Patch('payouts/:id/complete')
  @ApiOperation({ summary: 'Complete vendor payout' })
  async completeVendorPayout(@Param('id') payoutId: string, @Body() completePayoutDto: CompletePayoutDto) {
    return this.vendorService.completePayout(payoutId, completePayoutDto);
  }

  // Issues
  @Get(':id/issues')
  @ApiOperation({ summary: 'Get vendor issues' })
  async getVendorIssues(@Param('id') vendorId: string) {
    return this.vendorService.getIssues(vendorId);
  }

  @Post(':id/issues')
  @ApiOperation({ summary: 'Create vendor issue' })
  async createVendorIssue(@Param('id') vendorId: string, @Body() createIssueDto: CreateIssueDto) {
    return this.vendorService.createIssue(vendorId, createIssueDto);
  }

  @Patch('issues/:id')
  @ApiOperation({ summary: 'Update vendor issue' })
  async updateVendorIssue(@Param('id') issueId: string, @Body() updateIssueDto: UpdateIssueDto) {
    return this.vendorService.updateIssue(issueId, updateIssueDto);
  }

  // Additional endpoints for products and orders
  @Get(':id/products')
  @ApiOperation({ summary: 'Get vendor products' })
  async getVendorProducts(@Param('id') vendorId: string, @Query() pagination: PaginationDto) {
    return this.vendorService.getVendorProducts(vendorId, pagination);
  }

  @Get(':id/orders')
  @ApiOperation({ summary: 'Get vendor orders' })
  async getVendorOrders(@Param('id') vendorId: string, @Query() pagination: PaginationDto) {
    return this.vendorService.getVendorOrders(vendorId, pagination);
  }

  // Seller portal access
  @Post(':id/portal-user')
  @ApiOperation({ summary: 'Create or link seller portal user and email credentials' })
  async createPortalUser(@Param('id') vendorId: string, @ReqBody() body: { email: string }) {
    if (!body?.email) {
      return { message: 'Email is required' } as any;
    }
    return this.vendorService.createPortalUser(vendorId, body.email);
  }

  @Post(':id/portal-user/:userId/reset-password')
  @ApiOperation({ summary: 'Reset seller portal user password and email temp password' })
  async resetPortalPassword(@Param('userId') userId: string) {
    return this.vendorService.resetPortalPassword(userId);
  }
}


