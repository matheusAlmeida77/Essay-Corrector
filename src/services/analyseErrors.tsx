import textgears from "textgears-api";
import { Correction } from "./aiService";
const textgearsApi = textgears("VMRWwCDVL7LMBBgd", {
  language: "pt-BR",
});

export async function analyzeErros(
  text: string
): Promise<{ text: string; corrections: Correction[] }> {
  try {
    const data = await textgearsApi.checkGrammar(text);
    const corrections: Correction[] = data.response.errors.map((erro: any) => ({
      position: {
        start: erro.offset,
        end: erro.offset + erro.length,
      },
      original: erro.bad,
      suggested: erro.better[0] || "",
      type: erro.type === "grammar" ? "grammar" : "spelling",
    }));

    return {
      text: text,
      corrections,
    };
  } catch (error) {
    console.error("Erro ao analisar o texto:", error);
    return {
      text: text,
      corrections: [],
    };
  }
}
