import React from "react";
import { Correction } from "../types/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DetailedHighlightedTextProps {
  text: string;
  corrections: Correction[];
}

const DetailedHighlightedText: React.FC<DetailedHighlightedTextProps> = ({
  text,
  corrections,
}) => {
  if (!text) return <p>Nenhum texto para exibir</p>;

  // Ordenar correções por posição de início para processamento em ordem
  const sortedCorrections = [...corrections].sort((a, b) => {
    if (!a.position || !b.position) return 0;
    return a.position.start - b.position.start;
  });

  // Criar fragmentos de texto com e sem destaque
  const fragments: { text: string; correction?: Correction; index: number }[] =
    [];

  let lastEnd = 0;

  sortedCorrections.forEach((correction, index) => {
    if (!correction.position) return;

    const { start, end } = correction.position;

    // Adicionar texto normal antes da correção
    if (start > lastEnd) {
      fragments.push({
        text: text.substring(lastEnd, start),
        index: fragments.length,
      });
    }

    // Adicionar texto com correção
    fragments.push({
      text: text.substring(start, end),
      correction,
      index: fragments.length,
    });

    lastEnd = end;
  });

  // Adicionar o restante do texto após a última correção
  if (lastEnd < text.length) {
    fragments.push({
      text: text.substring(lastEnd),
      index: fragments.length,
    });
  }

  // Função para determinar a cor do texto com base no tipo de correção
  const getHighlightStyle = (correctionType?: string) => {
    if (!correctionType) return {};

    switch (correctionType) {
      case "spelling":
        return { color: "red", textDecoration: "underline wavy red" };
      case "grammar":
        return { color: "red", textDecoration: "underline red" };
      case "punctuation":
        return { color: "orange", textDecoration: "underline orange" };
      case "agreement":
        return { color: "darkred", textDecoration: "underline double darkred" };
      case "syntax":
        return { color: "purple", textDecoration: "underline purple" };
      case "formality":
        return { color: "blue", textDecoration: "underline blue" };
      case "connective":
        return { color: "green", fontWeight: "bold" };
      default:
        return { color: "gray", textDecoration: "underline gray" };
    }
  };

  // Função para obter o título do tooltip com base no tipo de correção
  const getTooltipTitle = (correction: Correction) => {
    switch (correction.type) {
      case "spelling":
        return "Erro ortográfico";
      case "grammar":
        return "Erro gramatical";
      case "punctuation":
        return "Erro de pontuação";
      case "agreement":
        return "Erro de concordância";
      case "syntax":
        return "Erro de sintaxe";
      case "formality":
        return "Linguagem informal";
      case "connective":
        return "Conectivo (boa prática)";
      default:
        return "Correção sugerida";
    }
  };

  // Função para formatar o texto, preservando quebras de linha
  const formatTextWithLineBreaks = (text: string) => {
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Renderizar os fragmentos
  return (
    <div className="bg-white rounded-lg p-4 whitespace-pre-wrap text-sm">
      <TooltipProvider>
        {fragments.map((fragment) =>
          fragment.correction ? (
            <Tooltip key={fragment.index}>
              <TooltipTrigger asChild>
                <span style={getHighlightStyle(fragment.correction.type)}>
                  {formatTextWithLineBreaks(fragment.text)}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <div className="space-y-1">
                  <p className="font-bold">
                    {getTooltipTitle(fragment.correction)}
                  </p>
                  <p>
                    <strong>Original:</strong> {fragment.correction.original}
                  </p>
                  <p>
                    <strong>Sugestão:</strong> {fragment.correction.suggested}
                  </p>
                  {fragment.correction.explanation && (
                    <p>
                      <strong>Explicação:</strong>{" "}
                      {fragment.correction.explanation}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
            <span key={fragment.index}>
              {formatTextWithLineBreaks(fragment.text)}
            </span>
          )
        )}
      </TooltipProvider>
    </div>
  );
};

export default DetailedHighlightedText;
