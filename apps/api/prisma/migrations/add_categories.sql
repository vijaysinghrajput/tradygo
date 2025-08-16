-- Add Categories table
CREATE TABLE IF NOT EXISTS "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "parentId" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "path" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "commissionType" "CommissionType" NOT NULL DEFAULT 'PERCENTAGE',
    "commissionValue" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "hasCustomCommission" BOOLEAN NOT NULL DEFAULT false,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- Add Product Categories junction table
CREATE TABLE IF NOT EXISTS "product_categories" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- Add Vendor Category Commissions table
CREATE TABLE IF NOT EXISTS "vendor_category_commissions" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "commissionType" "CommissionType" NOT NULL DEFAULT 'PERCENTAGE',
    "commissionValue" DECIMAL(8,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_category_commissions_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints
ALTER TABLE "categories" ADD CONSTRAINT "categories_slug_key" UNIQUE ("slug");
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_productId_categoryId_key" UNIQUE ("productId", "categoryId");
ALTER TABLE "vendor_category_commissions" ADD CONSTRAINT "vendor_category_commissions_vendorId_categoryId_key" UNIQUE ("vendorId", "categoryId");

-- Create indexes
CREATE INDEX IF NOT EXISTS "categories_parentId_idx" ON "categories"("parentId");
CREATE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories"("slug");
CREATE INDEX IF NOT EXISTS "categories_isActive_idx" ON "categories"("isActive");
CREATE INDEX IF NOT EXISTS "categories_level_idx" ON "categories"("level");
CREATE INDEX IF NOT EXISTS "product_categories_categoryId_idx" ON "product_categories"("categoryId");
CREATE INDEX IF NOT EXISTS "vendor_category_commissions_categoryId_idx" ON "vendor_category_commissions"("categoryId");

-- Add foreign keys
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "vendor_category_commissions" ADD CONSTRAINT "vendor_category_commissions_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "vendor_category_commissions" ADD CONSTRAINT "vendor_category_commissions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert some sample categories
INSERT INTO "categories" ("id", "name", "slug", "description", "level", "path", "displayOrder", "updatedAt")
VALUES 
    ('clz1234567890abcdef000001', 'Electronics', 'electronics', 'Electronic devices and accessories', 0, '', 1, NOW()),
    ('clz1234567890abcdef000002', 'Fashion', 'fashion', 'Clothing, shoes, and accessories', 0, '', 2, NOW()),
    ('clz1234567890abcdef000003', 'Home & Garden', 'home-garden', 'Home decor and gardening supplies', 0, '', 3, NOW()),
    ('clz1234567890abcdef000004', 'Mobile Phones', 'mobile-phones', 'Smartphones and mobile devices', 1, 'clz1234567890abcdef000001', 1, NOW()),
    ('clz1234567890abcdef000005', 'Laptops', 'laptops', 'Laptop computers and accessories', 1, 'clz1234567890abcdef000001', 2, NOW());

-- Update parent references for subcategories
UPDATE "categories" SET "parentId" = 'clz1234567890abcdef000001' WHERE "id" IN ('clz1234567890abcdef000004', 'clz1234567890abcdef000005');