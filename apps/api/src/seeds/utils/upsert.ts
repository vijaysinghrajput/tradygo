import { PrismaClient } from '@prisma/client';

interface UpsertResult {
  created: number;
  updated: number;
}

export async function upsertVendors(prisma: PrismaClient, vendors: any[]): Promise<UpsertResult> {
  const client = prisma as any;
  let created = 0;
  let updated = 0;
  
  for (const vendor of vendors) {
    try {
      const existing = await client.vendor.findUnique({ where: { id: vendor.id } });
      
      if (existing) {
        await client.vendor.update({
          where: { id: vendor.id },
          data: vendor,
        });
        updated++;
      } else {
        await client.vendor.create({ data: vendor });
        created++;
      }
    } catch (error) {
      console.error(`Error upserting vendor ${vendor.id}:`, error);
    }
  }
  
  return { created, updated };
}

export async function upsertVendorAddresses(prisma: PrismaClient, addresses: any[]): Promise<UpsertResult> {
  const client = prisma as any;
  let created = 0;
  let updated = 0;
  
  for (const address of addresses) {
    try {
      const existing = await client.vendorAddress.findUnique({ where: { id: address.id } });
      
      if (existing) {
        await client.vendorAddress.update({
          where: { id: address.id },
          data: address,
        });
        updated++;
      } else {
        await client.vendorAddress.create({ data: address });
        created++;
      }
    } catch (error) {
      console.error(`Error upserting address ${address.id}:`, error);
    }
  }
  
  return { created, updated };
}

export async function upsertVendorBankAccounts(prisma: PrismaClient, bankAccounts: any[]): Promise<UpsertResult> {
  const client = prisma as any;
  let created = 0;
  let updated = 0;
  
  for (const account of bankAccounts) {
    try {
      const existing = await client.vendorBankAccount.findUnique({ where: { id: account.id } });
      
      if (existing) {
        await client.vendorBankAccount.update({
          where: { id: account.id },
          data: account,
        });
        updated++;
      } else {
        await client.vendorBankAccount.create({ data: account });
        created++;
      }
    } catch (error) {
      console.error(`Error upserting bank account ${account.id}:`, error);
    }
  }
  
  return { created, updated };
}

export async function upsertVendorKyc(prisma: PrismaClient, kycDocs: any[]): Promise<UpsertResult> {
  const client = prisma as any;
  let created = 0;
  let updated = 0;
  
  for (const kyc of kycDocs) {
    try {
      const existing = await client.vendorKyc.findFirst({
        where: {
          vendorId: kyc.vendorId,
          docType: kyc.docType,
        },
      });
      
      if (existing) {
        await client.vendorKyc.update({
          where: { id: existing.id },
          data: kyc,
        });
        updated++;
      } else {
        await client.vendorKyc.create({ data: kyc });
        created++;
      }
    } catch (error) {
      console.error(`Error upserting KYC for vendor ${kyc.vendorId}:`, error);
    }
  }
  
  return { created, updated };
}

export async function upsertCommissionRules(prisma: PrismaClient, rules: any[]): Promise<UpsertResult> {
  const client = prisma as any;
  let created = 0;
  let updated = 0;
  
  for (const rule of rules) {
    try {
      const existing = await client.commissionRule.findUnique({ where: { id: rule.id } });
      
      if (existing) {
        await client.commissionRule.update({
          where: { id: rule.id },
          data: rule,
        });
        updated++;
      } else {
        await client.commissionRule.create({ data: rule });
        created++;
      }
    } catch (error) {
      console.error(`Error upserting commission rule ${rule.id}:`, error);
    }
  }
  
  return { created, updated };
}

export async function upsertVendorStatements(prisma: PrismaClient, statements: any[]): Promise<UpsertResult> {
  const client = prisma as any;
  let created = 0;
  let updated = 0;
  
  for (const statement of statements) {
    try {
      const existing = await client.vendorStatement.findUnique({ where: { id: statement.id } });
      
      if (existing) {
        await client.vendorStatement.update({
          where: { id: statement.id },
          data: statement,
        });
        updated++;
      } else {
        await client.vendorStatement.create({ data: statement });
        created++;
      }
    } catch (error) {
      console.error(`Error upserting statement ${statement.id}:`, error);
    }
  }
  
  return { created, updated };
}

