import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService, DefaultSettingsDto, VendorSettingsDto } from './settings.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

class BulkCommissionUpdateDto {
  @IsArray()
  vendorIds!: string[];
  
  @IsNumber()
  commissionRate!: number;
  
  @IsOptional()
  @IsEnum(['PERCENTAGE', 'FLAT'])
  commissionType?: 'PERCENTAGE' | 'FLAT';
}

class BulkStatusUpdateDto {
  @IsArray()
  vendorIds!: string[];
  
  @IsEnum(['ACTIVE', 'SUSPENDED', 'REJECTED'])
  status!: 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  
  @IsOptional()
  @IsString()
  reason?: string;
}

class ExportVendorDataDto {
  @IsOptional()
  @IsArray()
  vendorIds?: string[];
}

@ApiTags('admin/vendor-settings')
@ApiBearerAuth()
@Controller('admin/vendor-settings')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // Default Platform Settings
  @Get('defaults')
  @ApiOperation({ summary: 'Get default vendor settings' })
  @ApiResponse({ status: 200, description: 'Default settings retrieved successfully' })
  async getDefaultSettings() {
    return this.settingsService.getDefaultSettings();
  }

  @Patch('defaults')
  @ApiOperation({ summary: 'Update default vendor settings' })
  @ApiResponse({ status: 200, description: 'Default settings updated successfully' })
  async updateDefaultSettings(@Body() settings: DefaultSettingsDto) {
    return this.settingsService.updateDefaultSettings(settings);
  }

  // Vendor-specific Settings
  @Get(':vendorId')
  @ApiOperation({ summary: 'Get vendor-specific settings' })
  @ApiResponse({ status: 200, description: 'Vendor settings retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async getVendorSettings(@Param('vendorId') vendorId: string) {
    return this.settingsService.getVendorSettings(vendorId);
  }

  @Patch(':vendorId')
  @ApiOperation({ summary: 'Update vendor-specific settings' })
  @ApiResponse({ status: 200, description: 'Vendor settings updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async updateVendorSettings(
    @Param('vendorId') vendorId: string,
    @Body() settings: VendorSettingsDto
  ) {
    return this.settingsService.updateVendorSettings(vendorId, settings);
  }

  // Bulk Operations
  @Post('bulk/commission-rates')
  @ApiOperation({ summary: 'Bulk update commission rates' })
  @ApiResponse({ status: 200, description: 'Commission rates updated successfully' })
  async bulkUpdateCommissionRates(@Body() dto: BulkCommissionUpdateDto) {
    return this.settingsService.bulkUpdateCommissionRates(
      dto.vendorIds,
      dto.commissionRate,
      dto.commissionType
    );
  }

  @Post('bulk/status')
  @ApiOperation({ summary: 'Bulk update vendor status' })
  @ApiResponse({ status: 200, description: 'Vendor statuses updated successfully' })
  async bulkUpdateVendorStatus(@Body() dto: BulkStatusUpdateDto) {
    return this.settingsService.bulkUpdateVendorStatus(
      dto.vendorIds,
      dto.status,
      dto.reason
    );
  }

  // Import/Export
  @Post('export')
  @ApiOperation({ summary: 'Export vendor data' })
  @ApiResponse({ status: 200, description: 'Vendor data exported successfully' })
  async exportVendorData(@Body() dto: ExportVendorDataDto) {
    return this.settingsService.exportVendorData(dto.vendorIds);
  }

  // System Health
  @Get('system/health')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'System health retrieved successfully' })
  async getSystemHealth() {
    return this.settingsService.getSystemHealth();
  }
}