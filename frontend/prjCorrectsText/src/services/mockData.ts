
import { AnalysisResult } from './types';
import { countConnectives } from './utils';
import { formatFeedback } from './formatFeedback';

/**
 * Gera um resultado de análise simulado para testes
 * @param theme Tema da redação
 * @param title Título da redação (opcional)
 * @returns Resultado simulado da análise
 */
export const getMockAnalysisResult = (theme: string, title?: string): AnalysisResult => {
  // Texto de exemplo de uma redação
  const mockText = `A importância da educação no Brasil

É inegável que a educação representa um dos pilares fundamentais para o desenvolvimento socioeconômico de qualquer nação. No contexto brasileiro, marcado por profundas desigualdades sociais, o acesso à educação de qualidade torna-se ainda mais crucial. Entretanto, diversos fatores estruturais e históricos comprometem a efetividade do sistema educacional no país, exigindo uma análise aprofundada e intervenções precisas.

Primeiramente, é necessário reconhecer que a Constituição Federal de 1988 estabelece a educação como um direito social inalienável, sendo dever do Estado e da família proporcioná-la. Contudo, na prática, observa-se uma discrepância significativa entre o texto legal e a realidade educacional brasileira. Segundo dados do IBGE, aproximadamente 11 milhões de brasileiros ainda são analfabetos, evidenciando uma falha sistêmica no alcance e na qualidade da educação ofertada.

Além disso, a desigualdade no acesso à educação de qualidade perpetua ciclos de pobreza e exclusão social. Escolas em regiões periféricas e rurais frequentemente carecem de infraestrutura adequada, materiais didáticos e profissionais qualificados. Como consequência, estudantes dessas localidades enfrentam obstáculos adicionais em sua trajetória educacional, refletindo posteriormente em menores oportunidades no mercado de trabalho e na mobilidade social.

Outrossim, a valorização insuficiente dos profissionais da educação constitui outro entrave significativo. Professores brasileiros recebem salários abaixo da média de países com desenvolvimento semelhante e enfrentam condições de trabalho desafiadoras. Esta desvalorização não apenas compromete a qualidade do ensino, mas também desestimula novos talentos a ingressarem na carreira docente, criando um ciclo vicioso de precarização.

Portanto, é fundamental implementar políticas públicas abrangentes que visem não apenas a universalização do acesso à educação, mas também a garantia de sua qualidade. Investimentos consistentes em infraestrutura escolar, formação e valorização docente, bem como a adoção de metodologias pedagógicas inovadoras são medidas essenciais. Adicionalmente, parcerias entre governo, iniciativa privada e sociedade civil podem potencializar recursos e conhecimentos, criando um ecossistema educacional mais robusto e inclusivo. Somente através de um compromisso coletivo com a educação será possível construir um Brasil mais justo, desenvolvido e igualitário.`;

  // Simular algumas correções
  const corrections = [
    {
      original: 'inegável',
      suggested: 'inegável',
      type: 'spelling' as const,
      position: {
        start: 3,
        end: 11
      }
    },
    {
      original: 'inalienável',
      suggested: 'inalienável',
      type: 'grammar' as const,
      position: {
        start: 251,
        end: 262
      }
    }
  ];
  
  // Contar conectivos
  const connectivesCount = countConnectives(mockText);
  
  // Contar parágrafos
  const paragraphsCount = mockText.split('\n\n').length;
  
  // Contar palavras
  const wordsCount = mockText.split(/\s+/).filter(Boolean).length;
  
  // Contar linhas efetivamente
  const linesCount = mockText.split('\n').filter(line => line.trim().length > 0).length;
  
  // Estimar linhas baseadas em palavras (ENEM considera média de 10 palavras por linha)
  const estimatedLines = Math.ceil(wordsCount / 10);
  
  // Redefinir pontuações mais realistas para as competências ENEM
  // Esta é uma redação de alta qualidade, mas ajustando para ser mais realista
  const competencia1 = 180; // Domínio da norma culta (quase perfeito, mas com pequenos desvios)
  const competencia2 = 180; // Compreensão da proposta (muito boa, com repertório adequado)
  const competencia3 = 180; // Organização de argumentos (bem estruturada)
  const competencia4 = 180; // Mecanismos linguísticos (bom uso de conectivos)
  const competencia5 = 160; // Proposta de intervenção (boa, mas poderia ser mais detalhada)
  
  // Calcular pontuação total
  const totalScore = competencia1 + competencia2 + competencia3 + competencia4 + competencia5;

  // Identificar repertórios socioculturais (baseado em análise mais precisa)
  const socioculturalReferences = {
    present: true,
    examples: ["Constituição Federal de 1988", "dados do IBGE"],
    quality: "good" as const, 
    type: "jurídico e estatístico" 
  };

  // Simular se a redação foi zerada
  const zeroReason = null; // Se não for zero, usar null. Caso contrário, informar o motivo.

  // Gerar feedback formatado
  const feedback = formatFeedback("", {
    competencia1,
    competencia2,
    competencia3,
    competencia4,
    competencia5
  }, totalScore, undefined, undefined);
  
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
        competencia5
      }
    },
    feedback,
    statistics: {
      connectivesCount,
      paragraphsCount,
      wordsCount,
      charactersCount: mockText.length,
      linesCount,
      estimatedLines
    },
    theme: theme || 'A importância da educação no Brasil',
    title: title || 'A importância da educação no Brasil',
    zeroReason,
    socioculturalReferences
  };
};

