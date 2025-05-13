import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface GrammarErrorDetailsProps {
  errorCounts: {
    spelling: number;
    grammar: number;
    punctuation: number;
    agreement: number;
    syntax: number;
    formality: number;
  };
}

const GrammarErrorDetails: React.FC<GrammarErrorDetailsProps> = ({
  errorCounts,
}) => {
  const totalErrors = Object.values(errorCounts).reduce((a, b) => a + b, 0);

  const getSeverityClass = (count: number) => {
    if (count === 0) return "bg-green-100 text-green-800";
    if (count <= 2) return "bg-yellow-100 text-yellow-800";
    if (count <= 5) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-3">Análise de Erros Gramaticais</h2>

        <div className="space-y-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium">
              Total de erros detectados
            </span>
            <p className="text-2xl font-bold">{totalErrors}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div
              className={`p-3 rounded-lg ${getSeverityClass(
                errorCounts.spelling
              )}`}
            >
              <h3 className="text-sm font-semibold">Ortografia</h3>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">{errorCounts.spelling}</div>
                <div className="text-xs opacity-80">
                  {errorCounts.spelling > 5
                    ? "Precisa melhorar muito"
                    : errorCounts.spelling > 2
                    ? "Precisa de atenção"
                    : errorCounts.spelling > 0
                    ? "Poucos erros"
                    : "Excelente!"}
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${getSeverityClass(
                errorCounts.grammar
              )}`}
            >
              <h3 className="text-sm font-semibold">Gramática</h3>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">{errorCounts.grammar}</div>
                <div className="text-xs opacity-80">
                  {errorCounts.grammar > 5
                    ? "Precisa melhorar muito"
                    : errorCounts.grammar > 2
                    ? "Precisa de atenção"
                    : errorCounts.grammar > 0
                    ? "Poucos erros"
                    : "Excelente!"}
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${getSeverityClass(
                errorCounts.punctuation
              )}`}
            >
              <h3 className="text-sm font-semibold">Pontuação</h3>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">
                  {errorCounts.punctuation}
                </div>
                <div className="text-xs opacity-80">
                  {errorCounts.punctuation > 5
                    ? "Precisa melhorar muito"
                    : errorCounts.punctuation > 2
                    ? "Precisa de atenção"
                    : errorCounts.punctuation > 0
                    ? "Poucos erros"
                    : "Excelente!"}
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${getSeverityClass(
                errorCounts.agreement
              )}`}
            >
              <h3 className="text-sm font-semibold">Concordância</h3>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">{errorCounts.agreement}</div>
                <div className="text-xs opacity-80">
                  {errorCounts.agreement > 5
                    ? "Precisa melhorar muito"
                    : errorCounts.agreement > 2
                    ? "Precisa de atenção"
                    : errorCounts.agreement > 0
                    ? "Poucos erros"
                    : "Excelente!"}
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${getSeverityClass(
                errorCounts.syntax
              )}`}
            >
              <h3 className="text-sm font-semibold">Sintaxe</h3>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">{errorCounts.syntax}</div>
                <div className="text-xs opacity-80">
                  {errorCounts.syntax > 5
                    ? "Precisa melhorar muito"
                    : errorCounts.syntax > 2
                    ? "Precisa de atenção"
                    : errorCounts.syntax > 0
                    ? "Poucos erros"
                    : "Excelente!"}
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg ${getSeverityClass(
                errorCounts.formality
              )}`}
            >
              <h3 className="text-sm font-semibold">Informalidade</h3>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">{errorCounts.formality}</div>
                <div className="text-xs opacity-80">
                  {errorCounts.formality > 5
                    ? "Precisa melhorar muito"
                    : errorCounts.formality > 2
                    ? "Precisa de atenção"
                    : errorCounts.formality > 0
                    ? "Poucos erros"
                    : "Excelente!"}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <p className="font-medium mb-1">Dicas para melhorar:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Revise cuidadosamente para erros ortográficos</li>
              <li>Verifique concordâncias verbais e nominais</li>
              <li>Evite frases muito longas e confusas</li>
              <li>Use pontuação adequada para separar ideias</li>
              <li>Mantenha a formalidade e evite expressões coloquiais</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrammarErrorDetails;
