import { LanguageModel } from "./base.provider.js";
import Cerebras from "@cerebras/cerebras_cloud_sdk";

export class CerebrasProvider implements LanguageModel {
  private client: Cerebras;
  private modelName: string;

  constructor() {
    const apiKey = process.env.CEREBRAS_API_KEY;
    if (!apiKey) {
      throw new Error("CEREBRAS_API_KEY is not defined.");
    }
    this.client = new Cerebras({ apiKey, warmTCPConnection: true });
    this.modelName = process.env.CEREBRAS_MODEL_NAME || "llama-3.3-70b";
    console.log(`Using Cerebras provider: model=${this.modelName}`);
  }

  async generate(
    prompt: string,
    taskHint?: "structure" | "analysis" | "rewrite"
  ): Promise<string> {
    try {
      const response = (await this.client.chat.completions.create({
        model: this.modelName,
        messages: [{ role: "user", content: prompt }],
      })) as {
        choices?: { message?: { content?: string } }[];
      };

      const message = response.choices?.[0]?.message?.content;
      if (!message) {
        throw new Error("Cerebras returned no message content.");
      }
      return message;
    } catch (err: any) {
      console.error("CerebrasProvider.generate error:", err);
      throw err;
    }
  }

  async *stream(
    prompt: string,
    taskHint?: "structure" | "analysis" | "rewrite"
  ): AsyncGenerator<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.modelName,
        messages: [{ role: "user", content: prompt }],
        stream: true,
      });

      for await (const chunk of stream as AsyncIterable<any>) {
        const delta = chunk?.choices?.[0]?.delta?.content;
        if (delta) {
          process.stdout.write(delta);
          yield delta;
        }
      }
    } catch (err: any) {
      console.error("CerebrasProvider.stream error:", err);
      yield `[Error streaming: ${err.message}]`;
    }
  }
}
