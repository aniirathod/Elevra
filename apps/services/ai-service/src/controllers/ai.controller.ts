import { Request, Response } from "express";
import { getLanguageModel } from "../providers/index.js";
import { createAnalysisPrompt } from "../prompts/analysis.js";
import { createStructurePrompt } from "../prompts/structure.js";
import { createRewritePrompt } from "../prompts/rewrite.js";
import cleanAIResponse from "../util/cleanAIResponse.js";

/**
 * Analyzes structured resume JSON against JD text, streaming the result.
 */
export const analyzeStructuredResume = async (req: Request, res: Response) => {
  try {
    const { resumeText, jdText } = req.body;
    if (!resumeText || !jdText)
      return res
        .status(400)
        .json({ message: "resumeJson and jdText are required." });

    console.log("AI Service: Received request to analyze structured resume.");
    // Convert JSON object to string for the prompt
    const resumeTextForPrompt = JSON.stringify(resumeText, null, 2);
    const jobTextForPrompt = JSON.stringify(jdText, null, 2);

    const model = getLanguageModel();
    const prompt = createAnalysisPrompt(resumeTextForPrompt, jobTextForPrompt);

    // Stream the analysis response using Server-Sent Events (SSE)
    const stream = model.stream(prompt, "analysis");

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // Send headers immediately

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    res.write("event: end\ndata: {}\n\n"); // Signal end
    res.end();
    console.log("AI Service: Analysis stream finished.");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    if (!res.writableEnded) {
      res
        .status(500)
        .write(
          `event: error\ndata: ${JSON.stringify({ message: "Error during AI analysis." })}\n\n`
        );
      res.end();
    } else if (!res.headersSent) {
      res.status(500).json({ message: "Error during AI analysis." });
    }
  }
};
/**
 * Structures raw resume text into JSON using AI.
 */
export const structureResume = async (req: Request, res: Response) => {
  try {
    const { rawText } = req.body;

    if (!rawText || typeof rawText !== "string" || rawText.trim().length < 50) {
      return res
        .status(400)
        .json({ message: "Invalid or missing resume text." });
    }

    console.log("AI Service: Received request to structure resume.");

    const model = getLanguageModel();
    const prompt = createStructurePrompt(rawText);

    const aiResponse = await Promise.race([
      model.generate(prompt, "structure"),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI Timeout")), 20000)
      ),
    ]);

    const cleanedResponse = cleanAIResponse(aiResponse as string);
    let structuredData;

    try {
      structuredData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("❌ JSON parse failed:", cleanedResponse);
      return res.status(500).json({
        message: "AI did not return valid JSON.",
        raw: cleanedResponse.slice(0, 200),
      });
    }

    console.log("✅ Resume structured successfully.");
    res.status(200).json(structuredData);
  } catch (error) {
    console.error("AI Structure Error:", error);
    res.status(500).json({ message: "Error during AI structuring." });
  }
};

/**
 * Rewrites a single bullet point using AI.
 */
export const rewriteBulletPoint = async (req: Request, res: Response) => {
  try {
    const { bulletText, jobContext } = req.body;
    if (!bulletText)
      return res.status(400).json({ message: "bulletText is required." });

    console.log("AI Service: Received request to rewrite bullet point.");
    const model = getLanguageModel();
    const prompt = createRewritePrompt(bulletText, jobContext);

    // Use generate for rewrite suggestions
    const jsonStringResponse = await model.generate(prompt, "rewrite");

    const cleanResponse = cleanAIResponse(jsonStringResponse);

    try {
      const suggestions = JSON.parse(cleanResponse);
      if (!Array.isArray(suggestions))
        throw new Error("AI response was not a JSON array.");
      console.log("AI Service: Rewrite successful.");
      res.status(200).json({ suggestions });
    } catch (parseError) {
      console.error(
        "AI Service: Failed to parse rewrite response as JSON:",
        jsonStringResponse
      );
      res.status(500).json({
        message: "AI failed to return valid JSON suggestions.",
        rawResponse: jsonStringResponse,
      });
    }
  } catch (error) {
    console.error("AI Rewrite Error:", error);
    res.status(500).json({ message: "Error during AI rewrite." });
  }
};
