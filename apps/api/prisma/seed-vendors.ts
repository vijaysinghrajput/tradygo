import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedVendors() {
  console.log('🌱 Seeding vendors...');

  try {
    // Create demo vendors using type assertion for vendor models
    const vendor1 = await (prisma as any).vendor.create({
      data: {
        name: 'TechGadgets Store',
        legalName: 'TechGadgets Private Limited',
        email: 'admin@techgadgets.com',
        phone: '+91-9876543210',
        gstNumber: '29ABCDE1234F1Z5',
        panNumber: 'ABCDE1234F',
        status: 'ACTIVE',
        addresses: {
          create: [
            {
              line1: '123 Tech Street',
              line2: 'Electronic City',
              city: 'Bangalore',
              state: 'Karnataka',
              country: 'India',
              postalCode: '560100',
              type: 'BUSINESS',
              isDefault: true,
            },
            {
              line1: '456 Warehouse Road',
              city: 'Bangalore',
              state: 'Karnataka',
              country: 'India',
              postalCode: '560037',
              type: 'WAREHOUSE',
              isDefault: false,
            },
          ],
        },
        bankAccounts: {
          create: [
            {
              accountHolder: 'TechGadgets Private Limited',
              accountNumber: '1234567890123456',
              ifsc: 'HDFC0001234',
              bankName: 'HDFC Bank',
              branch: 'Electronic City Branch',
              status: 'VERIFIED',
            },
          ],
        },
        kyc: {
          create: [
            {
              docType: 'GST_CERTIFICATE',
              docUrl: 'https://example.com/gst-cert.pdf',
              status: 'APPROVED',
            },
            {
              docType: 'PAN_CARD',
              docUrl: 'https://example.com/pan-card.pdf',
              status: 'APPROVED',
            },
          ],
        },
        commission: {
          create: [
            {
              type: 'PERCENTAGE',
              value: 5.0,
              category: 'Electronics',
            },
            {
              type: 'PERCENTAGE',
              value: 3.0,
              category: 'Accessories',
            },
          ],
        },
        settings: {
          create: {
            autoPayout: true,
            defaultCommissionType: 'PERCENTAGE',
            defaultCommissionValue: 5.0,
          },
        },
        statements: {
          create: [
            {
              periodStart: new Date('2024-01-01'),
              periodEnd: new Date('2024-01-31'),
              totalSales: 150000.00,
              totalFees: 7500.00,
              netAmount: 142500.00,
              status: 'FINALIZED',
            },
            {
              periodStart: new Date('2024-02-01'),
              periodEnd: new Date('2024-02-29'),
              totalSales: 180000.00,
              totalFees: 9000.00,
              netAmount: 171000.00,
              status: 'DRAFT',
            },
          ],
        },
        issues: {
          create: [
            {
              title: 'Payment delay issue',
              description: 'Last month payment was delayed by 3 days',
              status: 'RESOLVED',
            },
          ],
        },
      },
    });

    const vendor2 = await (prisma as any).vendor.create({
      data: {
        name: 'Fashion Hub',
        legalName: 'Fashion Hub Enterprises',
        email: 'contact@fashionhub.com',
        phone: '+91-9876543211',
        gstNumber: '29FGHIJ5678K2L6',
        panNumber: 'FGHIJ5678K',
        status: 'PENDING',
        addresses: {
          create: [
            {
              line1: '789 Fashion Street',
              city: 'Mumbai',
              state: 'Maharashtra',
              country: 'India',
              postalCode: '400001',
              type: 'BUSINESS',
              isDefault: true,
            },
          ],
        },
        bankAccounts: {
          create: [
            {
              accountHolder: 'Fashion Hub Enterprises',
              accountNumber: '9876543210987654',
              ifsc: 'ICIC0001234',
              bankName: 'ICICI Bank',
              branch: 'Fashion Street Branch',
              status: 'UNVERIFIED',
            },
          ],
        },
        kyc: {
          create: [
            {
              docType: 'GST_CERTIFICATE',
              docUrl: 'https://example.com/fashion-gst.pdf',
              status: 'PENDING',
            },
          ],
        },
        commission: {
          create: [
            {
              type: 'PERCENTAGE',
              value: 8.0,
              category: 'Fashion',
            },
          ],
        },
        settings: {
          create: {
            autoPayout: false,
            defaultCommissionType: 'PERCENTAGE',
            defaultCommissionValue: 8.0,
          },
        },
        issues: {
          create: [
            {
              title: 'KYC verification pending',
              description: 'Waiting for GST certificate verification',
              status: 'OPEN',
            },
          ],
        },
      },
    });

    // Create some demo products for the vendors (if Product model exists)
    try {
      await (prisma as any).product.createMany({
        data: [
          {
            vendorId: vendor1.id,
            name: 'iPhone 15 Pro',
            price: 129900.00,
          },
          {
            vendorId: vendor1.id,
            name: 'Samsung Galaxy S24',
            price: 89999.00,
          },
          {
            vendorId: vendor1.id,
            name: 'MacBook Air M3',
            price: 114900.00,
          },
          {
            vendorId: vendor2.id,
            name: 'Designer Handbag',
            price: 5999.00,
          },
          {
            vendorId: vendor2.id,
            name: 'Casual T-Shirt',
            price: 899.00,
          },
        ],
      });
      console.log('✅ Demo products created');
    } catch (error) {
      console.log('⚠️ Product model not available, skipping product creation');
    }

    // Create some demo orders (if Order model supports vendorId)
    const demoUser = await prisma.user.findFirst({
      where: { role: 'CUSTOMER' },
    });

    if (demoUser) {
      try {
        // Try to create orders with vendorId if supported
        await prisma.order.createMany({
          data: [
            {
              userId: demoUser.id,
              totalAmount: 129900.00,
              status: 'DELIVERED',
            },
            {
              userId: demoUser.id,
              totalAmount: 89999.00,
              status: 'SHIPPED',
            },
            {
              userId: demoUser.id,
              totalAmount: 6898.00,
              status: 'PENDING',
            },
          ],
        });
        console.log('✅ Demo orders created');
      } catch (error) {
        console.log('⚠️ Order creation failed, vendorId field may not be available yet');
      }
    }

    // Create payouts for finalized statements
    try {
      const finalizedStatement = await (prisma as any).vendorStatement.findFirst({
        where: {
          vendorId: vendor1.id,
          status: 'FINALIZED',
        },
      });

      if (finalizedStatement) {
        await (prisma as any).payout.create({
          data: {
            vendorId: vendor1.id,
            statementId: finalizedStatement.id,
            amount: finalizedStatement.netAmount,
            status: 'COMPLETED',
            reference: 'PAY-' + Date.now(),
          },
        });
        console.log('✅ Demo payout created');
      }
    } catch (error) {
      console.log('⚠️ Payout creation failed, statement/payout models may not be available yet');
    }

    console.log('✅ Vendors seeded successfully!');
    console.log(`Created vendors:`);
    console.log(`- ${vendor1.name} (${vendor1.email})`);
    console.log(`- ${vendor2.name} (${vendor2.email})`);
  } catch (error) {
    console.error('❌ Error seeding vendors:', error);
    console.log('💡 This is expected if the database migration has not been run yet.');
    console.log('💡 Please run the database migration first: npx prisma migrate deploy');
    throw error;
  }
}

async function main() {
  try {
    await seedVendors();
  } catch (error) {
    console.error('❌ Error seeding vendors:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedVendors };