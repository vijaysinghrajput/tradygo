import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QueueService } from './queue.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationDto } from './dto/vendor.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

class BulkApproveVendorsDto {
  @IsArray()
  vendorIds!: string[];
}

class BulkRejectVendorsDto {
  @IsArray()
  vendorIds!: string[];
  
  @IsOptional()
  @IsString()
  reason?: string;
}

class BulkApproveKycDto {
  @IsArray()
  kycIds!: string[];
}

class BulkRejectKycDto {
  @IsArray()
  kycIds!: string[];
  
  @IsOptional()
  @IsString()
  remarks?: string;
}

class CreateBatchPayoutsDto {
  @IsArray()
  statementIds!: string[];
}

@ApiTags('admin/vendor-queues')
@ApiBearerAuth()
@Controller('admin/vendor-queues')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get queue statistics' })
  @ApiResponse({ status: 200, description: 'Queue statistics retrieved successfully' })
  async getQueueStats() {
    return this.queueService.getQueueStats();
  }

  // Approval Queue
  @Get('approvals')
  @ApiOperation({ summary: 'Get pending vendor approvals' })
  @ApiResponse({ status: 200, description: 'Approval queue retrieved successfully' })
  async getApprovalQueue(@Query() pagination: PaginationDto) {
    return this.queueService.getApprovalQueue(pagination);
  }

  @Post('approvals/bulk-approve')
  @ApiOperation({ summary: 'Bulk approve vendors' })
  @ApiResponse({ status: 200, description: 'Vendors approved successfully' })
  async bulkApproveVendors(@Body() dto: BulkApproveVendorsDto) {
    return this.queueService.bulkApproveVendors(dto.vendorIds);
  }

  @Post('approvals/bulk-reject')
  @ApiOperation({ summary: 'Bulk reject vendors' })
  @ApiResponse({ status: 200, description: 'Vendors rejected successfully' })
  async bulkRejectVendors(@Body() dto: BulkRejectVendorsDto) {
    return this.queueService.bulkRejectVendors(dto.vendorIds, dto.reason);
  }

  // KYC Review Queue
  @Get('kyc')
  @ApiOperation({ summary: 'Get pending KYC documents' })
  @ApiResponse({ status: 200, description: 'KYC queue retrieved successfully' })
  async getKycQueue(@Query() pagination: PaginationDto) {
    return this.queueService.getKycQueue(pagination);
  }

  @Post('kyc/bulk-approve')
  @ApiOperation({ summary: 'Bulk approve KYC documents' })
  @ApiResponse({ status: 200, description: 'KYC documents approved successfully' })
  async bulkApproveKyc(@Body() dto: BulkApproveKycDto) {
    return this.queueService.bulkApproveKyc(dto.kycIds);
  }

  @Post('kyc/bulk-reject')
  @ApiOperation({ summary: 'Bulk reject KYC documents' })
  @ApiResponse({ status: 200, description: 'KYC documents rejected successfully' })
  async bulkRejectKyc(@Body() dto: BulkRejectKycDto) {
    return this.queueService.bulkRejectKyc(dto.kycIds, dto.remarks);
  }

  // Payout Queue
  @Get('payouts')
  @ApiOperation({ summary: 'Get due payouts' })
  @ApiResponse({ status: 200, description: 'Payout queue retrieved successfully' })
  async getPayoutQueue(@Query() pagination: PaginationDto) {
    return this.queueService.getPayoutQueue(pagination);
  }

  @Post('payouts/batch-create')
  @ApiOperation({ summary: 'Create batch payouts' })
  @ApiResponse({ status: 200, description: 'Batch payouts created successfully' })
  async createBatchPayouts(@Body() dto: CreateBatchPayoutsDto) {
    return this.queueService.createBatchPayouts(dto.statementIds);
  }
}