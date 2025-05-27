import { AnalysisResult } from "./types";
import { countConnectives } from "./utils";

/**
 * Gera um resultado simulado para análise de imagem
 * @param theme Tema da redação (opcional)
 * @returns Resultado simulado da análise
 */
export function getMockAnalysisResult(theme?: string): AnalysisResult {
  const text =
    "A importancia da educacao no Brasil. A educacao é fundamental para o desenvolvimiento do pais. Sem ela, não podemos avançar como sociedade e nem como individuos.";

  return {
    text: text,
    corrections: [
      {
        original: "importancia",
        suggested: "importância",
        type: "spelling",
        position: {
          start: 2,
          end: 12,
        },
      },
      {
        original: "educacao",
        suggested: "educação",
        type: "spelling",
        position: {
          start: 16,
          end: 24,
        },
      },
      {
        original: "desenvolvimiento",
        suggested: "desenvolvimento",
        type: "spelling",
        position: {
          start: 58,
          end: 74,
        },
      },
      {
        original: "pais",
        suggested: "país",
        type: "spelling",
        position: {
          start: 78,
          end: 82,
        },
      },
      {
        original: "individuos",
        suggested: "indivíduos",
        type: "spelling",
        position: {
          start: 148,
          end: 158,
        },
      },
    ],
    score: {
      total: 400, // Total em 1000 pontos
      categories: {
        competencia1: 80, // Domínio da norma padrão (0-200)
        competencia2: 100, // Compreensão da proposta (0-200)
        competencia3: 80, // Seleção e organização de argumentos (0-200)
        competencia4: 60, // Conhecimento dos mecanismos linguísticos (0-200)
        competencia5: 80, // Proposta de intervenção (0-200)
      },
    },
    statistics: {
      connectivesCount: countConnectives(text),
      paragraphsCount: 1,
      wordsCount: text.split(/\s+/).length,
      charactersCount: text.length,
    },
    theme: theme || "A importância da educação no Brasil",
    feedback:
      "Análise da redação com base nas competências do ENEM:\n\n" +
      "Competência 1 (80/200): Demonstra domínio mediano da modalidade escrita formal da língua portuguesa, com alguns desvios gramaticais e de convenções da escrita.\n\n" +
      "Competência 2 (100/200): Compreende a proposta da redação e aplica conceitos das várias áreas de conhecimento, mas com argumentação previsível.\n\n" +
      "Competência 3 (80/200): Apresenta informações, fatos e opiniões relacionados ao tema, mas limitados aos argumentos dos textos motivadores.\n\n" +
      "Competência 4 (60/200): Articula as partes do texto com inadequações, mas com repertório limitado de recursos coesivos.\n\n" +
      "Competência 5 (80/200): Apresenta proposta de intervenção relacionada ao tema, mas pouco articulada com a discussão desenvolvida no texto.\n\n" +
      "Total: 400/1000 pontos.",
  };
}

/**
 * Gera um resultado simulado para análise de texto
 * @param text Texto a ser analisado
 * @param theme Tema da redação (opcional)
 * @returns Resultado simulado da análise
 */
export function getMockAnalysisResultFromText(
  text: string,
  theme?: string
): AnalysisResult {
  // Simular correções baseadas em padrões comuns
  const corrections = simulateTextCorrections(text);

  // Analisar estrutura do texto
  const paragraphs = text.split(/\n\s*\n|\r\n\s*\r\n|\r\s*\r/);
  const numParagraphs = paragraphs.length;
  const textLength = text.length;
  const wordsCount = text.split(/\s+/).length;
  const connectivesCount = countConnectives(text);

  // Calcular pontuações ENEM (baseadas em indicadores simples)
  const {
    comp1Score,
    comp2Score,
    comp3Score,
    comp4Score,
    comp5Score,
    totalScore,
  } = calculateMockScores(
    corrections.length,
    numParagraphs,
    wordsCount,
    connectivesCount,
    paragraphs
  );

  // Gerar feedback personalizado
  const feedback = generateMockFeedback(
    comp1Score,
    comp2Score,
    comp3Score,
    comp4Score,
    comp5Score,
    totalScore
  );

  return {
    text: text,
    corrections: corrections,
    score: {
      total: totalScore,
      categories: {
        competencia1: comp1Score,
        competencia2: comp2Score,
        competencia3: comp3Score,
        competencia4: comp4Score,
        competencia5: comp5Score,
      },
    },
    statistics: {
      connectivesCount: connectivesCount,
      paragraphsCount: numParagraphs,
      wordsCount: wordsCount,
      charactersCount: textLength,
    },
    theme: theme || "Tema não especificado",
    feedback: feedback,
  };
}

