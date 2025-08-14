import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { QueueService } from './queue.service';
import { AnalyticsService } from './analytics.service';
import { SettingsService } from './settings.service';
import { OnboardingService } from './onboarding.service';
import { FileUploadService } from './file-upload.service';
import { VendorAdminController } from './vendor_admin.controller';
import { QueueController } from './queue.controller';
import { AnalyticsController } from './analytics.controller';
import { SettingsController } from './settings.controller';
import { OnboardingController } from './onboarding.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    VendorAdminController,
    QueueController,
    AnalyticsController,
    SettingsController,
    OnboardingController,
  ],
  providers: [
    VendorService,
    QueueService,
    AnalyticsService,
    SettingsService,
    OnboardingService,
    FileUploadService,
  ],
  exports: [
    VendorService,
    QueueService,
    AnalyticsService,
    SettingsService,
    OnboardingService,
    FileUploadService,
  ],
})
export class VendorModule {}


