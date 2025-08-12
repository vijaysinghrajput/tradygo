#!/bin/bash

# Railway CLI Setup Script for Tradygo
# This script helps set up Railway CLI authentication and project linking

echo "🚂 Railway CLI Setup for Tradygo"
echo "================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed successfully"
else
    echo "✅ Railway CLI is already installed"
fi

echo ""
echo "🔐 Authentication Options:"
echo "1. Browser-based login (Recommended)"
echo "2. Token-based login"
read -p "Choose option (1 or 2): " auth_option

if [ "$auth_option" = "1" ]; then
    echo "Opening browser for authentication..."
    railway login
elif [ "$auth_option" = "2" ]; then
    echo "Setting up token-based authentication..."
    export RAILWAY_TOKEN=b041c494-cddf-4382-a719-c1ddf7da8c7a
    railway login
else
    echo "❌ Invalid option. Please run the script again."
    exit 1
fi

echo ""
echo "🔗 Linking to Tradygo project..."
echo "Project ID: eb52c2a2-412b-41fb-b068-c3e0f00640f7"
echo "Please select the Tradygo project from the list:"
railway link

echo ""
echo "✅ Setup complete! You can now use:"
echo "   railway up        - Deploy your changes"
echo "   railway logs      - View application logs"
echo "   railway open      - Open project in browser"
echo "   railway variables - Manage environment variables"
echo ""
echo "🌐 Project URL: https://railway.app/project/eb52c2a2-412b-41fb-b068-c3e0f00640f7"