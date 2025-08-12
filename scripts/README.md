# TradyGo Deployment Scripts

This directory contains all the scripts needed to deploy the TradyGo platform to your VPS.

## 📁 Scripts Overview

### 🚀 `deploy.sh` - Main Deployment Script
**Usage**: `./scripts/deploy.sh`
- **Purpose**: Entry point for deployment
- **What it does**: Runs pre-checks and executes the main deployment
- **Requirements**: Must be run from monorepo root

### 🔧 `deploy-prod.sh` - Production Deployment Engine
**Usage**: Called automatically by `deploy.sh`
- **Purpose**: Full VPS setup and application deployment
- **What it does**:
  - Sets up VPS with Docker, Caddy, PostgreSQL
  - Deploys API and Admin applications
  - Configures automatic HTTPS
  - Sets up security and monitoring

### 🔍 `status.sh` - Health Check Script
**Usage**: `./scripts/status.sh`
- **Purpose**: Check deployed services health and status
- **What it shows**:
  - Container status
  - Service health
  - System resources
  - Network connectivity
  - SSL certificates

## 🚀 Quick Start

### 1. First Time Setup
```bash
# Make sure you're in the monorepo root
cd /path/to/tradygo

# Make scripts executable (if not already done)
chmod +x scripts/*.sh

# Update configuration in deploy-prod.sh
nano scripts/deploy-prod.sh
```

### 2. Deploy
```bash
# Run the deployment
./scripts/deploy.sh
```

### 3. Check Status
```bash
# Check service health
./scripts/status.sh
```

## ⚙️ Configuration

### Required Updates in `deploy-prod.sh`
```bash
# Server details
SERVER_IP="195.35.21.175"        # Your VPS IP
ROOT_USER="root"                  # SSH user
ROOT_PASS="your-password"         # SSH password

# Domain configuration
ADMIN_DOMAIN="admin.tradygo.in"   # Your admin domain
API_DOMAIN="api.tradygo.in"       # Your API domain
ACME_EMAIL="admin@tradygo.in"     # Email for SSL certificates
```

### Environment Template
Use `scripts/env.template` as a starting point for custom environment variables.

## 🔍 What Gets Deployed

### Infrastructure
- **Docker**: Container runtime
- **Caddy**: Reverse proxy with automatic HTTPS
- **PostgreSQL 16**: Database
- **UFW**: Firewall configuration

### Applications
- **API**: NestJS backend with Prisma ORM
- **Admin Panel**: Next.js admin interface

### Security Features
- Automatic SSL certificate generation
- Firewall with minimal open ports
- Container isolation
- Health monitoring

## 📊 Monitoring

### View Logs
```bash
# All services
ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose logs -f'

# Specific service
ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose logs -f api'
```

### Check Status
```bash
# Service status
ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose ps'

# Health checks
ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose exec db pg_isready -U trg_app -d trgdb'
```

## 🔄 Updates

### Redeploy
```bash
# Run the deployment script again
./scripts/deploy.sh
```

### Restart Services
```bash
ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose restart'
```

## 🚨 Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Check server IP and credentials
   - Verify SSH key setup

2. **Port Already in Use**
   - Check what's using the port: `netstat -tulpn | grep :80`
   - Stop conflicting services

3. **Container Won't Start**
   - Check logs: `docker compose logs container-name`
   - Verify environment variables

4. **SSL Certificate Issues**
   - Ensure DNS is pointing to your server
   - Check Caddy logs for ACME errors

### Debug Commands
```bash
# Check all container logs
./scripts/status.sh

# Test database connection
ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose exec db psql -U trg_app -d trgdb'

# Check system resources
ssh root@your-server-ip 'htop'
```

## 📚 Documentation

- **`DEPLOYMENT.md`**: Comprehensive deployment guide
- **`env.template`**: Environment variable template
- **This README**: Script usage and quick reference

## 🔐 Security Notes

- Scripts use SSH keys for secure communication
- Environment files contain sensitive data
- Firewall restricts access to necessary ports only
- SSL certificates are automatically managed

## 🆘 Support

If you encounter issues:
1. Check the logs using `./scripts/status.sh`
2. Review the `DEPLOYMENT.md` guide
3. Verify your configuration in `deploy-prod.sh`
4. Check server connectivity and SSH setup

---

**Remember**: Always test in a staging environment first and ensure you have proper backups before deploying to production.



