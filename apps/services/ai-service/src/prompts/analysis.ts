export const createAnalysisPrompt = (
  structuredResumeText: string,
  jdText: string
): string => {
  // Same prompt asking for analysis based on structured text/JD
  return `
Analyze the following resume content against the provided job description. Provide a concise analysis focusing on ATS keyword matching, skills alignment, and overall fit.

**Job Description:**
---
${jdText}
---

**Resume Content:**
---
${structuredResumeText}
---

**Analysis Output Format (Use Markdown):**

### ATS Match Score
**XX%**

### Key Strengths
- ...

### Areas for Improvement / Missing Keywords
- ...

### Overall Summary
...
`;
};
