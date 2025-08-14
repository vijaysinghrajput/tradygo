import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { vendorSeedData } from './data/vendors.data';
import { upsertVendors, upsertVendorAddresses, upsertVendorBankAccounts, upsertVendorKyc, upsertCommissionRules, upsertVendorStatements, upsertPayouts, upsertVendorSettings, upsertVendorIssues, upsertVendorUsers, upsertProducts, upsertOrders } from './utils/upsert';

// Load environment variables
config();

const prisma = new PrismaClient();
const client = prisma as any;

async function seedVendors() {
  console.log('🌱 Starting vendor seeding...');
  
  try {
    // Get initial counts
    const initialCounts = {
      vendors: await client.vendor.count(),
      addresses: await client.vendorAddress.count(),
      bankAccounts: await client.vendorBankAccount.count(),
      kyc: await client.vendorKyc.count(),
      commissionRules: await client.commissionRule.count(),
      statements: await client.vendorStatement.count(),
      payouts: await client.payout.count(),
      settings: await client.vendorSetting.count(),
      issues: await client.vendorIssue.count(),
      products: await client.product.count(),
      orders: await client.order.count(),
    };
    
    console.log('📊 Initial counts:', initialCounts);
    
    // Check if users table exists for vendor_users seeding
    let usersTableExists = true;
    try {
      await client.user.count();
    } catch (error) {
      console.log('⚠️  Users table missing – skipping vendor_users');
      usersTableExists = false;
    }
    
    // Seed vendors
    console.log('\n👥 Seeding vendors...');
    const vendorResults = await upsertVendors(prisma, vendorSeedData.vendors);
    console.log(`✅ Vendors: ${vendorResults.created} created, ${vendorResults.updated} updated`);
    
    // Seed vendor addresses
    console.log('\n🏠 Seeding vendor addresses...');
    const addressResults = await upsertVendorAddresses(prisma, vendorSeedData.addresses);
    console.log(`✅ Addresses: ${addressResults.created} created, ${addressResults.updated} updated`);
    
    // Seed vendor bank accounts
    console.log('\n🏦 Seeding vendor bank accounts...');
    const bankResults = await upsertVendorBankAccounts(prisma, vendorSeedData.bankAccounts);
    console.log(`✅ Bank accounts: ${bankResults.created} created, ${bankResults.updated} updated`);
    
    // Seed vendor KYC
    console.log('\n📄 Seeding vendor KYC documents...');
    const kycResults = await upsertVendorKyc(prisma, vendorSeedData.kyc);
    console.log(`✅ KYC documents: ${kycResults.created} created, ${kycResults.updated} updated`);
    
    // Seed commission rules
    console.log('\n💰 Seeding commission rules...');
    const commissionResults = await upsertCommissionRules(prisma, vendorSeedData.commissionRules);
    console.log(`✅ Commission rules: ${commissionResults.created} created, ${commissionResults.updated} updated`);
    
    // Seed vendor settings
    console.log('\n⚙️  Seeding vendor settings...');
    const settingsResults = await upsertVendorSettings(prisma, vendorSeedData.settings);
    console.log(`✅ Vendor settings: ${settingsResults.created} created, ${settingsResults.updated} updated`);
    
    // Seed vendor statements
    console.log('\n📊 Seeding vendor statements...');
    const statementResults = await upsertVendorStatements(prisma, vendorSeedData.statements);
    console.log(`✅ Statements: ${statementResults.created} created, ${statementResults.updated} updated`);
    
    // Seed payouts
    console.log('\n💸 Seeding payouts...');
    const payoutResults = await upsertPayouts(prisma, vendorSeedData.payouts);
    console.log(`✅ Payouts: ${payoutResults.created} created, ${payoutResults.updated} updated`);
    
    // Seed vendor issues
    console.log('\n🐛 Seeding vendor issues...');
    const issueResults = await upsertVendorIssues(prisma, vendorSeedData.issues);
    console.log(`✅ Issues: ${issueResults.created} created, ${issueResults.updated} updated`);
    
    // Seed vendor users (if users table exists)
    if (usersTableExists) {
      console.log('\n👤 Seeding vendor users...');
      const userResults = await upsertVendorUsers(prisma, vendorSeedData.vendorUsers);
      console.log(`✅ Vendor users: ${userResults.created} created, ${userResults.updated} updated`);
    }
    
    // Seed products
    console.log('\n📦 Seeding products...');
    const productResults = await upsertProducts(prisma, vendorSeedData.products);
    console.log(`✅ Products: ${productResults.created} created, ${productResults.updated} updated`);
    
    // Seed orders
    console.log('\n🛒 Seeding orders...');
    const orderResults = await upsertOrders(prisma, vendorSeedData.orders);
    console.log(`✅ Orders: ${orderResults.created} created, ${orderResults.updated} updated`);
    
    // Get final counts
    const finalCounts = {
      vendors: await client.vendor.count(),
      addresses: await client.vendorAddress.count(),
      bankAccounts: await client.vendorBankAccount.count(),
      kyc: await client.vendorKyc.count(),
      commissionRules: await client.commissionRule.count(),
      statements: await client.vendorStatement.count(),
      payouts: await client.payout.count(),
      settings: await client.vendorSetting.count(),
      issues: await client.vendorIssue.count(),
      products: await client.product.count(),
      orders: await client.order.count(),
    };
    
    console.log('\n📊 Final counts:', finalCounts);
    
    // Print vendor summary
    console.log('\n🎯 Vendor Summary:');
    const vendors = await client.vendor.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        _count: {
          select: {
            products: true,
            orders: true,
          }
        }
      }
    });
    
    vendors.forEach(vendor => {
      console.log(`  • ${vendor.name} (${vendor.status}) - ${vendor._count.products} products, ${vendor._count.orders} orders`);
    });
    
    // Acceptance checks
    console.log('\n✅ Acceptance Checks:');
    console.log(`  • Vendors: ${finalCounts.vendors} (target: 5) ${finalCounts.vendors >= 5 ? '✅' : '❌'}`);
    console.log(`  • Addresses: ${finalCounts.addresses} (target: ≥10) ${finalCounts.addresses >= 10 ? '✅' : '❌'}`);
    console.log(`  • Bank accounts: ${finalCounts.bankAccounts} (target: ≥5) ${finalCounts.bankAccounts >= 5 ? '✅' : '❌'}`);
    console.log(`  • KYC docs: ${finalCounts.kyc} (target: ≥10) ${finalCounts.kyc >= 10 ? '✅' : '❌'}`);
    console.log(`  • Commission rules: ${finalCounts.commissionRules} (target: ≥4) ${finalCounts.commissionRules >= 4 ? '✅' : '❌'}`);
    console.log(`  • Statements: ${finalCounts.statements} (target: ≥8) ${finalCounts.statements >= 8 ? '✅' : '❌'}`);
    console.log(`  • Payouts: ${finalCounts.payouts} (target: ≥4) ${finalCounts.payouts >= 4 ? '✅' : '❌'}`);
    console.log(`  • Issues: ${finalCounts.issues} (target: ≥6) ${finalCounts.issues >= 6 ? '✅' : '❌'}`);
    console.log(`  • Settings: ${finalCounts.settings} (target: 5) ${finalCounts.settings >= 5 ? '✅' : '❌'}`);
    
    const completedPayouts = await client.payout.count({ where: { status: 'COMPLETED' } });
    console.log(`  • Completed payouts: ${completedPayouts} (target: ≥2) ${completedPayouts >= 2 ? '✅' : '❌'}`);
    
    console.log('\n🎉 Vendor seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during vendor seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedVendors()
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedVendors };