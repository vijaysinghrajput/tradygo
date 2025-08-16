#!/bin/bash

# Deploy Categories Feature to Production
# This script deploys the multi-level category system with commission management

echo "🚀 Deploying Categories Feature to Production..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}Railway CLI is not installed. Please install it first:${NC}"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Railway project configuration
export RAILWAY_TOKEN="b041c494-cddf-4382-a719-c1ddf7da8c7a"

echo -e "${YELLOW}Step 1: Running database migration...${NC}"
# Run the migration on the production database
railway run --service tradygo-api npx prisma migrate deploy

echo -e "${YELLOW}Step 2: Generating Prisma client...${NC}"
railway run --service tradygo-api npx prisma generate

echo -e "${YELLOW}Step 3: Deploying API changes...${NC}"
git add -A
git commit -m "feat: Add multi-level categories with commission management"
git push origin main

echo -e "${YELLOW}Step 4: Waiting for Railway to deploy...${NC}"
echo "Railway will automatically deploy from the GitHub push."
echo "Monitor deployment at: https://railway.app/project/eb52c2a2-412b-41fb-b068-c3e0f00640f7"

echo -e "${GREEN}✅ Categories feature deployment initiated!${NC}"
echo ""
echo "Next steps:"
echo "1. Monitor the deployment in Railway dashboard"
echo "2. Run the SQL migration manually if needed: apps/api/prisma/migrations/add_categories.sql"
echo "3. Test the categories API endpoints"
echo "4. Access the admin panel to manage categories"

# Create a deployment log
echo "Deployment initiated at: $(date)" >> deployment.log
echo "Feature: Multi-level categories with commission management" >> deployment.log