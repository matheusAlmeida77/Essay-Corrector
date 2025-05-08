
/**
 * Arquivo principal para exportar todas as funcionalidades relacionadas à análise de redações
 */

// Exportar tipos
export type {
  AnalysisResult,
  Correction,
  CorrectionPosition,
  ResultData,
  ScoreCategories,
  StudentInfo,
  TeacherInput,
  GrammarErrorType,
  ErrorSeverity,
  ArgumentAnalysis,
  EvaluationChecklist
} from './types';

// Exportar funções de análise
export {
  analyzeEssay,
  analyzeEssayText,
  saveResults,
} from './analysisService';

// Exportar utilitários
export {
  countConnectives,
} from './utils';

// Exportar funções de formatação
export {
  formatFeedback,
  formatZeroFeedback,
} from './formatFeedback';