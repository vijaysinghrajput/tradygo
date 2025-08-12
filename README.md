# TradyGo - Multi-Vendor E-commerce Platform

[![Deploy TradyGo Platform](https://github.com/tradygo/platform/actions/workflows/deploy.yml/badge.svg)](https://github.com/tradygo/platform/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TradyGo is a comprehensive multi-vendor e-commerce platform built with modern technologies, designed for scalability, performance, and ease of use.

## 🚀 Features

### Core Features
- **Multi-vendor marketplace** with seller onboarding and management
- **Advanced product catalog** with variants, categories, and inventory management
- **Secure payment processing** with Razorpay and Stripe integration
- **Order management** with real-time tracking and notifications
- **User authentication** with JWT, OTP, and social login
- **Admin dashboard** for platform management
- **Seller portal** for vendor management
- **Mobile-responsive** customer storefront

### Technical Features
- **Microservices architecture** with Docker containerization
- **Real-time notifications** with WebSocket support
- **File storage** with MinIO/S3 integration
- **Search functionality** with full-text search
- **API-first design** with comprehensive REST API
- **Automated deployments** with CI/CD pipeline
- **Monitoring and logging** with Uptime Kuma
- **SSL/TLS encryption** with automatic certificate management

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js 20+ with NestJS framework
- PostgreSQL 16 with Prisma ORM
- Redis for caching and sessions
- TypeScript for type safety

**Frontend:**
- Next.js 14 with React 18
- Tailwind CSS for styling
- TypeScript for type safety
- Responsive design with mobile-first approach

**Infrastructure:**
- Docker & Docker Compose
- Nginx as reverse proxy
- MinIO for object storage
- GitHub Actions for CI/CD
- Ubuntu 24.04 LTS for production

**Monitoring & Security:**
- Uptime Kuma for monitoring
- SSL/TLS with Let's Encrypt
- Rate limiting and security headers
- Automated backups

### Project Structure

```
tradygo/
├── apps/
│   ├── api/              # NestJS API server
│   ├── web/              # Customer storefront (Next.js)
│   ├── admin/            # Admin dashboard (Next.js)
│   └── seller/           # Seller portal (Next.js)
├── packages/
│   ├── config/           # Shared configuration
│   └── ui/               # Shared UI components
├── nginx/                # Nginx configuration
├── scripts/              # Deployment and utility scripts
├── env/                  # Environment configurations
└── docker-compose.yml    # Production Docker setup
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 16 (for local development)
- Redis 7+

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vijaysinghrajput/tradygo.git
   cd tradygo
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start development services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Set up environment variables:**
   ```bash
   cp apps/api/.env.example apps/api/.env
   # Edit .env with your configuration
   ```

5. **Run database migrations:**
   ```bash
   cd apps/api
   pnpm prisma:migrate:dev
   pnpm prisma:seed
   ```

6. **Start development servers:**
   ```bash
   # API server
   pnpm dev:api
   
   # Web applications (in separate terminals)
   pnpm dev:web
   pnpm dev:admin
   pnpm dev:seller
   ```

### Access Applications

- **API Documentation:** http://localhost:3001/api/docs
- **Customer Store:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3002
- **Seller Portal:** http://localhost:3003
- **MailHog (Email Testing):** http://localhost:8025
- **MinIO Console:** http://localhost:9001

## 🌐 Railway Deployment

### Quick Railway Deploy

This project is optimized for deployment on Railway:

1. **Fork this repository**
   - Fork the repository to your GitHub account

2. **Connect to Railway:**
   - Sign up at [Railway](https://railway.app)
   - Connect your GitHub account
   - Create a new project from your forked repository

3. **Add PostgreSQL database:**
   - Add a PostgreSQL service to your Railway project
   - Note the database connection details

4. **Deploy services separately:**
   Deploy each service as a separate Railway service:
   - API Server (`apps/api`)
   - Admin Dashboard (`apps/admin`)
   - Seller Portal (`apps/seller`)
   - Customer Web (`apps/web`)

5. **Configure environment variables:**
   Set up the required environment variables for each service

### Environment Configuration

Key environment variables for Railway deployment:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` - Payment gateway
- `STRIPE_SECRET_KEY` - Stripe payment processing
- `EMAIL_*` - Email service configuration
- `CLOUDINARY_*` - File storage credentials

For detailed deployment instructions, see [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md).

## 📊 Monitoring

### Health Checks

All services include health check endpoints:
- API: `https://api.tradygo.in/api/v1/health/healthz`
- Web: `https://www.tradygo.in/api/health`
- Admin: `https://admin.tradygo.in/api/health`
- Seller: `https://seller.tradygo.in/api/health`

### Uptime Monitoring

Access the monitoring dashboard at: `https://monitor.tradygo.in`

### Logs

Application logs are stored in `/srv/tradygo/logs/` and rotated daily.

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in development
pnpm dev:api          # Start API server only
pnpm dev:web          # Start web app only
pnpm dev:admin        # Start admin app only
pnpm dev:seller       # Start seller app only

# Building
pnpm build            # Build all applications
pnpm build:api        # Build API only
pnpm build:web        # Build web app only

# Testing
pnpm test             # Run all tests
pnpm test:api         # Run API tests only
pnpm lint             # Lint all code
pnpm type-check       # Type check all code

# Database
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run migrations
pnpm prisma:seed      # Seed database
pnpm prisma:studio    # Open Prisma Studio

# Docker
pnpm docker:build     # Build all Docker images
pnpm docker:dev       # Start development environment
pnpm docker:prod      # Start production environment
```

### API Documentation

The API is documented using OpenAPI/Swagger. Access the interactive documentation at:
- Development: http://localhost:3001/api/docs
- Production: https://api.tradygo.in/api/docs

## 🔐 Security

### Security Features

- **Authentication:** JWT tokens with refresh mechanism
- **Authorization:** Role-based access control (RBAC)
- **Rate Limiting:** API and authentication endpoints
- **CORS:** Configured for specific origins
- **HTTPS:** SSL/TLS encryption with HSTS
- **Security Headers:** XSS protection, content type sniffing prevention
- **Input Validation:** Comprehensive request validation
- **SQL Injection Prevention:** Prisma ORM with parameterized queries

### Security Best Practices

- Regular security updates
- Environment variable management
- Secrets rotation
- Database backups
- Access logging
- Fail2ban for intrusion prevention

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

The platform includes a comprehensive CI/CD pipeline:

1. **Testing:** Automated tests, linting, and type checking
2. **Building:** Multi-platform Docker image builds
3. **Security:** Vulnerability scanning with Trivy
4. **Deployment:** Automated deployment to staging and production
5. **Monitoring:** Deployment notifications and health checks

### Deployment Environments

- **Development:** Local development with hot reload
- **Staging:** Pre-production testing environment
- **Production:** Live production environment

## 📱 Mobile App

### React Native Setup

The mobile app is built with React Native and Expo:

```bash
cd apps/mobile
npm install
npx expo start
```

### Features

- Cross-platform (iOS & Android)
- Push notifications
- Offline support
- Biometric authentication
- Deep linking
- App store deployment ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commit messages
- Ensure all CI checks pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- [API Documentation](https://api.tradygo.in/api/docs)
- [Development Guide](docs/development.md)
- [Deployment Guide](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)

### Community

- [GitHub Issues](https://github.com/tradygo/platform/issues)
- [Discussions](https://github.com/tradygo/platform/discussions)
- [Discord Community](https://discord.gg/tradygo)

### Commercial Support

For commercial support, custom development, or enterprise features, contact us at:
- Email: support@tradygo.in
- Website: https://tradygo.in

---

**Built with ❤️ by the TradyGo Team**