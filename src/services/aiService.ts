export type {
  AnalysisResult,
  Correction,
  CorrectionPosition,
  ScoreCategories,
  StudentInfo,
  TeacherInput,
  GrammarErrorType,
  ErrorSeverity,
  ArgumentAnalysis,
  EvaluationChecklist,
} from "../types/types";

export { analyzeEssayText } from "./analysisService";

export { countConnectives } from "./utils";
