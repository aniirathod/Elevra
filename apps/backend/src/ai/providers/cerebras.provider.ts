import { Logger } from '@nestjs/common';
import { LLMProvider } from './llm.interface';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

interface CerebrasChunk {
  choices: Array<{
    delta: {
      content?: string;
    };
  }>;
}

interface CerebrasResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class CerebrusProvider implements LLMProvider {
  private readonly logger = new Logger(CerebrusProvider.name);
  private client: Cerebras;
  private modelName: string;

  constructor(apiKey: string, model: string) {
    this.client = new Cerebras({ apiKey, warmTCPConnection: true });
    this.modelName = model || 'llama-3.3-70b';
    this.logger.log(`Using Cerebras provider: model=${this.modelName}`);
  }

  async generate(prompt: string): Promise<string> {
    try {
      const response = (await this.client.chat.completions.create({
        model: this.modelName,
        messages: [{ role: 'user', content: prompt }],
      })) as {
        choices?: { message?: { content?: string } }[];
      };

      const data = response as unknown as CerebrasResponse;

      const message = data.choices?.[0]?.message?.content;
      if (!message) {
        throw new Error('Cerebras returned no message content.');
      }
      return message;
    } catch (err: unknown) {
      this.logger.error('CerebrasProvider.generate error', err);
      throw err;
    }
  }

  async *stream(prompt: string): AsyncGenerator<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.modelName,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });

      for await (const chunk of stream) {
        const typedChunk = chunk as unknown as CerebrasChunk;

        const delta = typedChunk?.choices?.[0]?.delta?.content;
        if (delta) {
          process.stdout.write(delta);
          yield delta;
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      this.logger.error(`CerebrasProvider.stream error: ${errorMessage}`);

      yield `[Error streaming: ${errorMessage}]`;
    }
  }
}
