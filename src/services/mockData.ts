import { AnalysisResult } from "./types";
import { countConnectives } from "./utils";
import { formatFeedback } from "./formatFeedback";

export const getMockAnalysisResult = (
  theme: string,
  title?: string
): AnalysisResult => {
  const mockText = `A importância da educação no Brasil

É inegável que a educação representa um dos pilares fundamentais para o desenvolvimento socioeconômico de qualquer nação. No contexto brasileiro, marcado por profundas desigualdades sociais, o acesso à educação de qualidade torna-se ainda mais crucial. Entretanto, diversos fatores estruturais e históricos comprometem a efetividade do sistema educacional no país, exigindo uma análise aprofundada e intervenções precisas.

Primeiramente, é necessário reconhecer que a Constituição Federal de 1988 estabelece a educação como um direito social inalienável, sendo dever do Estado e da família proporcioná-la. Contudo, na prática, observa-se uma discrepância significativa entre o texto legal e a realidade educacional brasileira. Segundo dados do IBGE, aproximadamente 11 milhões de brasileiros ainda são analfabetos, evidenciando uma falha sistêmica no alcance e na qualidade da educação ofertada.

Além disso, a desigualdade no acesso à educação de qualidade perpetua ciclos de pobreza e exclusão social. Escolas em regiões periféricas e rurais frequentemente carecem de infraestrutura adequada, materiais didáticos e profissionais qualificados. Como consequência, estudantes dessas localidades enfrentam obstáculos adicionais em sua trajetória educacional, refletindo posteriormente em menores oportunidades no mercado de trabalho e na mobilidade social.

Outrossim, a valorização insuficiente dos profissionais da educação constitui outro entrave significativo. Professores brasileiros recebem salários abaixo da média de países com desenvolvimento semelhante e enfrentam condições de trabalho desafiadoras. Esta desvalorização não apenas compromete a qualidade do ensino, mas também desestimula novos talentos a ingressarem na carreira docente, criando um ciclo vicioso de precarização.

Portanto, é fundamental implementar políticas públicas abrangentes que visem não apenas a universalização do acesso à educação, mas também a garantia de sua qualidade. Investimentos consistentes em infraestrutura escolar, formação e valorização docente, bem como a adoção de metodologias pedagógicas inovadoras são medidas essenciais. Adicionalmente, parcerias entre governo, iniciativa privada e sociedade civil podem potencializar recursos e conhecimentos, criando um ecossistema educacional mais robusto e inclusivo. Somente através de um compromisso coletivo com a educação será possível construir um Brasil mais justo, desenvolvido e igualitário.`;

  const corrections = [
    {
      original: "inegável",
      suggested: "inegável",
      type: "spelling" as const,
      position: {
        start: 3,
        end: 11,
      },
    },
    {
      original: "inalienável",
      suggested: "inalienável",
      type: "grammar" as const,
      position: {
        start: 251,
        end: 262,
      },
    },
  ];

  const connectivesCount = countConnectives(mockText);

  const paragraphsCount = mockText.split("\n\n").length;

  const wordsCount = mockText.split(/\s+/).filter(Boolean).length;

  const linesCount = mockText
    .split("\n")
    .filter((line) => line.trim().length > 0).length;

  const estimatedLines = Math.ceil(wordsCount / 10);

  const competencia1 = 180;
  const competencia2 = 180;
  const competencia3 = 180;
  const competencia4 = 180;
  const competencia5 = 160;

  const totalScore =
    competencia1 + competencia2 + competencia3 + competencia4 + competencia5;

  const socioculturalReferences = {
    present: true,
    examples: ["Constituição Federal de 1988", "dados do IBGE"],
    quality: "good" as const,
    type: "jurídico e estatístico",
  };

  const zeroReason = null;

  const feedback = formatFeedback(
    "",
    {
      competencia1,
      competencia2,
      competencia3,
      competencia4,
      competencia5,
    },
    totalScore,
    undefined,
    undefined
  );

  return {
    text: mockText,
    corrections,
    score: {
      total: totalScore,
      categories: {
        competencia1,
        competencia2,
        competencia3,
        competencia4,
        competencia5,
      },
    },
    feedback,
    statistics: {
      connectivesCount,
      paragraphsCount,
      wordsCount,
      charactersCount: mockText.length,
      linesCount,
      estimatedLines,
    },
    theme: theme || "A importância da educação no Brasil",
    title: title || "A importância da educação no Brasil",
    zeroReason,
    socioculturalReferences,
  };
};

