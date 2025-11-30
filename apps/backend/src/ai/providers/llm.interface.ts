export interface LLMProvider {
  generate(prompt: string, taskHint?: 'structure' | 'analysis' | 'rewrite'): Promise<string>;

  stream(prompt: string, taskHint?: 'structure' | 'analysis' | 'rewrite'): AsyncGenerator<string>;
}
