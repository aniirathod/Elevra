export const createRewritePrompt = (
  originalBullet: string,
  jobContext?: string,
  focus?: string
): string => {
  let prompt = `
You are an expert career coach and resume writer. Your task is to rewrite the following resume bullet point to maximize impact, clarity, and ATS compatibility.
Ensure the bullet points are achievement-oriented, quantify results where possible, and use strong action verbs.
Provide professional feedback in the form of 3 distinct suggestions.

Original Bullet Point:
"${originalBullet}"
`;

  if (jobContext) {
    prompt += `\nContext: This is for a ${jobContext} position.`;
  }

  if (focus) {
    prompt += `\nFocus: ${focus}`;
  }

  prompt += `

Guidelines:
- Each suggestion should be concise, 1–2 lines maximum.
- Use keywords relevant to the role to enhance ATS scanning.
- Avoid generic phrases; make each bullet measurable and outcome-focused.

Suggestions (Return ONLY a valid JSON array of strings):
`;

  return prompt;
};
