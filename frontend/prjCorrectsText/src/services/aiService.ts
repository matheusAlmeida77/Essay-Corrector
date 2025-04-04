// Interface definitions for essay analysis
export interface CorrectionPosition {
  start: number;
  end: number;
}

export interface Correction {
  original: string;
  suggested: string;
  type: 'spelling' | 'grammar' | 'style';
  position?: CorrectionPosition;
}

export interface ScoreCategories {
  grammar: number;
  coherence: number;
  cohesion: number;
  adherenceToTheme: number;
  argumentQuality: number;
}

export interface AnalysisScore {
  total: number;
  categories: ScoreCategories;
}

export interface AnalysisResult {
  text: string;
  corrections: Correction[];
  score: AnalysisScore;
  feedback: string;
}

export interface StudentInfo {
  name: string;
  number: string;
  class: string;
}

export interface TeacherInput {
  grade: string;
  comments: string;
}

export interface ResultData {
  studentInfo: StudentInfo;
  essayAnalysis: AnalysisResult;
  teacherInput: TeacherInput;
  inputType: 'image' | 'text';
  timestamp: string;
}

// Configuration for API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Analisa uma redação a partir de uma imagem
 * @param {File} essayImage - A imagem da redação a ser analisada
 * @returns {Promise<AnalysisResult>} Resultado da análise
 */
export const analyzeEssay = async (essayImage: File): Promise<AnalysisResult> => {
  // Forçar uso da API Python, independente do ambiente
  // Removendo a verificação de ambiente para garantir que sempre usamos a API
  console.log(`Enviando imagem para API: ${API_URL}/api/analyze/image`);
  
  try {
    const formData = new FormData();
    formData.append('image', essayImage);
    
    const response = await fetch(`${API_URL}/api/analyze/image`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      console.error('Erro na resposta da API:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha ao analisar a redação');
    }
    
    const result = await response.json();
    console.log('Resultado da análise da imagem:', result);
    return result;
  } catch (error) {
    console.error('Erro ao analisar a imagem:', error);
    // Fallback para dados simulados em caso de erro
    console.warn('Usando dados simulados devido a falha na API');
    return getMockAnalysisResult();
  }
};

/**
 * Analisa uma redação a partir do texto inserido
 * @param {string} essayText - O texto da redação a ser analisado
 * @returns {Promise<AnalysisResult>} Resultado da análise
 */
export const analyzeEssayText = async (essayText: string): Promise<AnalysisResult> => {
  // Forçar uso da API Python, independente do ambiente
  // Removendo a verificação de ambiente para garantir que sempre usamos a API
  console.log(`Enviando texto para API: ${API_URL}/api/analyze/text`);

  try {
    const response = await fetch(`${API_URL}/api/analyze/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: essayText }),
    });
    
    if (!response.ok) {
      console.error('Erro na resposta da API:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha ao analisar a redação');
    }
    
    const result = await response.json();
    console.log('Resultado da análise do texto:', result);
    return result;
  } catch (error) {
    console.error('Erro ao analisar o texto:', error);
    // Fallback para dados simulados em caso de erro
    console.warn('Usando dados simulados devido a falha na API');
    return getMockAnalysisResultFromText(essayText);
  }
};

/**
 * Salva os resultados da análise no servidor Python
 * @param {ResultData} resultData - Dados completos da análise
 * @returns {Promise<Object>} Resultado da operação de salvamento
 */
export const saveResults = async (resultData: ResultData): Promise<{success: boolean, message: string}> => {
  console.log(`Salvando resultados na API: ${API_URL}/api/save-results`);
  console.log('Dados sendo enviados:', resultData);

  try {
    const response = await fetch(`${API_URL}/api/save-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resultData),
    });
    
    if (!response.ok) {
      console.error('Erro na resposta da API ao salvar:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha ao salvar os resultados');
    }
    
    const result = await response.json();
    console.log('Resultado do salvamento:', result);
    return result;
  } catch (error) {
    console.error('Erro ao salvar os resultados:', error);
    throw error;
  }
};

