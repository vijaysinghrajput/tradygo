import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { CreateVendorDto, UpdateVendorDto, UpdateVendorStatusDto } from './dto/vendor.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/vendor.dto';
import { CreateBankDto, UpdateBankDto } from './dto/vendor.dto';
import { CreateKycDto, UpdateKycDto } from './dto/vendor.dto';
import { CreateCommissionDto, UpdateCommissionDto } from './dto/vendor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('admin/vendors')
@ApiBearerAuth()
@Controller('admin/vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class VendorAdminController {
  constructor(private readonly vendorService: VendorService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vendors with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully' })
  async findAll(@Query() query: any) {
    return this.vendorService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiResponse({ status: 200, description: 'Vendor retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async findOne(@Param('id') id: string) {
    return this.vendorService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vendor' })
  @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(id, updateVendorDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update vendor status' })
  @ApiResponse({ status: 200, description: 'Vendor status updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async updateStatus(@Param('id') id: string, @Body() statusDto: UpdateVendorStatusDto) {
    return this.vendorService.updateStatus(id, statusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vendor' })
  @ApiResponse({ status: 200, description: 'Vendor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async remove(@Param('id') id: string) {
    // Note: remove method doesn't exist, using deleteAddress pattern
    throw new Error('Delete vendor not implemented');
  }

  // Vendor Addresses
  @Get(':id/addresses')
  @ApiOperation({ summary: 'Get vendor addresses' })
  async getAddresses(@Param('id') vendorId: string) {
    return this.vendorService.getAddresses(vendorId);
  }

  @Post(':id/addresses')
  @ApiOperation({ summary: 'Add vendor address' })
  async addAddress(@Param('id') vendorId: string, @Body() addressDto: CreateAddressDto) {
    return this.vendorService.createAddress(vendorId, addressDto);
  }

  @Patch('addresses/:addressId')
  @ApiOperation({ summary: 'Update vendor address' })
  async updateAddress(@Param('addressId') addressId: string, @Body() addressDto: UpdateAddressDto) {
    return this.vendorService.updateAddress(addressId, addressDto);
  }

  @Delete('addresses/:addressId')
  @ApiOperation({ summary: 'Delete vendor address' })
  async removeAddress(@Param('addressId') addressId: string) {
    return this.vendorService.deleteAddress(addressId);
  }

  // Vendor Bank Accounts
  @Get(':id/bank-accounts')
  @ApiOperation({ summary: 'Get vendor bank accounts' })
  async getBankAccounts(@Param('id') vendorId: string) {
    return this.vendorService.getBankAccounts(vendorId);
  }

  @Post(':id/bank-accounts')
  @ApiOperation({ summary: 'Add vendor bank account' })
  async addBankAccount(@Param('id') vendorId: string, @Body() bankDto: CreateBankDto) {
    return this.vendorService.createBankAccount(vendorId, bankDto);
  }

  @Patch('bank-accounts/:bankId')
  @ApiOperation({ summary: 'Update vendor bank account' })
  async updateBankAccount(@Param('bankId') bankId: string, @Body() bankDto: UpdateBankDto) {
    return this.vendorService.updateBankAccount(bankId, bankDto);
  }

  @Delete('bank-accounts/:bankId')
  @ApiOperation({ summary: 'Delete vendor bank account' })
  async removeBankAccount(@Param('bankId') bankId: string) {
    return this.vendorService.deleteBankAccount(bankId);
  }

  // Vendor KYC
  @Get(':id/kyc')
  @ApiOperation({ summary: 'Get vendor KYC documents' })
  async getKYC(@Param('id') vendorId: string) {
    return this.vendorService.getKyc(vendorId);
  }

  @Post(':id/kyc')
  @ApiOperation({ summary: 'Add vendor KYC document' })
  async addKYC(@Param('id') vendorId: string, @Body() kycDto: CreateKycDto) {
    return this.vendorService.createKyc(vendorId, kycDto);
  }

  @Patch('kyc/:kycId')
  @ApiOperation({ summary: 'Update vendor KYC document' })
  async updateKYC(@Param('kycId') kycId: string, @Body() kycDto: UpdateKycDto) {
    return this.vendorService.updateKyc(kycId, kycDto);
  }

  @Delete('kyc/:kycId')
  @ApiOperation({ summary: 'Delete vendor KYC document' })
  async removeKYC(@Param('kycId') kycId: string) {
    return this.vendorService.deleteKyc(kycId);
  }

  // Commission Rules
  @Get(':id/commissions')
  @ApiOperation({ summary: 'Get vendor commission rules' })
  async getCommissionRules(@Param('id') vendorId: string) {
    return this.vendorService.getCommissions(vendorId);
  }

  @Post(':id/commissions')
  @ApiOperation({ summary: 'Add vendor commission rule' })
  async addCommissionRule(@Param('id') vendorId: string, @Body() commissionDto: CreateCommissionDto) {
    return this.vendorService.createCommission(vendorId, commissionDto);
  }

  @Patch('commissions/:ruleId')
  @ApiOperation({ summary: 'Update vendor commission rule' })
  async updateCommissionRule(@Param('ruleId') ruleId: string, @Body() commissionDto: UpdateCommissionDto) {
    return this.vendorService.updateCommission(ruleId, commissionDto);
  }

  @Delete('commissions/:ruleId')
  @ApiOperation({ summary: 'Delete vendor commission rule' })
  async removeCommissionRule(@Param('ruleId') ruleId: string) {
    return this.vendorService.deleteCommission(ruleId);
  }

  // Portal User Management
  @Post(':id/portal-user')
  @ApiOperation({ summary: 'Create or link seller portal user and email credentials' })
  async createPortalUser(@Param('id') vendorId: string, @Body() body: { email: string }) {
    return this.vendorService.createPortalUser(vendorId, body.email);
  }

  @Post(':id/portal-user/:userId/reset-password')
  @ApiOperation({ summary: 'Reset seller portal user password and email temp password' })
  async resetPortalPassword(@Param('userId') userId: string) {
    return this.vendorService.resetPortalPassword(userId);
  }
}


