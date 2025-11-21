import { Controller, Get } from '@nestjs/common';

interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  uptime: number;
  environment: string;
}

@Controller('health')
export class HealthController {
  @Get()
  check(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'elevra-backend',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
