export interface LanguageModel {
  /**
   * Generates a complete response for a given prompt.
   * @param prompt The input prompt string.
   * @returns A promise that resolves to the full response text.
   */
  generate(
    prompt: string,
    taskHint?: "structure" | "analysis" | "rewrite"
  ): Promise<string>;

  /**
   * Generates a response as a stream of text chunks.
   * Crucial for the "fast" user experience.
   * @param prompt The input prompt string.
   * @returns An async generator that yields text chunks.
   */
  stream(
    prompt: string,
    taskHint?: "structure" | "analysis" | "rewrite"
  ): AsyncGenerator<string>;
}
