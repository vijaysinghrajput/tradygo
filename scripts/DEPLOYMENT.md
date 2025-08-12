# TradyGo Production Deployment Guide

This guide explains how to deploy the TradyGo platform to your VPS using Docker, Caddy, and PostgreSQL.

## 🚀 Quick Start

### 1. Prerequisites

- **Local Machine**: macOS or Linux with Docker and pnpm installed
- **VPS**: Ubuntu 20.04+ with root access
- **Domain**: Pointed to your VPS IP address
- **SSH Access**: Root password for initial setup

### 2. One-Command Deployment

```bash
# From the monorepo root directory
./scripts/deploy.sh
```

This will:
- Set up your VPS with Docker, Caddy, and PostgreSQL
- Deploy the API and Admin applications
- Configure automatic HTTPS with Let's Encrypt
- Set up proper networking and security

## 📋 What Gets Deployed

### Services
- **PostgreSQL 16**: Database with automatic backups
- **API**: NestJS backend with Prisma ORM
- **Admin Panel**: Next.js admin interface
- **Caddy**: Reverse proxy with automatic HTTPS

### Infrastructure
- **Docker Compose**: Multi-container orchestration
- **Network Security**: UFW firewall configuration
- **SSL Certificates**: Automatic Let's Encrypt setup
- **Health Checks**: Container monitoring and restart

## 🔧 Configuration

### Environment Variables

The deployment script automatically generates:
- **Database**: Random secure password
- **JWT Secrets**: Cryptographically secure tokens
- **CORS**: Proper domain configuration
- **Ports**: Standard production ports

### Domains

Update these in `scripts/deploy-prod.sh`:
```bash
ADMIN_DOMAIN="admin.tradygo.in"
API_DOMAIN="api.tradygo.in"
ACME_EMAIL="admin@tradygo.in"
```

### Server Details

Update these in `scripts/deploy-prod.sh`:
```bash
SERVER_IP="195.35.21.175"
ROOT_USER="root"
ROOT_PASS="your-root-password"
```

## 🐳 Docker Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Caddy (80/443)│    │   Admin (3000)  │    │    API (3001)   │
│   Reverse Proxy │────│   Next.js App   │────│   NestJS App    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                └───────────────────────┘
                                                │
                                        ┌─────────────────┐
                                        │  PostgreSQL 16  │
                                        │   Database      │
                                        └─────────────────┘
```

## 📁 File Structure

After deployment, your server will have:
```
/opt/tradygo/
├── compose/           # Docker Compose files
│   ├── docker-compose.yml
│   ├── Dockerfile.api
│   ├── Dockerfile.admin
│   └── Caddyfile
├── env/              # Environment files
│   ├── api.env
│   └── admin.env
├── repo/             # Your monorepo code
├── logs/             # Application logs
├── backups/          # Database backups
└── logs/             # System logs
```

## 🔍 Monitoring & Maintenance

### View Logs
```bash
# All services
ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose logs -f'

# Specific service
ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose logs -f api'
```

### Restart Services
```bash
ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose restart'
```

### Update Deployment
```bash
# Run the deployment script again
./scripts/deploy.sh
```

### Database Backup
```bash
ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose exec db pg_dump -U trg_app trgdb > backup.sql'
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   ssh root@your-server-ip 'netstat -tulpn | grep :80'
   ```

2. **Container Won't Start**
   ```bash
   # Check container logs
   ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose logs container-name'
   ```

3. **Database Connection Issues**
   ```bash
   # Test database connection
   ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose exec db psql -U trg_app -d trgdb'
   ```

### Health Checks

The deployment includes health checks for all services:
- **Database**: PostgreSQL readiness check
- **API**: HTTP health endpoint
- **Admin**: HTTP response check
- **Caddy**: Port availability

## 🔐 Security Features

- **Firewall**: UFW with minimal open ports (22, 80, 443)
- **HTTPS**: Automatic SSL certificate generation
- **Container Isolation**: Docker network isolation
- **Secret Management**: Environment-based configuration
- **Health Monitoring**: Automatic service restart on failure

## 📊 Performance

- **Compression**: Gzip and Zstd compression enabled
- **Caching**: Static asset optimization
- **Load Balancing**: Ready for horizontal scaling
- **Database**: Optimized PostgreSQL configuration

## 🔄 Updates & Rollbacks

### Update Process
1. Run `./scripts/deploy.sh` again
2. Script handles graceful shutdown and restart
3. New containers built and deployed
4. Health checks verify deployment

### Rollback
```bash
# Stop current deployment
ssh root@your-server-ip 'cd /opt/tradygo/compose && docker compose down'

# Restore from backup (if available)
# Re-run deployment script
```

## 📞 Support

If you encounter issues:
1. Check the logs: `docker compose logs -f`
2. Verify network connectivity
3. Check firewall settings
4. Ensure DNS is properly configured

## 🎯 Next Steps

After successful deployment:
1. **Configure DNS**: Point domains to your VPS IP
2. **Test Services**: Verify all endpoints are working
3. **Set Up Monitoring**: Configure alerts and notifications
4. **Create Admin User**: Set up initial platform configuration
5. **Upload Content**: Add products, categories, and media

---

**Note**: This deployment script is designed for production use. Always test in a staging environment first and ensure you have proper backups before deploying to production.
