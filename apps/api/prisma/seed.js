"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@tradygo.in' },
        update: {},
        create: {
            email: 'admin@tradygo.in',
            firstName: 'Admin',
            lastName: 'User',
            role: client_1.UserRole.ADMIN,
            isActive: true,
            isVerified: true,
            authProviders: {
                create: {
                    provider: client_1.AuthProvider.EMAIL,
                    passwordHash: adminPasswordHash,
                    isVerified: true,
                },
            },
        },
    });
    // Create demo seller users
    const seller1PasswordHash = await bcrypt.hash('seller123', 10);
    const seller1 = await prisma.user.upsert({
        where: { email: 'seller1@tradygo.in' },
        update: {},
        create: {
            email: 'seller1@tradygo.in',
            firstName: 'John',
            lastName: 'Seller',
            role: client_1.UserRole.SELLER,
            isActive: true,
            isVerified: true,
            authProviders: {
                create: {
                    provider: client_1.AuthProvider.EMAIL,
                    passwordHash: seller1PasswordHash,
                    isVerified: true,
                },
            },
            seller: {
                create: {
                    businessName: 'TechGadgets Store',
                    businessType: 'Electronics',
                    gstNumber: '29ABCDE1234F1Z5',
                    panNumber: 'ABCDE1234F',
                    kycStatus: client_1.KYCStatus.APPROVED,
                    bankAccountNumber: '1234567890',
                    bankIfscCode: 'HDFC0001234',
                    bankAccountName: 'TechGadgets Store',
                    isActive: true,
                    commissionRate: 8.0,
                },
            },
        },
    });
    const seller2PasswordHash = await bcrypt.hash('seller123', 10);
    const seller2 = await prisma.user.upsert({
        where: { email: 'seller2@tradygo.in' },
        update: {},
        create: {
            email: 'seller2@tradygo.in',
            firstName: 'Jane',
            lastName: 'Fashion',
            role: client_1.UserRole.SELLER,
            isActive: true,
            isVerified: true,
            authProviders: {
                create: {
                    provider: client_1.AuthProvider.EMAIL,
                    passwordHash: seller2PasswordHash,
                    isVerified: true,
                },
            },
            seller: {
                create: {
                    businessName: 'Fashion Hub',
                    businessType: 'Clothing',
                    gstNumber: '29FGHIJ5678K2L6',
                    panNumber: 'FGHIJ5678K',
                    kycStatus: client_1.KYCStatus.APPROVED,
                    bankAccountNumber: '9876543210',
                    bankIfscCode: 'ICICI0005678',
                    bankAccountName: 'Fashion Hub',
                    isActive: true,
                    commissionRate: 10.0,
                },
            },
        },
    });
    // Create demo customer users
    const customerPasswordHash = await bcrypt.hash('customer123', 10);
    const customer1 = await prisma.user.upsert({
        where: { email: 'customer1@example.com' },
        update: {},
        create: {
            email: 'customer1@example.com',
            phone: '+919876543210',
            firstName: 'Rahul',
            lastName: 'Kumar',
            role: client_1.UserRole.CUSTOMER,
            isActive: true,
            isVerified: true,
            authProviders: {
                create: {
                    provider: client_1.AuthProvider.EMAIL,
                    passwordHash: customerPasswordHash,
                    isVerified: true,
                },
            },
        },
    });
    // Create categories
    const electronicsCategory = await prisma.category.upsert({
        where: { slug: 'electronics' },
        update: {},
        create: {
            name: 'Electronics',
            slug: 'electronics',
            description: 'Electronic gadgets and devices',
            isActive: true,
            sortOrder: 1,
        },
    });
    const mobileCategory = await prisma.category.upsert({
        where: { slug: 'mobiles' },
        update: {},
        create: {
            name: 'Mobiles',
            slug: 'mobiles',
            description: 'Smartphones and mobile accessories',
            parentId: electronicsCategory.id,
            isActive: true,
            sortOrder: 1,
        },
    });
    const fashionCategory = await prisma.category.upsert({
        where: { slug: 'fashion' },
        update: {},
        create: {
            name: 'Fashion',
            slug: 'fashion',
            description: 'Clothing and fashion accessories',
            isActive: true,
            sortOrder: 2,
        },
    });
    const mensFashionCategory = await prisma.category.upsert({
        where: { slug: 'mens-fashion' },
        update: {},
        create: {
            name: "Men's Fashion",
            slug: 'mens-fashion',
            description: "Men's clothing and accessories",
            parentId: fashionCategory.id,
            isActive: true,
            sortOrder: 1,
        },
    });
    // Create brands
    const appleBrand = await prisma.brand.upsert({
        where: { slug: 'apple' },
        update: {},
        create: {
            name: 'Apple',
            slug: 'apple',
            description: 'Premium technology products',
            isActive: true,
        },
    });
    const nikeBrand = await prisma.brand.upsert({
        where: { slug: 'nike' },
        update: {},
        create: {
            name: 'Nike',
            slug: 'nike',
            description: 'Sports and lifestyle brand',
            isActive: true,
        },
    });
    // Get seller records
    const seller1Record = await prisma.seller.findUnique({
        where: { userId: seller1.id },
    });
    const seller2Record = await prisma.seller.findUnique({
        where: { userId: seller2.id },
    });
    if (!seller1Record || !seller2Record) {
        throw new Error('Seller records not found');
    }
    // Create warehouses
    const warehouse1 = await prisma.warehouse.create({
        data: {
            sellerId: seller1Record.id,
            name: 'TechGadgets Main Warehouse',
            addressLine: '123 Tech Street',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            country: 'India',
            isActive: true,
        },
    });
    const warehouse2 = await prisma.warehouse.create({
        data: {
            sellerId: seller2Record.id,
            name: 'Fashion Hub Warehouse',
            addressLine: '456 Fashion Avenue',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India',
            isActive: true,
        },
    });
    // Create products
    const iphoneProduct = await prisma.product.create({
        data: {
            sellerId: seller1Record.id,
            categoryId: mobileCategory.id,
            brandId: appleBrand.id,
            name: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            description: 'Latest iPhone with advanced features',
            isActive: true,
            variants: {
                create: [
                    {
                        sku: 'IPH15P-128-BLK',
                        name: 'iPhone 15 Pro 128GB Black',
                        price: 134900,
                        mrp: 134900,
                        taxRate: 18.0,
                        barcode: '1234567890123',
                        attributes: {
                            color: 'Black',
                            storage: '128GB',
                        },
                        images: [
                            'https://cdn.tradygo.in/products/iphone-15-pro-black-1.jpg',
                            'https://cdn.tradygo.in/products/iphone-15-pro-black-2.jpg',
                        ],
                        weight: 187,
                        dimensions: {
                            length: 146.6,
                            width: 70.6,
                            height: 8.25,
                        },
                        isActive: true,
                    },
                    {
                        sku: 'IPH15P-256-BLU',
                        name: 'iPhone 15 Pro 256GB Blue',
                        price: 144900,
                        mrp: 144900,
                        taxRate: 18.0,
                        barcode: '1234567890124',
                        attributes: {
                            color: 'Blue',
                            storage: '256GB',
                        },
                        images: [
                            'https://cdn.tradygo.in/products/iphone-15-pro-blue-1.jpg',
                            'https://cdn.tradygo.in/products/iphone-15-pro-blue-2.jpg',
                        ],
                        weight: 187,
                        dimensions: {
                            length: 146.6,
                            width: 70.6,
                            height: 8.25,
                        },
                        isActive: true,
                    },
                ],
            },
        },
    });
    const nikeShoeProduct = await prisma.product.create({
        data: {
            sellerId: seller2Record.id,
            categoryId: mensFashionCategory.id,
            brandId: nikeBrand.id,
            name: 'Nike Air Max 270',
            slug: 'nike-air-max-270',
            description: 'Comfortable running shoes with air cushioning',
            isActive: true,
            variants: {
                create: [
                    {
                        sku: 'NIKE-AM270-9-BLK',
                        name: 'Nike Air Max 270 Size 9 Black',
                        price: 12995,
                        mrp: 14995,
                        taxRate: 12.0,
                        barcode: '2345678901234',
                        attributes: {
                            color: 'Black',
                            size: '9',
                        },
                        images: [
                            'https://cdn.tradygo.in/products/nike-air-max-270-black-1.jpg',
                            'https://cdn.tradygo.in/products/nike-air-max-270-black-2.jpg',
                        ],
                        weight: 500,
                        dimensions: {
                            length: 30,
                            width: 12,
                            height: 10,
                        },
                        isActive: true,
                    },
                    {
                        sku: 'NIKE-AM270-10-WHT',
                        name: 'Nike Air Max 270 Size 10 White',
                        price: 12995,
                        mrp: 14995,
                        taxRate: 12.0,
                        barcode: '2345678901235',
                        attributes: {
                            color: 'White',
                            size: '10',
                        },
                        images: [
                            'https://cdn.tradygo.in/products/nike-air-max-270-white-1.jpg',
                            'https://cdn.tradygo.in/products/nike-air-max-270-white-2.jpg',
                        ],
                        weight: 500,
                        dimensions: {
                            length: 31,
                            width: 12,
                            height: 10,
                        },
                        isActive: true,
                    },
                ],
            },
        },
    });
    // Create inventory
    const productVariants = await prisma.productVariant.findMany();
    for (const variant of productVariants) {
        const product = await prisma.product.findUnique({
            where: { id: variant.productId },
        });
        if (product) {
            const warehouse = product.sellerId === seller1Record.id ? warehouse1 : warehouse2;
            await prisma.inventory.create({
                data: {
                    sellerId: product.sellerId,
                    warehouseId: warehouse.id,
                    productVariantId: variant.id,
                    quantity: 50,
                    reservedQuantity: 0,
                    reorderLevel: 10,
                },
            });
        }
    }
    // Create coupons
    await prisma.coupon.createMany({
        data: [
            {
                code: 'WELCOME10',
                type: client_1.CouponType.PERCENTAGE,
                value: 10,
                minOrderAmount: 1000,
                maxDiscountAmount: 500,
                usageLimit: 1000,
                usedCount: 0,
                isActive: true,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
            {
                code: 'FLAT500',
                type: client_1.CouponType.FIXED_AMOUNT,
                value: 500,
                minOrderAmount: 2000,
                usageLimit: 500,
                usedCount: 0,
                isActive: true,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
            },
            {
                code: 'FREESHIP',
                type: client_1.CouponType.FREE_SHIPPING,
                value: 0,
                minOrderAmount: 999,
                usageLimit: 2000,
                usedCount: 0,
                isActive: true,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
            },
        ],
    });
    // Create customer address
    await prisma.address.create({
        data: {
            userId: customer1.id,
            type: 'home',
            firstName: 'Rahul',
            lastName: 'Kumar',
            phone: '+919876543210',
            addressLine: '123 Main Street, Apartment 4B',
            landmark: 'Near City Mall',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            country: 'India',
            isDefault: true,
        },
    });
    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Demo accounts created:');
    console.log('Admin: admin@tradygo.in / admin123');
    console.log('Seller 1: seller1@tradygo.in / seller123');
    console.log('Seller 2: seller2@tradygo.in / seller123');
    console.log('Customer: customer1@example.com / customer123');
    console.log('\n🎫 Demo coupons:');
    console.log('WELCOME10 - 10% off (min ₹1000)');
    console.log('FLAT500 - ₹500 off (min ₹2000)');
    console.log('FREESHIP - Free shipping (min ₹999)');
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
