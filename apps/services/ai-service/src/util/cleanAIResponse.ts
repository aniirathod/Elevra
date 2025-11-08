const cleanAIResponse = (response: string): string => {
  return response
    .replace(/^[^{[]*/, "") // remove anything before JSON starts
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/[\r\n]+$/, "")
    .trim();
};

export default cleanAIResponse;