/**
 * Simula correções de texto com base em padrões comuns
 */
function simulateTextCorrections(text: string) {
  const corrections = [];

  // Detecta palavras sem acentos
  const accentPatterns = [
    { pattern: /\beducacao\b/gi, correct: "educação" },
    { pattern: /\bpais\b/gi, correct: "país" },
    { pattern: /\bimportancia\b/gi, correct: "importância" },
    { pattern: /\bnivel\b/gi, correct: "nível" },
    { pattern: /\bpolitica\b/gi, correct: "política" },
    { pattern: /\beconomia\b/gi, correct: "economia" },
    { pattern: /\bsaude\b/gi, correct: "saúde" },
    { pattern: /\bhistoria\b/gi, correct: "história" },
    { pattern: /\banalise\b/gi, correct: "análise" },
    { pattern: /\bpublico\b/gi, correct: "público" },
  ];

  // Busca por padrões e adiciona correções
  accentPatterns.forEach(({ pattern, correct }) => {
    let match;
    const tempPattern = new RegExp(pattern.source, pattern.flags);
    while ((match = tempPattern.exec(text)) !== null) {
      corrections.push({
        original: match[0],
        suggested: correct,
        type: "spelling" as const,
        position: {
          start: match.index,
          end: match.index + match[0].length,
        },
      });
    }
  });

  return corrections;
}

/**
 * Calcula pontuações simuladas para as competências do ENEM
 */
function calculateMockScores(
  errorsCount: number,
  paragraphsCount: number,
  wordsCount: number,
  connectivesCount: number,
  paragraphs: string[]
) {
  // Impacto dos erros na pontuação
  const errorImpact = Math.min(errorsCount * 10, 80);

  // Competência 1: Domínio da norma culta
  const comp1Score = Math.max(0, Math.min(200, 160 - errorImpact));

  // Competência 2: Compreensão da proposta
  const comp2Score = Math.max(0, Math.min(200, 100 + paragraphsCount * 15));

  // Competência 3: Argumentação
  const comp3Score = Math.max(
    0,
    Math.min(200, 100 + (wordsCount > 300 ? 40 : wordsCount > 200 ? 20 : 0))
  );

  // Competência 4: Mecanismos linguísticos (conectivos são importantes)
  const comp4Score = Math.max(0, Math.min(200, 100 + connectivesCount * 8));

  // Competência 5: Proposta de intervenção
  const comp5Score = Math.max(
    0,
    Math.min(200, 100 + (paragraphsCount > 3 ? 40 : 0))
  );

  // Pontuação total (soma das competências)
  const totalScore =
    comp1Score + comp2Score + comp3Score + comp4Score + comp5Score;

  return {
    comp1Score,
    comp2Score,
    comp3Score,
    comp4Score,
    comp5Score,
    totalScore,
  };
}

/**
 * Gera feedback personalizado para cada competência do ENEM
 */
