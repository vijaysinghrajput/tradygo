import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AppConfigService } from './app-config.service';
import { AppConfigController } from './app-config.controller';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [AppConfigService],
  controllers: [AppConfigController],
  exports: [AppConfigService],
})
export class AppConfigModule {}