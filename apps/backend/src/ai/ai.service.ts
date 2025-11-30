import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { LLMFactory } from './providers/llm.factory';
import { AnalyzeDto } from './dto/analyze.dto';
import { buildAnalyzeOnlyPrompt } from './prompts/analyze.prompt';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  constructor(private readonly llmFactory: LLMFactory) {}

  /**
   * Streams the analysis response chunk by chunk
   */
  async *analyzeStream(dto: AnalyzeDto): AsyncGenerator<string> {
    const provider = this.llmFactory.create();
    const prompt = buildAnalyzeOnlyPrompt(dto.resumeText, dto.jdText);

    this.logger.log('Starting AI Stream Analysis');

    try {
      const stream = provider.stream(prompt);

      for await (const chunk of stream) {
        if (chunk) {
          yield chunk;
        }
      }
    } catch (error) {
      this.logger.error('Error in AI Stream', error);
      throw new InternalServerErrorException('Stream generation failed');
    }
  }

  async analyze(dto: AnalyzeDto) {
    const provider = this.llmFactory.create();
    const prompt = buildAnalyzeOnlyPrompt(dto.resumeText, dto.jdText);
    const raw = await provider.generate(prompt);

    try {
      const cleanJson = raw.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      if (error.status) throw error;
      throw new InternalServerErrorException('Failed to parse AI response.');
    }
  }
}
