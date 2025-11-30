import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

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
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const key = request.ip || 'unknown';

    try {
      await this.limiter.consume(key);
      return true;
    } catch (rateLimiterRes) {
      if (rateLimiterRes instanceof RateLimiterRes) {
        const retrySecs = Math.ceil(rateLimiterRes.msBeforeNext / 1000);
        response.header('Retry-After', retrySecs);
      }

      // ❌ REMOVE: throw new TooManyRequestsException(...)
      // ✅ ADD THIS:
      throw new HttpException('Too many AI requests. Please wait.', HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}
