# Vendor Seeding Documentation

This document explains how to use the vendor seeding system to populate your database with demo vendor data.

## Overview

The vendor seeding system creates deterministic, re-runnable seed data for all vendor-related tables in the TradyGo platform. It includes 5 demo vendors with complete data across all vendor management features.

## Quick Start

### Prerequisites

1. Ensure your database is running and accessible
2. Run database migrations first

### For Docker Setup

#### Method 1: Automated Script (Recommended)

1. **Copy environment file:**
   ```bash
   cp .env.docker .env
   ```

2. **Run the seeding script:**
   ```bash
   ./scripts/seed-vendors-docker.sh
   ```

#### Method 2: Using Docker Compose Profiles

1. **Setup environment:**
   ```bash
   cp .env.docker .env
   ```

2. **Start database services:**
   ```bash
   docker-compose up -d postgres redis
   ```

3. **Run seeding with profile:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.override.yml --profile seed up seeder
   ```

#### Method 3: Manual Docker Commands

1. **Start the services:**
   ```bash
   docker-compose up -d postgres redis
   ```

2. **Run migrations and seeding:**
   ```bash
   # If API container is running
   docker-compose exec api pnpm run db:migrate
   docker-compose exec api pnpm run db:seed:vendors
   
   # If API container is not running
   docker run --rm --network tradygo_tradygo-internal \
     -e DATABASE_URL="postgresql://tradygo:${POSTGRES_PASSWORD}@postgres:5432/tradygo_core" \
     -v $(pwd)/apps/api:/app -w /app \
     node:20-alpine sh -c "npm install -g pnpm && pnpm install && pnpm run db:generate && pnpm run db:migrate && pnpm run db:seed:vendors"
   ```

### For Local Development

1. **Run migrations:**
   ```bash
   cd apps/api
   pnpm run db:migrate
   ```

2. **Run vendor seeding:**
   ```bash
   cd apps/api
   pnpm run db:seed:vendors
   ```

## What Gets Seeded

The seeding process creates data for the following tables:

### Core Vendor Data
- **5 Vendors** with fixed UUIDs and realistic business information
- **10 Addresses** (registered and warehouse addresses for each vendor)
- **5 Bank Accounts** with mixed verification statuses
- **13 KYC Documents** with mixed approval statuses
- **5 Vendor Settings** with different configurations

### Financial Data
- **1 Global Commission Rule** (10% default)
- **3 Vendor-specific Commission Rules** with overrides
- **6 Vendor Statements** covering June and July 2025
- **4 Payouts** with mixed statuses (2 completed, 1 initiated, 1 failed)

### Operational Data
- **8 Vendor Issues** covering different categories and statuses
- **6 Vendor Users** (if users table exists)
- **16 Products** distributed across vendors
- **8 Orders** for active vendors

## Demo Vendors

The system creates these 5 vendors with fixed UUIDs:

| Code | Name | Status | Description |
|------|------|--------|--------------|
| VEND-00001 | Acme Retail | ACTIVE | Electronics retailer with complete setup |
| VEND-00002 | Bharat Electronics | ACTIVE | Electronics corporation with verified accounts |
| VEND-00003 | GreenLeaf Organics | PENDING | Organic food vendor awaiting approval |
| VEND-00004 | TrendyKart | ACTIVE | Fashion retailer with category-specific commission |
| VEND-00005 | TechBazaar | SUSPENDED | Tech vendor with rejected KYC documents |

## Idempotency

The seeding system is designed to be **idempotent** - you can run it multiple times safely:

- **Existing records** are updated with new data
- **Missing records** are created
- **No duplicate records** are created
- **Fixed UUIDs** ensure consistency across runs

## Customizing Seed Data

### Modifying Vendor Data

Edit the data in `src/seeds/data/vendors.data.ts`:

```typescript
// Fixed UUIDs for deterministic seeding
export const VENDOR_IDS = {
  V1: '3f1a2b3c-4d5e-46f7-89a0-12b34c56d701',
  // ... add more vendors
};

export const vendorSeedData = {
  vendors: [
    {
      id: VENDOR_IDS.V1,
      name: 'Your Vendor Name',
      // ... other fields
    },
  ],
  // ... other data arrays
};
```

### Adding New Data Types

1. Add data to `vendors.data.ts`
2. Create upsert function in `utils/upsert.ts`
3. Call the function in `seed-vendors.ts`

## Verification

After seeding, the system performs acceptance checks:

- ✅ **5 vendors** created
- ✅ **≥10 addresses** total
- ✅ **≥5 bank accounts**
- ✅ **≥10 KYC docs** with mixed statuses
- ✅ **≥4 commission rules** (global + vendor overrides)
- ✅ **≥8 statements** total
- ✅ **≥4 payouts** (≥2 completed)
- ✅ **≥6 issues**
- ✅ **5 settings** rows (one per vendor)

## Troubleshooting

### Docker Environment Issues

```bash
# Check if containers are running
docker-compose ps

