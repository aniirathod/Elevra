import { Injectable, InternalServerErrorException, Logger, HttpException } from '@nestjs/common';
import { LLMFactory } from './providers/llm.factory';
import { AnalyzeDto } from './dto/analyze.dto';
import { buildAnalyzeOnlyPrompt } from './prompts/analyze.prompt';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly llmFactory: LLMFactory) {}

  async *analyzeStream(dto: AnalyzeDto): AsyncGenerator<string, void, unknown> {
    const provider = this.llmFactory.create();
    const prompt = buildAnalyzeOnlyPrompt(dto.resumeText, dto.jdText);

    this.logger.log('Starting AI Stream Analysis');

    try {
      const stream = provider.stream(prompt);

      for await (const chunk of stream) {
        if (chunk) {
          yield typeof chunk === 'string' ? chunk : JSON.stringify(chunk);
        }
      }
    } catch (error: unknown) {
      this.logger.error('Error in AI Stream', error);
      throw new InternalServerErrorException('Stream generation failed');
    }
  }

  async analyze(dto: AnalyzeDto) {
    const provider = this.llmFactory.create();
    const prompt = buildAnalyzeOnlyPrompt(dto.resumeText, dto.jdText);

    // Ensure raw is a string
    const raw = await provider.generate(prompt);

    try {
      const cleanJson = raw.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson) as object;
    } catch (error: unknown) {
      // Type Narrowing: Check if error is an object and has a status (e.g., nested HttpException)
      if (error instanceof Object && 'status' in error && error instanceof HttpException) {
        throw error;
      }

      this.logger.error('Parsing Error', error);
      throw new InternalServerErrorException('Failed to parse AI response.');
    }
  }
}
