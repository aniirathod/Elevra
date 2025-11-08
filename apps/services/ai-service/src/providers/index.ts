import { LanguageModel } from "./base.provider.js";
import { CerebrasProvider } from "./cerebras.provider.js";
import { GeminiProvider } from "./gemini.provider.js";

let instance: LanguageModel | null = null;

/**
 * Factory function to get the configured language model provider.
 * Uses Singleton pattern to ensure only one instance is created.
 * @returns The singleton instance of the configured LanguageModel provider.
 */
export function getLanguageModel(): LanguageModel {
  if (instance) {
    return instance;
  }

  const providerType = process.env.AI_PROVIDER?.toLowerCase() || "gemini";

  console.log(`Initializing AI Provider: ${providerType}`);

  switch (providerType) {
    case "gemini":
      instance = new GeminiProvider();
      break;
    case "cerebras":
      instance = new CerebrasProvider();
      break;
    default:
      throw new Error(`Unsupported AI_PROVIDER configured: ${providerType}`);
  }

  return instance;
}
