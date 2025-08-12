# Hybrid Deployment Guide: Railway + Vercel

This guide explains how to deploy the Tradygo platform using a hybrid approach:
- **Railway**: API + PostgreSQL Database
- **Vercel**: Frontend applications (Admin, Seller, Web)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│     VERCEL      │    │     RAILWAY     │
│                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Admin App   │ │────┤ │     API     │ │
│ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Seller App  │ │────┤ │ PostgreSQL  │ │
│ └─────────────┘ │    │ │  Database   │ │
│ ┌─────────────┐ │    │ └─────────────┘ │
│ │  Web App    │ │    │                 │
│ └─────────────┘ │    │                 │
└─────────────────┘    └─────────────────┘
```

## 🚀 Railway Deployment (API + Database)

### Step 1: Deploy API to Railway

1. **Connect Repository to Railway**
   - Go to [Railway Dashboard](https://railway.app/project/eb52c2a2-412b-41fb-b068-c3e0f00640f7)
   - Connect your GitHub repository
   - Select the `main` branch

2. **Configure Railway Service**
   - **Root Directory**: `/` (monorepo root)
   - **Build Command**: `pnpm build --filter=@tradygo/api`
   - **Start Command**: `cd apps/api && pnpm start`
   - **Port**: `3001`

3. **Add PostgreSQL Database**
   - In Railway dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically provide `DATABASE_URL`

4. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_ACCESS_SECRET=your-super-secret-jwt-access-key
   JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key
   CORS_ORIGINS=https://admin.yourdomain.com,https://seller.yourdomain.com,https://yourdomain.com
   ```

5. **Deploy**
   - Railway will automatically deploy when you push to `main`
   - Note your Railway API URL: `https://your-project.railway.app`

### Step 2: Database Migration

```bash
# Run migrations on Railway
railway run --service=api pnpm db:migrate

# Seed database (optional)
railway run --service=api pnpm db:seed
```

## 🌐 Vercel Deployment (Frontend Apps)

### Step 1: Deploy Admin App

1. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Admin Deployment**
   - **Project Name**: `tradygo-admin`
   - **Framework**: Next.js
   - **Root Directory**: `apps/admin`
   - **Build Command**: `cd ../.. && pnpm build --filter=@tradygo/admin`
   - **Install Command**: `cd ../.. && pnpm install`

3. **Environment Variables**
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-railway-api-domain.railway.app
   ```

4. **Deploy**
   - Vercel will build and deploy automatically
   - Note your admin URL: `https://tradygo-admin.vercel.app`

### Step 2: Deploy Seller App

1. **Create New Vercel Project**
   - Import the same GitHub repository
   - **Project Name**: `tradygo-seller`
   - **Root Directory**: `apps/seller`

2. **Configure Seller Deployment**
   - **Build Command**: `cd ../.. && pnpm build --filter=@tradygo/seller`
   - **Install Command**: `cd ../.. && pnpm install`

3. **Environment Variables**
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-railway-api-domain.railway.app
   ```

### Step 3: Deploy Web App

1. **Create New Vercel Project**
   - Import the same GitHub repository
   - **Project Name**: `tradygo-web`
   - **Root Directory**: `apps/web`

2. **Configure Web Deployment**
   - **Build Command**: `cd ../.. && pnpm build --filter=@tradygo/web`
   - **Install Command**: `cd ../.. && pnpm install`

3. **Environment Variables**
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-railway-api-domain.railway.app
   ```

## 🔧 Configuration Updates

### Update API CORS Settings

Update your Railway API environment variables to include Vercel domains:

```env
CORS_ORIGINS=https://tradygo-admin.vercel.app,https://tradygo-seller.vercel.app,https://tradygo-web.vercel.app
```

### Custom Domains (Optional)

If you have custom domains:

1. **Add Custom Domains in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domains

2. **Update CORS Origins**
   ```env
   CORS_ORIGINS=https://admin.yourdomain.com,https://seller.yourdomain.com,https://yourdomain.com
   ```

## 📊 Deployment Summary

| Service | Platform | URL | Purpose |
|---------|----------|-----|----------|
| API | Railway | `https://your-project.railway.app` | Backend API |
| Database | Railway | Internal | PostgreSQL |
| Admin | Vercel | `https://tradygo-admin.vercel.app` | Admin Panel |
| Seller | Vercel | `https://tradygo-seller.vercel.app` | Seller Portal |
| Web | Vercel | `https://tradygo-web.vercel.app` | Customer Site |

## 🔍 Health Checks

### API Health Check
```bash
curl https://your-railway-api-domain.railway.app/health/healthz
```

### Frontend Health Checks
- Admin: `https://tradygo-admin.vercel.app`
- Seller: `https://tradygo-seller.vercel.app`
- Web: `https://tradygo-web.vercel.app`

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure Railway API CORS_ORIGINS includes all Vercel domains
   - Check environment variables in Railway dashboard

2. **API Connection Issues**
   - Verify NEXT_PUBLIC_API_URL in Vercel environment variables
   - Ensure Railway API is deployed and running

3. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure monorepo build commands are correct

### Monitoring

- **Railway**: Monitor API logs and metrics in Railway dashboard
- **Vercel**: Monitor frontend deployments and analytics in Vercel dashboard

## 💰 Cost Benefits

### Railway (API + Database)
- **Pros**: Persistent database, better for backend services
- **Cost**: ~$5-20/month depending on usage

### Vercel (Frontend)
- **Pros**: Excellent Next.js optimization, global CDN, free tier
- **Cost**: Free for personal projects, ~$20/month for teams

**Total Estimated Cost**: $5-40/month (much lower than full Railway deployment)

## 🔄 CI/CD Pipeline

The deployment will automatically trigger when you push to `main`:

1. **Railway**: Deploys API changes
2. **Vercel**: Deploys frontend changes for each app

This hybrid approach provides the best of both platforms while optimizing costs and performance! 🎉