

// Interfaces para análise de redações

// Posição da correção no texto
export interface CorrectionPosition {
  start: number;
  end: number;
}

// Tipos de erros gramaticais para análise mais detalhada (Competência 1)
export type GrammarErrorType = 'spelling' | 'grammar' | 'punctuation' | 'agreement' | 'syntax' | 'formality' | 'connective' | 'style';

// Níveis de gravidade do erro
export type ErrorSeverity = 'low' | 'medium' | 'high';

// Correção individual
export interface Correction {
  original: string;
  suggested: string;
  type: GrammarErrorType;
  severity?: ErrorSeverity;
  position?: CorrectionPosition;
  explanation?: string;     // Explicação sobre o erro
}

// Detalhes de qualidade argumentativa (Competência 3)
export interface ArgumentAnalysis {
  hasThesis: boolean;               // Apresenta tese clara
  hasConclusion: boolean;           // Tem conclusão coerente com a tese
  argumentCount: number;            // Quantidade de argumentos identificados
  counterArgumentPresent: boolean;  // Apresenta contra-argumentação
  connectivesUsed: string[];        // Lista de conectivos usados
  topicCoherence: number;           // 0-100: coerência entre parágrafos
  paragraphProgression: boolean;    // Há progressão lógica entre parágrafos
  socioculturalReferences?: {
    present: boolean;
    examples: string[];
    quality: 'excellent' | 'good' | 'average' | 'poor';
    type: string;
  };
}

// Checklist de avaliação para feedback visual
export interface EvaluationChecklist {
  competencia1: {
    correctSpelling: boolean;       // Ortografia correta
    properAgreement: boolean;       // Concordância adequada
    goodPunctuation: boolean;       // Pontuação adequada
    formalLanguage: boolean;        // Linguagem formal
    syntaxCoherence: boolean;       // Coerência sintática
  };
  competencia2: {
    followsTopic: boolean;          // Segue o tema proposto
    usesKnowledge: boolean;         // Utiliza conhecimentos diversos
    hasEssayStructure: boolean;     // Estrutura dissertativa
  };
  competencia3: {
    hasThesis: boolean;             // Apresenta tese
    hasArguments: boolean;          // Apresenta argumentos
    usesConnectives: boolean;       // Usa conectivos
    topicProgression: boolean;      // Progressão entre parágrafos
    counterArgument: boolean;       // Apresenta contra-argumentação
  };
  competencia4: {
    usesConnectives: boolean;       // Usa conectivos
    variedVocabulary: boolean;      // Vocabulário variado
    paragraphCohesion: boolean;     // Coesão entre parágrafos
  };
  competencia5: {
    hasSolution: boolean;           // Apresenta solução
    detailedSolution: boolean;      // Solução detalhada
    feasibleSolution: boolean;      // Solução viável
    respectsHumanRights: boolean;   // Respeita direitos humanos
  };
}

// Competências do ENEM (0-200 pontos cada, em intervalos de 40 pontos)
export interface ScoreCategories {
  competencia1: number; // Demonstrar domínio da norma padrão (0, 40, 80, 120, 160 ou 200)
  competencia2: number; // Compreender a proposta e aplicar conceitos das áreas de conhecimento (0, 40, 80, 120, 160 ou 200)
  competencia3: number; // Selecionar, relacionar, organizar e interpretar informações (0, 40, 80, 120, 160 ou 200)
  competencia4: number; // Demonstrar conhecimento dos mecanismos linguísticos (0, 40, 80, 120, 160 ou 200)
  competencia5: number; // Elaborar proposta de intervenção para o problema (0, 40, 80, 120, 160 ou 200)
}

// Resultado da análise
export interface AnalysisResult {
  text: string;
  corrections: Correction[];
  score: {
    total: number; // Nota total (0-1000)
    categories: {
      competencia1: number;
      competencia2: number;
      competencia3: number;
      competencia4: number;
      competencia5: number;
    };
  };
  feedback: string;
  statistics: {
    connectivesCount: number; // Contagem de conectivos
    paragraphsCount: number;
    wordsCount: number;
    charactersCount: number;
    linesCount?: number;
    estimatedLines?: number; // Estimativa de linhas baseada em palavras
  };
  theme: string; // Tema da redação
  title?: string; // Título da redação (opcional)
  zeroReason?: string | null; // Motivo pelo qual a redação foi zerada, se aplicável
  argumentAnalysis?: ArgumentAnalysis; // Análise detalhada dos argumentos (Competência 3)
  checklist?: EvaluationChecklist; // Checklist de avaliação
  errorCounts?: {
    spelling: number;      // Erros ortográficos
    grammar: number;       // Erros gramaticais
    punctuation: number;   // Erros de pontuação
    agreement: number;     // Erros de concordância
    syntax: number;        // Erros de sintaxe
    formality: number;     // Linguagem informal
  };
  socioculturalReferences?: {
    present: boolean;
    examples: string[];
    quality: 'excellent' | 'good' | 'average' | 'poor';
    type: string;
  };
}

// Informações do estudante
export interface StudentInfo {
  name: string;
  number: string;
  class: string;
}

// Comentários do professor
export interface TeacherInput {
  grade: string;
  comments: string;
}

// Dados completos do resultado
export interface ResultData {
  studentInfo: StudentInfo;
  essayAnalysis: AnalysisResult;
  teacherInput: TeacherInput;
  inputType: 'image' | 'text';
  timestamp: string;
  theme: string; // Tema da redação
  title?: string; // Título da redação (opcional)
}

