import { aiService } from "./api";
import { AnalysisResult, StudentInfo, TeacherInput } from "../types/types";

export const analyzeEssayText = async (
  text: string,
  theme: string,
  title?: string
): Promise<AnalysisResult> => {
  try {
    const response = await aiService.analyzeText(text, theme, title);

    return response;
  } catch (error) {
    console.error("Erro ao corrigir redação:", error);
  }
};