export const getMockAnalysisResultFromText = (
  text: string,
  theme: string,
  title?: string
): AnalysisResult => {
  const connectivesCount = countConnectives(text);

  const paragraphsCount = text.split("\n\n").filter(Boolean).length || 1;

  const wordsCount = text.split(/\s+/).filter(Boolean).length;

  const linesCount = text
    .split("\n")
    .filter((line) => line.trim().length > 0).length;

  const estimatedLines = Math.ceil(wordsCount / 10);

  let zeroReason: string | null = null;

  if (estimatedLines < 7) {
    zeroReason = "Texto com menos de 7 linhas (estimativa)";
  }

  if (wordsCount < 30) {
    zeroReason = "Texto com menos de 30 palavras";
  }

  const keywords = theme
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);
  let keywordsFound = 0;

  if (keywords.length > 0) {
    const textLower = text.toLowerCase();
    keywordsFound = keywords.filter((word) => textLower.includes(word)).length;

    if (keywordsFound / keywords.length < 0.2 && keywords.length >= 3) {
      zeroReason = "Possível fuga ao tema";
    }
  }

  let competencia1 = 0;
  let competencia2 = 0;
  let competencia3 = 0;
  let competencia4 = 0;
  let competencia5 = 0;

  if (!zeroReason) {
    let errosGramaticais = 0;
    const errosComuns = [
      {
        regex: /\b(concerteza|porisso|apartir|entretato|cabeça-dura)\b/gi,
        count: 0,
      },
      {
        regex:
          /\b(a\s+menos|há\s+dois\s+dias\s+atrás|entrar\s+para\s+dentro)\b/gi,
        count: 0,
      },
      {
        regex: /\b(ansioso\s+com|em\s+vista\s+que|devido\s+que)\b/gi,
        count: 0,
      },
      { regex: /\b(fazem\s+\d+\s+anos|houveram\s+problemas)\b/gi, count: 0 },
      { regex: /[,.!?][A-Za-z]/g, count: 0 },
      { regex: /\s[,.!?]/g, count: 0 },
      { regex: /\b(tava|tá|pra|pro)\b/gi, count: 0 },
    ];

    errosComuns.forEach((erro) => {
      const matches = text.match(erro.regex);
      if (matches) {
        erro.count = matches.length;
        errosGramaticais += matches.length;
      }
    });

    const densidadeErros = (errosGramaticais / wordsCount) * 100;

    if (densidadeErros <= 0.1) competencia1 = 200;
    else if (densidadeErros <= 0.3) competencia1 = 180;
    else if (densidadeErros <= 0.5) competencia1 = 160;
    else if (densidadeErros <= 1) competencia1 = 140;
    else if (densidadeErros <= 2) competencia1 = 120;
    else if (densidadeErros <= 3) competencia1 = 100;
    else if (densidadeErros <= 4) competencia1 = 80;
    else if (densidadeErros <= 5) competencia1 = 60;
    else if (densidadeErros <= 6) competencia1 = 40;
    else competencia1 = 0;

    const temIntroducao =
      paragraphsCount >= 3 && text.split("\n\n")[0].length > 100;
    const temDesenvolvimento =
      paragraphsCount >= 3 &&
      text
        .split("\n\n")
        .slice(1, -1)
        .every((p) => p.length > 150);
    const temConclusao =
      (paragraphsCount >= 3 &&
        text.split("\n\n").slice(-1)[0].includes("portanto")) ||
      text.split("\n\n").slice(-1)[0].includes("assim") ||
      text.split("\n\n").slice(-1)[0].includes("dessa forma");

    const repertorioSociocultural = analisarRepertorioSociocultural(text);

    let pontosCompetencia2 = 0;

    if (temIntroducao && temDesenvolvimento && temConclusao) {
      pontosCompetencia2 += 80;
    } else if (temIntroducao && temDesenvolvimento) {
      pontosCompetencia2 += 60;
    } else if (temIntroducao || temConclusao) {
      pontosCompetencia2 += 40;
    }

    if (repertorioSociocultural.present) {
      if (repertorioSociocultural.quality === "excellent") {
        pontosCompetencia2 += 120;
      } else if (repertorioSociocultural.quality === "good") {
        pontosCompetencia2 += 100;
      } else if (repertorioSociocultural.quality === "average") {
        pontosCompetencia2 += 80;
      } else {
        pontosCompetencia2 += 60;
      }
    } else {
      pontosCompetencia2 = Math.min(pontosCompetencia2, 80);
    }

    competencia2 = ajustarParaEscalaEnem(pontosCompetencia2);

    const qualidadeArgumentativa = analisarArgumentacao(
      text,
      connectivesCount,
      paragraphsCount
    );

    let pontosCompetencia3 = 0;

    if (
      qualidadeArgumentativa.argumentCount >= 3 &&
      qualidadeArgumentativa.hasThesis
    ) {
      pontosCompetencia3 += 80;
    } else if (
      qualidadeArgumentativa.argumentCount >= 2 &&
      qualidadeArgumentativa.hasThesis
    ) {
      pontosCompetencia3 += 60;
    } else if (qualidadeArgumentativa.argumentCount >= 1) {
      pontosCompetencia3 += 40;
    }

    if (
      qualidadeArgumentativa.topicCoherence > 80 &&
      qualidadeArgumentativa.paragraphProgression
    ) {
      pontosCompetencia3 += 80;
    } else if (qualidadeArgumentativa.topicCoherence > 60) {
      pontosCompetencia3 += 60;
    } else if (qualidadeArgumentativa.topicCoherence > 40) {
      pontosCompetencia3 += 40;
    }

    if (qualidadeArgumentativa.counterArgumentPresent) {
      pontosCompetencia3 += 40;
    }

    competencia3 = ajustarParaEscalaEnem(pontosCompetencia3);

    let pontosCompetencia4 = 0;

    const densidadeConectivos = connectivesCount / paragraphsCount;

    if (densidadeConectivos >= 3) {
      pontosCompetencia4 += 80;
    } else if (densidadeConectivos >= 2) {
      pontosCompetencia4 += 60;
    } else if (densidadeConectivos >= 1) {
      pontosCompetencia4 += 40;
    }

    const variedadeConectivos = new Set(
      text.match(
        /portanto|entretanto|contudo|assim|além disso|dessa forma|por outro lado|por fim|primeiramente|ademais/gi
      ) || []
    ).size;

    if (variedadeConectivos >= 5) {
      pontosCompetencia4 += 80;
    } else if (variedadeConectivos >= 3) {
      pontosCompetencia4 += 60;
    } else if (variedadeConectivos >= 1) {
      pontosCompetencia4 += 40;
    }

    const paragrafos = text.split("\n\n").filter(Boolean);
    let tamanhos = paragrafos.map((p) => p.length);
    const mediaTamanho = tamanhos.reduce((a, b) => a + b, 0) / tamanhos.length;
    const desviosTamanho = tamanhos.map((t) => Math.abs(t - mediaTamanho));
    const desvioMedio =
      desviosTamanho.reduce((a, b) => a + b, 0) / desviosTamanho.length;
    const coeficienteVariacao = (desvioMedio / mediaTamanho) * 100;

    if (coeficienteVariacao > 50) {
      pontosCompetencia4 -= 20;
    }

    competencia4 = ajustarParaEscalaEnem(pontosCompetencia4);

    const ultimoParagrafo = text.split("\n\n").filter(Boolean).pop() || "";

    const palavrasAgentes =
      /(governo|estado|sociedade|cidadãos|população|autoridades|instituições|empresas|escolas|universidades|comunidade)/gi;
    const palavrasAcoes =
      /(implementar|criar|desenvolver|estabelecer|promover|incentivar|fomentar|garantir|assegurar|proporcionar|investir)/gi;
    const palavrasMeios =
      /(por meio de|através de|a partir de|mediante|utilizando|com base em|com apoio de|em parceria)/gi;
    const palavrasEfeitos =
      /(assim|dessa forma|portanto|dessa maneira|desse modo|com isso|por conseguinte|logo|a fim de que|para que)/gi;

    const temAgentes =
      (ultimoParagrafo.match(palavrasAgentes) || []).length > 0;
    const temAcoes = (ultimoParagrafo.match(palavrasAcoes) || []).length > 0;
    const temMeios = (ultimoParagrafo.match(palavrasMeios) || []).length > 0;
    const temEfeitos =
      (ultimoParagrafo.match(palavrasEfeitos) || []).length > 0;

    const mencionaDireitosHumanos =
      ultimoParagrafo.toLowerCase().includes("direitos humanos") ||
      ultimoParagrafo.toLowerCase().includes("dignidade") ||
      ultimoParagrafo.toLowerCase().includes("cidadania") ||
      ultimoParagrafo.toLowerCase().includes("igualdade") ||
      ultimoParagrafo.toLowerCase().includes("respeito");

    let pontosCompetencia5 = 0;

    if (temAgentes) pontosCompetencia5 += 40;
    if (temAcoes) pontosCompetencia5 += 40;
    if (temMeios) pontosCompetencia5 += 40;
    if (temEfeitos) pontosCompetencia5 += 40;
    if (mencionaDireitosHumanos) pontosCompetencia5 += 40;

    if (ultimoParagrafo.length < 200) {
      pontosCompetencia5 = Math.max(0, pontosCompetencia5 - 40);
    }

    competencia5 = ajustarParaEscalaEnem(pontosCompetencia5);

    const isExceptional =
      wordsCount > 350 &&
      paragraphsCount >= 4 &&
      connectivesCount >= 15 &&
      repertorioSociocultural.quality === "excellent" &&
      qualidadeArgumentativa.argumentCount >= 3 &&
      qualidadeArgumentativa.counterArgumentPresent &&
      temAgentes &&
      temAcoes &&
      temMeios &&
      temEfeitos &&
      mencionaDireitosHumanos;

    if (isExceptional) {
      competencia1 = Math.min(200, competencia1 + 20);
      competencia2 = Math.min(200, competencia2 + 20);
      competencia3 = Math.min(200, competencia3 + 20);
      competencia4 = Math.min(200, competencia4 + 20);
      competencia5 = Math.min(200, competencia5 + 20);
    }
  }

  const totalScore =
    competencia1 + competencia2 + competencia3 + competencia4 + competencia5;

  const categories = {
    competencia1,
    competencia2,
    competencia3,
    competencia4,
    competencia5,
  };

  const socioculturalReferences = analisarRepertorioSociocultural(text);

  const feedback = formatFeedback(
    "",
    categories,
    totalScore,
    undefined,
    undefined
  );

  const corrections = [];

  const commonErrors = [
    { error: /concerteza/gi, fix: "com certeza", type: "spelling" as const },
    { error: /porisso/gi, fix: "por isso", type: "spelling" as const },
    { error: /apartir/gi, fix: "a partir", type: "spelling" as const },
    { error: /\bsi\b/gi, fix: "se", type: "grammar" as const },
    {
      error: /\bmau\b\s+(uso|exemplo|desempenho)/gi,
      fix: "mau",
      type: "grammar" as const,
    },
  ];

  commonErrors.forEach(({ error, fix, type }) => {
    let match;
    while ((match = error.exec(text)) !== null) {
      corrections.push({
        original: match[0],
        suggested: fix,
        type,
        position: {
          start: match.index,
          end: match.index + match[0].length,
        },
      });
    }
  });

  return {
    text,
    corrections,
    score: {
      total: totalScore,
      categories: {
        competencia1,
        competencia2,
        competencia3,
        competencia4,
        competencia5,
      },
    },
    feedback,
    statistics: {
      connectivesCount,
      paragraphsCount,
      wordsCount,
      charactersCount: text.length,
      linesCount,
      estimatedLines,
    },
    theme,
    title,
    zeroReason,
    socioculturalReferences,
  };
};