export async function upsertPayouts(prisma: PrismaClient, payouts: any[]): Promise<UpsertResult> {
  const client = prisma as any;
  let created = 0;
  let updated = 0;
  
  for (const payout of payouts) {
    try {
      const existing = await client.payout.findUnique({ where: { id: payout.id } });
      
      if (existing) {
        await client.payout.update({
          where: { id: payout.id },
          data: payout,
        });
        updated++;
      } else {
        await client.payout.create({ data: payout });
        created++;
      }
    } catch (error) {
      console.error(`Error upserting payout ${payout.id}:`, error);
    }
  }
  
  return { created, updated };
}

export async function upsertVendorSettings(prisma: PrismaClient, settings: any[]): Promise<UpsertResult> {
  const client = prisma as any;
  let created = 0;
  let updated = 0;
  
  for (const setting of settings) {
    try {
      const existing = await client.vendorSetting.findUnique({ where: { id: setting.id } });
      
      if (existing) {
        await client.vendorSetting.update({
          where: { id: setting.id },
          data: setting,
        });
        updated++;
      } else {
        await client.vendorSetting.create({ data: setting });
        created++;
      }
    } catch (error) {
      console.error(`Error upserting setting ${setting.id}:`, error);
    }
  }
  
  return { created, updated };
}

export async function upsertVendorIssues(prisma: PrismaClient, issues: any[]): Promise<UpsertResult> {
  const client = prisma as any;
  let created = 0;
  let updated = 0;
  
  for (const issue of issues) {
    try {
      const existing = await client.vendorIssue.findFirst({
        where: {
          vendorId: issue.vendorId,
          title: issue.title,
        },
      });
      
      if (existing) {
        await client.vendorIssue.update({
          where: { id: existing.id },
          data: issue,
        });
        updated++;
      } else {
        await client.vendorIssue.create({ data: issue });
        created++;
      }
    } catch (error) {
      console.error(`Error upserting issue for vendor ${issue.vendorId}:`, error);
    }
  }
  
  return { created, updated };
}

export async function upsertVendorUsers(prisma: PrismaClient, vendorUsers: any[]): Promise<UpsertResult> {
  const client = prisma as any;
  let created = 0;
  let updated = 0;
  
  for (const vendorUser of vendorUsers) {
    try {
      let user = await client.user.findUnique({ where: { email: vendorUser.email } });
      
      if (!user) {
        user = await client.user.create({
          data: {
            email: vendorUser.email,
            firstName: vendorUser.firstName,
            lastName: vendorUser.lastName,
            role: vendorUser.role,
            passwordHash: '$2b$10$defaulthashforseeding',
            isVerified: true,
          },
        });
      }
      
      const existing = await client.vendorUser.findFirst({
        where: {
          vendorId: vendorUser.vendorId,
          userId: user.id,
        },
      });
      
      if (existing) {
        await client.vendorUser.update({
          where: { id: existing.id },
          data: {
            role: vendorUser.vendorRole,
          },
        });
        updated++;
      } else {
        await client.vendorUser.create({
          data: {
            vendorId: vendorUser.vendorId,
            userId: user.id,
            role: vendorUser.vendorRole,
          },
        });
        created++;
      }
    } catch (error) {
      console.error(`Error upserting vendor user ${vendorUser.email}:`, error);
    }
  }
  
  return { created, updated };
}

export async function upsertProducts(prisma: PrismaClient, products: any[]): Promise<UpsertResult> {
  const client = prisma as any;
  let created = 0;
  let updated = 0;
  
  for (const product of products) {
    try {
      const existing = await client.product.findFirst({
        where: {
          vendorId: product.vendorId,
          name: product.name,
        },
      });
      
      if (existing) {
        await client.product.update({
          where: { id: existing.id },
          data: product,
        });
        updated++;
      } else {
        await client.product.create({ data: product });
        created++;
      }
    } catch (error) {
      console.error(`Error upserting product ${product.name}:`, error);
    }
  }
  
  return { created, updated };
}

export async function upsertOrders(prisma: PrismaClient, orders: any[]): Promise<UpsertResult> {
  const client = prisma as any;
  let created = 0;
  let updated = 0;
  
  for (const order of orders) {
    try {
      let user = await client.user.findFirst({ where: { role: 'CUSTOMER' } });
      
      if (!user) {
        user = await client.user.create({
          data: {
            email: 'demo.customer@tradygo.com',
            firstName: 'Demo',
            lastName: 'Customer',
            role: 'CUSTOMER',
            passwordHash: '$2b$10$defaulthashforseeding',
            isVerified: true,
          },
        });
      }
      
      const orderData = {
        ...order,
        userId: user.id,
      };
      
      await client.order.create({ data: orderData });
      created++;
    } catch (error) {
      console.error(`Error creating order:`, error);
    }
  }
  
  return { created, updated };
}