const SECTION_HEIGHT = 2000;

export const transformsKeys = {
  cardTransform1: "cardTransform1",
  cardTransform2: "cardTransform2",
  cardTransform3: "cardTransform3",
} as const;

export interface HowItWorksStep {
  id: number;
  step: string;
  headline: string;
  content: string;
  zIndex: number;
  xKey?: keyof typeof transformsKeys;
  yKey?: keyof typeof transformsKeys;
}

const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: 1,
    step: "1",
    headline: "Upload",
    content:
      "Upload your existing resume or start fresh — Elevera scans every detail to understand your strengths.",
    zIndex: 30,
    xKey: "cardTransform1",
  },
  {
    id: 2,
    step: "2",
    headline: "AI Analyzes ",
    content:
      "Our AI evaluates your resume against industry benchmarks and provides an ATS compatibility score.",
    zIndex: 20,
    yKey: "cardTransform2",
  },
  {
    id: 3,
    step: "3",
    headline: "Get Instant Suggestions",
    content:
      "Receive actionable feedback and tips to enhance wording, formatting, and keyword optimization — instantly.",
    zIndex: 10,
    xKey: "cardTransform3",
  },
];
export { SECTION_HEIGHT, HOW_IT_WORKS_STEPS };
