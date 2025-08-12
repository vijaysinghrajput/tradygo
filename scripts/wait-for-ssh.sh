#!/bin/bash
# ===== WAIT FOR SSH + SETUP PASSWORDLESS ACCESS =====
set -euo pipefail

SERVER_IP="195.35.21.175"
ROOT_USER="root"
ROOT_PASS="Brijesh@411..,,"
PROJECT_NAME="tradygo"

echo "🔍 Waiting for SSH service to become available..."
echo "⏰ This may take 2-5 minutes after hosting provider restart..."

# Wait for SSH to become available
while ! nc -z -w 3 ${SERVER_IP} 22 2>/dev/null; do
    echo "⏳ SSH not ready yet... waiting 30 seconds..."
    sleep 30
done

echo "✅ SSH is now available!"
echo "🔑 Setting up passwordless access..."

# Test SSH connection
sshpass -p "$ROOT_PASS" ssh -o StrictHostKeyChecking=no ${ROOT_USER}@${SERVER_IP} 'echo "SSH connection test successful"'

echo "🎉 SSH is working! Now setting up passwordless access..."

# Run the full SSH setup
./scripts/setup-ssh.sh

echo "🚀 Ready to deploy! Run: ./scripts/deploy-now.sh"



