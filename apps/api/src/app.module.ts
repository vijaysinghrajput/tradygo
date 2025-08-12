import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// Additional modules will be added as they are implemented
// import { SellersModule } from './sellers/sellers.module';
// import { CatalogModule } from './catalog/catalog.module';
// import { CartModule } from './cart/cart.module';
// import { OrdersModule } from './orders/orders.module';
// import { PaymentsModule } from './payments/payments.module';
// import { MediaModule } from './media/media.module';
// import { WebhooksModule } from './webhooks/webhooks.module';
// import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { AppConfigModule } from './config/app-config.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Caching
    CacheModule.register({
      isGlobal: true,
      ttl: 300, // 5 minutes
      max: 100, // maximum number of items in cache
    }),

    // Queue management
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // Core modules
    AppConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    HealthModule,
    
    // Additional modules will be added as they are implemented
    // SellersModule,
    // CatalogModule,
    // CartModule,
    // OrdersModule,
    // PaymentsModule,
    // MediaModule,
    // WebhooksModule,
    // AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}