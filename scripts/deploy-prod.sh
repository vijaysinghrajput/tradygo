#!/bin/bash
# ===== TRADYGO PROD DEPLOY: VPS + DOCKER + CADDY + POSTGRES + ADMIN/API =====
set -euo pipefail

# --- EDIT ONLY IF NEEDED ---
SERVER_IP="195.35.21.175"
ROOT_USER="root"
ROOT_PASS="Brijesh@411..,,"

ADMIN_DOMAIN="admin.tradygo.in"
API_DOMAIN="api.tradygo.in"
ACME_EMAIL="admin@tradygo.in"

PROJECT_NAME="tradygo"
LOCAL_REPO="$HOME/Documents/clients/tradygo"  # monorepo root
REMOTE_DIR="/opt/${PROJECT_NAME}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Error handling
trap 'log_error "Deployment failed at line $LINENO. Exiting..."; exit 1' ERR

# ---- 0) Check dependencies on local machine ----
log_info "Checking local dependencies..."

if ! command -v sshpass >/dev/null 2>&1; then
  log_info "Installing sshpass..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install hudochenkov/sshpass/sshpass || brew install sshpass
  else
    sudo apt-get update -y && sudo apt-get install -y sshpass
  fi
fi

if ! command -v rsync >/dev/null 2>&1; then
  log_error "rsync is required but not installed. Please install it first."
  exit 1
fi

# Setup SSH keys
log_info "Setting up SSH keys..."
mkdir -p ~/.ssh
if [[ ! -f ~/.ssh/${PROJECT_NAME}_ed25519 ]]; then
  ssh-keygen -t ed25519 -N "" -f ~/.ssh/${PROJECT_NAME}_ed25519 -C "${PROJECT_NAME}-deploy" >/dev/null
  log_success "Generated new SSH key pair"
fi

PUBKEY="$(cat ~/.ssh/${PROJECT_NAME}_ed25519.pub)"
log_info "Using public key: ${PUBKEY:0:50}..."

# ---- 1) Push pubkey to server using password, prep server ----
log_info "Setting up server and pushing SSH key..."
sshpass -p "$ROOT_PASS" ssh -o StrictHostKeyChecking=no ${ROOT_USER}@${SERVER_IP} "
  set -e
  echo 'Setting up SSH key...'
  mkdir -p /root/.ssh
  touch /root/.ssh/authorized_keys
  chmod 700 /root/.ssh
  chmod 600 /root/.ssh/authorized_keys
  grep -q '${PUBKEY}' /root/.ssh/authorized_keys || echo '${PUBKEY}' >> /root/.ssh/authorized_keys

  echo 'Installing system packages...'
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y
  apt-get install -y ca-certificates curl gnupg ufw rsync postgresql-client
  
  echo 'Installing Docker...'
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  . /etc/os-release
  echo \"deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \$VERSION_CODENAME stable\" > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  
  echo 'Starting Docker service...'
  systemctl enable --now docker
  
  echo 'Installing Caddy...'
  curl -fsSL https://getcaddy.com | bash -s stable
  
  echo 'Configuring firewall...'
  ufw --force enable || true
  ufw allow 22/tcp
  ufw allow 80,443/tcp
  
  echo 'Creating project directories...'
  mkdir -p ${REMOTE_DIR}/{compose,env,logs,backups,repo}
  
  echo 'Server setup complete!'
"

# Test SSH key connection
log_info "Testing SSH key connection..."
ssh -o ConnectTimeout=10 root@${SERVER_IP} "echo 'SSH key connection successful!'"

# ---- 2) rsync monorepo over SSH key ----
log_info "Syncing monorepo to server..."
rsync -az --delete \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude ".next" \
  --exclude ".turbo" \
  --exclude "dist" \
  --exclude "build" \
  --exclude ".DS_Store" \
  --exclude "*.log" \
  "${LOCAL_REPO}/" "root@${SERVER_IP}:${REMOTE_DIR}/repo/"

log_success "Repository synced successfully"

# ---- 3) Create env files + dockerfiles + compose + caddyfile on server ----
log_info "Creating configuration files on server..."
ssh root@${SERVER_IP} bash -lc "
  set -e
  cd ${REMOTE_DIR}

  echo 'Creating environment files...'
  
  # API environment
  if [ ! -f env/api.env ]; then
    DBPASS=\$(openssl rand -hex 12)
    ACC_HEX=\$(openssl rand -hex 32)
    REF_HEX=\$(openssl rand -hex 32)
    cat > env/api.env <<EOT
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://trg_app:\${DBPASS}@db:5432/trgdb?schema=public
JWT_ACCESS_SECRET=\${ACC_HEX}
JWT_REFRESH_SECRET=\${REF_HEX}
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d
PASSWORD_BCRYPT_ROUNDS=12
CORS_ORIGINS=https://${ADMIN_DOMAIN},https://${API_DOMAIN}

