-- TradyGo Database Initialization Script
-- This script sets up the initial database structure and data

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create indexes for better performance
-- These will be created after Prisma migrations

-- Full-text search indexes
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search ON "Product" USING gin(to_tsvector('english', name || ' ' || description));
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_categories_search ON "Category" USING gin(to_tsvector('english', name || ' ' || description));

-- Performance indexes
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_status ON "Product"(status) WHERE status = 'ACTIVE';
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status ON "Order"(status);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_id ON "Order"("userId");
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_id ON "Product"("categoryId");
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_seller_id ON "Product"("sellerId");

-- Composite indexes
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_status ON "Product"("categoryId", status) WHERE status = 'ACTIVE';
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_product ON "OrderItem"("orderId", "productVariantId");

-- Initial data will be inserted via Prisma seed script
-- This file is mainly for database extensions and performance optimizations

-- Log the initialization
DO $$
BEGIN
    RAISE NOTICE 'TradyGo database initialization completed at %', now();
END $$;