
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Info,
  BarChart3,
  ArrowRight,
  BookOpen
} from "lucide-react";

interface ArgumentAnalysis {
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
    quality: "poor" | "average" | "good" | "excellent";
    type: string;
  };
}

interface ArgumentAnalysisDetailsProps {
  argumentAnalysis: ArgumentAnalysis;
}

const ArgumentAnalysisDetails: React.FC<ArgumentAnalysisDetailsProps> = ({ argumentAnalysis }) => {
  // Helper function to determine quality text and color
  const qualityInfo = (quality: string) => {
    switch (quality) {
      case 'poor':
        return { text: 'Insuficiente', color: 'text-red-600' };
      case 'average':
        return { text: 'Médio', color: 'text-amber-600' };
      case 'good':
        return { text: 'Bom', color: 'text-green-600' };
      case 'excellent':
        return { text: 'Excelente', color: 'text-blue-600' };
      default:
        return { text: 'Não avaliado', color: 'text-gray-600' };
    }
  };

  const {
    hasThesis,
    hasConclusion,
    argumentCount,
    counterArgumentPresent,
    connectivesUsed,
    topicCoherence,
    paragraphProgression,
    socioculturalReferences
  } = argumentAnalysis;

  // Determine repertoire quality information
  const repertoireQuality = socioculturalReferences?.quality 
    ? qualityInfo(socioculturalReferences.quality)
    : qualityInfo('poor');

  return (
    <div>
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <FileSpreadsheet className="w-5 h-5 mr-2 text-amber-500" />
        Análise da Argumentação
      </h3>
      
      <Card className="mb-4">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-sm font-medium">Tese clara</span>
              {hasThesis ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-sm font-medium">Conclusão</span>
              {hasConclusion ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-sm font-medium">Argumentos</span>
              <span className="font-medium text-sm">
                {argumentCount} {argumentCount === 1 ? 'argumento' : 'argumentos'}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-sm font-medium">Contra-argumentação</span>
              {counterArgumentPresent ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-sm font-medium">Progressão temática</span>
              {paragraphProgression ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-sm font-medium">Coerência textual</span>
              <span className="font-medium text-sm">
                {topicCoherence.toFixed(0)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-sm font-medium">Conectivos utilizados</span>
              <span className="font-medium text-sm">
                {connectivesUsed.length} tipos
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Repertório Sociocultural - Nova seção */}
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
        Repertório Sociocultural
      </h3>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium">Presença de repertório</span>
              {socioculturalReferences?.present ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            
            <div className="border-b pb-2">
              <span className="text-sm font-medium block mb-1">Tipo de repertório</span>
              <span className="text-sm bg-blue-50 text-blue-800 px-2 py-1 rounded">
                {socioculturalReferences?.type || "Não identificado"}
              </span>
            </div>
            
            <div className="border-b pb-2">
              <span className="text-sm font-medium block mb-1">Qualidade do repertório</span>
              <span className={`text-sm font-medium ${repertoireQuality.color}`}>
                {repertoireQuality.text}
              </span>
            </div>
            
            <div>
              <span className="text-sm font-medium block mb-1">Exemplos identificados</span>
              {socioculturalReferences?.examples && socioculturalReferences.examples.length > 0 ? (
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {socioculturalReferences.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Nenhum exemplo específico identificado</p>
              )}
            </div>
            
            <div className="bg-amber-50 p-3 rounded-lg mt-3">
              <h4 className="text-sm font-medium text-amber-800 mb-1 flex items-center">
                <Info className="w-4 h-4 mr-1" />
                O que é repertório sociocultural?
              </h4>
              <p className="text-xs text-amber-800">
                Na redação do ENEM, o repertório sociocultural legítimo refere-se ao uso e referência adequada de 
                conhecimentos de diferentes áreas (literatura, filosofia, história, sociologia, ciências, etc.) 
                para fundamentar os argumentos. Um bom repertório demonstra conhecimento amplo e fortalece 
                significativamente a argumentação.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Conectivos utilizados */}
      {connectivesUsed.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Conectivos utilizados:</p>
          <div className="flex flex-wrap gap-1">
            {connectivesUsed.map((connective, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {connective}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArgumentAnalysisDetails;
