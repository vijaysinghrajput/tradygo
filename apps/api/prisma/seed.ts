import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Get environment variables with fallbacks
  const brandName = process.env.PLATFORM_BRAND_NAME || 'TradyGo';
  const assetsBase = process.env.ASSETS_BASE_URL?.replace(/\/+$/, '');
  const brandLogoUrl = process.env.PLATFORM_BRAND_LOGO_URL || (assetsBase ? `${assetsBase}/brand/admin-logo.svg` : 'https://cdn.tradygo.in/brand/admin-logo.svg');
  const uiHelpUrl = process.env.UI_HELP_URL || 'https://docs.tradygo.in/admin';
  const authAdminRoles = JSON.parse(process.env.AUTH_ADMIN_ROLES_JSON || '["ADMIN","SUPER_ADMIN"]');
  const authOtpEnabled = process.env.AUTH_OTP_ENABLED === '1';
  const uiShowDemoCreds = process.env.NODE_ENV !== 'production' && process.env.UI_SHOW_DEMO_CREDS === '1';
  const defaultRedirectAdmin = process.env.REDIRECT_ADMIN || '/dashboard';
  const defaultRedirectSeller = process.env.REDIRECT_SELLER || '/orders';
  const bcryptRounds = parseInt(process.env.PASSWORD_BCRYPT_ROUNDS || '12', 10);

  // Hash passwords for demo users
  const superAdminPassword = await bcrypt.hash('Admin@12345!', bcryptRounds);
  const adminPassword = await bcrypt.hash('Admin@12345!', bcryptRounds);
  const sellerPassword = await bcrypt.hash('Seller@12345!', bcryptRounds);
  const customerPassword = await bcrypt.hash('User@12345!', bcryptRounds);

  // Create or update users
  console.log('👤 Creating/updating users...');
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'sa@tradygo.in' },
    update: {
      passwordHash: superAdminPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
    create: {
      email: 'sa@tradygo.in',
      passwordHash: superAdminPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tradygo.in' },
    update: {
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
    create: {
      email: 'admin@tradygo.in',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@tradygo.in' },
    update: {
      passwordHash: sellerPassword,
      role: 'SELLER',
      status: 'ACTIVE',
    },
    create: {
      email: 'seller@tradygo.in',
      passwordHash: sellerPassword,
      role: 'SELLER',
      status: 'ACTIVE',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'user@tradygo.in' },
    update: {
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      status: 'ACTIVE',
    },
    create: {
      email: 'user@tradygo.in',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Created/updated users: ${superAdmin.email}, ${admin.email}, ${seller.email}, ${customer.email}`);

  // Create or update platform config (singleton)
  console.log('⚙️ Creating/updating platform configuration...');
  
  const platformConfig = await prisma.platformConfig.upsert({
    where: { id: 'cfg-singleton' },
    update: {
      brandName,
      brandLogoUrl,
      uiHelpUrl,
      authAdminRoles,
      authOtpEnabled,
      uiShowDemoCreds,
      defaultRedirectAdmin,
      defaultRedirectSeller,
    },
    create: {
      id: 'cfg-singleton',
      brandName,
      brandLogoUrl,
      uiHelpUrl,
      authAdminRoles,
      authOtpEnabled,
      uiShowDemoCreds,
      defaultRedirectAdmin,
      defaultRedirectSeller,
    },
  });

  console.log(`✅ Platform config: ${platformConfig.brandName}`);

  // Create demo credentials
  console.log('🧪 Creating demo credentials...');
  
  const demoCredentials = [
    {
      label: 'Super Admin',
      email: 'sa@tradygo.in',
      passwordPlaintext: 'Admin@12345!',
      role: 'SUPER_ADMIN' as const,
    },
    {
      label: 'Admin',
      email: 'admin@tradygo.in',
      passwordPlaintext: 'Admin@12345!',
      role: 'ADMIN' as const,
    },
    {
      label: 'Seller',
      email: 'seller@tradygo.in',
      passwordPlaintext: 'Seller@12345!',
      role: 'SELLER' as const,
    },
    {
      label: 'Customer',
      email: 'user@tradygo.in',
      passwordPlaintext: 'User@12345!',
      role: 'CUSTOMER' as const,
    },
  ];

  for (const cred of demoCredentials) {
    await prisma.demoCredential.upsert({
      where: { email: cred.email },
      update: {
        label: cred.label,
        passwordPlaintext: cred.passwordPlaintext,
        role: cred.role,
        platformConfigId: 'cfg-singleton',
      },
      create: {
        label: cred.label,
        email: cred.email,
        passwordPlaintext: cred.passwordPlaintext,
        role: cred.role,
        platformConfigId: 'cfg-singleton',
      },
    });
    console.log(`✅ Demo credential: ${cred.label} (${cred.email})`);
  }

  console.log('🎉 Database seed completed successfully!');
  console.log('📋 Configuration Summary:');
  console.log(`   Brand: ${brandName}`);
  console.log(`   Logo: ${brandLogoUrl}`);
  console.log(`   Help: ${uiHelpUrl}`);
  console.log(`   Admin Roles: ${JSON.stringify(authAdminRoles)}`);
  console.log(`   OTP Enabled: ${authOtpEnabled}`);
  console.log(`   Show Demo Creds: ${uiShowDemoCreds}`);
  console.log(`   Admin Redirect: ${defaultRedirectAdmin}`);
  console.log(`   Seller Redirect: ${defaultRedirectSeller}`);

  // Seed demo vendors
  console.log('🏪 Seeding demo vendors...');
  const v1 = await prisma.vendor.upsert({
    where: { email: 'acme@vendors.test' },
    update: {},
    create: { name: 'Acme Traders', legalName: 'Acme Traders Pvt Ltd', email: 'acme@vendors.test', phone: '9000000001', status: 'ACTIVE' as any },
  });
  await prisma.vendorAddress.create({ data: { vendorId: v1.id, line1: '12 Main St', city: 'Mumbai', state: 'MH', postalCode: '400001', country: 'India', isDefault: true } });
  await prisma.vendorBankAccount.create({ data: { vendorId: v1.id, accountHolder: 'Acme Traders', accountNumber: '1234567890', ifsc: 'HDFC0000001', bankName: 'HDFC Bank', status: 'VERIFIED' as any } });
  await prisma.commissionRule.create({ data: { vendorId: v1.id, type: 'PERCENTAGE', value: new Prisma.Decimal(10) } });

  const v2 = await prisma.vendor.upsert({
    where: { email: 'globex@vendors.test' },
    update: {},
    create: { name: 'Globex Retail', legalName: 'Globex Retail LLP', email: 'globex@vendors.test', phone: '9000000002', status: 'PENDING' as any },
  });
  await prisma.vendorAddress.create({ data: { vendorId: v2.id, line1: '221B Baker St', city: 'Delhi', state: 'DL', postalCode: '110001', country: 'India' } });

  console.log('✅ Demo vendors seeded:', v1.email, v2.email);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });