import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // CORS
  const corsOrigins = configService.get('CORS_ORIGINS', '').split(',').filter(Boolean);
  const defaultOrigins = [
    'https://admin.tradygo.in',
    'https://seller.tradygo.in', 
    'https://tradygo.in',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ];
  
  app.enableCors({
    origin: corsOrigins.length > 0 ? [
      ...corsOrigins,
      /\.vercel\.app$/ // Vercel preview deployments
    ] : [
      ...defaultOrigins,
      /\.vercel\.app$/ // Vercel preview deployments
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Trust proxy (express) in dev so cookies and IPs work correctly behind proxies
  try {
    const httpAdapter = app.getHttpAdapter();
    const instance: any = httpAdapter.getInstance?.();
    if (instance?.set) {
      instance.set('trust proxy', 1);
    }
  } catch {}

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('TradyGo API')
      .setDescription('Multi-vendor e-commerce platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .addTag('sellers', 'Seller management')
      .addTag('catalog', 'Product catalog')
      .addTag('cart', 'Shopping cart')
      .addTag('orders', 'Order management')
      .addTag('payments', 'Payment processing')
      .addTag('media', 'File uploads')
      .addTag('admin', 'Admin endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const port = configService.get('PORT') || 3001;
  const host = '0.0.0.0'; // Required for Railway deployment
  await app.listen(port, host);
  
  console.log(`🚀 TradyGo API is running on: http://${host}:${port}`);
  console.log(`📚 API Documentation: http://${host}:${port}/api/docs`);
  console.log(`🌐 Environment: ${configService.get('NODE_ENV', 'development')}`);
  console.log(`🔗 CORS Origins: ${corsOrigins.join(', ') || 'localhost defaults'}`);
  console.log(`💾 Database: ${configService.get('DATABASE_URL') ? 'Connected' : 'Not configured'}`);
  console.log(`🔐 JWT Secret: ${configService.get('JWT_ACCESS_SECRET') ? 'Configured' : 'Missing'}`);
}

bootstrap();