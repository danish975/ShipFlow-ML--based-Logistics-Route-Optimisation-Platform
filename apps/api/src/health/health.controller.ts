import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  // Both paths are excluded from the global 'api/v1' prefix in main.ts.
  @Get(['/', 'api/health'])
  @ApiOperation({ summary: 'API health check' })
  check() {
    return {
      success: true,
      message: 'ShipFlow API is running successfully!',
      status: 'healthy',
      service: 'ShipFlow Backend',
      timestamp: new Date().toISOString(),
    };
  }
}
