# 🚀 Railway Production Configuration Guide

## Critical Environment Variables

### Required Variables
```env
# Database (already configured ✅)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Production Environment
NODE_ENV=production

# JWT Security (CRITICAL - Generate long random strings)
JWT_ACCESS_SECRET=your-super-long-random-jwt-access-secret-minimum-32-chars
JWT_REFRESH_SECRET=your-super-long-random-jwt-refresh-secret-minimum-32-chars
JWT_SECRET=your-super-long-random-jwt-secret-minimum-32-chars

# Node Version (Stability)
NIXPACKS_NODE_VERSION=20

# CORS Origins (Production Domains)
CORS_ORIGINS=https://admin.tradygo.in,https://seller.tradygo.in,https://tradygo.in

# Optional: Redis for Queues (if using Bull/BullMQ)
# REDIS_URL=redis://:password@host:port
```

### Optimized Database URL
For better connection stability, use:
```env
DATABASE_URL=postgresql://USER:PASS@HOST:PORT/DB?schema=public&pgbouncer=true&connection_limit=5&connect_timeout=30
```

## Build Configuration

### Build Command
```bash
pnpm i --frozen-lockfile && pnpm -w prisma generate && pnpm -w build
```

### Pre-Start Command (Migrations)
```bash
pnpm -w prisma migrate deploy
```

### Start Command
```bash
node apps/api/dist/main.js
```

## Health Check Settings

### Railway Health Check Configuration
- **Path**: `/api/v1/health/healthz`
- **Grace Period**: 45 seconds
- **Interval**: 10 seconds
- **Timeout**: 5 seconds

This prevents restart loops while Prisma/DB warms up.

## Production Smoke Tests

### API Health Checks
```bash
# Health endpoint
curl -s https://api.tradygo.in/api/v1/health/healthz

# Public config
curl -s https://api.tradygo.in/api/v1/config/public

# Admin ping (if available)
curl -s https://api.tradygo.in/api/v1/auth/admin/ping
```

### Expected Health Response
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "memory_rss": { "status": "up" },
    "storage": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "memory_rss": { "status": "up" },
    "storage": { "status": "up" }
  }
}
```

## Frontend URLs to Test

### Production Applications
- **Admin Panel**: https://admin.tradygo.in/
- **Seller Portal**: https://seller.tradygo.in/
- **Main Website**: https://tradygo.in/
- **API Documentation**: https://api.tradygo.in/api/docs

## Common Issues & Solutions

### 1. Restart Loops
- **Cause**: Migrations missing or DB connection issues
- **Solution**: Pre-Start command runs migrations automatically

### 2. Port Binding Issues
- **Cause**: Hard-coded port instead of Railway's dynamic PORT
- **Solution**: ✅ Already fixed - uses `process.env.PORT || 3001`

### 3. CORS Errors
- **Cause**: Frontend domains not allowed
- **Solution**: ✅ Already configured for production domains + Vercel previews

### 4. Connection Pool Exhaustion
- **Cause**: Too many DB connections (default 97 is aggressive)
- **Solution**: Use optimized DATABASE_URL with `connection_limit=5`

### 5. Node Version Drift
- **Cause**: Railway using different Node version
- **Solution**: Set `NIXPACKS_NODE_VERSION=20`

## Security Checklist

### ✅ Implemented
- HTTPS enforced
- CORS properly configured
- JWT secrets configured
- Database connection secured
- Environment variables protected

### ✅ Production Ready
- Health checks configured
- Automatic migrations on deploy
- Connection pooling optimized
- Error handling implemented
- Logging configured

## Deployment Verification

### 1. Check Railway Logs
Look for:
```
🚀 TradyGo API is running on: http://0.0.0.0:PORT
📚 API Documentation: http://0.0.0.0:PORT/api/docs
🌐 Environment: production
🔗 CORS Origins: https://admin.tradygo.in,https://seller.tradygo.in,https://tradygo.in
💾 Database: Connected
🔐 JWT Secret: Configured
```

### 2. Test All Endpoints
```bash
# Health check
curl https://api.tradygo.in/api/v1/health/healthz

# API documentation
open https://api.tradygo.in/api/docs

# Frontend applications
open https://admin.tradygo.in/
open https://seller.tradygo.in/
open https://tradygo.in/
```

### 3. Verify Authentication
- Test login with demo credentials
- Verify JWT token generation
- Check cookie handling
- Test protected routes

## Performance Optimization

### Database
- Connection pooling: 5 connections max
- Connection timeout: 30 seconds
- pgbouncer enabled

### API
- Compression enabled
- Security headers (Helmet)
- Request validation
- Global error handling

### Monitoring
- Health checks every 10 seconds
- Automatic restart on failure
- Database connection monitoring
- Memory usage tracking

Your Railway API is now production-ready with all optimizations applied! 🚀