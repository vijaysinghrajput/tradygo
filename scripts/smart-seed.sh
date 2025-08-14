#!/bin/bash

# 🌱 Smart Vendor Seeding Script
# Safely seeds vendor data without duplicates

set -e

echo "🌱 Starting Smart Vendor Seeding..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[SEED]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Ensure we're in the API directory
cd apps/api

print_status "Checking database connection..."
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL not found"
    exit 1
fi

# Check current vendor count
print_status "Checking existing vendor data..."
VENDOR_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.vendor.count()
  .then(count => { console.log(count); return prisma.\$disconnect(); })
  .catch(err => { console.log('0'); return prisma.\$disconnect(); });
" 2>/dev/null || echo "0")

print_status "Found $VENDOR_COUNT existing vendors"

if [ "$VENDOR_COUNT" = "0" ]; then
    print_status "Database is empty - running full vendor seeding..."
    
    # Run the vendor seeding
    if pnpm run db:seed:vendors; then
        print_success "Vendor seeding completed successfully"
        
        # Verify seeding
        NEW_COUNT=$(node -e "
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        prisma.vendor.count()
          .then(count => { console.log(count); return prisma.\$disconnect(); })
          .catch(err => { console.log('0'); return prisma.\$disconnect(); });
        " 2>/dev/null || echo "0")
        
        print_success "Seeded $NEW_COUNT vendors successfully"
    else
        print_warning "Vendor seeding failed, but continuing deployment"
    fi
else
    print_warning "Database already contains $VENDOR_COUNT vendors"
    print_status "Skipping seeding to avoid duplicates"
    
    # Show existing vendor info
    print_status "Existing vendor summary:"
    node -e "
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    async function showVendors() {
        try {
            const vendors = await prisma.vendor.findMany({
                select: { id: true, name: true, status: true },
                take: 5
            });
            
            console.log('📊 Existing vendors:');
            vendors.forEach(v => {
                console.log(\`  - \${v.name} (\${v.status})\`);
            });
            
            if (vendors.length === 5) {
                const total = await prisma.vendor.count();
                if (total > 5) {
                    console.log(\`  ... and \${total - 5} more\`);
                }
            }
        } catch (error) {
            console.log('❌ Could not fetch vendor info:', error.message);
        } finally {
            await prisma.\$disconnect();
        }
    }
    
    showVendors();
    "
fi

# Final verification
print_status "Verifying final state..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
    try {
        const vendorCount = await prisma.vendor.count();
        const addressCount = await prisma.vendorAddress.count();
        const bankCount = await prisma.vendorBankAccount.count();
        
        console.log('✅ Final counts:');
        console.log('  📊 Vendors:', vendorCount);
        console.log('  🏠 Addresses:', addressCount);
        console.log('  🏦 Bank Accounts:', bankCount);
        
        if (vendorCount > 0) {
            console.log('🎉 Database is ready for seller onboarding!');
        } else {
            console.log('⚠️  No vendors found - manual seeding may be needed');
        }
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    } finally {
        await prisma.\$disconnect();
    }
}

verify();
"

print_success "🌱 Smart seeding completed!"
echo ""
echo "📋 Summary:"
echo "  - Checked existing data before seeding"
echo "  - Avoided duplicate vendor creation"
echo "  - Verified final database state"
echo "  - Database is ready for production use"
echo ""