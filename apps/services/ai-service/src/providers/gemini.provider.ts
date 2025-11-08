import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { LanguageModel } from "./base.provider.js";

export class GeminiProvider implements LanguageModel {
  private generativeAI: GoogleGenerativeAI;
  private models: Record<"analysis" | "rewrite" | "structure", GenerativeModel>;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("❌ Missing GEMINI_API_KEY in environment.");

    this.generativeAI = new GoogleGenerativeAI(apiKey);

    // Pre-initialize models for faster repeated use
    const analysisModelName =
      process.env.AI_ANALYSIS_MODEL || "gemini-2.0-flash";
    const rewriteModelName =
      process.env.AI_REWRITE_MODEL || "gemini-1.5-flash-latest";
    const structureModelName =
      process.env.AI_STRUCTURE_MODEL || "gemini-2.0-flash";

    this.models = {
      analysis: this.generativeAI.getGenerativeModel({
        model: analysisModelName,
      }),
      rewrite: this.generativeAI.getGenerativeModel({
        model: rewriteModelName,
      }),
      structure: this.generativeAI.getGenerativeModel({
        model: structureModelName,
      }),
    };

    console.log(`🚀 Gemini initialized with models:
      • Analysis: ${analysisModelName}
      • Rewrite: ${rewriteModelName}`);
  }

  /** Non-streaming (synchronous) response */
  async generate(
    prompt: string,
    taskHint: "analysis" | "rewrite" | "structure"
  ): Promise<string> {
    try {
      const result = await this.models[taskHint].generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error(`Gemini generate error [${taskHint}]:`, err);
      throw new Error("Gemini generation failed.");
    }
  }

  /** Streaming response (for SSE) */
  async *stream(
    prompt: string,
    taskHint: "analysis" | "rewrite" = "analysis"
  ): AsyncGenerator<string> {
    try {
      const streamResult =
        await this.models[taskHint].generateContentStream(prompt);
      for await (const chunk of streamResult.stream) {
        const text = chunk.text?.() || "";
        if (text.trim()) yield text;
      }
    } catch (err) {
      console.error(`Gemini stream error [${taskHint}]:`, err);
      yield "[Stream Error: Gemini processing failed]";
    }
  }
}
