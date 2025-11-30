import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { LLMFactory } from './providers/llm.factory';
import { RateLimitGuard } from './guards/rate-limit.guard';

@Module({
  controllers: [AiController],
  providers: [AiService, LLMFactory, RateLimitGuard],
})
export class AiModule {}
