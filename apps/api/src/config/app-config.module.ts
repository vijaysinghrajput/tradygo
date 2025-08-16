import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AppConfigService } from './app-config.service';
import { AppConfigController } from './app-config.controller';
import { DynamicConfigService } from './config.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [AppConfigService, DynamicConfigService],
  controllers: [AppConfigController],
  exports: [AppConfigService, DynamicConfigService],
})
export class AppConfigModule {}