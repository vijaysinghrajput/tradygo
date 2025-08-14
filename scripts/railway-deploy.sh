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

# Run migrations with P3005 error handling
print_status "Running database migrations..."
if ! pnpm run db:migrate 2>/dev/null; then
    print_warning "Migration failed - checking for P3005 (non-empty database)"
    
    # Check if it's a P3005 error (database not empty)
    if pnpm run db:migrate 2>&1 | grep -q "P3005\|database schema is not empty"; then
        print_status "P3005 detected - running baseline migration for existing database"
        cd ../..
        ./scripts/baseline-production.sh
        cd apps/api
        print_success "Baseline migration completed"
    else
        print_error "Migration failed with unknown error"
        pnpm run db:migrate  # Re-run to show the actual error
        exit 1
    fi
else
    print_success "Migrations completed successfully"
fi

# Smart vendor seeding
print_status "Running smart vendor seeding..."
cd ../..
./scripts/smart-seed.sh
cd apps/api
print_success "Smart seeding completed"

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