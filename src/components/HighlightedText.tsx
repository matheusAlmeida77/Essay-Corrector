import React from 'react';
import { Correction } from '../services/types';

interface HighlightedTextProps {
  text: string;
  corrections: Correction[];
  className?: string;
}

/**
 * Componente que exibe um texto com marcações para correções gramaticais e conectivos
 */
const HighlightedText: React.FC<HighlightedTextProps> = ({ 
  text, 
  corrections, 
  className = "" 
}) => {
  if (!text) return null;
  
  // Se não houver correções, apenas renderiza o texto
  if (!corrections || corrections.length === 0) {
    return <div className={`whitespace-pre-wrap ${className}`}>{text}</div>;
  }
  
  // Ordena as correções por posição de início, do menor para o maior
  const sortedCorrections = [...corrections].sort((a, b) => {
    if (!a.position || !b.position) return 0;
    return a.position.start - b.position.start;
  });
  
  // Array para armazenar os fragmentos de texto com ou sem destaque
  const textFragments: JSX.Element[] = [];
  
  // Posição atual no texto
  let currentPosition = 0;
  
  // Processa cada correção
  sortedCorrections.forEach((correction, index) => {
    if (!correction.position) return;
    
    const { start, end } = correction.position;
    
    // Adiciona o texto normal antes da correção
    if (start > currentPosition) {
      textFragments.push(
        <span key={`text-${index}`}>
          {text.substring(currentPosition, start)}
        </span>
      );
    }
    
    // Determina a classe CSS baseada no tipo de correção
    let highlightClass = '';
    let title = '';
    
    switch (correction.type) {
      case 'spelling':
        highlightClass = 'bg-red-200 underline decoration-wavy decoration-red-500';
        title = `Erro de ortografia: ${correction.original} → ${correction.suggested}`;
        break;
      case 'grammar':
        highlightClass = 'bg-yellow-200 underline decoration-wavy decoration-yellow-500';
        title = `Erro gramatical: ${correction.original} → ${correction.suggested}`;
        break;
      case 'style':
        highlightClass = 'bg-blue-200 underline decoration-dotted decoration-blue-500';
        title = `Sugestão de estilo: ${correction.original} → ${correction.suggested}`;
        break;
      case 'connective':
        highlightClass = 'bg-green-100 text-green-800 font-medium';
        title = 'Conectivo textual';
        break;
      default:
        highlightClass = 'bg-gray-200';
        title = 'Marcação';
    }
    
    // Adiciona o texto com destaque
    textFragments.push(
      <span 
        key={`correction-${index}`} 
        className={highlightClass}
        title={title}
      >
        {text.substring(start, end)}
      </span>
    );
    
    // Atualiza a posição atual
    currentPosition = end;
  });
  
  // Adiciona o texto restante após a última correção
  if (currentPosition < text.length) {
    textFragments.push(
      <span key="text-end">
        {text.substring(currentPosition)}
      </span>
    );
  }
  
  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {textFragments}
    </div>
  );
};

export default HighlightedText;