/**
 * Gera um resultado de análise simulado a partir de um texto fornecido
 * @param text Texto da redação
 * @param theme Tema da redação
 * @param title Título da redação (opcional)
 * @returns Resultado simulado da análise
 */
export const getMockAnalysisResultFromText = (
  text: string, 
  theme: string,
  title?: string
): AnalysisResult => {
  // Contar conectivos
  const connectivesCount = countConnectives(text);
  
  // Contar parágrafos
  const paragraphsCount = text.split('\n\n').filter(Boolean).length || 1;
  
  // Contar palavras
  const wordsCount = text.split(/\s+/).filter(Boolean).length;
  
  // Contar linhas corretamente - considerando linhas não vazias
  const linesCount = text.split('\n').filter(line => line.trim().length > 0).length;
  
  // Estimar linhas baseadas em palavras (ENEM considera média de 10 palavras por linha)
  const estimatedLines = Math.ceil(wordsCount / 10);
  
  // Verificar se a redação deve ser zerada logo de início
  let zeroReason: string | null = null;
  
  // Verificar se a redação tem menos de 7 linhas estimadas
  if (estimatedLines < 7) {
    zeroReason = "Texto com menos de 7 linhas (estimativa)";
  }
  
  // Verificar se o texto é muito curto (menos de 30 palavras)
  if (wordsCount < 30) {
    zeroReason = "Texto com menos de 30 palavras";
  }
  
  // Verificar fuga ao tema (simplificado)
  // Uma análise real precisaria de processamento de linguagem natural mais avançado
  const keywords = theme.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  let keywordsFound = 0;
  
  if (keywords.length > 0) {
    const textLower = text.toLowerCase();
    keywordsFound = keywords.filter(word => textLower.includes(word)).length;
    
    // Se menos de 20% das palavras-chave do tema estiverem presentes
    if (keywordsFound / keywords.length < 0.2 && keywords.length >= 3) {
      zeroReason = "Possível fuga ao tema";
    }
  }
  
  // Avaliar cada competência apenas se a redação não foi zerada
  let competencia1 = 0;
  let competencia2 = 0;
  let competencia3 = 0;
  let competencia4 = 0;
  let competencia5 = 0;
  
  if (!zeroReason) {
    // Análise mais detalhada baseada em critérios ENEM
    
    // Competência 1: Domínio da norma padrão da língua escrita
    // Critérios reais: verificar erros gramaticais, ortográficos, concordância, regência, pontuação
    let errosGramaticais = 0;
    const errosComuns = [
      { regex: /\b(concerteza|porisso|apartir|entretato|cabeça-dura)\b/gi, count: 0 },
      { regex: /\b(a\s+menos|há\s+dois\s+dias\s+atrás|entrar\s+para\s+dentro)\b/gi, count: 0 },
      { regex: /\b(ansioso\s+com|em\s+vista\s+que|devido\s+que)\b/gi, count: 0 },
      { regex: /\b(fazem\s+\d+\s+anos|houveram\s+problemas)\b/gi, count: 0 },
      { regex: /[,.!?][A-Za-z]/g, count: 0 }, // Pontuação sem espaço
      { regex: /\s[,.!?]/g, count: 0 }, // Espaço antes da pontuação
      { regex: /\b(tava|tá|pra|pro)\b/gi, count: 0 }, // Linguagem informal
    ];
    
    errosComuns.forEach(erro => {
      const matches = text.match(erro.regex);
      if (matches) {
        erro.count = matches.length;
        errosGramaticais += matches.length;
      }
    });
    
    // Cálculo da competência 1 baseado em densidade de erros
    // Considerando tamanho do texto - textos maiores podem ter mais erros mas menor densidade
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
    
    // Competência 2: Compreensão da proposta e aplicação de conceitos das áreas de conhecimento
    // Critérios: aderência ao tema, repertório sociocultural, contextualização
    
    // Avaliar compreensão pelo número de palavras-chave relacionadas ao tema presentes
    // Avaliar estrutura dissertativa (introdução, desenvolvimento, conclusão)
    const temIntroducao = paragraphsCount >= 3 && text.split('\n\n')[0].length > 100;
    const temDesenvolvimento = paragraphsCount >= 3 && text.split('\n\n').slice(1, -1).every(p => p.length > 150);
    const temConclusao = paragraphsCount >= 3 && text.split('\n\n').slice(-1)[0].includes("portanto") || 
                                                 text.split('\n\n').slice(-1)[0].includes("assim") ||
                                                 text.split('\n\n').slice(-1)[0].includes("dessa forma");
    
    // Repertório sociocultural
    const repertorioSociocultural = analisarRepertorioSociocultural(text);
    
    // Calcular competência 2
    let pontosCompetencia2 = 0;
    
    // Estrutura dissertativa (até 80 pontos)
    if (temIntroducao && temDesenvolvimento && temConclusao) {
      pontosCompetencia2 += 80;
    } else if (temIntroducao && temDesenvolvimento) {
      pontosCompetencia2 += 60;
    } else if (temIntroducao || temConclusao) {
      pontosCompetencia2 += 40;
    }
    
    // Repertório sociocultural (até 120 pontos)
    if (repertorioSociocultural.present) {
      if (repertorioSociocultural.quality === 'excellent') {
        pontosCompetencia2 += 120;
      } else if (repertorioSociocultural.quality === 'good') {
        pontosCompetencia2 += 100;
      } else if (repertorioSociocultural.quality === 'average') {
        pontosCompetencia2 += 80;
      } else {
        pontosCompetencia2 += 60;
      }
    } else {
      // Se não há repertório, não pode passar de 80 pontos nesta competência
      pontosCompetencia2 = Math.min(pontosCompetencia2, 80);
    }
    
    // Ajustar para escala ENEM (de 40 em 40 pontos)
    competencia2 = ajustarParaEscalaEnem(pontosCompetencia2);
    
    // Competência 3: Selecionar, relacionar, organizar e interpretar informações em defesa de um ponto de vista
    // Critérios: seleção de argumentos, coerência, organização textual
    
    // Analisar a qualidade da argumentação
    const qualidadeArgumentativa = analisarArgumentacao(text, connectivesCount, paragraphsCount);
    
    let pontosCompetencia3 = 0;
    
    // Qualidade dos argumentos (até 80 pontos)
    if (qualidadeArgumentativa.argumentCount >= 3 && qualidadeArgumentativa.hasThesis) {
      pontosCompetencia3 += 80;
    } else if (qualidadeArgumentativa.argumentCount >= 2 && qualidadeArgumentativa.hasThesis) {
      pontosCompetencia3 += 60;
    } else if (qualidadeArgumentativa.argumentCount >= 1) {
      pontosCompetencia3 += 40;
    }
    
    // Organização e progressão textual (até 80 pontos)
    if (qualidadeArgumentativa.topicCoherence > 80 && qualidadeArgumentativa.paragraphProgression) {
      pontosCompetencia3 += 80;
    } else if (qualidadeArgumentativa.topicCoherence > 60) {
      pontosCompetencia3 += 60;
    } else if (qualidadeArgumentativa.topicCoherence > 40) {
      pontosCompetencia3 += 40;
    }
    
    // Contra-argumentação (até 40 pontos)
    if (qualidadeArgumentativa.counterArgumentPresent) {
      pontosCompetencia3 += 40;
    }
    
    // Ajustar para escala ENEM
    competencia3 = ajustarParaEscalaEnem(pontosCompetencia3);
    
    // Competência 4: Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação
    // Critérios: coesão textual, uso de conectivos, articulação entre parágrafos
    
    // Avaliar uso de conectivos e articuladores
    let pontosCompetencia4 = 0;
    
    // Densidade de conectivos (conectivos por parágrafo)
    const densidadeConectivos = connectivesCount / paragraphsCount;
    
    if (densidadeConectivos >= 3) {
      pontosCompetencia4 += 80;
    } else if (densidadeConectivos >= 2) {
      pontosCompetencia4 += 60;
    } else if (densidadeConectivos >= 1) {
      pontosCompetencia4 += 40;
    }
    
    // Variedade de conectivos
    const variedadeConectivos = new Set(text.match(/portanto|entretanto|contudo|assim|além disso|dessa forma|por outro lado|por fim|primeiramente|ademais/gi) || []).size;
    
    if (variedadeConectivos >= 5) {
      pontosCompetencia4 += 80;
    } else if (variedadeConectivos >= 3) {
      pontosCompetencia4 += 60;
    } else if (variedadeConectivos >= 1) {
      pontosCompetencia4 += 40;
    }
    
    // Equilíbrio no tamanho de parágrafos
    const paragrafos = text.split('\n\n').filter(Boolean);
    let tamanhos = paragrafos.map(p => p.length);
    const mediaTamanho = tamanhos.reduce((a, b) => a + b, 0) / tamanhos.length;
    const desviosTamanho = tamanhos.map(t => Math.abs(t - mediaTamanho));
    const desvioMedio = desviosTamanho.reduce((a, b) => a + b, 0) / desviosTamanho.length;
    const coeficienteVariacao = (desvioMedio / mediaTamanho) * 100;
    
    // Penalizar se os parágrafos forem muito desiguais em tamanho
    if (coeficienteVariacao > 50) {
      pontosCompetencia4 -= 20;
    }
    
    // Ajustar para escala ENEM
    competencia4 = ajustarParaEscalaEnem(pontosCompetencia4);
    
    // Competência 5: Elaborar proposta de intervenção para o problema respeitando os direitos humanos
    // Critérios: proposta concreta, detalhamento, respeito aos direitos humanos
    
    // Analisar o parágrafo final para verificar se há proposta de intervenção
    const ultimoParagrafo = text.split('\n\n').filter(Boolean).pop() || '';
    
    // Verificar presença de agentes, ações, meios/modos, efeitos e detalhamento
    const palavrasAgentes = /(governo|estado|sociedade|cidadãos|população|autoridades|instituições|empresas|escolas|universidades|comunidade)/gi;
    const palavrasAcoes = /(implementar|criar|desenvolver|estabelecer|promover|incentivar|fomentar|garantir|assegurar|proporcionar|investir)/gi;
    const palavrasMeios = /(por meio de|através de|a partir de|mediante|utilizando|com base em|com apoio de|em parceria)/gi;
    const palavrasEfeitos = /(assim|dessa forma|portanto|dessa maneira|desse modo|com isso|por conseguinte|logo|a fim de que|para que)/gi;
    
    const temAgentes = (ultimoParagrafo.match(palavrasAgentes) || []).length > 0;
    const temAcoes = (ultimoParagrafo.match(palavrasAcoes) || []).length > 0;
    const temMeios = (ultimoParagrafo.match(palavrasMeios) || []).length > 0;
    const temEfeitos = (ultimoParagrafo.match(palavrasEfeitos) || []).length > 0;
    
    // Verificar menção a direitos humanos
    const mencionaDireitosHumanos = ultimoParagrafo.toLowerCase().includes('direitos humanos') || 
                                   ultimoParagrafo.toLowerCase().includes('dignidade') ||
                                   ultimoParagrafo.toLowerCase().includes('cidadania') ||
                                   ultimoParagrafo.toLowerCase().includes('igualdade') ||
                                   ultimoParagrafo.toLowerCase().includes('respeito');
    
    let pontosCompetencia5 = 0;
    
    // Calcular pontuação base pela presença dos elementos
    if (temAgentes) pontosCompetencia5 += 40;
    if (temAcoes) pontosCompetencia5 += 40;
    if (temMeios) pontosCompetencia5 += 40;
    if (temEfeitos) pontosCompetencia5 += 40;
    if (mencionaDireitosHumanos) pontosCompetencia5 += 40;
    
    // Penalizar se a proposta for muito curta
    if (ultimoParagrafo.length < 200) {
      pontosCompetencia5 = Math.max(0, pontosCompetencia5 - 40);
    }
    
    // Uma redação nota 1000 precisa ter todos os elementos
    // Ajustar para escala ENEM
    competencia5 = ajustarParaEscalaEnem(pontosCompetencia5);

    // Para redações realmente excepcionais, ajustar notas mais altas
    // Verificar se é uma redação de altíssima qualidade
    const isExceptional = 
      wordsCount > 350 && // Mais de 350 palavras
      paragraphsCount >= 4 && // Pelo menos 4 parágrafos
      connectivesCount >= 15 && // Muitos conectivos
      repertorioSociocultural.quality === 'excellent' && // Excelente repertório
      qualidadeArgumentativa.argumentCount >= 3 && // Muitos argumentos
      qualidadeArgumentativa.counterArgumentPresent && // Conta com contra-argumentação
      temAgentes && temAcoes && temMeios && temEfeitos && mencionaDireitosHumanos; // Proposta completa
      
    if (isExceptional) {
      // Ajustar para notas muito altas (próximas de 1000)
      competencia1 = Math.min(200, competencia1 + 20);
      competencia2 = Math.min(200, competencia2 + 20);
      competencia3 = Math.min(200, competencia3 + 20);
      competencia4 = Math.min(200, competencia4 + 20);
      competencia5 = Math.min(200, competencia5 + 20);
    }
  }
  
  // Calcular pontuação total
  const totalScore = competencia1 + competencia2 + competencia3 + competencia4 + competencia5;
  
  // Criar o objeto de categorias para passar para o formatFeedback
  const categories = {
    competencia1,
    competencia2,
    competencia3,
    competencia4,
    competencia5
  };
  
  // Identificar repertórios socioculturais
  const socioculturalReferences = analisarRepertorioSociocultural(text);
  
  // Gerar feedback formatado
  const feedback = formatFeedback("", categories, totalScore, undefined, undefined);
  
  // Simular algumas correções básicas
  const corrections = [];
  
  // Detectar erros comuns (exemplo simples)
  const commonErrors = [
    { error: /concerteza/gi, fix: 'com certeza', type: 'spelling' as const },
    { error: /porisso/gi, fix: 'por isso', type: 'spelling' as const },
    { error: /apartir/gi, fix: 'a partir', type: 'spelling' as const },
    { error: /\bsi\b/gi, fix: 'se', type: 'grammar' as const },
    { error: /\bmau\b\s+(uso|exemplo|desempenho)/gi, fix: 'mau', type: 'grammar' as const }
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
          end: match.index + match[0].length
        }
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
        competencia5
      }
    },
    feedback,
    statistics: {
      connectivesCount,
      paragraphsCount,
      wordsCount,
      charactersCount: text.length,
      linesCount,
      estimatedLines
    },
    theme,
    title,
    zeroReason,
    socioculturalReferences
  };
};

