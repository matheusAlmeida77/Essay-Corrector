import React from "react";
import { EvaluationChecklist as ChecklistType } from "../types/types";
import { Card, CardContent } from "@/components/ui/card";

interface EvaluationChecklistProps {
  checklist: ChecklistType;
}

const EvaluationChecklist: React.FC<EvaluationChecklistProps> = ({
  checklist,
}) => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-3">Checklist de Avaliação ENEM</h2>

        <div className="space-y-4">
          {/* Competência 1 */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-sm mb-2">
              Competência 1 - Norma Padrão
            </h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center">
                <span
                  className={`${
                    checklist.competencia1.correctSpelling
                      ? "text-green-600"
                      : "text-red-600"
                  } mr-2`}
                >
                  {checklist.competencia1.correctSpelling ? "✓" : "✗"}
                </span>
                Ortografia correta
              </li>
              <li className="flex items-center">
                <span
                  className={`${
                    checklist.competencia1.properAgreement
                      ? "text-green-600"
                      : "text-red-600"
                  } mr-2`}
                >
                  {checklist.competencia1.properAgreement ? "✓" : "✗"}
                </span>
                Concordância adequada
              </li>
              <li className="flex items-center">
                <span
                  className={`${
                    checklist.competencia1.goodPunctuation
                      ? "text-green-600"
                      : "text-red-600"
                  } mr-2`}
                >
                  {checklist.competencia1.goodPunctuation ? "✓" : "✗"}
                </span>
                Pontuação adequada
              </li>
              <li className="flex items-center">
                <span
                  className={`${
                    checklist.competencia1.formalLanguage
                      ? "text-green-600"
                      : "text-red-600"
                  } mr-2`}
                >
                  {checklist.competencia1.formalLanguage ? "✓" : "✗"}
                </span>
                Linguagem formal
              </li>
              <li className="flex items-center">
                <span
                  className={`${
                    checklist.competencia1.syntaxCoherence
                      ? "text-green-600"
                      : "text-red-600"
                  } mr-2`}
                >
                  {checklist.competencia1.syntaxCoherence ? "✓" : "✗"}
                </span>
                Coerência sintática
              </li>
            </ul>
          </div>

          {/* Competência 3 */}
          <div className="p-3 bg-amber-50 rounded-lg">
            <h3 className="font-bold text-sm mb-2">
              Competência 3 - Argumentação
            </h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center">
                <span
                  className={`${
                    checklist.competencia3.hasThesis
                      ? "text-green-600"
                      : "text-red-600"
                  } mr-2`}
                >
                  {checklist.competencia3.hasThesis ? "✓" : "✗"}
                </span>
                Apresenta tese clara
              </li>
              <li className="flex items-center">
                <span
                  className={`${
                    checklist.competencia3.hasArguments
                      ? "text-green-600"
                      : "text-red-600"
                  } mr-2`}
                >
                  {checklist.competencia3.hasArguments ? "✓" : "✗"}
                </span>
                Traz ao menos 2 argumentos diferentes
              </li>
              <li className="flex items-center">
                <span
                  className={`${
                    checklist.competencia3.usesConnectives
                      ? "text-green-600"
                      : "text-red-600"
                  } mr-2`}
                >
                  {checklist.competencia3.usesConnectives ? "✓" : "✗"}
                </span>
                Usa conectivos lógicos
              </li>
              <li className="flex items-center">
                <span
                  className={`${
                    checklist.competencia3.topicProgression
                      ? "text-green-600"
                      : "text-red-600"
                  } mr-2`}
                >
                  {checklist.competencia3.topicProgression ? "✓" : "✗"}
                </span>
                Progressão entre parágrafos
              </li>
              <li className="flex items-center">
                <span
                  className={`${
                    checklist.competencia3.counterArgument
                      ? "text-green-600"
                      : "text-red-600"
                  } mr-2`}
                >
                  {checklist.competencia3.counterArgument ? "✓" : "✗"}
                </span>
                Apresenta contra-argumentação
              </li>
            </ul>
          </div>

          {/* Outras competências em formato reduzido */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <h3 className="font-bold text-sm mb-2">Competência 2 - Tema</h3>
              <ul className="space-y-1 text-xs">
                <li className="flex items-center">
                  <span
                    className={`${
                      checklist.competencia2.followsTopic
                        ? "text-green-600"
                        : "text-red-600"
                    } mr-2`}
                  >
                    {checklist.competencia2.followsTopic ? "✓" : "✗"}
                  </span>
                  Segue o tema proposto
                </li>
                <li className="flex items-center">
                  <span
                    className={`${
                      checklist.competencia2.hasEssayStructure
                        ? "text-green-600"
                        : "text-red-600"
                    } mr-2`}
                  >
                    {checklist.competencia2.hasEssayStructure ? "✓" : "✗"}
                  </span>
                  Estrutura dissertativa
                </li>
              </ul>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-sm mb-2">Competência 4 - Coesão</h3>
              <ul className="space-y-1 text-xs">
                <li className="flex items-center">
                  <span
                    className={`${
                      checklist.competencia4.usesConnectives
                        ? "text-green-600"
                        : "text-red-600"
                    } mr-2`}
                  >
                    {checklist.competencia4.usesConnectives ? "✓" : "✗"}
                  </span>
                  Conectivos adequados
                </li>
                <li className="flex items-center">
                  <span
                    className={`${
                      checklist.competencia4.paragraphCohesion
                        ? "text-green-600"
                        : "text-red-600"
                    } mr-2`}
                  >
                    {checklist.competencia4.paragraphCohesion ? "✓" : "✗"}
                  </span>
                  Coesão entre parágrafos
                </li>
              </ul>
            </div>

            <div className="p-3 bg-rose-50 rounded-lg col-span-2">
              <h3 className="font-bold text-sm mb-2">
                Competência 5 - Proposta
              </h3>
              <ul className="space-y-1 text-xs">
                <li className="flex items-center">
                  <span
                    className={`${
                      checklist.competencia5.hasSolution
                        ? "text-green-600"
                        : "text-red-600"
                    } mr-2`}
                  >
                    {checklist.competencia5.hasSolution ? "✓" : "✗"}
                  </span>
                  Proposta de solução
                </li>
                <li className="flex items-center">
                  <span
                    className={`${
                      checklist.competencia5.detailedSolution
                        ? "text-green-600"
                        : "text-red-600"
                    } mr-2`}
                  >
                    {checklist.competencia5.detailedSolution ? "✓" : "✗"}
                  </span>
                  Solução detalhada e viável
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationChecklist;
