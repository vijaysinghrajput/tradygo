#!/bin/bash
# TradyGo Deployment Status Checker
# Check the health and status of deployed services

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration (update these values)
SERVER_IP="195.35.21.175"
REMOTE_DIR="/opt/tradygo"

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo -e "${BLUE}🔍 TradyGo Deployment Status Check${NC}"
echo "=========================================="
echo

# Check if we can connect to the server
log_info "Checking server connectivity..."
if ssh -o ConnectTimeout=10 -o BatchMode=yes root@${SERVER_IP} "echo 'Connected'" 2>/dev/null; then
    log_success "Server connection successful"
else
    log_error "Cannot connect to server. Check SSH configuration and server status."
    exit 1
fi

echo

# Check Docker services status
log_info "Checking Docker services status..."
ssh root@${SERVER_IP} bash -lc "
    set -e
    cd ${REMOTE_DIR}/compose
    
    echo 'Container Status:'
    docker compose ps
    
    echo
    echo 'Service Health:'
    
    # Check database
    if docker compose exec -T db pg_isready -U trg_app -d trgdb >/dev/null 2>&1; then
        echo '✅ Database: Healthy'
    else
        echo '❌ Database: Unhealthy'
    fi
    
    # Check API
    if curl -f -s http://localhost:3001/health >/dev/null 2>&1; then
        echo '✅ API: Healthy'
    else
        echo '❌ API: Unhealthy'
    fi
    
    # Check Admin
    if curl -f -s http://localhost:3000 >/dev/null 2>&1; then
        echo '✅ Admin: Healthy'
    else
        echo '❌ Admin: Unhealthy'
    fi
    
    # Check Caddy
    if docker compose ps caddy | grep -q 'Up'; then
        echo '✅ Caddy: Running'
    else
        echo '❌ Caddy: Not running'
    fi
"

echo

# Check system resources
log_info "Checking system resources..."
ssh root@${SERVER_IP} bash -lc "
    echo 'System Resources:'
    echo '================='
    
    # CPU and Memory
    echo 'CPU Usage:'
    top -bn1 | grep 'Cpu(s)' | awk '{print \$2}' | awk -F'%' '{print \"CPU: \" \$1 \"%\"}'
    
    echo 'Memory Usage:'
    free -h | grep '^Mem:' | awk '{print \"Memory: \" \$3 \"/\" \$2 \" (\" \$3*100/\$2 \"%)\"}'
    
    echo 'Disk Usage:'
    df -h / | tail -1 | awk '{print \"Disk: \" \$3 \"/\" \$2 \" (\" \$5 \")\"}'
    
    echo
    echo 'Docker Resources:'
    docker system df
"

echo

# Check recent logs
log_info "Checking recent service logs..."
ssh root@${SERVER_IP} bash -lc "
    set -e
    cd ${REMOTE_DIR}/compose
    
    echo 'Recent API Logs (last 5 lines):'
    echo '================================'
    docker compose logs api --tail=5 || echo 'No API logs available'
    
    echo
    echo 'Recent Admin Logs (last 5 lines):'
    echo '================================='
    docker compose logs admin --tail=5 || echo 'No Admin logs available'
    
    echo
    echo 'Recent Caddy Logs (last 5 lines):'
    echo '================================='
    docker compose logs caddy --tail=5 || echo 'No Caddy logs available'
"

echo

# Check network connectivity
log_info "Checking network connectivity..."
ssh root@${SERVER_IP} bash -lc "
    echo 'Network Status:'
    echo '==============='
    
    # Check if ports are listening
    echo 'Port 80 (HTTP):'
    netstat -tulpn | grep :80 || echo 'Port 80 not listening'
    
    echo 'Port 443 (HTTPS):'
    netstat -tulpn | grep :443 || echo 'Port 443 not listening'
    
    echo 'Port 3000 (Admin):'
    netstat -tulpn | grep :3000 || echo 'Port 3000 not listening'
    
    echo 'Port 3001 (API):'
    netstat -tulpn | grep :3001 || echo 'Port 3001 not listening'
    
    echo
    echo 'Firewall Status:'
    ufw status
"

echo

# Check SSL certificates
log_info "Checking SSL certificates..."
ssh root@${SERVER_IP} bash -lc "
    echo 'SSL Certificate Status:'
    echo '======================='
    
    if [ -d '/opt/tradygo/compose/caddy_data/caddy/certificates/acme-v02.api.letsencrypt.org-directory' ]; then
        echo '✅ Let\'s Encrypt certificates directory exists'
        
        # List certificates
        find /opt/tradygo/compose/caddy_data/caddy/certificates -name '*.crt' 2>/dev/null | while read cert; do
            echo \"Certificate: \$cert\"
            openssl x509 -in \"\$cert\" -text -noout | grep -E 'Subject:|Not Before:|Not After:' | head -3
        done
    else
        echo '❌ Let\'s Encrypt certificates not found'
    fi
"

echo

# Summary
log_info "Status check complete!"
echo
echo "📋 Summary:"
echo "   • Run './scripts/deploy.sh' to deploy or update"
echo "   • Check logs: ssh root@${SERVER_IP} 'cd ${REMOTE_DIR}/compose && docker compose logs -f'"
echo "   • Restart services: ssh root@${SERVER_IP} 'cd ${REMOTE_DIR}/compose && docker compose restart'"
echo
echo "🌐 Access URLs:"
echo "   • Admin Panel: https://admin.tradygo.in"
echo "   • API: https://api.tradygo.in"
echo
echo "🔧 For detailed troubleshooting, check the DEPLOYMENT.md file"
