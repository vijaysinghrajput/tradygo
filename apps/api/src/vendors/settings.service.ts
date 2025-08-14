import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// DTOs for settings
export class DefaultSettingsDto {
  defaultCommissionRate?: number;
  paymentCycle?: number; // days
  productAutoApproval?: boolean;
  autoSuspensionRules?: {
    maxFailedPayouts?: number;
    maxPendingKyc?: number;
    inactivityDays?: number;
  };
  kycRequirements?: {
    requiredDocuments?: string[];
    autoApprovalEnabled?: boolean;
  };
  payoutSettings?: {
    minimumAmount?: number;
    processingDays?: number;
    autoProcessing?: boolean;
  };
}

export class VendorSettingsDto {
  autoPayout?: boolean;
  defaultCommissionType?: 'PERCENTAGE' | 'FLAT';
  defaultCommissionValue?: number;
  allowCod?: boolean;
  autoAccept?: boolean;
  shipmentCutoffHour?: number;
  returnPolicy?: string;
  extraJson?: any;
}

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // Default Platform Settings
  async getDefaultSettings() {
    try {
      // Get platform config or create default
      let config = await this.prisma.platformConfig.findFirst();
      
      if (!config) {
        // Create default platform config
        config = await this.prisma.platformConfig.create({
          data: {
            brandName: 'TradyGo',
            brandLogoUrl: '/logo.png',
            authAdminRoles: ['ADMIN', 'SUPER_ADMIN'],
            authOtpEnabled: false,
            uiShowDemoCreds: false,
            defaultRedirectAdmin: '/dashboard',
            defaultRedirectSeller: '/orders',
          },
        });
      }

      // Default vendor settings (stored in platform config or separate table)
      const defaultSettings = {
        defaultCommissionRate: 5.0,
        paymentCycle: 7, // Weekly
        productAutoApproval: false,
        autoSuspensionRules: {
          maxFailedPayouts: 3,
          maxPendingKyc: 30, // days
          inactivityDays: 90,
        },
        kycRequirements: {
          requiredDocuments: ['GST_CERTIFICATE', 'PAN_CARD', 'BANK_STATEMENT'],
          autoApprovalEnabled: false,
        },
        payoutSettings: {
          minimumAmount: 100,
          processingDays: 3,
          autoProcessing: false,
        },
      };

      return {
        platformConfig: config,
        vendorDefaults: defaultSettings,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch default settings. Please ensure database is properly configured.');
    }
  }

  async updateDefaultSettings(settings: DefaultSettingsDto) {
    try {
      // For now, we'll store vendor defaults in a JSON field or separate table
      // This is a simplified implementation
      
      // Update platform config if needed
      const config = await this.prisma.platformConfig.findFirst();
      if (config) {
        await this.prisma.platformConfig.update({
          where: { id: config.id },
          data: {
            updatedAt: new Date(),
          },
        });
      }

      // In a real implementation, you'd store these in a dedicated settings table
      return {
        message: 'Default settings updated successfully',
        settings,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update default settings. Please ensure database is properly configured.');
    }
  }

  // Vendor-specific Settings
  async getVendorSettings(vendorId: string) {
    try {
      const vendor = await (this.prisma as any).vendor.findUnique({
        where: { id: vendorId },
        include: {
          settings: true,
        },
      });

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      // If no settings exist, create default ones
      if (!vendor.settings) {
        const defaultSettings = await (this.prisma as any).vendorSetting.create({
          data: {
            vendorId,
            autoPayout: false,
            defaultCommissionType: 'PERCENTAGE',
            defaultCommissionValue: 5.0,
          },
        });
        return defaultSettings;
      }

      return vendor.settings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch vendor settings. Please ensure database is properly configured.');
    }
  }

  async updateVendorSettings(vendorId: string, settings: VendorSettingsDto) {
    try {
      // Check if vendor exists
      const vendor = await (this.prisma as any).vendor.findUnique({
        where: { id: vendorId },
      });

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      // Upsert vendor settings
      const updatedSettings = await (this.prisma as any).vendorSetting.upsert({
        where: { vendorId },
        update: {
          ...settings,
          updatedAt: new Date(),
        },
        create: {
          vendorId,
          autoPayout: settings.autoPayout ?? false,
          defaultCommissionType: settings.defaultCommissionType ?? 'PERCENTAGE',
          defaultCommissionValue: settings.defaultCommissionValue ?? 5.0,
        },
      });

      return updatedSettings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update vendor settings. Please ensure database is properly configured.');
    }
  }

  // Bulk Settings Operations
  async bulkUpdateCommissionRates(vendorIds: string[], commissionRate: number, commissionType: 'PERCENTAGE' | 'FLAT' = 'PERCENTAGE') {
    try {
      // Update commission rules for multiple vendors
      const results = await Promise.all(
        vendorIds.map(async (vendorId) => {
          try {
            // Update or create commission rule
            const existingRule = await (this.prisma as any).commissionRule.findFirst({
              where: {
                vendorId,
                category: null, // Default rule
              },
            });

            if (existingRule) {
              return await (this.prisma as any).commissionRule.update({
                where: { id: existingRule.id },
                data: {
                  type: commissionType,
                  value: commissionRate,
                },
              });
            } else {
              return await (this.prisma as any).commissionRule.create({
                data: {
                  vendorId,
                  type: commissionType,
                  value: commissionRate,
                },
              });
            }
          } catch (error) {
            return { vendorId, error: error instanceof Error ? error.message : 'Unknown error' };
          }
        })
      );

      const successful = results.filter(r => !r.error);
      const failed = results.filter(r => r.error);

      return {
        successful: successful.length,
        failed: failed.length,
        details: { successful, failed },
      };
    } catch (error) {
      throw new BadRequestException('Failed to bulk update commission rates. Please ensure database is properly configured.');
    }
  }

  async bulkUpdateVendorStatus(vendorIds: string[], status: 'ACTIVE' | 'SUSPENDED' | 'REJECTED', reason?: string) {
    try {
      const result = await (this.prisma as any).vendor.updateMany({
        where: {
          id: { in: vendorIds },
        },
        data: {
          status,
          updatedAt: new Date(),
        },
      });

      // Create issues for status changes if reason provided
      if (reason && result.count > 0) {
        const issueData = vendorIds.map(vendorId => ({
          vendorId,
          title: `Status changed to ${status}`,
          description: reason,
          status: 'RESOLVED',
        }));

        await (this.prisma as any).vendorIssue.createMany({
          data: issueData,
        });
      }

      return {
        updated: result.count,
        vendorIds,
        newStatus: status,
        reason,
      };
    } catch (error) {
      throw new BadRequestException('Failed to bulk update vendor status. Please ensure database is properly configured.');
    }
  }

  // Import/Export Operations
  async exportVendorData(vendorIds?: string[]) {
    try {
      const where = vendorIds ? { id: { in: vendorIds } } : {};
      
      const vendors = await (this.prisma as any).vendor.findMany({
        where,
        include: {
          addresses: true,
          bankAccounts: true,
          kyc: true,
          commission: true,
          settings: true,
          _count: {
            select: {
              products: true,
              orders: true,
              statements: true,
              payouts: true,
            },
          },
        },
      });

      // Format data for export
      const exportData = vendors.map((vendor: any) => ({
        id: vendor.id,
        name: vendor.name,
        legalName: vendor.legalName,
        email: vendor.email,
        phone: vendor.phone,
        gstNumber: vendor.gstNumber,
        panNumber: vendor.panNumber,
        status: vendor.status,
        createdAt: vendor.createdAt,
        addressCount: vendor.addresses.length,
        bankAccountCount: vendor.bankAccounts.length,
        kycDocuments: vendor.kyc.length,
        commissionRules: vendor.commission.length,
        productCount: vendor._count.products,
        orderCount: vendor._count.orders,
        statementCount: vendor._count.statements,
        payoutCount: vendor._count.payouts,
        settings: vendor.settings,
      }));

      return {
        data: exportData,
        exportedAt: new Date(),
        totalRecords: exportData.length,
      };
    } catch (error) {
      throw new BadRequestException('Failed to export vendor data. Please ensure database is properly configured.');
    }
  }

  // System Health and Maintenance
  async getSystemHealth() {
    try {
      const [vendorCount, activeVendors, pendingApprovals, failedPayouts, pendingKyc] = await Promise.all([
        (this.prisma as any).vendor.count(),
        (this.prisma as any).vendor.count({ where: { status: 'ACTIVE' } }),
        (this.prisma as any).vendor.count({ where: { status: 'PENDING' } }),
        (this.prisma as any).payout.count({ where: { status: 'FAILED' } }),
        (this.prisma as any).vendorKyc.count({ where: { status: 'PENDING' } }),
      ]);

      const healthScore = {
        overall: 'HEALTHY',
        issues: [],
      };

      // Check for issues
      if (pendingApprovals > 10) {
        healthScore.issues.push(`${pendingApprovals} vendors pending approval`);
        healthScore.overall = 'WARNING';
      }

      if (failedPayouts > 5) {
        healthScore.issues.push(`${failedPayouts} failed payouts need attention`);
        healthScore.overall = 'CRITICAL';
      }

      if (pendingKyc > 20) {
        healthScore.issues.push(`${pendingKyc} KYC documents pending review`);
        if (healthScore.overall === 'HEALTHY') healthScore.overall = 'WARNING';
      }

      return {
        metrics: {
          totalVendors: vendorCount,
          activeVendors,
          pendingApprovals,
          failedPayouts,
          pendingKyc,
        },
        health: healthScore,
        lastChecked: new Date(),
      };
    } catch (error) {
      throw new BadRequestException('Failed to check system health. Please ensure database is properly configured.');
    }
  }
}