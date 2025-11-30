import { Controller, Post, Body, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AiService } from './ai.service';
import { AnalyzeDto } from './dto/analyze.dto';
import { RateLimitGuard } from './guards/rate-limit.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(RateLimitGuard)
  @Post('analyze')
  async analyzeStream(@Body() dto: AnalyzeDto, @Res() res: Response) {
    // 1. Set Headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
      // 2. Call the service which returns a Generator
      const streamGenerator = this.aiService.analyzeStream(dto);

      // 3. Iterate over the stream and write to response
      for await (const chunk of streamGenerator) {
        // Format as SSE data
        const payload = JSON.stringify({ text: chunk });
        res.write(`data: ${payload}\n\n`);
      }

      // 4. Signal completion
      res.write('event: end\ndata: {}\n\n');
      res.end();
    } catch (error) {
      console.error('Streaming Error:', error);

      // Handle error during stream
      // If headers aren't sent (unlikely here due to flushHeaders), send 500
      // If streaming started, send a specific error event
      if (!res.writableEnded) {
        res.write(
          `event: error\ndata: ${JSON.stringify({ message: 'Error during AI analysis.' })}\n\n`
        );
        res.end();
      }
    }
  }
}