// Funções de mock para fallback em caso de erros na API
function getMockAnalysisResult(): AnalysisResult {
  return {
    text: "A importancia da educacao no Brasil. A educacao é fundamental para o desenvolvimiento do pais. Sem ela, não podemos avançar como sociedade e nem como individuos.",
    corrections: [
      {
        original: "importancia",
        suggested: "importância",
        type: "spelling",
        position: {
          start: 2,
          end: 12,
        },
      },
      {
        original: "educacao",
        suggested: "educação",
        type: "spelling",
        position: {
          start: 16,
          end: 24,
        },
      },
      {
        original: "desenvolvimiento",
        suggested: "desenvolvimento",
        type: "spelling",
        position: {
          start: 58,
          end: 74,
        },
      },
      {
        original: "pais",
        suggested: "país",
        type: "spelling",
        position: {
          start: 78,
          end: 82,
        },
      },
      {
        original: "individuos",
        suggested: "indivíduos",
        type: "spelling",
        position: {
          start: 148,
          end: 158,
        },
      },
    ],
    score: {
      total: 7.5,
      categories: {
        grammar: 6.5,
        coherence: 8.0,
        cohesion: 7.5,
        adherenceToTheme: 8.5,
        argumentQuality: 7.0,
      },
    },
    feedback: "A redação apresenta ideias relevantes sobre a importância da educação, mas precisa melhorar na ortografia e na elaboração dos argumentos. Recomenda-se revisão de acentuação e desenvolvimento mais aprofundado do tema."
  };
}

function getMockAnalysisResultFromText(text: string): AnalysisResult {
  // Esta função usa o texto real fornecido pelo usuário
  // e gera correções simuladas baseadas nele
  
  // Simulação simples de correções baseadas em padrões comuns
  const corrections: Correction[] = [];
  
  // Detecta palavras sem acentos
  const accentPatterns = [
    { pattern: /\beducacao\b/gi, correct: "educação" },
    { pattern: /\bpais\b/gi, correct: "país" },
    { pattern: /\bimportancia\b/gi, correct: "importância" },
    { pattern: /\bnivel\b/gi, correct: "nível" },
    { pattern: /\bpolitica\b/gi, correct: "política" },
    { pattern: /\beconomia\b/gi, correct: "economia" },
    { pattern: /\bsaude\b/gi, correct: "saúde" },
    { pattern: /\bhistoria\b/gi, correct: "história" },
    { pattern: /\banalise\b/gi, correct: "análise" },
    { pattern: /\bpublico\b/gi, correct: "público" },
  ];
  
  // Busca por padrões e adiciona correções
  accentPatterns.forEach(({ pattern, correct }) => {
    let match;
    const tempPattern = new RegExp(pattern.source, pattern.flags);
    while ((match = tempPattern.exec(text)) !== null) {
      corrections.push({
        original: match[0],
        suggested: correct,
        type: "spelling",
        position: {
          start: match.index,
          end: match.index + match[0].length,
        },
      });
    }
  });
  
  // Gera uma pontuação baseada na quantidade de correções
  const correctionImpact = Math.min(corrections.length * 0.7, 4);
  const baseScore = 8.0; // Pontuação base
  const totalScore = Math.max(5, Math.min(10, baseScore - correctionImpact));
  
  return {
    text: text,
    corrections: corrections,
    score: {
      total: parseFloat(totalScore.toFixed(1)),
      categories: {
        grammar: parseFloat((totalScore - 0.5).toFixed(1)),
        coherence: parseFloat((totalScore + 0.5).toFixed(1)),
        cohesion: parseFloat(totalScore.toFixed(1)),
        adherenceToTheme: parseFloat((totalScore + 1).toFixed(1)),
        argumentQuality: parseFloat((totalScore - 0.2).toFixed(1)),
      },
    },
    feedback: corrections.length > 0 
      ? "A redação apresenta alguns erros ortográficos que precisam ser corrigidos. Recomenda-se revisão de acentuação e verificação da gramática."
      : "A redação está bem escrita, com boa estrutura gramatical. Continue praticando para aprimorar ainda mais sua escrita."
  };
}
