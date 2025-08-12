import { Controller, Get } from '@nestjs/common';
import { DynamicConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private configService: DynamicConfigService) {}

  @Get('public')
  getPublicConfig() {
    return this.configService.getPublicConfig();
  }

  @Get('branding')
  getBranding() {
    return this.configService.getBranding();
  }

  @Get('demo-credentials')
  getDemoCredentials() {
    return this.configService.getDemoCredentials();
  }

  @Get('redirects')
  getRedirects() {
    return this.configService.getRedirectConfig();
  }
}