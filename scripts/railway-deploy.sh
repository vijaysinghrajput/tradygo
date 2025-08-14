#!/bin/bash

# 🚀 Railway Production Deployment Script
# Handles complete TradyGo deployment with database setup

set -e

echo "🚀 TradyGo Railway Deployment Starting..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[DEPLOY]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Environment validation
print_status "Validating environment..."

if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL not found"
    exit 1
fi

if [ -z "$JWT_ACCESS_SECRET" ]; then
    print_warning "JWT_ACCESS_SECRET not set, using default (INSECURE)"
    export JWT_ACCESS_SECRET="tradygo-default-jwt-secret-change-in-production"
fi

if [ -z "$NODE_ENV" ]; then
    export NODE_ENV="production"
fi

print_success "Environment validated"

# Install dependencies
print_status "Installing dependencies..."
pnpm install --frozen-lockfile --prod=false
print_success "Dependencies installed"

# Build application
print_status "Building application..."
pnpm run build
print_success "Application built"

# Database setup
print_status "Setting up database..."
cd apps/api

# Generate Prisma client
print_status "Generating Prisma client..."
pnpm run db:generate
print_success "Prisma client generated"

# Run migrations
print_status "Running database migrations..."
pnpm run db:migrate
print_success "Migrations completed"

# Check and seed data
print_status "Checking vendor data..."
VENDOR_CHECK=$(node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.vendor.count()
  .then(count => { console.log(count); return prisma.\$disconnect(); })
  .catch(err => { console.log('0'); return prisma.\$disconnect(); });
" 2>/dev/null || echo "0")

if [ "$VENDOR_CHECK" = "0" ]; then
    print_status "Seeding vendor data..."
    pnpm run db:seed:vendors
    print_success "Vendor data seeded"
else
    print_warning "Found $VENDOR_CHECK vendors, skipping seeding"
fi

# Final verification
print_status "Verifying deployment..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
    try {
        await prisma.\$connect();
        const vendors = await prisma.vendor.count();
        console.log('✅ Database connected');
        console.log('✅ Vendors:', vendors);
        console.log('🎉 Deployment verification successful!');
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
        process.exit(1);
    } finally {
        await prisma.\$disconnect();
    }
}

verify();
"

print_success "🎉 Railway deployment completed successfully!"
print_status "Starting application..."

# Start the application
exec pnpm start:prod