#!/bin/bash

# TradyGo SSL Certificate Setup Script
# This script sets up wildcard SSL certificates using acme.sh

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

# Check if acme.sh is installed
if [ ! -d "$HOME/.acme.sh" ]; then
    error "acme.sh is not installed. Please run bootstrap.sh first."
fi

# Source acme.sh
source ~/.acme.sh/acme.sh.env

log "Starting SSL certificate setup for tradygo.in..."

# Check if DNS records are properly configured
log "Checking DNS configuration..."
DOMAINS=("tradygo.in" "www.tradygo.in" "api.tradygo.in" "admin.tradygo.in" "seller.tradygo.in" "files.tradygo.in" "cdn.tradygo.in" "webhook.tradygo.in" "monitor.tradygo.in")

for domain in "${DOMAINS[@]}"; do
    if ! nslookup "$domain" | grep -q "195.35.21.175"; then
        warn "DNS for $domain may not be properly configured or not yet propagated"
    else
        log "DNS for $domain is correctly configured"
    fi
done

echo -e "\n${BLUE}=== SSL CERTIFICATE SETUP ===${NC}"
echo "This script will set up SSL certificates for tradygo.in and all subdomains."
echo "You have several options for certificate generation:"
echo ""
echo "1. HTTP-01 challenge (requires domains to resolve to this server)"
echo "2. DNS-01 challenge (requires DNS provider API access)"
echo "3. Manual DNS challenge (you'll need to add TXT records manually)"
echo ""
read -p "Choose option (1/2/3): " CERT_METHOD

case $CERT_METHOD in
    1)
        log "Using HTTP-01 challenge..."
        # Stop nginx temporarily
        sudo systemctl stop nginx
        
        # Issue certificate using standalone mode
        ~/.acme.sh/acme.sh --issue \
            -d tradygo.in \
            -d "*.tradygo.in" \
            --standalone \
            --force
        
        # Start nginx again
        sudo systemctl start nginx
        ;;
    2)
        echo "DNS-01 challenge requires API credentials for your DNS provider."
        echo "Supported providers: Cloudflare, Route53, DigitalOcean, etc."
        echo "Please refer to acme.sh documentation for your provider."
        echo "Example for Cloudflare:"
        echo "  export CF_Token='your-cloudflare-api-token'"
        echo "  export CF_Account_ID='your-cloudflare-account-id'"
        echo ""
        read -p "Have you set up your DNS provider credentials? (y/n): " DNS_READY
        
        if [[ $DNS_READY == "y" || $DNS_READY == "Y" ]]; then
            read -p "Enter your DNS provider (e.g., cf for Cloudflare): " DNS_PROVIDER
            
            ~/.acme.sh/acme.sh --issue \
                -d tradygo.in \
                -d "*.tradygo.in" \
                --dns "dns_$DNS_PROVIDER" \
                --force
        else
            error "Please set up DNS provider credentials first"
        fi
        ;;
    3)
        log "Using manual DNS challenge..."
        echo "You will need to add TXT records to your DNS manually."
        echo "The script will pause and wait for you to add the records."
        
        ~/.acme.sh/acme.sh --issue \
            -d tradygo.in \
            -d "*.tradygo.in" \
            --dns \
            --yes-I-know-dns-manual-mode-enough-go-ahead-please \
            --force
        ;;
    *)
        error "Invalid option selected"
        ;;
esac

# Install certificates to nginx directory
log "Installing certificates to nginx directory..."
sudo mkdir -p /etc/nginx/ssl

~/.acme.sh/acme.sh --install-cert \
    -d tradygo.in \
    --key-file /etc/nginx/ssl/tradygo.in.key \
    --fullchain-file /etc/nginx/ssl/tradygo.in.crt \
    --reloadcmd "sudo systemctl reload nginx"

# Set proper permissions
sudo chown root:root /etc/nginx/ssl/tradygo.in.*
sudo chmod 600 /etc/nginx/ssl/tradygo.in.key
sudo chmod 644 /etc/nginx/ssl/tradygo.in.crt

# Test nginx configuration
log "Testing nginx configuration..."
if sudo nginx -t; then
    log "Nginx configuration is valid"
    sudo systemctl reload nginx
    log "Nginx reloaded successfully"
else
    error "Nginx configuration test failed"
fi

# Set up auto-renewal
log "Setting up certificate auto-renewal..."
(crontab -l 2>/dev/null; echo "0 3 * * 0 ~/.acme.sh/acme.sh --cron --home ~/.acme.sh > /srv/tradygo/logs/ssl-renewal.log 2>&1") | crontab -

log "SSL certificate setup completed successfully!"
echo -e "\n${BLUE}=== CERTIFICATE INFORMATION ===${NC}"
echo "Certificate files:"
echo "  - Certificate: /etc/nginx/ssl/tradygo.in.crt"
echo "  - Private Key: /etc/nginx/ssl/tradygo.in.key"
echo ""
echo "The certificate covers:"
echo "  - tradygo.in"
echo "  - *.tradygo.in (all subdomains)"
echo ""
echo "Auto-renewal is set up to run weekly on Sundays at 3 AM."
echo ""
echo -e "${GREEN}You can now deploy the application using ./scripts/deploy.sh${NC}"