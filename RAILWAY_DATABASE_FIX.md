# 🚨 URGENT: Railway Database Configuration Fix

## Problem
- PrismaClientInitializationError: Can't reach database server at hopper.proxy.rlwy.net:50471
- 97-connection flood causing P1001 errors
- API using Railway proxy without SSL and limits
- SHADOW_DATABASE_URL pointing to proxy

## Solution: Exact Railway Environment Variables

### 1. Railway API Service → Variables (Replace Exactly)

```env
# Node LTS for Prisma
NIXPACKS_NODE_VERSION=20

# Prisma goes through pooled proxy with SSL + tiny pool
DATABASE_URL=postgresql://postgres:HfDAIBrIsYepQfrLNxbwDYkrxOJTLJmt@hopper.proxy.rlwy.net:50471/railway?sslmode=require&pgbouncer=true&connection_limit=3

# Direct primary for migrations/introspection (5432)
DIRECT_URL=postgresql://postgres:HfDAIBrIsYepQfrLNxbwDYkrxOJTLJmt@${RAILWAY_PRIVATE_DOMAIN}:5432/railway?sslmode=require

# JWT Security (keep existing)
JWT_SECRET=tradygo-super-secret-jwt-key-production-2024-change-this-make-it-very-long-and-random-555666777888999
JWT_REFRESH_SECRET=tradygo-super-secret-jwt-refresh-key-production-2024-change-this-make-it-very-long-and-random-987654321fedcba
JWT_ACCESS_SECRET=tradygo-super-secret-jwt-access-key-production-2024-change-this-make-it-very-long-and-random-123456789abcdef

# Production Environment
NODE_ENV=production
PORT=${{PORT}}

# CORS Configuration
CORS_ORIGINS=https://admin.tradygo.in,https://seller.tradygo.in,https://tradygo.in

# Prisma tunables
PRISMA_POOL_TIMEOUT=30
PRISMA_CLIENT_ENGINE_TYPE=library

# IMPORTANT: Remove SHADOW_DATABASE_URL completely
# Do NOT set SHADOW_DATABASE_URL in production
```

### 2. Railway Start Command

```bash
pnpm prisma migrate deploy && pnpm start
```

### 3. Key Changes Made

#### ✅ Database Configuration
- **DATABASE_URL**: Uses pooled proxy with SSL + connection limit of 3
- **DIRECT_URL**: Uses internal Railway domain for migrations
- **Removed**: SHADOW_DATABASE_URL (not needed in production)

#### ✅ Connection Optimizations
- `sslmode=require`: Enforces SSL connection
- `pgbouncer=true`: Enables connection pooling
- `connection_limit=3`: Prevents connection flooding
- `PRISMA_POOL_TIMEOUT=30`: Optimizes pool timeout

#### ✅ Node.js Configuration
- `NIXPACKS_NODE_VERSION=20`: Uses Node 20 LTS
- `PRISMA_CLIENT_ENGINE_TYPE=library`: Optimizes Prisma engine

### 4. Expected Results

#### ✅ After Deployment
- Database connection will use pooled proxy with SSL
- Connection limit of 3 prevents flooding
- Migrations use direct connection to avoid PgBouncer quirks
- API will start successfully without P1001 errors
- Health checks will pass

### 5. Verification Steps

1. **Update Railway Variables**: Copy exact values above
2. **Deploy**: Railway will automatically redeploy
3. **Check Logs**: Should see successful database connection
4. **Test Health**: https://api.tradygo.in/api/v1/health/healthz
5. **Verify Connection**: No more 97-connection messages

### 6. Technical Details

#### Database URL Breakdown
```
postgresql://postgres:HfDAIBrIsYepQfrLNxbwDYkrxOJTLJmt@hopper.proxy.rlwy.net:50471/railway?sslmode=require&pgbouncer=true&connection_limit=3

- postgres: Username
- HfDAIBrIsYepQfrLNxbwDYkrxOJTLJmt: Password
- hopper.proxy.rlwy.net:50471: Railway proxy with pooling
- railway: Database name
- sslmode=require: Force SSL
- pgbouncer=true: Enable connection pooling
- connection_limit=3: Limit concurrent connections
```

#### Direct URL Breakdown
```
postgresql://postgres:HfDAIBrIsYepQfrLNxbwDYkrxOJTLJmt@${RAILWAY_PRIVATE_DOMAIN}:5432/railway?sslmode=require

- Uses internal Railway domain
- Port 5432 (direct PostgreSQL)
- SSL required
- No connection pooling (for migrations)
```

### 7. Files Updated

- ✅ `apps/api/prisma/schema.prisma`: Added directUrl, removed shadowDatabaseUrl
- ✅ `package.json`: Added Node 20 engines, Railway-optimized scripts
- ✅ `apps/api/force-redeploy.txt`: Trigger for deployment

### 8. Immediate Action Required

**Go to Railway Dashboard → API Service → Variables and replace with the exact values above. This will immediately fix the database connection issues and stop the 97-connection flood.**

---

**This configuration will resolve all database connection issues and make your API production-ready!** 🚀