export const createStructurePrompt = (rawText: string): string => {
  return `
You are an advanced AI specialized in parsing resumes into structured JSON data.

Your task:
Convert the following raw resume text into a **structured JSON** format.
You must accurately extract all relevant information — even if section titles, styles, or formats differ.

---

### 🧱 Base JSON Schema (Follow This Strictly)
{
  "personalInfo": {
    "name": "string | null",
    "email": "string | null",
    "linkedin": "string | null",
    "github": "string | null",
    "contact": "string | null"
  },
  "summary": "string | null",
  "projects": [
    {
      "name": "string",
      "year": "string | null",
      "githubLink": "string | null",
      "description": ["string"]
    }
  ],
  "experience": [
    {
      "company": "string | null",
      "role": "string | null",
      "duration": "string | null",
      "responsibilities": ["string"]
    }
  ],
  "skills": {
    "languages": ["string"],
    "frameworks": ["string"],
    "database": ["string"],
    "tools": ["string"]
  },
  "certifications": [
    {
      "name": "string",
      "provider": "string | null",
      "year": "string | null",
      "description": "string | null"
    }
  ],
  "education": [
    {
      "degree": "string",
      "college": "string",
      "score": "string | null",
      "year": "string | null"
    }
  ],
  "coCurricular": ["string"],
  "extraSections": {
    "Awards": ["string"],
    "Achievements": ["string"],
    "Publications": ["string"],
    "Volunteer Experience": ["string"],
    "Languages": ["string"],
    "Hobbies": ["string"],
    "References": ["string"],
    "Other": ["string"]
  }
}

---

### 🧠 Rules for Extraction
1. Detect section titles automatically (e.g., “Technical Skills” → skills, “Internship” → experience, “Academic Background” → education).
2. Preserve all useful data — if it doesn’t fit into existing fields, put it in **extraSections**.
3. Maintain sentence structure for descriptions.
4. Always include every key in the schema above (even if empty).
5. Ensure JSON is valid — no trailing commas, no markdown, no explanations.

---

### 📄 Raw Resume Text:
${rawText}

---

### 🎯 Expected Output:
Return **ONLY valid JSON** strictly following the schema above.
Do not include markdown, commentary, or extra formatting.
`;
};