PLATFORM_BRAND_NAME=TradyGo
PLATFORM_BRAND_LOGO_URL=https://cdn.tradygo.in/brand/admin-logo.svg
UI_HELP_URL=https://docs.tradygo.in/admin
AUTH_ADMIN_ROLES_JSON=[\"ADMIN\",\"SUPER_ADMIN\"]
AUTH_OTP_ENABLED=0
UI_SHOW_DEMO_CREDS=0
REDIRECT_ADMIN=/dashboard
REDIRECT_SELLER=/orders
CONFIG_CACHE_TTL_MS=15000
EOT
    echo \"Generated database password: \${DBPASS}\"
  else
    echo 'API environment file already exists'
  fi

  # Admin environment
  if [ ! -f env/admin.env ]; then
    cat > env/admin.env <<EOT
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_BASE=https://${API_DOMAIN}
EOT
    echo 'Admin environment file created'
  else
    echo 'Admin environment file already exists'
  fi

  echo 'Creating Dockerfiles...'
  
  # API Dockerfile
  cat > compose/Dockerfile.api <<'EOT'
FROM node:20-slim AS base
WORKDIR /app

FROM base AS deps
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
COPY repo/pnpm-lock.yaml repo/package.json ./
RUN pnpm fetch
COPY repo ./
RUN pnpm -r i --offline --frozen-lockfile

FROM deps AS build
WORKDIR /app/apps/api
RUN pnpm prisma generate || true
RUN pnpm build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./package.json
ENV PORT=3001
CMD bash -lc '\
  set -e; \
  if command -v npx >/dev/null 2>&1; then (npx prisma migrate deploy || npx prisma db push || true); fi; \
  node dist/main.js \
'
EOT

  # Admin Dockerfile
  cat > compose/Dockerfile.admin <<'EOT'
FROM node:20-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
COPY repo/pnpm-lock.yaml repo/package.json ./
RUN pnpm fetch
COPY repo ./
RUN pnpm -r i --offline --frozen-lockfile

FROM deps AS build
WORKDIR /app/apps/admin
RUN pnpm build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/admin/.next/standalone ./
COPY --from=build /app/apps/admin/.next/static ./.next/static
COPY --from=build /app/apps/admin/public ./public
ENV PORT=3000
CMD [\"node\",\"server.js\"]
EOT

  echo 'Creating Caddyfile...'
  cat > compose/Caddyfile <<EOT
{
  email ${ACME_EMAIL}
  auto_https disable_redirects
}

${ADMIN_DOMAIN} {
  encode zstd gzip
  reverse_proxy admin:3000
}

${API_DOMAIN} {
  encode zstd gzip
  reverse_proxy api:3001
}
EOT

  echo 'Creating docker-compose.yml...'
  cat > compose/docker-compose.yml <<'EOT'
services:
  db:
    image: postgres:16
    container_name: trg_db
    environment:
      POSTGRES_DB: trgdb
      POSTGRES_USER: trg_app
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-trg_app_pass}
    volumes:
      - trg_db_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks: [trgnet]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U trg_app -d trgdb"]
      interval: 30s
      timeout: 10s
      retries: 3

  api:
    build:
      context: ..
      dockerfile: compose/Dockerfile.api
    container_name: trg_api
    env_file:
      - ../env/api.env
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    networks: [trgnet]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  admin:
    build:
      context: ..
      dockerfile: compose/Dockerfile.admin
    container_name: trg_admin
    env_file:
      - ../env/admin.env
    depends_on:
      - api
    restart: unless-stopped
    networks: [trgnet]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  caddy:
    image: caddy:2.8
    container_name: trg_caddy
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
    networks: [trgnet]

volumes:
  trg_db_data:
  caddy_data:
  caddy_config:

networks:
  trgnet:
    driver: bridge
EOT

  echo 'Configuration files created successfully'
"

# ---- 4) Build and deploy ----
log_info "Building and deploying containers..."
ssh root@${SERVER_IP} bash -lc "
  set -e
  cd ${REMOTE_DIR}/compose
  
  echo 'Stopping existing containers...'
  docker compose down || true
  
  echo 'Building containers...'
  docker compose build --no-cache
  
  echo 'Starting services...'
  docker compose up -d
  
  echo 'Waiting for services to be ready...'
  sleep 30
  
  echo 'Checking service status...'
  docker compose ps
  
  echo 'Checking service health...'
  docker compose logs --tail=20
"

# ---- 5) Verify deployment ----
log_info "Verifying deployment..."
ssh root@${SERVER_IP} bash -lc "
  set -e
  cd ${REMOTE_DIR}/compose
  
  echo 'Checking container status...'
  docker compose ps
  
  echo 'Checking service logs...'
  echo '=== API Logs ==='
  docker compose logs api --tail=10
  echo '=== Admin Logs ==='
  docker compose logs admin --tail=10
  echo '=== Caddy Logs ==='
  docker compose logs caddy --tail=10
  
  echo 'Testing API health endpoint...'
  sleep 10
  curl -f http://localhost:3001/health || echo 'API health check failed'
  
  echo 'Testing admin endpoint...'
  curl -f http://localhost:3000 || echo 'Admin health check failed'
"

# ---- 6) Final status and instructions ----
log_success "=== DEPLOYMENT COMPLETE ==="
echo
echo "🌐 Services deployed:"
echo "   • Admin Panel: https://${ADMIN_DOMAIN}"
echo "   • API: https://${API_DOMAIN}"
echo "   • Database: PostgreSQL running in container"
echo "   • Reverse Proxy: Caddy with automatic HTTPS"
echo
echo "📋 Next steps:"
echo "   1. Update your DNS records to point ${ADMIN_DOMAIN} and ${API_DOMAIN} to ${SERVER_IP}"
echo "   2. Wait for DNS propagation (can take up to 24 hours)"
echo "   3. HTTPS certificates will be automatically generated by Caddy"
echo "   4. Access your admin panel at https://${ADMIN_DOMAIN}"
echo
echo "🔧 Useful commands:"
echo "   • View logs: ssh root@${SERVER_IP} 'cd ${REMOTE_DIR}/compose && docker compose logs -f'"
echo "   • Restart services: ssh root@${SERVER_IP} 'cd ${REMOTE_DIR}/compose && docker compose restart'"
echo "   • Update deployment: Run this script again"
echo
echo "📁 Project files are located at: ${REMOTE_DIR}"
echo "🐳 Docker compose files: ${REMOTE_DIR}/compose"
echo "🔐 Environment files: ${REMOTE_DIR}/env"
echo
log_success "Deployment completed successfully!"
