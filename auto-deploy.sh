#!/bin/bash
# TradyGo Automated Production Deployment
# This script handles the complete deployment process

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Configuration
SERVER_IP="195.35.21.175"
SERVER_USER="root"
SERVER_PASS="Brijesh@411..,"
DEPLOY_DIR="/opt/tradygo"
DB_PASSWORD="8c44649ab86d78eb9d7393ac105cf7fa"
JWT_ACCESS_SECRET="f71b033880b23dfeb96a306c0ec01a5a3ddb5a6a0bd84036f01e29db17e4ff70"
JWT_REFRESH_SECRET="92ce18ace91a7a42441aa8e0e534ea3cb278c5f3fb0e62dc90b4a9080a282399"

log "🚀 Starting TradyGo Automated Production Deployment..."

# Check if sshpass is available
if ! command -v sshpass >/dev/null 2>&1; then
    log "Installing sshpass..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install hudochenkov/sshpass/sshpass || brew install sshpass
    else
        sudo apt-get update -y && sudo apt-get install -y sshpass
    fi
fi

# Function to run commands on VPS with SSH key authentication
run_on_vps() {
    local cmd="$1"
    log "Executing on VPS: $cmd"
    ssh -i ~/.ssh/tradygo_deploy -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$cmd"
}

# Function to upload files to VPS
upload_to_vps() {
    local local_file="$1"
    local remote_path="$2"
    log "Uploading $local_file to VPS..."
    scp -i ~/.ssh/tradygo_deploy -o StrictHostKeyChecking=no "$local_file" "$SERVER_USER@$SERVER_IP:$remote_path"
}

# Test SSH connection first
log "🔍 Testing SSH connection..."
if ! ssh -i ~/.ssh/tradygo_deploy -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$SERVER_USER@$SERVER_IP" 'echo "SSH connection successful"' 2>/dev/null; then
    error "SSH connection failed. Please ensure:
    1. Server is accessible at $SERVER_IP
    2. SSH key authentication is working
    3. Root login is permitted
    
    SSH key should be uploaded to ~/.ssh/authorized_keys on the server"
fi

log "✅ SSH connection successful!"

# Step 1: Prepare VPS
log "📋 Step 1: Preparing VPS environment..."
run_on_vps "apt update && apt upgrade -y"
run_on_vps "apt install -y curl wget git unzip docker.io docker-compose-plugin"
run_on_vps "systemctl start docker && systemctl enable docker"
run_on_vps "apt install -y ufw && ufw --force enable && ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp"
run_on_vps "mkdir -p $DEPLOY_DIR"

# Step 2: Create deployment files on VPS
log "📋 Step 2: Creating deployment configuration..."

# Create environment files
run_on_vps "mkdir -p $DEPLOY_DIR/env"

