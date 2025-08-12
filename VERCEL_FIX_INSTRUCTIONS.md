# 🚨 URGENT: Fix Vercel Environment Variables

## Problem
Your admin app is getting HTTP 405 errors because it's trying to call `/api/auth/login` on its own domain instead of the Railway API.

## Root Cause
Missing `NEXT_PUBLIC_API_URL` environment variable in Vercel deployments.

## IMMEDIATE FIX REQUIRED

### Step 1: Admin App Fix
1. Go to **Vercel Dashboard** → **Admin Project** → **Settings** → **Environment Variables**
2. Add these variables:

```env
NEXT_PUBLIC_API_URL=https://api.tradygo.in/api/v1
NEXT_PUBLIC_API_BASE=https://api.tradygo.in
NODE_ENV=production
```

3. **Redeploy** the admin app

### Step 2: Seller App Fix
1. Go to **Vercel Dashboard** → **Seller Project** → **Settings** → **Environment Variables**
2. Add these variables:

```env
NEXT_PUBLIC_API_URL=https://api.tradygo.in/api/v1
NODE_ENV=production
```

3. **Redeploy** the seller app

### Step 3: Web App Fix
1. Go to **Vercel Dashboard** → **Web Project** → **Settings** → **Environment Variables**
2. Add these variables:

```env
NEXT_PUBLIC_API_URL=https://api.tradygo.in/api/v1
NODE_ENV=production
```

3. **Redeploy** the web app

## Expected Results

### Before Fix
```
Request URL: https://admin.tradygo.in/api/auth/login
Status: HTTP 405 Error
```

### After Fix
```
Request URL: https://api.tradygo.in/api/v1/auth/login
Status: 200 OK
```

## Test After Fix

1. **Admin Login**: https://admin.tradygo.in/
   - Email: `admin@tradygo.in`
   - Password: `Admin@12345!`

2. **Seller Login**: https://seller.tradygo.in/
   - Email: `seller@tradygo.in`
   - Password: `Seller@12345!`

3. **Web App**: https://tradygo.in/
   - Should load without 502 errors

## Critical Notes

- **MOST IMPORTANT**: `NEXT_PUBLIC_API_URL=https://api.tradygo.in/api/v1`
- Apply to **ALL THREE** Vercel projects
- **Redeploy** each app after adding variables
- Test login functionality after each deployment

## Your Platform Status

✅ **Railway API**: Working perfectly  
✅ **Database**: Connected  
✅ **Authentication**: Configured  
❌ **Frontend Apps**: Need environment variables  

**Fix the environment variables and your entire platform will be functional!**