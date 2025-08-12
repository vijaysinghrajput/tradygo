#!/bin/bash
# TradyGo VPS Automated Deployment Script
# Execute this script on your VPS as root

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
DEPLOY_DIR="/opt/tradygo"
DB_PASSWORD="8c44649ab86d78eb9d7393ac105cf7fa"
JWT_ACCESS_SECRET="f71b033880b23dfeb96a306c0ec01a5a3ddb5a6a0bd84036f01e29db17e4ff70"
JWT_REFRESH_SECRET="92ce18ace91a7a42441aa8e0e534ea3cb278c5f3fb0e62dc90b4a9080a282399"

log "Starting TradyGo VPS Deployment..."

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root"
fi

# Update system
log "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
log "Installing required packages..."
apt install -y curl wget git unzip docker.io docker-compose-plugin

# Start Docker
log "Starting Docker service..."
systemctl start docker
systemctl enable docker

# Create deployment directory
log "Creating deployment directory..."
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

# Create environment files
log "Creating environment files..."
mkdir -p env

# API Environment
cat > env/api.env << EOF
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
AUTH_ADMIN_ROLES_JSON=["ADMIN","SUPER_ADMIN"]
AUTH_OTP_ENABLED=0
UI_SHOW_DEMO_CREDS=0
REDIRECT_ADMIN=/dashboard
REDIRECT_SELLER=/orders
CONFIG_CACHE_TTL_MS=15000
EOF

# Admin Environment
cat > env/admin.env << EOF
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_BASE=https://api.tradygo.in
EOF

# Create Caddyfile
log "Creating Caddyfile..."
cat > Caddyfile << EOF
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
EOF

# Create Dockerfiles
log "Creating Dockerfiles..."

# API Dockerfile
cat > Dockerfile.api << EOF
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
CMD ["sh", "-c", "prisma migrate deploy || prisma db push || true && node dist/main.js"]
EOF

# Admin Dockerfile
cat > Dockerfile.admin << EOF
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
CMD ["node", "server.js"]
EOF

# Create Docker Compose
log "Creating docker-compose.yml..."
cat > docker-compose.yml << EOF
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
      - "80:80"
      - "443:443"
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
EOF

# Configure firewall
log "Configuring firewall..."
apt install -y ufw
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

log "Deployment files created successfully!"
log "Next steps:"
log "1. Upload your TradyGo source code to $DEPLOY_DIR"
log "2. Run: docker compose build --no-cache"
log "3. Run: docker compose up -d"
log "4. Point your DNS: admin.tradygo.in and api.tradygo.in to this server's IP"
log "5. Access: https://admin.tradygo.in"

log "TradyGo VPS setup completed!"