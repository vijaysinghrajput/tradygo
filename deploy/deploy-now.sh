#!/bin/bash
# TradyGo Production Deployment Script
set -euo pipefail

# Configuration
SERVER_IP="195.35.21.175"
SERVER_USER="root"
ALIAS_NAME="tradygo"
REMOTE_DIR="/opt/tradygo"
LOCAL_REPO="/Users/mac/Documents/clients/tradygo"

echo "🚀 Starting TradyGo Production Deployment..."

# Test SSH connection
echo "📡 Testing SSH connection..."
if ! ssh -o ConnectTimeout=10 ${ALIAS_NAME} 'echo "SSH connection successful"' 2>/dev/null; then
    echo "❌ SSH connection failed. Please ensure:"
    echo "   1. Server is accessible at ${SERVER_IP}"
    echo "   2. SSH is running on port 22"
    echo "   3. SSH keys are properly configured"
    echo "   4. Run: ./scripts/setup-ssh.sh"
    exit 1
fi

# Install Docker and dependencies on server
echo "🐳 Installing Docker and dependencies..."
ssh ${ALIAS_NAME} 'bash -s' << 'EOF'
set -euo pipefail

# Update system
apt-get update -y
apt-get upgrade -y

# Install Docker
if ! command -v docker >/dev/null 2>&1; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Install Docker Compose
if ! docker compose version >/dev/null 2>&1; then
    apt-get install -y docker-compose-plugin
fi

# Configure firewall
if command -v ufw >/dev/null 2>&1; then
    ufw --force enable
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
fi

# Start Docker
systemctl enable docker
systemctl start docker

echo "✅ Server setup complete"
EOF

# Create remote directory
echo "📁 Creating remote directory..."
ssh ${ALIAS_NAME} "mkdir -p ${REMOTE_DIR}"

# Sync code to server (excluding unnecessary files)
echo "📦 Syncing code to server..."
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='.turbo' \
    --exclude='cookies.txt' \
    "${LOCAL_REPO}/" "${ALIAS_NAME}:${REMOTE_DIR}/repo/"

# Copy deployment files
echo "🔧 Copying deployment configuration..."
scp -r "${LOCAL_REPO}/deploy/" "${ALIAS_NAME}:${REMOTE_DIR}/"

# Build and deploy on server
echo "🏗️ Building and starting services..."
ssh ${ALIAS_NAME} "cd ${REMOTE_DIR}/deploy && docker compose build --no-cache"
ssh ${ALIAS_NAME} "cd ${REMOTE_DIR}/deploy && docker compose up -d"

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Health checks
echo "🔍 Running health checks..."
ssh ${ALIAS_NAME} 'bash -s' << 'EOF'
set -euo pipefail
cd /opt/tradygo/deploy

echo "📊 Container Status:"
docker compose ps

echo ""
echo "🔍 Service Health:"

# Check API health
if curl -fsS http://localhost:3001/health >/dev/null 2>&1; then
    echo "✅ API service is healthy"
else
    echo "⚠️ API health check failed (may not have /health endpoint)"
fi

# Check admin service
if curl -fsS http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Admin service is healthy"
else
    echo "⚠️ Admin service health check failed"
fi

# Check public config endpoint
echo ""
echo "📋 API Public Config:"
if curl -fsS http://localhost:3001/api/v1/public/config 2>/dev/null | head -c 200; then
    echo ""
    echo "✅ API public config endpoint working"
else
    echo "⚠️ API public config endpoint not accessible"
fi
EOF

echo ""
echo "🎉 DEPLOY COMPLETE"
echo ""
echo "📍 Access URLs:"
echo "   Admin: https://admin.tradygo.in"
echo "   API:   https://api.tradygo.in"
echo ""
echo "📝 Note: HTTPS becomes active once DNS points to ${SERVER_IP}"
echo "📝 Current server IP: ${SERVER_IP}"
echo ""
echo "🔧 To check logs: ssh ${ALIAS_NAME} 'cd ${REMOTE_DIR}/deploy && docker compose logs -f'"
echo "🔧 To restart: ssh ${ALIAS_NAME} 'cd ${REMOTE_DIR}/deploy && docker compose restart'"
echo "🔧 To stop: ssh ${ALIAS_NAME} 'cd ${REMOTE_DIR}/deploy && docker compose down'"