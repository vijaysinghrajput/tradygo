import {
  Controller,
  Get,
  Patch,
  Body,
  Headers,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AppConfigService, PublicConfig, RawConfig } from './app-config.service';

@Controller()
export class AppConfigController {
  constructor(private appConfigService: AppConfigService) {}

  @Get('public/config')
  @SkipThrottle()
  async getPublicConfig(
    @Headers('if-none-match') ifNoneMatch: string,
    @Res() res: Response,
  ): Promise<void> {
    const config = await this.appConfigService.getPublicConfig();
    const etag = this.appConfigService.generateETag(config);

    // Check if client has cached version
    if (ifNoneMatch && ifNoneMatch === etag) {
      res.status(HttpStatus.NOT_MODIFIED).end();
      return;
    }

    // Set cache headers
    res.set({
      'ETag': etag,
      'Cache-Control': 'public, max-age=15',
      'Content-Type': 'application/json',
    });

    res.json(config);
  }

  @Get('admin/config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async getAdminConfig(): Promise<RawConfig> {
    return this.appConfigService.getRawConfig();
  }

  @Patch('admin/config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  async updateAdminConfig(
    @Body() updates: Partial<RawConfig>,
  ): Promise<{ message: string }> {
    await this.appConfigService.updateConfig(updates);
    return { message: 'Configuration updated successfully' };
  }

  @Get('admin/config/bust-cache')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async bustCache(): Promise<{ message: string }> {
    this.appConfigService.bustCache();
    return { message: 'Configuration cache cleared' };
  }
}