import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamicConfigService } from './config.service';
import { ConfigController } from './config.controller';

@Module({
  imports: [ConfigModule],
  providers: [DynamicConfigService],
  controllers: [ConfigController],
  exports: [DynamicConfigService],
})
export class DynamicConfigModule {}