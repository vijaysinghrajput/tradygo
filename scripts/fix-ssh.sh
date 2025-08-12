#!/bin/bash
# SSH Connection Fix Script
set -e

SERVER_IP="195.35.21.175"
SERVER_USER="root"
SERVER_PASS="Brijesh@411..,,"

echo "🔍 Diagnosing SSH connection to $SERVER_IP..."

# Check if server is reachable
echo "1. Testing server reachability..."
if ping -c 1 $SERVER_IP >/dev/null 2>&1; then
    echo "   ✅ Server is reachable"
else
    echo "   ❌ Server is not reachable"
    exit 1
fi

# Check common ports
echo "2. Testing common ports..."
for port in 22 2222 2200 22022 22000; do
    if nc -z $SERVER_IP $port 2>/dev/null; then
        echo "   ✅ Port $port is open"
        if [ $port -eq 22 ]; then
            echo "   SSH is working on default port!"
            exit 0
        else
            echo "   SSH might be running on port $port"
        fi
    else
        echo "   ❌ Port $port is closed"
    fi
done

# Check if we can access via HTTP
echo "3. Testing HTTP access..."
if curl -s -m 5 http://$SERVER_IP/ >/dev/null; then
    echo "   ✅ HTTP is working (server is running)"
else
    echo "   ❌ HTTP is not working"
fi

echo ""
echo "🚨 SSH Connection Issue Detected!"
echo ""
echo "Possible causes:"
echo "1. SSH service crashed/stopped"
echo "2. SSH daemon not running"
echo "3. Firewall blocking port 22"
echo "4. SSH configuration corrupted"
echo ""
echo "Solutions to try:"
echo "1. Wait 5-10 minutes for auto-restart"
echo "2. Contact hosting provider for SSH restart"
echo "3. Use emergency console access if available"
echo "4. Check if SSH is running on different port"
echo ""
echo "Trying alternative SSH ports..."

# Try alternative ports with SSH
for port in 2222 2200 22022 22000; do
    echo "   Trying SSH on port $port..."
    if ssh -o ConnectTimeout=5 -o BatchMode=yes -p $port $SERVER_USER@$SERVER_IP "echo 'SSH working on port $port'" 2>/dev/null; then
        echo "   ✅ SSH is working on port $port!"
        echo "   Use: ssh -p $port $SERVER_USER@$SERVER_IP"
        exit 0
    fi
done

echo ""
echo "❌ All SSH attempts failed"
echo "You need to:"
echo "1. Contact your hosting provider"
echo "2. Ask them to restart SSH service"
echo "3. Or use emergency console access"
echo ""
echo "Once SSH is restored, run: ./scripts/setup-ssh.sh"
