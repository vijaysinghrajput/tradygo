#!/bin/bash

# TradyGo VPS Bootstrap Script
# Run this script on a fresh Ubuntu 24.04 VPS to set up the environment

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root. Please run as a regular user with sudo privileges."
fi

# Check Ubuntu version
if ! grep -q "Ubuntu 24.04" /etc/os-release; then
    warn "This script is designed for Ubuntu 24.04. Proceeding anyway..."
fi

log "Starting TradyGo VPS bootstrap process..."

# Update system
log "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
log "Installing essential packages..."
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    htop \
    tree \
    jq \
    socat

# Install Docker
log "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker $USER
    log "Docker installed successfully"
else
    log "Docker is already installed"
fi

# Install Docker Compose (standalone)
log "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    log "Docker Compose installed successfully"
else
    log "Docker Compose is already installed"
fi

# Install Nginx
log "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    log "Nginx installed and started"
else
    log "Nginx is already installed"
fi

# Install acme.sh for SSL certificates
log "Installing acme.sh..."
if [ ! -d "$HOME/.acme.sh" ]; then
    curl https://get.acme.sh | sh -s email=admin@tradygo.in
    source ~/.bashrc
    log "acme.sh installed successfully"
else
    log "acme.sh is already installed"
fi

# Create TradyGo directory structure
log "Creating TradyGo directory structure..."
sudo mkdir -p /srv/tradygo/{env,shared/{cdn,backups},logs}
sudo chown -R $USER:$USER /srv/tradygo

# Configure firewall
log "Configuring UFW firewall..."
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Configure fail2ban
log "Configuring fail2ban..."
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Create deployer user for CI/CD
log "Creating deployer user..."
if ! id "deployer" &>/dev/null; then
    sudo useradd -m -s /bin/bash deployer
    sudo usermod -aG docker deployer
    sudo mkdir -p /home/deployer/.ssh
    sudo chown deployer:deployer /home/deployer/.ssh
    sudo chmod 700 /home/deployer/.ssh
    
    # Add deployer to sudoers for specific commands
    echo "deployer ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/docker-compose, /bin/systemctl restart nginx, /bin/systemctl reload nginx" | sudo tee /etc/sudoers.d/deployer
    log "Deployer user created"
else
    log "Deployer user already exists"
fi

# Set up log rotation
log "Setting up log rotation..."
sudo tee /etc/logrotate.d/tradygo > /dev/null <<EOF
/srv/tradygo/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        /bin/systemctl reload nginx > /dev/null 2>&1 || true
    endscript
}
EOF

# Create backup script
log "Creating backup script..."
sudo tee /srv/tradygo/scripts/backup.sh > /dev/null <<'EOF'
#!/bin/bash

# TradyGo Backup Script
set -euo pipefail

BACKUP_DIR="/srv/tradygo/shared/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
docker exec tradygo-postgres pg_dump -U tradygo tradygo_core | gzip > "$BACKUP_DIR/db_backup_$DATE.sql.gz"

# MinIO backup (sync to backup directory)
docker exec tradygo-minio mc mirror /data/tradygo "$BACKUP_DIR/minio_$DATE" --overwrite

# Clean old backups (keep last 7 days)
find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "minio_*" -mtime +7 -exec rm -rf {} +

echo "Backup completed: $DATE"
EOF

sudo chmod +x /srv/tradygo/scripts/backup.sh

# Set up cron for backups
log "Setting up backup cron job..."
(crontab -l 2>/dev/null; echo "0 2 * * * /srv/tradygo/scripts/backup.sh >> /srv/tradygo/logs/backup.log 2>&1") | crontab -

# Create SSL certificate directory
log "Creating SSL certificate directory..."
sudo mkdir -p /etc/nginx/ssl
sudo chown -R $USER:$USER /etc/nginx/ssl

# Display DNS configuration needed
log "Bootstrap completed successfully!"
echo -e "\n${BLUE}=== DNS CONFIGURATION REQUIRED ===${NC}"
echo "Please add the following DNS A records pointing to 195.35.21.175:"
echo "  - tradygo.in"
echo "  - www.tradygo.in"
echo "  - api.tradygo.in"
echo "  - admin.tradygo.in"
echo "  - seller.tradygo.in"
echo "  - files.tradygo.in"
echo "  - cdn.tradygo.in"
echo "  - webhook.tradygo.in"
echo "  - monitor.tradygo.in"
echo ""
echo -e "${BLUE}=== NEXT STEPS ===${NC}"
echo "1. Configure DNS records as shown above"
echo "2. Wait for DNS propagation (5-30 minutes)"
echo "3. Run the SSL certificate setup: ./scripts/setup-ssl.sh"
echo "4. Deploy the application: ./scripts/deploy.sh"
echo ""
echo -e "${GREEN}You may need to log out and back in for Docker group membership to take effect.${NC}"

log "Bootstrap process completed!"