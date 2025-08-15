import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppConfigService } from './app-config.service';

@ApiTags('config')
@Controller('public/config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get public application configuration' })
  @ApiResponse({ status: 200, description: 'Configuration retrieved successfully' })
  async getPublicConfig() {
    return this.appConfigService.getPublicConfig();
  }
}