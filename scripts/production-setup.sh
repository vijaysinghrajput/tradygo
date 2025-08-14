#!/bin/bash

# 🚀 TradyGo Production Database Setup Script
# This script sets up the production database with all tables and demo data

set -e  # Exit on any error

echo "🚀 Starting TradyGo Production Database Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps/api" ]; then
    print_error "Please run this script from the TradyGo root directory"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL environment variable is not set"
    print_warning "Please set DATABASE_URL before running this script"
    exit 1
fi

print_status "Database URL: ${DATABASE_URL:0:30}..."

# Step 1: Install dependencies
print_status "Installing dependencies..."
pnpm install --frozen-lockfile
print_success "Dependencies installed"

# Step 2: Generate Prisma client
print_status "Generating Prisma client..."
cd apps/api
pnpm run db:generate
print_success "Prisma client generated"

# Step 3: Run database migrations
print_status "Running database migrations..."
pnpm run db:migrate
print_success "Database migrations completed"

# Step 4: Check if vendors table exists and has data
print_status "Checking existing vendor data..."
VENDOR_COUNT=$(node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.vendor.count().then(count => { console.log(count); prisma.\$disconnect(); }).catch(() => { console.log('0'); });")

if [ "$VENDOR_COUNT" -gt 0 ]; then
    print_warning "Found $VENDOR_COUNT existing vendors. Skipping seeding to avoid duplicates."
else
    print_status "No existing vendors found. Running vendor seeding..."
    pnpm run db:seed:vendors
    print_success "Vendor data seeded successfully"
fi

# Step 5: Verify setup
print_status "Verifying database setup..."

# Check tables exist
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
    try {
        const vendorCount = await prisma.vendor.count();
        const addressCount = await prisma.vendorAddress.count();
        const bankCount = await prisma.vendorBankAccount.count();
        
        console.log('✅ Vendors:', vendorCount);
        console.log('✅ Addresses:', addressCount);
        console.log('✅ Bank Accounts:', bankCount);
        
        if (vendorCount > 0) {
            console.log('\n🎉 Database setup completed successfully!');
            console.log('📊 Demo data is ready for testing');
        } else {
            console.log('\n⚠️  No vendor data found. Manual seeding may be required.');
        }
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
        process.exit(1);
    } finally {
        await prisma.\$disconnect();
    }
}

verify();
"

print_success "Production database setup completed!"
print_status "You can now start your application with: pnpm start:prod"

echo ""
echo "🎯 Next Steps:"
echo "1. Your database is ready with all tables and demo data"
echo "2. API endpoints are available for seller onboarding"
echo "3. Admin panel can manage vendors"
echo "4. Start your application: pnpm start:prod"
echo ""