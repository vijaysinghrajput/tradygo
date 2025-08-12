#!/bin/bash
# Simplified TradyGo Production Deployment Script
# This script runs the full deployment process

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting TradyGo Production Deployment...${NC}"
echo

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -f "pnpm-workspace.yaml" ]]; then
    echo -e "${RED}❌ Error: Please run this script from the TradyGo monorepo root directory${NC}"
    exit 1
fi

# Check if the main deployment script exists
if [[ ! -f "scripts/deploy-prod.sh" ]]; then
    echo -e "${RED}❌ Error: Main deployment script not found at scripts/deploy-prod.sh${NC}"
    exit 1
fi

# Check if required tools are available
if ! command -v docker >/dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
    echo -e "${RED}❌ Error: pnpm is not installed. Please install pnpm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"
echo

# Run the main deployment script
echo -e "${GREEN}🔄 Executing deployment script...${NC}"
echo

exec ./scripts/deploy-prod.sh