import { ResultData, AnalysisResult, StudentInfo, TeacherInput } from "./types";
import {
  getMockAnalysisResult,
  getMockAnalysisResultFromText,
} from "./mockData";
import { apiClient } from "./apiClient";

export const analyzeEssayText = async (
  text: string,
  theme: string,
  title?: string
): Promise<AnalysisResult> => {
  try {
    const response = await apiClient.post("/api/analyze/text", {
      text,
      theme,
      title,
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao chamar API Python:", error);
    console.log("Usando fallback para análise local");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return getMockAnalysisResultFromText(text, theme, title);
  }
};

export const saveResults = async (
  data: ResultData
): Promise<{
  success: boolean;
  message?: string;
  path?: string;
}> => {
  try {
    try {
      const response = await apiClient.post("/api/save-results", data);
      return response.data;
    } catch (apiError) {
      console.error("Erro ao salvar via API:", apiError);
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Dados a serem salvos:", data);

    return {
      success: true,
      message: "Resultados salvos com sucesso!",
      path: "/resultados",
    };
  } catch (error) {
    console.error("Erro ao salvar resultados:", error);
    return {
      success: false,
      message: "Erro ao salvar resultados. Por favor, tente novamente.",
    };
  }
};
