# Tradygo Railway Deployment Guide

This guide will help you deploy the Tradygo multi-vendor e-commerce platform on Railway.

## Railway Project Information

- **Project ID**: `eb52c2a2-412b-41fb-b068-c3e0f00640f7`
- **Project URL**: https://railway.app/project/eb52c2a2-412b-41fb-b068-c3e0f00640f7

## Prerequisites

- Railway account (https://railway.app)
- GitHub repository with your Tradygo code
- Basic understanding of environment variables
- Access to the Railway project above

## Architecture Overview

The Tradygo platform consists of:
- **API**: NestJS backend with Prisma ORM
- **Admin**: Next.js admin dashboard
- **Seller**: Next.js seller portal
- **Web**: Next.js customer storefront
- **Database**: PostgreSQL

## Railway Deployment Steps

### 1. Access Your Railway Project

1. Go to [Railway](https://railway.app) and sign in
2. Navigate to your project: https://railway.app/project/eb52c2a2-412b-41fb-b068-c3e0f00640f7
3. Or create a new project if needed:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your Tradygo repository

### 2. Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance
4. Note the connection details from the "Connect" tab

### 3. Deploy the API Service

1. Click "+ New" → "GitHub Repo"
2. Select your repository again
3. Set the following:
   - **Service Name**: `tradygo-api`
   - **Root Directory**: `/apps/api`
   - **Build Command**: `pnpm build`
   - **Start Command**: `pnpm start`

#### API Environment Variables

Add these environment variables to your API service:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key
PORT=${{PORT}}
```

### 4. Deploy Frontend Services

Repeat the deployment process for each frontend service:

#### Admin Dashboard
- **Service Name**: `tradygo-admin`
- **Root Directory**: `/apps/admin`
- **Environment Variables**:
  ```env
  NODE_ENV=production
  NEXT_PUBLIC_API_URL=${{tradygo-api.RAILWAY_PUBLIC_DOMAIN}}
  PORT=${{PORT}}
  ```

#### Seller Portal
- **Service Name**: `tradygo-seller`
- **Root Directory**: `/apps/seller`
- **Environment Variables**:
  ```env
  NODE_ENV=production
  NEXT_PUBLIC_API_URL=${{tradygo-api.RAILWAY_PUBLIC_DOMAIN}}
  PORT=${{PORT}}
  ```

#### Customer Web Store
- **Service Name**: `tradygo-web`
- **Root Directory**: `/apps/web`
- **Environment Variables**:
  ```env
  NODE_ENV=production
  NEXT_PUBLIC_API_URL=${{tradygo-api.RAILWAY_PUBLIC_DOMAIN}}
  PORT=${{PORT}}
  ```

### 5. Configure Custom Domains (Optional)

1. Go to each service's "Settings" tab
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Environment Variables Reference

### Required for API
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_ACCESS_SECRET`: Secret for JWT access tokens
- `JWT_REFRESH_SECRET`: Secret for JWT refresh tokens
- `NODE_ENV`: Set to `production`

### Required for Frontend Apps
- `NEXT_PUBLIC_API_URL`: URL of your deployed API service
- `NODE_ENV`: Set to `production`

### Optional
- `CORS_ORIGINS`: Comma-separated list of allowed origins
- `UPLOAD_MAX_SIZE`: Maximum file upload size
- `REDIS_URL`: Redis connection string (for caching)

## Database Migration

After deploying the API service:

1. Go to your API service in Railway
2. Open the "Deployments" tab
3. Click on the latest deployment
4. Open the "Deploy Logs" to verify Prisma migrations ran successfully

If migrations didn't run automatically, you can trigger them manually:

1. Go to your API service settings
2. Add a "Deploy Hook" or use Railway CLI:
   ```bash
   railway run npx prisma migrate deploy
   ```

## Monitoring and Logs

- **Logs**: View real-time logs in each service's "Deployments" tab
- **Metrics**: Monitor CPU, memory, and network usage in the "Metrics" tab
- **Health Checks**: Railway automatically monitors your services

## Scaling

- Railway automatically scales based on traffic
- For high-traffic applications, consider upgrading to Railway Pro
- Monitor resource usage and adjust as needed

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs for specific errors
   - Ensure all dependencies are listed in package.json
   - Verify build commands are correct

2. **Database Connection Issues**
   - Verify DATABASE_URL is correctly set
   - Check if Prisma migrations completed
   - Ensure PostgreSQL service is running

3. **CORS Errors**
   - Add frontend domains to CORS_ORIGINS
   - Verify API URLs in frontend environment variables

4. **Environment Variable Issues**
   - Double-check all required variables are set
   - Ensure Railway variable references are correct (e.g., `${{Postgres.DATABASE_URL}}`)

### Getting Help

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Create an issue in your repository

## Security Considerations

1. **Environment Variables**: Never commit secrets to your repository
2. **JWT Secrets**: Use strong, unique secrets for production
3. **Database**: Railway PostgreSQL is automatically secured
4. **HTTPS**: Railway provides HTTPS by default
5. **CORS**: Configure appropriate CORS origins

## Cost Optimization

- Railway offers a generous free tier
- Monitor usage in the Railway dashboard
- Consider combining services if traffic is low
- Use Railway's sleep feature for development environments

## Backup Strategy

1. **Database Backups**: Railway automatically backs up PostgreSQL
2. **Code Backups**: Your code is backed up in GitHub
3. **Environment Variables**: Document all variables securely

---

**Need Help?** 
If you encounter any issues during deployment, please check the troubleshooting section above or reach out for support.