/**
 * Ajusta uma pontuação para a escala do ENEM (0, 40, 80, 120, 160, 200)
 * @param pontos Pontuação a ser ajustada
 * @returns Pontuação ajustada para escala ENEM
 */
function ajustarParaEscalaEnem(pontos: number): number {
  if (pontos >= 180) return 200;
  if (pontos >= 140) return 160;
  if (pontos >= 100) return 120;
  if (pontos >= 60) return 80;
  if (pontos >= 20) return 40;
  return 0;
}

/**
 * Analisa a presença e qualidade de repertório sociocultural
 * @param text Texto da redação
 * @returns Análise do repertório sociocultural
 */
function analisarRepertorioSociocultural(text: string) {
  // Detecção de repertório sociocultural mais sofisticada
  // Repertórios comuns: filosófico, histórico, literário, artístico, científico, jurídico
  
  // Verificar citações filosóficas
  const filosofos = /(platão|aristóteles|sócrates|kant|nietzsche|sartre|foucault|marx|hegel|schopenhauer|rousseau|descartes|locke|hume|spinoza|heidegger|voltaire|hobbes|bacon)/gi;
  const conceitosFilosoficos = /(ética|moral|epistemologia|metafísica|existencialismo|empirismo|racionalismo|positivismo|fenomenologia|dialética|idealismo|materialismo|utilitarismo|ontologia)/gi;
  
  // Verificar referências históricas
  const eventosHistoricos = /(segunda guerra|guerra fria|revolução industrial|revolução francesa|idade média|renascimento|iluminismo|colonização|ditadura|república|império|escravidão|independência)/gi;
  const personagensHistoricas = /(getúlio vargas|dom pedro|princesa isabel|napoleão|hitler|martin luther king|gandhi|mandela|churchill|abraham lincoln|lula|bolsonaro)/gi;
  
  // Verificar referências literárias
  const autoresLiterarios = /(machado de assis|clarice lispector|guimarães rosa|cecília meireles|carlos drummond|shakespeare|dostoiévski|kafka|camus|orwell|saramago)/gi;
  const obrasLiterarias = /(dom casmurro|grande sertão|cem anos de solidão|memórias póstumas|vidas secas|morte e vida severina|1984|crime e castigo|metamorfose)/gi;
  
  // Verificar referências jurídicas
  const documentosJuridicos = /(constituição federal|código civil|código penal|estatuto da criança|estatuto do idoso|lei maria da penha|declaração universal dos direitos humanos|carta magna)/gi;
  const conceitosJuridicos = /(direito constitucional|direitos humanos|direitos fundamentais|estado democrático de direito|princípio da dignidade|hermenêutica jurídica)/gi;
  
  // Verificar referências científicas e estatísticas
  const fontesEstatisticas = /(ibge|ipea|onu|unicef|oms|pnud|unesco|ocde|fmi|banco mundial)/gi;
  const conceitosCientificos = /(método científico|estudo longitudinal|amostragem estatística|correlação|causalidade|pesquisa quantitativa|pesquisa qualitativa)/gi;
  
  // Contagem de referências por tipo
  const contarOcorrencias = (regex: RegExp) => {
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };
  
  const refsFilosoficas = contarOcorrencias(filosofos) + contarOcorrencias(conceitosFilosoficos);
  const refsHistoricas = contarOcorrencias(eventosHistoricos) + contarOcorrencias(personagensHistoricas);
  const refsLiterarias = contarOcorrencias(autoresLiterarios) + contarOcorrencias(obrasLiterarias);
  const refsJuridicas = contarOcorrencias(documentosJuridicos) + contarOcorrencias(conceitosJuridicos);
  const refsCientificas = contarOcorrencias(fontesEstatisticas) + contarOcorrencias(conceitosCientificos);
  
  // Total de referências
  const totalRefs = refsFilosoficas + refsHistoricas + refsLiterarias + refsJuridicas + refsCientificas;
  
  // Determinar o tipo predominante
  let tipo = "";
  if (refsFilosoficas > 0) tipo += "filosófico ";
  if (refsHistoricas > 0) tipo += "histórico ";
  if (refsLiterarias > 0) tipo += "literário ";
  if (refsJuridicas > 0) tipo += "jurídico ";
  if (refsCientificas > 0) tipo += "científico ";
  
  if (tipo === "") tipo = "não identificado";
  
  // Extrair exemplos específicos
  const exemplosPossiveis = [
    // Filosofia
    ...text.match(/(?:conforme|segundo|como afirma|de acordo com)[^.]*?(platão|aristóteles|sócrates|kant|nietzsche)[^.]*?\./gi) || [],
    // História
    ...text.match(/(?:como ocorreu|durante|no período)[^.]*?(segunda guerra|revolução francesa|ditadura)[^.]*?\./gi) || [],
    // Literatura
    ...text.match(/(?:como retratado|como escreveu|na obra)[^.]*?(machado de assis|clarice lispector|dom casmurro)[^.]*?\./gi) || [],
    // Jurídico
    ...text.match(/(?:segundo a|conforme a|de acordo com a)[^.]*?(constituição federal|código civil|estatuto)[^.]*?\./gi) || [],
    // Científico
    ...text.match(/(?:dados do|pesquisa do|segundo o)[^.]*?(ibge|ipea|onu|unicef|oms)[^.]*?\./gi) || [],
  ];
  
  // Limitar a 3 exemplos
  const exemplos = exemplosPossiveis.slice(0, 3);
  
  // Se não encontrou exemplos específicos, usar identificações genéricas
  if (exemplos.length === 0) {
    if (refsFilosoficas > 0) exemplos.push("conceitos filosóficos");
    if (refsHistoricas > 0) exemplos.push("referências históricas");
    if (refsLiterarias > 0) exemplos.push("referências literárias");
    if (refsJuridicas > 0) exemplos.push("referências jurídicas");
    if (refsCientificas > 0) exemplos.push("referências científicas e estatísticas");
  }
  
  // Determinar qualidade do repertório
  let qualidade: "excellent" | "good" | "average" | "poor" = "poor";
  
  // Tipos diferentes de repertório
  const tiposDiferentes = [
    refsFilosoficas > 0,
    refsHistoricas > 0,
    refsLiterarias > 0,
    refsJuridicas > 0,
    refsCientificas > 0
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
    type: tipo.trim()
  };
}