# Check PostgreSQL container logs
docker-compose logs postgres

# Check if database is accessible
docker-compose exec postgres pg_isready -U tradygo -d tradygo_core

# Connect to database directly
docker-compose exec postgres psql -U tradygo -d tradygo_core

# Check environment variables
docker-compose exec api env | grep DATABASE_URL
```

### Database Connection Issues

```bash
# For Docker setup
docker-compose exec postgres psql -U tradygo -d tradygo_core -c "SELECT version();"

# For local setup
echo $DATABASE_URL
sudo service postgresql status
```

### Migration Issues

```bash
# Docker reset and re-run
docker-compose down -v
docker-compose up -d postgres
./scripts/seed-vendors-docker.sh

# Local reset and re-run
pnpm run db:reset
pnpm run db:migrate
pnpm run db:seed:vendors
```

### Network Issues (Docker)

```bash
# Check Docker networks
docker network ls

# Inspect the tradygo network
docker network inspect tradygo_tradygo-internal

# Recreate network if needed
docker-compose down
docker-compose up -d
```

### TypeScript Compilation Issues

```bash
# Docker: Generate Prisma client
docker-compose exec api pnpm run db:generate

# Local: Generate Prisma client
pnpm run db:generate
pnpm run db:seed:vendors
```

### Partial Seeding

If seeding fails partway through:

1. Check the console output for specific errors
2. Fix any data issues in `vendors.data.ts`
3. Re-run the seed (it will update existing records)
4. For Docker: Check container logs with `docker-compose logs api`

## File Structure

```
src/seeds/
├── seed-vendors.ts          # Main seeding script
├── data/
│   └── vendors.data.ts      # All seed data definitions
└── utils/
    └── upsert.ts           # Upsert utility functions
```

## Environment Variables

The seeding system uses the same database configuration as your main application:

- `DATABASE_URL` - PostgreSQL connection string
- SSL settings are honored in production

## Production Considerations

### Safety Features

- **No table drops** - Only inserts and updates
- **Parameterized queries** - No SQL injection risk
- **Transaction safety** - Each table group is wrapped in try/catch
- **Logging** - Comprehensive before/after counts

### Performance

- **Batch operations** where possible
- **Efficient upserts** using Prisma's native methods
- **Minimal database round trips**

## Integration with CI/CD

```yaml
# Example GitHub Actions step
- name: Seed demo data
  run: |
    cd apps/api
    pnpm run db:migrate
    pnpm run db:seed:vendors
```

## Verification

### Docker Verification

```bash
# Check seeded vendors
docker-compose exec postgres psql -U tradygo -d tradygo_core -c "
  SELECT name, status, email FROM vendors ORDER BY name;
"

# Check vendor counts
docker-compose exec postgres psql -U tradygo -d tradygo_core -c "
  SELECT 
    (SELECT COUNT(*) FROM vendors) as vendors,
    (SELECT COUNT(*) FROM vendor_addresses) as addresses,
    (SELECT COUNT(*) FROM vendor_bank_accounts) as bank_accounts,
    (SELECT COUNT(*) FROM vendor_kyc) as kyc_docs,
    (SELECT COUNT(*) FROM products WHERE vendor_id IS NOT NULL) as products;
"

# Check payout status
docker-compose exec postgres psql -U tradygo -d tradygo_core -c "
  SELECT status, COUNT(*) FROM payouts GROUP BY status;
"
```

### Local Verification

```bash
# Connect to local database
psql $DATABASE_URL -c "SELECT name, status FROM vendors;"

# Or using the API database directly
psql postgresql://tradygo:tradygo@localhost:5432/tradygo -c "
  SELECT COUNT(*) as total_vendors FROM vendors;
"
```

## Related Commands

### Docker Commands

```bash
# Start services
docker-compose up -d postgres redis

# Run seeding script
./scripts/seed-vendors-docker.sh

# Generate Prisma client
docker-compose exec api pnpm run db:generate

# Run migrations
docker-compose exec api pnpm run db:migrate

# Open database shell
docker-compose exec postgres psql -U tradygo -d tradygo_core

# Reset database (destructive)
docker-compose down -v
docker-compose up -d postgres

# View logs
docker-compose logs api
docker-compose logs postgres
```

### Local Commands

```bash
# Generate Prisma client
pnpm run db:generate

# Run migrations
pnpm run db:migrate

# Open Prisma Studio
pnpm run db:studio

# Reset database (destructive)
pnpm run db:reset

# Seed vendors
pnpm run db:seed:vendors
```

## Support

For issues with the seeding system:

1. Check the console output for detailed error messages
2. Verify your database connection and migrations
3. Ensure all required environment variables are set
4. Review the acceptance checks output for missing data

The seeding system provides comprehensive logging to help diagnose any issues.