function ajustarParaEscalaEnem(pontos: number): number {
  if (pontos >= 180) return 200;
  if (pontos >= 140) return 160;
  if (pontos >= 100) return 120;
  if (pontos >= 60) return 80;
  if (pontos >= 20) return 40;
  return 0;
}

function analisarRepertorioSociocultural(text: string) {
  const filosofos =
    /(platão|aristóteles|sócrates|kant|nietzsche|sartre|foucault|marx|hegel|schopenhauer|rousseau|descartes|locke|hume|spinoza|heidegger|voltaire|hobbes|bacon)/gi;
  const conceitosFilosoficos =
    /(ética|moral|epistemologia|metafísica|existencialismo|empirismo|racionalismo|positivismo|fenomenologia|dialética|idealismo|materialismo|utilitarismo|ontologia)/gi;

  const eventosHistoricos =
    /(segunda guerra|guerra fria|revolução industrial|revolução francesa|idade média|renascimento|iluminismo|colonização|ditadura|república|império|escravidão|independência)/gi;
  const personagensHistoricas =
    /(getúlio vargas|dom pedro|princesa isabel|napoleão|hitler|martin luther king|gandhi|mandela|churchill|abraham lincoln|lula|bolsonaro)/gi;

  const autoresLiterarios =
    /(machado de assis|clarice lispector|guimarães rosa|cecília meireles|carlos drummond|shakespeare|dostoiévski|kafka|camus|orwell|saramago)/gi;
  const obrasLiterarias =
    /(dom casmurro|grande sertão|cem anos de solidão|memórias póstumas|vidas secas|morte e vida severina|1984|crime e castigo|metamorfose)/gi;

  const documentosJuridicos =
    /(constituição federal|código civil|código penal|estatuto da criança|estatuto do idoso|lei maria da penha|declaração universal dos direitos humanos|carta magna)/gi;
  const conceitosJuridicos =
    /(direito constitucional|direitos humanos|direitos fundamentais|estado democrático de direito|princípio da dignidade|hermenêutica jurídica)/gi;

  const fontesEstatisticas =
    /(ibge|ipea|onu|unicef|oms|pnud|unesco|ocde|fmi|banco mundial)/gi;
  const conceitosCientificos =
    /(método científico|estudo longitudinal|amostragem estatística|correlação|causalidade|pesquisa quantitativa|pesquisa qualitativa)/gi;

  const contarOcorrencias = (regex: RegExp) => {
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  const refsFilosoficas =
    contarOcorrencias(filosofos) + contarOcorrencias(conceitosFilosoficos);
  const refsHistoricas =
    contarOcorrencias(eventosHistoricos) +
    contarOcorrencias(personagensHistoricas);
  const refsLiterarias =
    contarOcorrencias(autoresLiterarios) + contarOcorrencias(obrasLiterarias);
  const refsJuridicas =
    contarOcorrencias(documentosJuridicos) +
    contarOcorrencias(conceitosJuridicos);
  const refsCientificas =
    contarOcorrencias(fontesEstatisticas) +
    contarOcorrencias(conceitosCientificos);

  const totalRefs =
    refsFilosoficas +
    refsHistoricas +
    refsLiterarias +
    refsJuridicas +
    refsCientificas;

  let tipo = "";
  if (refsFilosoficas > 0) tipo += "filosófico ";
  if (refsHistoricas > 0) tipo += "histórico ";
  if (refsLiterarias > 0) tipo += "literário ";
  if (refsJuridicas > 0) tipo += "jurídico ";
  if (refsCientificas > 0) tipo += "científico ";

  if (tipo === "") tipo = "não identificado";

  const exemplosPossiveis = [
    ...(text.match(
      /(?:conforme|segundo|como afirma|de acordo com)[^.]*?(platão|aristóteles|sócrates|kant|nietzsche)[^.]*?\./gi
    ) || []),
    // História
    ...(text.match(
      /(?:como ocorreu|durante|no período)[^.]*?(segunda guerra|revolução francesa|ditadura)[^.]*?\./gi
    ) || []),
    // Literatura
    ...(text.match(
      /(?:como retratado|como escreveu|na obra)[^.]*?(machado de assis|clarice lispector|dom casmurro)[^.]*?\./gi
    ) || []),
    // Jurídico
    ...(text.match(
      /(?:segundo a|conforme a|de acordo com a)[^.]*?(constituição federal|código civil|estatuto)[^.]*?\./gi
    ) || []),
    // Científico
    ...(text.match(
      /(?:dados do|pesquisa do|segundo o)[^.]*?(ibge|ipea|onu|unicef|oms)[^.]*?\./gi
    ) || []),
  ];

  const exemplos = exemplosPossiveis.slice(0, 3);

  if (exemplos.length === 0) {
    if (refsFilosoficas > 0) exemplos.push("conceitos filosóficos");
    if (refsHistoricas > 0) exemplos.push("referências históricas");
    if (refsLiterarias > 0) exemplos.push("referências literárias");
    if (refsJuridicas > 0) exemplos.push("referências jurídicas");
    if (refsCientificas > 0)
      exemplos.push("referências científicas e estatísticas");
  }

  let qualidade: "excellent" | "good" | "average" | "poor" = "poor";

  const tiposDiferentes = [
    refsFilosoficas > 0,
    refsHistoricas > 0,
    refsLiterarias > 0,
    refsJuridicas > 0,
    refsCientificas > 0,
  ].filter(Boolean).length;

  if (totalRefs === 0) {
    qualidade = "poor";
  } else if (tiposDiferentes >= 3 && totalRefs >= 4) {
    qualidade = "excellent";
  } else if (tiposDiferentes >= 2 && totalRefs >= 3) {
    qualidade = "good";
  } else if (totalRefs >= 1) {
    qualidade = "average";
  }

  return {
    present: totalRefs > 0,
    examples: exemplos.length > 0 ? exemplos : ["não identificado"],
    quality: qualidade,
    type: tipo.trim(),
  };
}

function analisarArgumentacao(
  text: string,
  connectivesCount: number,
  paragraphsCount: number
) {
  const paragrafos = text.split("\n\n").filter(Boolean);

  if (paragrafos.length === 0) {
    return {
      hasThesis: false,
      hasConclusion: false,
      argumentCount: 0,
      counterArgumentPresent: false,
      connectivesUsed: [],
      topicCoherence: 0,
      paragraphProgression: false,
    };
  }

  const primeiroParagrafo = paragrafos[0].toLowerCase();
  const ultimoParagrafo = paragrafos[paragrafos.length - 1].toLowerCase();

  const hasTese =
    primeiroParagrafo.includes("importante") ||
    primeiroParagrafo.includes("fundamental") ||
    primeiroParagrafo.includes("essencial") ||
    primeiroParagrafo.includes("necessário") ||
    primeiroParagrafo.includes("primordial") ||
    primeiroParagrafo.includes("indubitável") ||
    primeiroParagrafo.includes("inegável");

  const hasConclusao =
    ultimoParagrafo.includes("portanto") ||
    ultimoParagrafo.includes("assim") ||
    ultimoParagrafo.includes("dessa forma") ||
    ultimoParagrafo.includes("por fim") ||
    ultimoParagrafo.includes("em suma") ||
    ultimoParagrafo.includes("diante do exposto") ||
    ultimoParagrafo.includes("conclui-se");

  const argumentCount = Math.max(0, paragrafos.length - 2);

  const contraArgumentacao =
    text.includes("entretanto") ||
    text.includes("contudo") ||
    text.includes("porém") ||
    text.includes("todavia") ||
    text.includes("no entanto") ||
    text.includes("apesar de") ||
    text.includes("embora") ||
    text.includes("por outro lado");

  const conectivosComuns = [
    "portanto",
    "assim",
    "dessa forma",
    "logo",
    "por fim",
    "primeiramente",
    "além disso",
    "ademais",
    "outrossim",
    "entretanto",
    "contudo",
    "porém",
    "todavia",
    "no entanto",
    "por exemplo",
    "como",
    "tal qual",
    "conforme",
  ];

  const conectivosUsados = conectivosComuns.filter((c) =>
    text.toLowerCase().includes(c)
  );

  let topicCoherence = 50;

  if (conectivosUsados.length > 5) topicCoherence += 20;
  else if (conectivosUsados.length > 3) topicCoherence += 10;

  const densidadeConectivos = connectivesCount / paragraphsCount;
  if (densidadeConectivos >= 2) topicCoherence += 20;
  else if (densidadeConectivos >= 1) topicCoherence += 10;

  const paragraphProgression = paragraphsCount >= 3 && hasTese && hasConclusao;

  return {
    hasThesis: hasTese,
    hasConclusion: hasConclusao,
    argumentCount: argumentCount,
    counterArgumentPresent: contraArgumentacao,
    connectivesUsed: conectivosUsados.slice(0, 5),
    topicCoherence: topicCoherence,
    paragraphProgression: paragraphProgression,
  };
}
