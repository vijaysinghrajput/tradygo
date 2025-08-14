import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './dto/vendor.dto';

@Injectable()
export class QueueService {
  constructor(private prisma: PrismaService) {}

  // Approval Queue - Pending vendors
  async getApprovalQueue(pagination: PaginationDto) {
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;
    
    const where: any = {
      status: 'PENDING',
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    try {
      const [vendors, total] = await Promise.all([
        (this.prisma as any).vendor.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'asc' }, // Oldest first for approval queue
          include: {
            addresses: true,
            bankAccounts: true,
            kyc: {
              where: { status: 'PENDING' },
            },
            _count: {
              select: {
                kyc: true,
                bankAccounts: true,
              },
            },
          },
        }),
        (this.prisma as any).vendor.count({ where }),
      ]);

      return { data: vendors, total, page, limit };
    } catch (error) {
      throw new BadRequestException('Failed to fetch approval queue. Please ensure database is properly configured.');
    }
  }

  // KYC Review Queue - Pending KYC documents
  async getKycQueue(pagination: PaginationDto) {
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;
    
    const where: any = {
      status: 'PENDING',
      ...(search && {
        vendor: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      }),
    };

    try {
      const [kycDocuments, total] = await Promise.all([
        (this.prisma as any).vendorKyc.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'asc' }, // Oldest first for review queue
          include: {
            vendor: {
              select: {
                id: true,
                name: true,
                email: true,
                status: true,
              },
            },
          },
        }),
        (this.prisma as any).vendorKyc.count({ where }),
      ]);

      return { data: kycDocuments, total, page, limit };
    } catch (error) {
      throw new BadRequestException('Failed to fetch KYC queue. Please ensure database is properly configured.');
    }
  }

  // Payout Queue - Due payouts
  async getPayoutQueue(pagination: PaginationDto) {
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;
    
    // Get finalized statements that don't have completed payouts
    const where: any = {
      status: 'FINALIZED',
      payouts: {
        none: {
          status: 'COMPLETED',
        },
      },
      ...(search && {
        vendor: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      }),
    };

    try {
      const [statements, total] = await Promise.all([
        (this.prisma as any).vendorStatement.findMany({
          where,
          skip,
          take: limit,
          orderBy: { periodEnd: 'asc' }, // Oldest periods first
          include: {
            vendor: {
              select: {
                id: true,
                name: true,
                email: true,
                status: true,
              },
            },
            payouts: {
              where: {
                status: { in: ['INITIATED', 'FAILED'] },
              },
            },
          },
        }),
        (this.prisma as any).vendorStatement.count({ where }),
      ]);

      return { data: statements, total, page, limit };
    } catch (error) {
      throw new BadRequestException('Failed to fetch payout queue. Please ensure database is properly configured.');
    }
  }

  // Bulk approve vendors
  async bulkApproveVendors(vendorIds: string[]) {
    try {
      const result = await (this.prisma as any).vendor.updateMany({
        where: {
          id: { in: vendorIds },
          status: 'PENDING',
        },
        data: {
          status: 'ACTIVE',
        },
      });

      return { updated: result.count, vendorIds };
    } catch (error) {
      throw new BadRequestException('Failed to bulk approve vendors. Please ensure database is properly configured.');
    }
  }

  // Bulk reject vendors
  async bulkRejectVendors(vendorIds: string[], reason?: string) {
    try {
      const result = await (this.prisma as any).vendor.updateMany({
        where: {
          id: { in: vendorIds },
          status: 'PENDING',
        },
        data: {
          status: 'REJECTED',
        },
      });

      // Create issues for rejected vendors if reason provided
      if (reason && result.count > 0) {
        const issueData = vendorIds.map(vendorId => ({
          vendorId,
          title: 'Application Rejected',
          description: reason,
          status: 'RESOLVED',
        }));

        await (this.prisma as any).vendorIssue.createMany({
          data: issueData,
        });
      }

      return { updated: result.count, vendorIds, reason };
    } catch (error) {
      throw new BadRequestException('Failed to bulk reject vendors. Please ensure database is properly configured.');
    }
  }

  // Bulk approve KYC documents
  async bulkApproveKyc(kycIds: string[]) {
    try {
      const result = await (this.prisma as any).vendorKyc.updateMany({
        where: {
          id: { in: kycIds },
          status: 'PENDING',
        },
        data: {
          status: 'APPROVED',
        },
      });

      return { updated: result.count, kycIds };
    } catch (error) {
      throw new BadRequestException('Failed to bulk approve KYC documents. Please ensure database is properly configured.');
    }
  }

  // Bulk reject KYC documents
  async bulkRejectKyc(kycIds: string[], remarks?: string) {
    try {
      const result = await (this.prisma as any).vendorKyc.updateMany({
        where: {
          id: { in: kycIds },
          status: 'PENDING',
        },
        data: {
          status: 'REJECTED',
          remarks: remarks || 'Bulk rejection',
        },
      });

      return { updated: result.count, kycIds, remarks };
    } catch (error) {
      throw new BadRequestException('Failed to bulk reject KYC documents. Please ensure database is properly configured.');
    }
  }

  // Create batch payouts
  async createBatchPayouts(statementIds: string[]) {
    try {
      // Get statements with their amounts
      const statements = await (this.prisma as any).vendorStatement.findMany({
        where: {
          id: { in: statementIds },
          status: 'FINALIZED',
        },
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
      });

      if (statements.length === 0) {
        throw new BadRequestException('No valid statements found for payout creation');
      }

      // Create payouts for each statement
      const payoutData = statements.map(statement => ({
        vendorId: statement.vendorId,
        statementId: statement.id,
        amount: statement.netAmount,
        status: 'INITIATED',
        reference: `BATCH-${Date.now()}-${statement.id.slice(-6)}`,
      }));

      const payouts = await (this.prisma as any).payout.createMany({
        data: payoutData,
      });

      return { 
        created: payouts.count, 
        statementIds,
        totalAmount: statements.reduce((sum, s) => sum + Number(s.netAmount), 0),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create batch payouts. Please ensure database is properly configured.');
    }
  }

  // Get queue statistics
  async getQueueStats() {
    try {
      const [pendingVendors, pendingKyc, duePayouts, failedPayouts] = await Promise.all([
        (this.prisma as any).vendor.count({ where: { status: 'PENDING' } }),
        (this.prisma as any).vendorKyc.count({ where: { status: 'PENDING' } }),
        (this.prisma as any).vendorStatement.count({
          where: {
            status: 'FINALIZED',
            payouts: {
              none: {
                status: 'COMPLETED',
              },
            },
          },
        }),
        (this.prisma as any).payout.count({ where: { status: 'FAILED' } }),
      ]);

      return {
        pendingVendors,
        pendingKyc,
        duePayouts,
        failedPayouts,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch queue statistics. Please ensure database is properly configured.');
    }
  }
}