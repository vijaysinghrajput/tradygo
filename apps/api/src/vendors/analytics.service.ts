import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Vendor Overview Analytics
  async getVendorOverview() {
    try {
      const [totalVendors, activeVendors, pendingVendors, suspendedVendors, rejectedVendors] = await Promise.all([
        (this.prisma as any).vendor.count(),
        (this.prisma as any).vendor.count({ where: { status: 'ACTIVE' } }),
        (this.prisma as any).vendor.count({ where: { status: 'PENDING' } }),
        (this.prisma as any).vendor.count({ where: { status: 'SUSPENDED' } }),
        (this.prisma as any).vendor.count({ where: { status: 'REJECTED' } }),
      ]);

      const statusDistribution = {
        ACTIVE: activeVendors,
        PENDING: pendingVendors,
        SUSPENDED: suspendedVendors,
        REJECTED: rejectedVendors,
      };

      return {
        totalVendors,
        statusDistribution,
        activePercentage: totalVendors > 0 ? Math.round((activeVendors / totalVendors) * 100) : 0,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch vendor overview. Please ensure database is properly configured.');
    }
  }

  // Vendor Growth Analytics
  async getVendorGrowth(days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const vendors = await (this.prisma as any).vendor.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          createdAt: true,
          status: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Group by date
      const growthData = vendors.reduce((acc: any, vendor: any) => {
        const date = vendor.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, total: 0, active: 0, pending: 0 };
        }
        acc[date].total += 1;
        if (vendor.status === 'ACTIVE') acc[date].active += 1;
        if (vendor.status === 'PENDING') acc[date].pending += 1;
        return acc;
      }, {});

      return Object.values(growthData);
    } catch (error) {
      throw new BadRequestException('Failed to fetch vendor growth data. Please ensure database is properly configured.');
    }
  }

  // KYC Analytics
  async getKycAnalytics() {
    try {
      const [totalKyc, approvedKyc, pendingKyc, rejectedKyc] = await Promise.all([
        (this.prisma as any).vendorKyc.count(),
        (this.prisma as any).vendorKyc.count({ where: { status: 'APPROVED' } }),
        (this.prisma as any).vendorKyc.count({ where: { status: 'PENDING' } }),
        (this.prisma as any).vendorKyc.count({ where: { status: 'REJECTED' } }),
      ]);

      // KYC by document type
      const kycByType = await (this.prisma as any).vendorKyc.groupBy({
        by: ['docType'],
        _count: {
          id: true,
        },
      });

      return {
        totalKyc,
        statusDistribution: {
          APPROVED: approvedKyc,
          PENDING: pendingKyc,
          REJECTED: rejectedKyc,
        },
        approvalRate: totalKyc > 0 ? Math.round((approvedKyc / totalKyc) * 100) : 0,
        documentTypes: kycByType.map((item: any) => ({
          type: item.docType,
          count: item._count.id,
        })),
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch KYC analytics. Please ensure database is properly configured.');
    }
  }

  // Financial Analytics
  async getFinancialAnalytics(months: number = 6) {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const statements = await (this.prisma as any).vendorStatement.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          totalSales: true,
          totalFees: true,
          netAmount: true,
          status: true,
          createdAt: true,
          vendor: {
            select: {
              name: true,
            },
          },
        },
      });

      const totalSales = statements.reduce((sum, s) => sum + Number(s.totalSales), 0);
      const totalFees = statements.reduce((sum, s) => sum + Number(s.totalFees), 0);
      const totalPayouts = statements.reduce((sum, s) => sum + Number(s.netAmount), 0);

      // Monthly breakdown
      const monthlyData = statements.reduce((acc: any, statement: any) => {
        const month = statement.createdAt.toISOString().slice(0, 7); // YYYY-MM
        if (!acc[month]) {
          acc[month] = { month, sales: 0, fees: 0, payouts: 0 };
        }
        acc[month].sales += Number(statement.totalSales);
        acc[month].fees += Number(statement.totalFees);
        acc[month].payouts += Number(statement.netAmount);
        return acc;
      }, {});

      return {
        totalSales,
        totalFees,
        totalPayouts,
        averageCommissionRate: totalSales > 0 ? Math.round((totalFees / totalSales) * 100 * 100) / 100 : 0,
        monthlyBreakdown: Object.values(monthlyData),
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch financial analytics. Please ensure database is properly configured.');
    }
  }

  // Top Performing Vendors
  async getTopVendors(limit: number = 10) {
    try {
      const topVendors = await (this.prisma as any).vendor.findMany({
        where: {
          status: 'ACTIVE',
        },
        include: {
          statements: {
            select: {
              totalSales: true,
              netAmount: true,
            },
          },
          _count: {
            select: {
              products: true,
              orders: true,
            },
          },
        },
      });

      // Calculate performance metrics
      const vendorsWithMetrics = topVendors.map((vendor: any) => {
        const totalSales = vendor.statements.reduce((sum: number, s: any) => sum + Number(s.totalSales), 0);
        const totalEarnings = vendor.statements.reduce((sum: number, s: any) => sum + Number(s.netAmount), 0);
        
        return {
          id: vendor.id,
          name: vendor.name,
          email: vendor.email,
          totalSales,
          totalEarnings,
          productCount: vendor._count.products,
          orderCount: vendor._count.orders,
          averageOrderValue: vendor._count.orders > 0 ? totalSales / vendor._count.orders : 0,
        };
      });

      // Sort by total sales and limit
      return vendorsWithMetrics
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, limit);
    } catch (error) {
      throw new BadRequestException('Failed to fetch top vendors. Please ensure database is properly configured.');
    }
  }

  // Payout Analytics
  async getPayoutAnalytics() {
    try {
      const [totalPayouts, completedPayouts, pendingPayouts, failedPayouts] = await Promise.all([
        (this.prisma as any).payout.count(),
        (this.prisma as any).payout.count({ where: { status: 'COMPLETED' } }),
        (this.prisma as any).payout.count({ where: { status: 'INITIATED' } }),
        (this.prisma as any).payout.count({ where: { status: 'FAILED' } }),
      ]);

      // Total payout amounts
      const payoutAmounts = await (this.prisma as any).payout.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: 'COMPLETED',
        },
      });

      const pendingPayoutAmounts = await (this.prisma as any).payout.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: 'INITIATED',
        },
      });

      return {
        totalPayouts,
        statusDistribution: {
          COMPLETED: completedPayouts,
          INITIATED: pendingPayouts,
          FAILED: failedPayouts,
        },
        totalAmountPaid: Number(payoutAmounts._sum.amount || 0),
        pendingAmount: Number(pendingPayoutAmounts._sum.amount || 0),
        successRate: totalPayouts > 0 ? Math.round((completedPayouts / totalPayouts) * 100) : 0,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch payout analytics. Please ensure database is properly configured.');
    }
  }

  // Vendor Activity Analytics
  async getVendorActivity(vendorId?: string) {
    try {
      const whereClause = vendorId ? { vendorId } : {};

      const [recentProducts, recentOrders, recentIssues] = await Promise.all([
        (this.prisma as any).product.findMany({
          where: whereClause,
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            vendor: {
              select: {
                name: true,
              },
            },
          },
        }),
        this.prisma.order.findMany({
          where: vendorId ? { userId: { not: undefined } } : {}, // Temporary workaround until vendorId is available
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        (this.prisma as any).vendorIssue.findMany({
          where: whereClause,
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            vendor: {
              select: {
                name: true,
              },
            },
          },
        }),
      ]);

      return {
        recentProducts,
        recentOrders,
        recentIssues,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch vendor activity. Please ensure database is properly configured.');
    }
  }

  // Commission Analytics
  async getCommissionAnalytics() {
    try {
      const commissionRules = await (this.prisma as any).commissionRule.findMany({
        include: {
          vendor: {
            select: {
              name: true,
              status: true,
            },
          },
        },
      });

      // Group by commission type and category
      const byType = commissionRules.reduce((acc: any, rule: any) => {
        if (!acc[rule.type]) acc[rule.type] = [];
        acc[rule.type].push(rule);
        return acc;
      }, {});

      const byCategory = commissionRules.reduce((acc: any, rule: any) => {
        const category = rule.category || 'Default';
        if (!acc[category]) acc[category] = [];
        acc[category].push(rule);
        return acc;
      }, {});

      // Calculate averages
      const averageCommission = commissionRules.length > 0 
        ? commissionRules.reduce((sum: number, rule: any) => sum + Number(rule.value), 0) / commissionRules.length
        : 0;

      return {
        totalRules: commissionRules.length,
        averageCommission: Math.round(averageCommission * 100) / 100,
        byType: Object.keys(byType).map(type => ({
          type,
          count: byType[type].length,
          averageRate: byType[type].reduce((sum: number, rule: any) => sum + Number(rule.value), 0) / byType[type].length,
        })),
        byCategory: Object.keys(byCategory).map(category => ({
          category,
          count: byCategory[category].length,
          averageRate: byCategory[category].reduce((sum: number, rule: any) => sum + Number(rule.value), 0) / byCategory[category].length,
        })),
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch commission analytics. Please ensure database is properly configured.');
    }
  }
}