/**
 * Analisa a qualidade argumentativa do texto
 * @param text Texto da redação
 * @param connectivesCount Número de conectivos
 * @param paragraphsCount Número de parágrafos
 * @returns Análise da argumentação
 */
function analisarArgumentacao(text: string, connectivesCount: number, paragraphsCount: number) {
  // Verificar presença de tese no primeiro parágrafo
  const paragrafos = text.split('\n\n').filter(Boolean);
  
  if (paragrafos.length === 0) {
    return {
      hasThesis: false,
      hasConclusion: false,
      argumentCount: 0,
      counterArgumentPresent: false,
      connectivesUsed: [],
      topicCoherence: 0,
      paragraphProgression: false
    };
  }
  
  const primeiroParagrafo = paragrafos[0].toLowerCase();
  const ultimoParagrafo = paragrafos[paragrafos.length - 1].toLowerCase();
  
  // Detecção simplificada de tese
  const hasTese = primeiroParagrafo.includes("importante") || 
                primeiroParagrafo.includes("fundamental") || 
                primeiroParagrafo.includes("essencial") || 
                primeiroParagrafo.includes("necessário") ||
                primeiroParagrafo.includes("primordial") ||
                primeiroParagrafo.includes("indubitável") ||
                primeiroParagrafo.includes("inegável");
  
  // Detecção de conclusão coerente
  const hasConclusao = ultimoParagrafo.includes("portanto") || 
                     ultimoParagrafo.includes("assim") || 
                     ultimoParagrafo.includes("dessa forma") || 
                     ultimoParagrafo.includes("por fim") ||
                     ultimoParagrafo.includes("em suma") ||
                     ultimoParagrafo.includes("diante do exposto") ||
                     ultimoParagrafo.includes("conclui-se");
  
  // Estimar número de argumentos (parágrafos de desenvolvimento, simplificado)
  const argumentCount = Math.max(0, paragrafos.length - 2); // Excluindo introdução e conclusão
  
  // Verificar contra-argumentação
  const contraArgumentacao = text.includes("entretanto") || 
                            text.includes("contudo") || 
                            text.includes("porém") || 
                            text.includes("todavia") ||
                            text.includes("no entanto") ||
                            text.includes("apesar de") ||
                            text.includes("embora") ||
                            text.includes("por outro lado");
  
  // Extrair conectivos usados (simplificado)
  const conectivosComuns = [
    "portanto", "assim", "dessa forma", "logo", "por fim",
    "primeiramente", "além disso", "ademais", "outrossim", 
    "entretanto", "contudo", "porém", "todavia", "no entanto",
    "por exemplo", "como", "tal qual", "conforme"
  ];
  
  const conectivosUsados = conectivosComuns.filter(c => text.toLowerCase().includes(c));
  
  // Avaliar coerência entre tópicos (simplificado)
  // Uma análise real utilizaria técnicas mais avançadas de NLP
  let topicCoherence = 50; // Base
  
  // Aumentar coerência se houver bom uso de conectivos
  if (conectivosUsados.length > 5) topicCoherence += 20;
  else if (conectivosUsados.length > 3) topicCoherence += 10;
  
  // Aumentar coerência se houver densidade adequada de conectivos por parágrafo
  const densidadeConectivos = connectivesCount / paragraphsCount;
  if (densidadeConectivos >= 2) topicCoherence += 20;
  else if (densidadeConectivos >= 1) topicCoherence += 10;
  
  // Verificar se há progressão entre parágrafos
  const paragraphProgression = paragraphsCount >= 3 && hasTese && hasConclusao;
  
  return {
    hasThesis: hasTese,
    hasConclusion: hasConclusao,
    argumentCount: argumentCount,
    counterArgumentPresent: contraArgumentacao,
    connectivesUsed: conectivosUsados.slice(0, 5), // Limitar a 5 exemplos
    topicCoherence: topicCoherence,
    paragraphProgression: paragraphProgression
  };
}
