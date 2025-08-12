#!/bin/bash
# Quick deployment script for when SSH connection is restored

set -e

echo "🚀 Starting TradyGo deployment..."

# Test SSH connection
echo "Testing SSH connection..."
ssh root@195.35.21.175 "echo 'SSH connection successful'"

# Build containers
echo "Building Docker containers..."
ssh root@195.35.21.175 "cd /opt/tradygo/compose && docker compose build --no-cache"

# Start services
echo "Starting services..."
ssh root@195.35.21.175 "cd /opt/tradygo/compose && docker compose up -d"

# Check status
echo "Checking service status..."
ssh root@195.35.21.175 "cd /opt/tradygo/compose && docker compose ps"

echo "✅ Deployment completed!"
echo "Admin URL: https://admin.tradygo.in"
echo "API URL: https://api.tradygo.in"
echo "Note: HTTPS becomes active once DNS points to 195.35.21.175"



