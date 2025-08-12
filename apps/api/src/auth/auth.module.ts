import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { PrismaService } from '../prisma/prisma.service';
import { DynamicConfigModule } from '../config/config.module';

@Module({
  imports: [
    DynamicConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TTL', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ([
        {
          name: 'short',
          ttl: 1000, // 1 second
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000, // 10 seconds
          limit: 20,
        },
        {
          name: 'long',
          ttl: 60000, // 1 minute
          limit: 100,
        },
        {
          name: 'login',
          ttl: 60000, // 1 minute
          limit: 5, // 5 login attempts per minute
        },
      ]),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, PrismaService],
  exports: [AuthService, JwtStrategy, RolesGuard],
})
export class AuthModule {}