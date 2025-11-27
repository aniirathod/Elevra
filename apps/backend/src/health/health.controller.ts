import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  uptime: number;
  environment: string;
  db?: string;
  message?: string;
}

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check(): Promise<HealthResponse> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'elevra-backend-service',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        db: 'connected',
      };
    } catch (err) {
      return {
        status: 'error',
        message: `Database connection failed ${err}`,
        timestamp: new Date().toISOString(),
        service: 'elevra-backend',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        db: 'disconnected',
      };
    }
  }
}
