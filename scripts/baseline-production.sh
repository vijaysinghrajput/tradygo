#!/bin/bash

# 🔧 Prisma Production Database Baseline Script
# Handles existing production databases with P3005 error

set -e

echo "🔧 Starting Prisma Production Database Baseline..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[BASELINE]${NC} $1"; }
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

print_success "Database URL configured"

# Step 1: Create baseline migration directory
print_status "Creating baseline migration..."

# Remove existing migrations if any
if [ -d "prisma/migrations" ]; then
    print_warning "Backing up existing migrations..."
    mv prisma/migrations prisma/migrations.backup.$(date +%Y%m%d-%H%M%S)
fi

# Create new migrations directory with baseline
mkdir -p prisma/migrations/0_baseline

print_success "Baseline migration directory created"

# Step 2: Generate baseline migration SQL
print_status "Generating baseline migration SQL..."

# Generate the migration diff from empty to current schema
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_baseline/migration.sql

print_success "Baseline migration SQL generated"

# Step 3: Mark baseline as applied (don't actually run it)
print_status "Marking baseline migration as applied..."

npx prisma migrate resolve --applied 0_baseline

print_success "Baseline migration marked as applied"

# Step 4: Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate
print_success "Prisma client generated"

# Step 5: Run any new migrations (if any)
print_status "Checking for new migrations..."
npx prisma migrate deploy
print_success "Migration deployment completed"

# Step 6: Verify database connection
print_status "Verifying database setup..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
    try {
        await prisma.\$connect();
        const vendorCount = await prisma.vendor.count();
        console.log('✅ Database connected successfully');
        console.log('✅ Vendor count:', vendorCount);
        
        if (vendorCount === 0) {
            console.log('📝 Database is empty, seeding recommended');
        } else {
            console.log('📊 Database contains existing data');
        }
        
        console.log('🎉 Baseline migration completed successfully!');
    } catch (error) {
        console.error('❌ Database verification failed:', error.message);
        process.exit(1);
    } finally {
        await prisma.\$disconnect();
    }
}

verify();
"

print_success "🎉 Production database baseline completed!"
print_status "Database is now ready for normal operations"

echo ""
echo "📋 What happened:"
echo "1. ✅ Created baseline migration (0_baseline)"
echo "2. ✅ Marked existing schema as already applied"
echo "3. ✅ Generated Prisma client"
echo "4. ✅ Deployed any new migrations"
echo "5. ✅ Verified database connectivity"
echo ""
echo "🚀 Your production database is now properly baselined!"
echo "   Future migrations will work correctly."
echo ""