function generateMockFeedback(
  comp1Score: number,
  comp2Score: number,
  comp3Score: number,
  comp4Score: number,
  comp5Score: number,
  totalScore: number
): string {
  let feedback = "Análise da redação com base nas competências do ENEM:\n\n";

  // Feedback Competência 1
  if (comp1Score < 80) {
    feedback += `Competência 1 (${comp1Score}/200): Demonstra domínio precário da modalidade escrita formal da língua portuguesa, com muitos desvios gramaticais e de convenções da escrita.\n\n`;
  } else if (comp1Score < 120) {
    feedback += `Competência 1 (${comp1Score}/200): Demonstra domínio mediano da modalidade escrita formal da língua portuguesa, com alguns desvios gramaticais e de convenções da escrita.\n\n`;
  } else if (comp1Score < 160) {
    feedback += `Competência 1 (${comp1Score}/200): Demonstra bom domínio da modalidade escrita formal da língua portuguesa, com poucos desvios gramaticais e de convenções da escrita.\n\n`;
  } else {
    feedback += `Competência 1 (${comp1Score}/200): Demonstra excelente domínio da modalidade escrita formal da língua portuguesa, com pouquíssimos desvios gramaticais e de convenções da escrita.\n\n`;
  }

  // Feedback Competência 2
  if (comp2Score < 80) {
    feedback += `Competência 2 (${comp2Score}/200): Desenvolve o tema recorrendo à cópia de trechos dos textos motivadores ou apresenta domínio insuficiente do texto dissertativo-argumentativo.\n\n`;
  } else if (comp2Score < 120) {
    feedback += `Competência 2 (${comp2Score}/200): Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano do texto dissertativo-argumentativo.\n\n`;
  } else if (comp2Score < 160) {
    feedback += `Competência 2 (${comp2Score}/200): Desenvolve o tema por meio de argumentação consistente e apresenta bom domínio do texto dissertativo-argumentativo.\n\n`;
  } else {
    feedback += `Competência 2 (${comp2Score}/200): Desenvolve o tema por meio de argumentação consistente e apresenta excelente domínio do texto dissertativo-argumentativo.\n\n`;
  }

  // Feedback Competência 3
  if (comp3Score < 80) {
    feedback += `Competência 3 (${comp3Score}/200): Apresenta informações, fatos e opiniões relacionados ao tema, mas desorganizados ou contraditórios.\n\n`;
  } else if (comp3Score < 120) {
    feedback += `Competência 3 (${comp3Score}/200): Apresenta informações, fatos e opiniões relacionados ao tema, mas limitados aos argumentos dos textos motivadores.\n\n`;
  } else if (comp3Score < 160) {
    feedback += `Competência 3 (${comp3Score}/200): Apresenta informações, fatos e opiniões relacionados ao tema, de forma organizada, com indícios de autoria.\n\n`;
  } else {
    feedback += `Competência 3 (${comp3Score}/200): Apresenta informações, fatos e opiniões relacionados ao tema propostos, de forma consistente e organizada, configurando autoria.\n\n`;
  }

  // Feedback Competência 4
  if (comp4Score < 80) {
    feedback += `Competência 4 (${comp4Score}/200): Articula as partes do texto de forma precária, com muitas inadequações, e apresenta repertório limitado de recursos coesivos.\n\n`;
  } else if (comp4Score < 120) {
    feedback += `Competência 4 (${comp4Score}/200): Articula as partes do texto com algumas inadequações e apresenta repertório pouco diversificado de recursos coesivos.\n\n`;
  } else if (comp4Score < 160) {
    feedback += `Competência 4 (${comp4Score}/200): Articula as partes do texto, com poucas inadequações, e apresenta repertório diversificado de recursos coesivos.\n\n`;
  } else {
    feedback += `Competência 4 (${comp4Score}/200): Articula as partes do texto de maneira coesa e apresenta repertório diversificado de recursos coesivos.\n\n`;
  }

  // Feedback Competência 5
  if (comp5Score < 80) {
    feedback += `Competência 5 (${comp5Score}/200): Apresenta proposta de intervenção vaga, precária ou relacionada apenas ao tema.\n\n`;
  } else if (comp5Score < 120) {
    feedback += `Competência 5 (${comp5Score}/200): Apresenta proposta de intervenção relacionada ao tema, mas pouco articulada com a discussão desenvolvida no texto.\n\n`;
  } else if (comp5Score < 160) {
    feedback += `Competência 5 (${comp5Score}/200): Apresenta proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto.\n\n`;
  } else {
    feedback += `Competência 5 (${comp5Score}/200): Apresenta proposta de intervenção relacionada ao tema, bem articulada com a discussão desenvolvida no texto e bem detalhada.\n\n`;
  }

  // Feedback geral
  feedback += `Total: ${totalScore}/1000 pontos.\n\n`;

  if (totalScore < 400) {
    feedback +=
      "No geral, sua redação apresenta muitos pontos a melhorar. Recomenda-se revisar os aspectos gramaticais e a estrutura argumentativa.";
  } else if (totalScore < 600) {
    feedback +=
      "No geral, sua redação está na média, mas pode melhorar em diversos aspectos. Trabalhe na coesão e na qualidade dos argumentos.";
  } else if (totalScore < 800) {
    feedback +=
      "No geral, sua redação está bem desenvolvida, mas ainda há espaço para aprimoramento, especialmente na proposta de intervenção.";
  } else {
    feedback +=
      "No geral, sua redação está muito bem desenvolvida, com boa estrutura argumentativa e poucos desvios gramaticais.";
  }

  return feedback;
}