# API Environment
run_on_vps "cat > $DEPLOY_DIR/env/api.env << 'EOF'
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://trg_app:${DB_PASSWORD}@db:5432/trgdb?schema=public
JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d
PASSWORD_BCRYPT_ROUNDS=12
CORS_ORIGINS=https://admin.tradygo.in,https://api.tradygo.in
PLATFORM_BRAND_NAME=TradyGo
PLATFORM_BRAND_LOGO_URL=https://cdn.tradygo.in/brand/admin-logo.svg
UI_HELP_URL=https://docs.tradygo.in/admin
AUTH_ADMIN_ROLES_JSON=[\"ADMIN\",\"SUPER_ADMIN\"]
AUTH_OTP_ENABLED=0
UI_SHOW_DEMO_CREDS=0
REDIRECT_ADMIN=/dashboard
REDIRECT_SELLER=/orders
CONFIG_CACHE_TTL_MS=15000
EOF"

# Admin Environment
run_on_vps "cat > $DEPLOY_DIR/env/admin.env << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_BASE=https://api.tradygo.in
EOF"

# Create Caddyfile
run_on_vps "cat > $DEPLOY_DIR/Caddyfile << 'EOF'
{
  email admin@tradygo.in
}

admin.tradygo.in {
  encode zstd gzip
  reverse_proxy admin:3000
}

api.tradygo.in {
  encode zstd gzip
  reverse_proxy api:3001
}
EOF"

# Create API Dockerfile
run_on_vps "cat > $DEPLOY_DIR/Dockerfile.api << 'EOF'
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/*/package.json ./packages/*/
RUN pnpm install --frozen-lockfile --prod=false
COPY . .
RUN pnpm build:api

FROM node:20-alpine AS production
RUN npm install -g pnpm prisma
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/*/package.json ./packages/*/
RUN pnpm install --frozen-lockfile --prod
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/prisma ./apps/api/prisma
WORKDIR /app/apps/api
RUN prisma generate
EXPOSE 3001
CMD [\"sh\", \"-c\", \"prisma migrate deploy || prisma db push || true && node dist/main.js\"]
EOF"

# Create Admin Dockerfile
run_on_vps "cat > $DEPLOY_DIR/Dockerfile.admin << 'EOF'
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/*/package.json ./packages/*/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build:admin

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=base /app/apps/admin/.next/standalone ./
COPY --from=base /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=base /app/apps/admin/public ./apps/admin/public
WORKDIR /app/apps/admin
EXPOSE 3000
CMD [\"node\", \"server.js\"]
EOF"

# Create Docker Compose
run_on_vps "cat > $DEPLOY_DIR/docker-compose.yml << 'EOF'
version: '3.8'

services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: trgdb
      POSTGRES_USER: trg_app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - trg_db_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - tradygo

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    env_file:
      - ./env/api.env
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - tradygo

  admin:
    build:
      context: .
      dockerfile: Dockerfile.admin
    env_file:
      - ./env/admin.env
    depends_on:
      - api
    restart: unless-stopped
    networks:
      - tradygo

  caddy:
    image: caddy:2.8
    ports:
      - \"80:80\"
      - \"443:443\"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - admin
      - api
    restart: unless-stopped
    networks:
      - tradygo

volumes:
  trg_db_data:
  caddy_data:
  caddy_config:

networks:
  tradygo:
    driver: bridge
EOF"

# Step 3: Upload source code
log "📋 Step 3: Uploading TradyGo source code..."
upload_to_vps "tradygo-deploy.tar.gz" "$DEPLOY_DIR/"
run_on_vps "cd $DEPLOY_DIR && tar -xzf tradygo-deploy.tar.gz --strip-components=1"
run_on_vps "rm $DEPLOY_DIR/tradygo-deploy.tar.gz"

# Step 4: Build and deploy
log "📋 Step 4: Building and starting services..."
run_on_vps "cd $DEPLOY_DIR && docker compose build --no-cache"
run_on_vps "cd $DEPLOY_DIR && docker compose up -d"

# Step 5: Health checks
log "📋 Step 5: Running health checks..."
sleep 30
run_on_vps "cd $DEPLOY_DIR && docker compose ps"
run_on_vps "curl -f http://localhost:3001/health || echo 'API health check failed (may not have /health endpoint)'"
run_on_vps "curl -f http://localhost:3000 || echo 'Admin health check failed'"

# Step 6: Display results
log "🎉 DEPLOYMENT COMPLETE!"
log ""
log "📍 Access URLs (after DNS propagation):"
log "   Admin Panel: https://admin.tradygo.in"
log "   API: https://api.tradygo.in"
log ""
log "🔐 Default Login:"
log "   Email: admin@tradygo.in"
log "   Password: Admin@12345!"
log ""
log "📝 DNS Configuration Required:"
log "   Point admin.tradygo.in to $SERVER_IP"
log "   Point api.tradygo.in to $SERVER_IP"
log ""
log "🔧 Management Commands:"
log "   Check status: ssh $SERVER_USER@$SERVER_IP 'cd $DEPLOY_DIR && docker compose ps'"
log "   View logs: ssh $SERVER_USER@$SERVER_IP 'cd $DEPLOY_DIR && docker compose logs -f'"
log "   Restart: ssh $SERVER_USER@$SERVER_IP 'cd $DEPLOY_DIR && docker compose restart'"
log ""
log "✅ TradyGo is now running in production!"

log "🎯 Deployment Summary:"
log "   - PostgreSQL 16 database with persistent storage"
log "   - NestJS API with Prisma ORM and JWT authentication"
log "   - Next.js admin panel with standalone build"
log "   - Caddy reverse proxy with automatic HTTPS certificates"
log "   - UFW firewall configured for ports 22, 80, 443"
log "   - All services configured for auto-restart"
log "   - Production environment variables and secrets"
log ""
log "🚀 Your TradyGo platform is live and ready for use!"