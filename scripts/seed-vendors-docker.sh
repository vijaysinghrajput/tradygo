#!/bin/bash

# Vendor Seeding Script for Docker Environment
# This script seeds the database with demo vendor data using Docker

set -e

echo "🐳 TradyGo Vendor Seeding (Docker)"
echo "==================================="

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed or not in PATH"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create one with POSTGRES_PASSWORD set."
    exit 1
fi

# Load environment variables
source .env

if [ -z "$POSTGRES_PASSWORD" ]; then
    echo "❌ POSTGRES_PASSWORD not set in .env file"
    exit 1
fi

echo "📋 Environment check passed"

# Start PostgreSQL if not running
echo "🚀 Starting PostgreSQL service..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U tradygo -d tradygo_core; do
    echo "   Waiting for database..."
    sleep 2
done

echo "✅ PostgreSQL is ready"

# Check if API container is running
if docker-compose ps api | grep -q "Up"; then
    echo "📦 Using running API container for seeding"
    
    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    docker-compose exec api pnpm run db:generate
    
    # Run migrations
    echo "🗃️  Running database migrations..."
    docker-compose exec api pnpm run db:migrate
    
    # Run vendor seeding
    echo "🌱 Running vendor seeding..."
    docker-compose exec api pnpm run db:seed:vendors
    
else
    echo "📦 API container not running, using temporary container"
    
    # Get the network name
    NETWORK_NAME=$(docker-compose config | grep -A 10 "networks:" | grep -v "networks:" | head -1 | sed 's/^[[:space:]]*//' | sed 's/:.*$//')
    if [ -z "$NETWORK_NAME" ]; then
        NETWORK_NAME="tradygo_tradygo-internal"
    fi
    
    echo "🔗 Using network: $NETWORK_NAME"
    
    # Create temporary container for seeding
    echo "🔧 Installing dependencies and generating Prisma client..."
    docker run --rm \
        --network "${NETWORK_NAME}" \
        -e DATABASE_URL="postgresql://tradygo:${POSTGRES_PASSWORD}@postgres:5432/tradygo_core" \
        -v "$(pwd)/apps/api:/app" \
        -w /app \
        node:20-alpine sh -c "
            echo 'Installing dependencies...' && 
            npm install -g pnpm && 
            pnpm install && 
            echo 'Generating Prisma client...' && 
            pnpm run db:generate && 
            echo 'Running migrations...' && 
            pnpm run db:migrate && 
            echo 'Running vendor seeding...' && 
            pnpm run db:seed:vendors
        "
fi

echo ""
echo "🎉 Vendor seeding completed successfully!"
echo ""
echo "📊 You can now:"
echo "   • View the admin panel: http://localhost:3002/admin/vendors"
echo "   • Check the database: docker-compose exec postgres psql -U tradygo -d tradygo_core"
echo "   • View logs: docker-compose logs api"
echo ""
echo "🔍 To verify the seeding:"
echo "   docker-compose exec postgres psql -U tradygo -d tradygo_core -c 'SELECT name, status FROM vendors;'"
echo ""