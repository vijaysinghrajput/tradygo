# TradyGo Production Deployment Instructions

## 🚀 Automated VPS Deployment

Your TradyGo deployment package is ready! Follow these steps to deploy to your VPS.

### 📦 Files Created

- `tradygo-deploy.tar.gz` - Complete deployment package
- `vps-deploy.sh` - Automated VPS setup script
- `deploy/` - Production configuration files

### 🔧 VPS Setup (Automated)

**Step 1: Upload Files to VPS**

```bash
# Option A: Using SCP (if SSH keys work)
scp tradygo-deploy.tar.gz vps-deploy.sh root@195.35.21.175:/root/

# Option B: Manual upload via VPS file manager
# Upload both files to /root/ directory
```

**Step 2: Execute Deployment Script on VPS**

```bash
# SSH into your VPS
ssh root@195.35.21.175

# Run the automated deployment script
chmod +x vps-deploy.sh
./vps-deploy.sh
```

**Step 3: Upload Source Code**

```bash
# Extract deployment package
cd /opt/tradygo
tar -xzf /root/tradygo-deploy.tar.gz --strip-components=1

# Build and start services
docker compose build --no-cache
docker compose up -d
```

### 🌐 DNS Configuration

**Point these domains to your VPS IP (195.35.21.175):**

- `admin.tradygo.in` → `195.35.21.175`
- `api.tradygo.in` → `195.35.21.175`

### ✅ Verification

**Check deployment status:**

```bash
# Check containers
docker compose ps

# Check logs
docker compose logs -f

# Test services
curl http://localhost:3001/health
curl http://localhost:3000
```

### 🎯 Access URLs

**After DNS propagation:**

- **Admin Panel:** https://admin.tradygo.in
- **API:** https://api.tradygo.in

### 🔐 Default Credentials

**Admin Login:**
- Email: `admin@tradygo.in`
- Password: `Admin@12345!`

### 🛠️ Manual Deployment (Alternative)

If automated script fails, follow these manual steps:

**1. Install Dependencies**
```bash
apt update && apt upgrade -y
apt install -y docker.io docker-compose-plugin
systemctl start docker && systemctl enable docker
```

**2. Create Deployment Directory**
```bash
mkdir -p /opt/tradygo
cd /opt/tradygo
```

**3. Copy Configuration Files**
```bash
# Copy from deploy/ directory
cp -r /path/to/deploy/* .
```

**4. Build and Start**
```bash
docker compose build --no-cache
docker compose up -d
```

### 🔍 Troubleshooting

**Common Issues:**

1. **Docker build fails:**
   ```bash
   docker system prune -a
   docker compose build --no-cache
   ```

2. **Services won't start:**
   ```bash
   docker compose logs api
   docker compose logs admin
   docker compose logs db
   ```

3. **Database connection issues:**
   ```bash
   docker compose exec db psql -U trg_app -d trgdb
   ```

4. **SSL certificate issues:**
   ```bash
   docker compose logs caddy
   ```

### 📊 Monitoring

**Check system resources:**
```bash
docker stats
df -h
free -h
```

**View application logs:**
```bash
docker compose logs -f api
docker compose logs -f admin
```

### 🔄 Updates

**To update the application:**
```bash
cd /opt/tradygo
git pull origin main  # if using git
docker compose build --no-cache
docker compose up -d
```

### 🆘 Support

**If you encounter issues:**

1. Check container logs: `docker compose logs`
2. Verify DNS settings
3. Ensure firewall allows ports 80, 443
4. Check VPS provider security groups

---

## 🎉 Deployment Complete!

Your TradyGo platform should now be running in production with:

- ✅ HTTPS auto-certificates via Caddy
- ✅ PostgreSQL database
- ✅ NestJS API backend
- ✅ Next.js admin frontend
- ✅ Production-ready configuration
- ✅ Automatic restarts
- ✅ Secure environment variables

**Access your admin panel at: https://admin.tradygo.in**