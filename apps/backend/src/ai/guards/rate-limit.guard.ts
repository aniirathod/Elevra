import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import { Request, Response } from 'express'; // Fix: Import Express types

@Injectable()
export class RateLimitGuard implements CanActivate {
  private limiter: RateLimiterMemory;

  constructor() {
    this.limiter = new RateLimiterMemory({
      points: 10,
      duration: 60,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const key = request.ip ?? 'unknown';

    try {
      await this.limiter.consume(key);
      return true;
    } catch (rateLimiterRes: unknown) {
      if (rateLimiterRes instanceof RateLimiterRes) {
        const retrySecs = Math.ceil(rateLimiterRes.msBeforeNext / 1000);

        response.header('Retry-After', String(retrySecs));
      }

      throw new HttpException('Too many AI requests. Please wait.', HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}
