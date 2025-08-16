-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT');

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "iconUrl" TEXT,
    "parentId" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "CategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "commissionType" "CommissionType" NOT NULL DEFAULT 'PERCENTAGE',
    "commissionValue" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "inheritCommission" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "comparePrice" DECIMAL(10,2),
ADD COLUMN     "costPrice" DECIMAL(10,2),
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "weight" DECIMAL(8,3),
ADD COLUMN     "dimensions" TEXT,
ADD COLUMN     "trackQuantity" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lowStockAlert" INTEGER DEFAULT 10,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE INDEX "categories_level_idx" ON "categories"("level");

-- CreateIndex
CREATE INDEX "categories_status_idx" ON "categories"("status");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_vendorId_idx" ON "products"("vendorId");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex
CREATE INDEX "products_slug_idx" ON "products"("slug");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;