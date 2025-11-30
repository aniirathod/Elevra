import { Injectable } from '@nestjs/common';
import { LLMProvider } from './llm.interface';
import { CerebrusProvider } from './cerebras.provider';

@Injectable()
export class LLMFactory {
  create(): LLMProvider {
    const provider = process.env.LLM_PROVIDER; // "openai" | "gemini" | "cerebrus"
    const apiKey = process.env.LLM_API_KEY;
    const model = process.env.LLM_MODEL;

    switch (provider) {
      case 'cerebras':
        if (!apiKey || !model) {
          throw new Error(
            'LLM_API_KEY and LLM_MODEL environment variables must be set for cerebrus provider'
          );
        }
        return new CerebrusProvider(apiKey, model);

      default:
        throw new Error(`Unknown LLM provider: ${provider}`);
    }
  }
}
