import React from "react";
import { Correction } from "../types/types";

interface HighlightedTextProps {
  content: string;
  corrections: Correction[];
  className?: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  content,
  corrections,
  className = "",
}) => {
  if (!content) return null;

  if (!corrections || corrections.length === 0) {
    return <div className={`whitespace-pre-wrap ${className}`}>{content}</div>;
  }

  const sortedCorrections = [...corrections].sort((a, b) => {
    if (!a.position || !b.position) return 0;
    return a.position.start - b.position.start;
  });

  const textFragments: JSX.Element[] = [];

  let currentPosition = 0;

  sortedCorrections.forEach((correction, index) => {
    if (!correction.position) return;

    const { start, end } = correction.position;

    if (start > currentPosition) {
      textFragments.push(
        <span key={`text-${index}`}>
          {content.substring(currentPosition, start)}
        </span>
      );
    }

    let highlightClass = "";
    let title = "";

    switch (correction.type) {
      case "spelling":
        highlightClass =
          "bg-red-200 underline decoration-wavy decoration-red-500";
        title = `Erro de ortografia: ${correction.original} → ${correction.suggested}`;
        break;
      case "grammar":
        highlightClass =
          "bg-yellow-200 underline decoration-wavy decoration-yellow-500";
        title = `Erro gramatical: ${correction.original} → ${correction.suggested}`;
        break;
      case "style":
        highlightClass =
          "bg-blue-200 underline decoration-dotted decoration-blue-500";
        title = `Sugestão de estilo: ${correction.original} → ${correction.suggested}`;
        break;
      case "connective":
        highlightClass = "bg-green-100 text-green-800 font-medium";
        title = "Conectivo textual";
        break;
      default:
        highlightClass = "bg-gray-200";
        title = "Marcação";
    }

    textFragments.push(
      <span
        key={`correction-${index}`}
        className={highlightClass}
        title={title}
      >
        {content.substring(start, end)}
      </span>
    );

    currentPosition = end;
  });

  if (currentPosition < content.length) {
    textFragments.push(
      <span key="text-end">{content.substring(currentPosition)}</span>
    );
  }

  return (
    <div className={`whitespace-pre-wrap ${className}`}>{textFragments}</div>
  );
};

export default HighlightedText;
