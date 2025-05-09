export interface CorrectionPosition {
  start: number;
  end: number;
}

export type GrammarErrorType =
  | "spelling"
  | "grammar"
  | "punctuation"
  | "agreement"
  | "syntax"
  | "formality"
  | "connective"
  | "style";

export type ErrorSeverity = "low" | "medium" | "high";

export interface Correction {
  original: string;
  suggested: string;
  type: GrammarErrorType;
  severity?: ErrorSeverity;
  position?: CorrectionPosition;
  explanation?: string;
}

export interface ArgumentAnalysis {
  hasThesis: boolean;
  hasConclusion: boolean;
  argumentCount: number;
  counterArgumentPresent: boolean;
  connectivesUsed: string[];
  topicCoherence: number;
  paragraphProgression: boolean;
  socioculturalReferences?: {
    present: boolean;
    examples: string[];
    quality: "excellent" | "good" | "average" | "poor";
    type: string;
  };
}

export interface EvaluationChecklist {
  competencia1: {
    correctSpelling: boolean;
    properAgreement: boolean;
    goodPunctuation: boolean;
    formalLanguage: boolean;
    syntaxCoherence: boolean;
  };
  competencia2: {
    followsTopic: boolean;
    usesKnowledge: boolean;
    hasEssayStructure: boolean;
  };
  competencia3: {
    hasThesis: boolean;
    hasArguments: boolean;
    usesConnectives: boolean;
    topicProgression: boolean;
    counterArgument: boolean;
  };
  competencia4: {
    usesConnectives: boolean;
    variedVocabulary: boolean;
    paragraphCohesion: boolean;
  };
  competencia5: {
    hasSolution: boolean;
    detailedSolution: boolean;
    feasibleSolution: boolean;
    respectsHumanRights: boolean;
  };
}

export interface ScoreCategories {
  competencia1: number;
  competencia2: number;
  competencia3: number;
  competencia4: number;
  competencia5: number;
}

export interface AnalysisResult {
  text: string;
  corrections: Correction[];
  score: {
    total: number;
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
    connectivesCount: number;
    paragraphsCount: number;
    wordsCount: number;
    charactersCount: number;
    linesCount?: number;
    estimatedLines?: number;
  };
  theme: string;
  title?: string;
  zeroReason?: string | null;
  argumentAnalysis?: ArgumentAnalysis;
  checklist?: EvaluationChecklist;
  errorCounts?: {
    spelling: number;
    grammar: number;
    punctuation: number;
    agreement: number;
    syntax: number;
    formality: number;
  };
  socioculturalReferences?: {
    present: boolean;
    examples: string[];
    quality: "excellent" | "good" | "average" | "poor";
    type: string;
  };
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
