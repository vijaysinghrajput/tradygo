import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Get environment variables with fallbacks
  const brandName = process.env.PLATFORM_BRAND_NAME || 'TradyGo';
  const brandLogoUrl = process.env.PLATFORM_BRAND_LOGO_URL || 'https://cdn.tradygo.in/brand/admin-logo.svg';
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

  console.log(`✅ Created/updated users: ${superAdmin.email}, ${admin.email}`);

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
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });