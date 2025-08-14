import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateVendorDto,
  UpdateVendorDto,
  UpdateVendorStatusDto,
  PaginationDto,
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
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  // Vendors CRUD
  async findAll(pagination: PaginationDto) {
    const { page, limit, search } = pagination;
    const skip = (page - 1) * limit;
    
    const where: any = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    try {
      const [vendors, total] = await Promise.all([
        (this.prisma as any).vendor.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            addresses: true,
            _count: {
              select: {
                products: true,
                orders: true,
              },
            },
          },
        }),
        (this.prisma as any).vendor.count({ where }),
      ]);

      return { data: vendors, total, page, limit };
    } catch (error) {
      throw new BadRequestException('Failed to fetch vendors. Please ensure database is properly configured.');
    }
  }

  async findOne(id: string) {
    try {
      const vendor = await (this.prisma as any).vendor.findUnique({
        where: { id },
        include: {
          addresses: true,
          bankAccounts: true,
          kyc: true,
          commission: true,
          statements: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          payouts: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          settings: true,
          issues: {
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              products: true,
              orders: true,
            },
          },
        },
      });

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      return vendor;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch vendor. Please ensure database is properly configured.');
    }
  }

  async create(createVendorDto: CreateVendorDto) {
    try {
      return await (this.prisma as any).vendor.create({
        data: {
          ...createVendorDto,
          settings: {
            create: {
              autoPayout: false,
              defaultCommissionType: 'PERCENTAGE',
              defaultCommissionValue: 5.0,
            },
          },
        },
        include: {
          settings: true,
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new BadRequestException('Email, GST number, or PAN number already exists');
      }
      throw new BadRequestException('Failed to create vendor. Please ensure database is properly configured.');
    }
  }

  async update(id: string, updateVendorDto: UpdateVendorDto) {
    try {
      return await (this.prisma as any).vendor.update({
        where: { id },
        data: updateVendorDto,
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Vendor not found');
      }
      if (error?.code === 'P2002') {
        throw new BadRequestException('Email, GST number, or PAN number already exists');
      }
      throw new BadRequestException('Failed to update vendor. Please ensure database is properly configured.');
    }
  }

  async updateStatus(id: string, updateStatusDto: UpdateVendorStatusDto) {
    try {
      return await (this.prisma as any).vendor.update({
        where: { id },
        data: { status: updateStatusDto.status },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Vendor not found');
      }
      throw new BadRequestException('Failed to update vendor status. Please ensure database is properly configured.');
    }
  }

  // Addresses
  async getAddresses(vendorId: string) {
    try {
      return (this.prisma as any).vendorAddress.findMany({ 
        where: { vendorId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch addresses. Please ensure database is properly configured.');
    }
  }

  async createAddress(vendorId: string, createAddressDto: CreateAddressDto) {
    try {
      // If this is set as default, unset other defaults
      if (createAddressDto.isDefault) {
        await (this.prisma as any).vendorAddress.updateMany({
          where: { vendorId },
          data: { isDefault: false },
        });
      }

      return (this.prisma as any).vendorAddress.create({ 
        data: { vendorId, ...createAddressDto },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create address. Please ensure database is properly configured.');
    }
  }

  async updateAddress(addressId: string, updateAddressDto: UpdateAddressDto) {
    try {
      const address = await (this.prisma as any).vendorAddress.findUnique({
        where: { id: addressId },
      });

      if (!address) {
        throw new NotFoundException('Address not found');
      }

      // If this is set as default, unset other defaults
      if (updateAddressDto.isDefault) {
        await (this.prisma as any).vendorAddress.updateMany({
          where: { vendorId: address.vendorId },
          data: { isDefault: false },
        });
      }

      return (this.prisma as any).vendorAddress.update({ 
        where: { id: addressId }, 
        data: updateAddressDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update address. Please ensure database is properly configured.');
    }
  }

  async deleteAddress(addressId: string) {
    try {
      return await (this.prisma as any).vendorAddress.delete({ where: { id: addressId } });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Address not found');
      }
      throw new BadRequestException('Failed to delete address. Please ensure database is properly configured.');
    }
  }

  // Bank Accounts
  async getBankAccounts(vendorId: string) {
    try {
      return (this.prisma as any).vendorBankAccount.findMany({ 
        where: { vendorId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch bank accounts. Please ensure database is properly configured.');
    }
  }

  async createBankAccount(vendorId: string, createBankDto: CreateBankDto) {
    try {
      return (this.prisma as any).vendorBankAccount.create({ 
        data: { vendorId, ...createBankDto },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create bank account. Please ensure database is properly configured.');
    }
  }

  async updateBankAccount(bankId: string, updateBankDto: UpdateBankDto) {
    try {
      return await (this.prisma as any).vendorBankAccount.update({ 
        where: { id: bankId }, 
        data: updateBankDto,
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Bank account not found');
      }
      throw new BadRequestException('Failed to update bank account. Please ensure database is properly configured.');
    }
  }

  async verifyBankAccount(bankId: string, verifyBankDto: VerifyBankDto) {
    try {
      return await (this.prisma as any).vendorBankAccount.update({
        where: { id: bankId },
        data: { status: verifyBankDto.verified ? 'VERIFIED' : 'REJECTED' },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Bank account not found');
      }
      throw new BadRequestException('Failed to verify bank account. Please ensure database is properly configured.');
    }
  }

  async deleteBankAccount(bankId: string) {
    try {
      return await (this.prisma as any).vendorBankAccount.delete({ where: { id: bankId } });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Bank account not found');
      }
      throw new BadRequestException('Failed to delete bank account. Please ensure database is properly configured.');
    }
  }

  // KYC
  async getKyc(vendorId: string) {
    try {
      return (this.prisma as any).vendorKyc.findMany({ 
        where: { vendorId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch KYC documents. Please ensure database is properly configured.');
    }
  }

  async createKyc(vendorId: string, createKycDto: CreateKycDto) {
    try {
      return (this.prisma as any).vendorKyc.create({ 
        data: { vendorId, ...createKycDto },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create KYC document. Please ensure database is properly configured.');
    }
  }

  async updateKyc(kycId: string, updateKycDto: UpdateKycDto) {
    try {
      return await (this.prisma as any).vendorKyc.update({ 
        where: { id: kycId }, 
        data: updateKycDto,
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('KYC document not found');
      }
      throw new BadRequestException('Failed to update KYC document. Please ensure database is properly configured.');
    }
  }

  async deleteKyc(kycId: string) {
    try {
      return await (this.prisma as any).vendorKyc.delete({ where: { id: kycId } });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('KYC document not found');
      }
      throw new BadRequestException('Failed to delete KYC document. Please ensure database is properly configured.');
    }
  }

  // Commission Rules
  async getCommissions(vendorId: string) {
    try {
      return (this.prisma as any).commissionRule.findMany({ 
        where: { vendorId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch commission rules. Please ensure database is properly configured.');
    }
  }

  async createCommission(vendorId: string, createCommissionDto: CreateCommissionDto) {
    try {
      return (this.prisma as any).commissionRule.create({ 
        data: { 
          vendorId, 
          type: createCommissionDto.type,
          value: createCommissionDto.value,
          category: createCommissionDto.category,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create commission rule. Please ensure database is properly configured.');
    }
  }

  async updateCommission(ruleId: string, updateCommissionDto: UpdateCommissionDto) {
    try {
      return await (this.prisma as any).commissionRule.update({ 
        where: { id: ruleId }, 
        data: {
          ...(updateCommissionDto.type && { type: updateCommissionDto.type }),
          ...(updateCommissionDto.value !== undefined && { value: updateCommissionDto.value }),
          ...(updateCommissionDto.category && { category: updateCommissionDto.category }),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Commission rule not found');
      }
      throw new BadRequestException('Failed to update commission rule. Please ensure database is properly configured.');
    }
  }

  async deleteCommission(ruleId: string) {
    try {
      return await (this.prisma as any).commissionRule.delete({ where: { id: ruleId } });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Commission rule not found');
      }
      throw new BadRequestException('Failed to delete commission rule. Please ensure database is properly configured.');
    }
  }

  // Statements
  async getStatements(vendorId: string) {
    try {
      return (this.prisma as any).vendorStatement.findMany({ 
        where: { vendorId },
        orderBy: { createdAt: 'desc' },
        include: {
          payouts: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch statements. Please ensure database is properly configured.');
    }
  }

  async finalizeStatement(statementId: string, finalizeDto: FinalizeStatementDto) {
    try {
      return await (this.prisma as any).vendorStatement.update({
        where: { id: statementId },
        data: { status: finalizeDto.finalize ? 'FINALIZED' : 'DRAFT' },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Statement not found');
      }
      throw new BadRequestException('Failed to finalize statement. Please ensure database is properly configured.');
    }
  }

  // Payouts
  async getPayouts(vendorId: string) {
    try {
      return (this.prisma as any).payout.findMany({ 
        where: { vendorId },
        orderBy: { createdAt: 'desc' },
        include: {
          statement: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch payouts. Please ensure database is properly configured.');
    }
  }

  async createPayout(vendorId: string, createPayoutDto: CreatePayoutDto) {
    try {
      return (this.prisma as any).payout.create({ 
        data: { 
          vendorId, 
          amount: createPayoutDto.amount,
          reference: createPayoutDto.reference,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create payout. Please ensure database is properly configured.');
    }
  }

  async completePayout(payoutId: string, completePayoutDto: CompletePayoutDto) {
    try {
      return await (this.prisma as any).payout.update({
        where: { id: payoutId },
        data: { status: completePayoutDto.complete ? 'COMPLETED' : 'FAILED' },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Payout not found');
      }
      throw new BadRequestException('Failed to complete payout. Please ensure database is properly configured.');
    }
  }

  // Issues
  async getIssues(vendorId: string) {
    try {
      return (this.prisma as any).vendorIssue.findMany({ 
        where: { vendorId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch issues. Please ensure database is properly configured.');
    }
  }

  async createIssue(vendorId: string, createIssueDto: CreateIssueDto) {
    try {
      return (this.prisma as any).vendorIssue.create({ 
        data: { vendorId, ...createIssueDto },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create issue. Please ensure database is properly configured.');
    }
  }

  async updateIssue(issueId: string, updateIssueDto: UpdateIssueDto) {
    try {
      return await (this.prisma as any).vendorIssue.update({ 
        where: { id: issueId }, 
        data: {
          ...(updateIssueDto.status && { status: updateIssueDto.status }),
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Issue not found');
      }
      throw new BadRequestException('Failed to update issue. Please ensure database is properly configured.');
    }
  }

  // Additional helper methods
  async getVendorProducts(vendorId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    try {
      const [products, total] = await Promise.all([
        (this.prisma as any).product.findMany({
          where: { vendorId },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        (this.prisma as any).product.count({ where: { vendorId } }),
      ]);

      return { data: products, total, page, limit };
    } catch (error) {
      throw new BadRequestException('Failed to fetch vendor products. Please ensure database is properly configured.');
    }
  }

  async getVendorOrders(vendorId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    try {
      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where: { userId: { not: undefined } }, // Temporary workaround until vendorId is available
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        this.prisma.order.count({ where: { userId: { not: undefined } } }),
      ]);

      return { data: orders, total, page, limit };
    } catch (error) {
      throw new BadRequestException('Failed to fetch vendor orders. Please ensure database is properly configured.');
    }
  }

  // ===== Seller portal access helpers =====
  private generateTempPassword(length = 10): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@$!';
    return Array.from({ length }).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  private async sendEmail(to: string, subject: string, html: string) {
    const host = process.env.SMTP_HOST || 'localhost';
    const port = parseInt(process.env.SMTP_PORT || '1025', 10);
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';
    const from = process.env.MAIL_FROM || 'no-reply@tradygo.test';
    const transporter = nodemailer.createTransport({ host, port, auth: user && pass ? { user, pass } : undefined });
    try {
      await transporter.sendMail({ from, to, subject, html });
    } catch (e) {
      // ignore in dev
    }
  }

  async createPortalUser(vendorId: string, email: string) {
    const vendor = await (this.prisma as any).vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      await (this.prisma as any).vendorUser.upsert({
        where: { vendorId_userId: { vendorId, userId: existing.id } },
        create: { vendorId, userId: existing.id, role: 'OWNER' },
        update: {},
      });
      return { userId: existing.id, email, tempPassword: null, linked: true };
    }

    const tempPassword = this.generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 12);
    const user = await this.prisma.user.create({ data: { email, passwordHash, role: 'SELLER', status: 'ACTIVE', isVerified: true } });
    await (this.prisma as any).vendorUser.create({ data: { vendorId, userId: user.id, role: 'OWNER' } });

    await this.sendEmail(
      email,
      'Your Seller Portal Access',
      `<p>Welcome to TradyGo Seller Portal.</p><p>Email: ${email}<br/>Temporary Password: <b>${tempPassword}</b></p><p>Please log in and change your password.</p>`
    );

    return { userId: user.id, email, tempPassword, linked: false };
  }

  async resetPortalPassword(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const tempPassword = this.generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 12);
    await this.prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    await this.sendEmail(
      user.email,
      'Your Seller Portal Password Reset',
      `<p>Your password has been reset.</p><p>Email: ${user.email}<br/>Temporary Password: <b>${tempPassword}</b></p>`
    );
    return { userId: user.id, email: user.email, tempPassword };
  }
}


