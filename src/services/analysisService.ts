import { aiService } from "./api";
import { AnalysisResult } from "../types/types";

export const analyzeEssayText = async (
  text: string,
  theme: string,
  title?: string
): Promise<AnalysisResult> => {
  try {
    const response = await aiService.analyzeText(text, theme, title);

    return response;
  } catch (error) {
    console.error("Error correcting essay:", error);
  }
};
