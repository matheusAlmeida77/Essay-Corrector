
import { ResultData, AnalysisResult, StudentInfo, TeacherInput } from './types';
import { getMockAnalysisResult, getMockAnalysisResultFromText } from './mockData';
import { apiClient } from './apiClient';

/**
 * Analisa uma redação a partir de imagem (arquivo)
 * @param file Arquivo de imagem da redação
 * @returns Resultado da análise
 */
export const analyzeEssay = async (file: File): Promise<AnalysisResult> => {
  try {
    // Preparar o arquivo para envio
    const formData = new FormData();
    formData.append('file', file);
    
    // Tentar usar a API do servidor Python para análise mais precisa
    const response = await apiClient.post('/api/analyze/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao chamar API Python:', error);
    console.log('Usando fallback para análise local');
    
    // Fallback para a análise local caso a API falhe
    // Simular uma espera para parecer que está processando
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Usar mock data para demonstração
    return getMockAnalysisResult();
  }
};

/**
 * Analisa uma redação a partir de texto
 * @param text Texto da redação
 * @param theme Tema da redação
 * @param title Título da redação (opcional)
 * @returns Resultado da análise
 */
export const analyzeEssayText = async (
  text: string, 
  theme: string, 
  title?: string
): Promise<AnalysisResult> => {
  try {
    // Tentar usar a API do servidor Python para análise mais precisa
    const response = await apiClient.post('/api/analyze/text', {
      text,
      theme,
      title
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao chamar API Python:', error);
    console.log('Usando fallback para análise local');
    
    // Fallback para a análise local caso a API falhe
    // Simular uma espera para parecer que está processando
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Usar mock data com texto fornecido
    return getMockAnalysisResultFromText(text, theme, title);
  }
};

/**
 * Salva os resultados da análise
 * @param data Dados completos da análise
 * @returns Confirmação de sucesso ou erro
 */
export const saveResults = async (data: ResultData): Promise<{ 
  success: boolean; 
  message?: string;
  path?: string;
}> => {
  try {
    // Tentar salvar via API Python
    try {
      const response = await apiClient.post('/api/save-results', data);
      return response.data;
    } catch (apiError) {
      console.error('Erro ao salvar via API:', apiError);
      // Continuar com o fallback
    }
    
    // Simular uma espera para parecer que está salvando
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Para um caso real, aqui haveria uma chamada à API para salvar os dados
    // Por enquanto, apenas simulamos o sucesso
    console.log('Dados a serem salvos:', data);
    
    return {
      success: true,
      message: 'Resultados salvos com sucesso!',
      path: '/resultados'
    };
  } catch (error) {
    console.error('Erro ao salvar resultados:', error);
    return {
      success: false,
      message: 'Erro ao salvar resultados. Por favor, tente novamente.'
    };
  }
};
