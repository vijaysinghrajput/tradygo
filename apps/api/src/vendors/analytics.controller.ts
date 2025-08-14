import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('admin/vendor-analytics')
@ApiBearerAuth()
@Controller('admin/vendor-analytics')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get vendor overview analytics' })
  @ApiResponse({ status: 200, description: 'Vendor overview retrieved successfully' })
  async getVendorOverview() {
    return this.analyticsService.getVendorOverview();
  }

  @Get('growth')
  @ApiOperation({ summary: 'Get vendor growth analytics' })
  @ApiResponse({ status: 200, description: 'Vendor growth data retrieved successfully' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to analyze (default: 30)' })
  async getVendorGrowth(@Query('days', new ParseIntPipe({ optional: true })) days?: number) {
    return this.analyticsService.getVendorGrowth(days);
  }

  @Get('kyc')
  @ApiOperation({ summary: 'Get KYC analytics' })
  @ApiResponse({ status: 200, description: 'KYC analytics retrieved successfully' })
  async getKycAnalytics() {
    return this.analyticsService.getKycAnalytics();
  }

  @Get('financial')
  @ApiOperation({ summary: 'Get financial analytics' })
  @ApiResponse({ status: 200, description: 'Financial analytics retrieved successfully' })
  @ApiQuery({ name: 'months', required: false, type: Number, description: 'Number of months to analyze (default: 6)' })
  async getFinancialAnalytics(@Query('months', new ParseIntPipe({ optional: true })) months?: number) {
    return this.analyticsService.getFinancialAnalytics(months);
  }

  @Get('top-vendors')
  @ApiOperation({ summary: 'Get top performing vendors' })
  @ApiResponse({ status: 200, description: 'Top vendors retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of vendors to return (default: 10)' })
  async getTopVendors(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.analyticsService.getTopVendors(limit);
  }

  @Get('payouts')
  @ApiOperation({ summary: 'Get payout analytics' })
  @ApiResponse({ status: 200, description: 'Payout analytics retrieved successfully' })
  async getPayoutAnalytics() {
    return this.analyticsService.getPayoutAnalytics();
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get vendor activity analytics' })
  @ApiResponse({ status: 200, description: 'Vendor activity retrieved successfully' })
  @ApiQuery({ name: 'vendorId', required: false, type: String, description: 'Specific vendor ID to analyze' })
  async getVendorActivity(@Query('vendorId') vendorId?: string) {
    return this.analyticsService.getVendorActivity(vendorId);
  }

  @Get('commissions')
  @ApiOperation({ summary: 'Get commission analytics' })
  @ApiResponse({ status: 200, description: 'Commission analytics retrieved successfully' })
  async getCommissionAnalytics() {
    return this.analyticsService.getCommissionAnalytics();
  }
}