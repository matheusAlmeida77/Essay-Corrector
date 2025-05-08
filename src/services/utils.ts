const CONNECTIVES = [
  // Aditivos
  'além disso', 'ademais', 'também', 'além do mais', 'ainda', 'e',
  'não só... mas também', 'tanto... quanto', 'não apenas... como também',
  'inclusive', 'até mesmo', 'igualmente', 'do mesmo modo', 'bem como',
  
  // Adversativos
  'mas', 'porém', 'todavia', 'contudo', 'entretanto', 'no entanto', 
  'apesar de', 'embora', 'ainda que', 'mesmo que', 'posto que', 
  'conquanto', 'se bem que', 'não obstante', 'por outro lado',
  
  // Causais
  'porque', 'pois', 'já que', 'uma vez que', 'visto que', 'devido a', 
  'por causa de', 'como', 'sendo assim', 'dado que', 'considerando que',
  'tendo em vista que', 'em virtude de', 'haja vista', 'posto que',
  
  // Conclusivos
  'portanto', 'logo', 'por conseguinte', 'por isso', 'assim', 'dessa forma', 
  'desse modo', 'então', 'em conclusão', 'consequentemente', 'destarte',
  'em suma', 'diante do exposto', 'sendo assim', 'por fim', 'enfim',
  
  // Explicativos
  'ou seja', 'isto é', 'a saber', 'em outras palavras', 'quer dizer', 
  'por exemplo', 'vale ressaltar', 'vale lembrar', 'em especial',
  'assim', 'com efeito', 'naturalmente', 'cabe destacar',
  
  // Temporais
  'quando', 'enquanto', 'antes que', 'depois que', 'logo que', 'desde que', 
  'até que', 'sempre que', 'assim que', 'à medida que', 'ao passo que',
  'no momento em que', 'concomitantemente', 'simultaneamente',
  
  // Conformativos
  'conforme', 'segundo', 'consoante', 'de acordo com', 'como', 
  'em conformidade com', 'em consonância com', 'em harmonia com',
  
  // Comparativos
  'mais que', 'menos que', 'como', 'assim como', 'tal qual', 'tanto quanto',
  'do mesmo modo que', 'da mesma maneira que', 'à semelhança de',
  
  // Concessivos
  'embora', 'apesar de', 'mesmo que', 'ainda que', 'se bem que', 'posto que',
  'conquanto', 'não obstante', 'malgrado', 'em que pese', 'por mais que',
  
  // Finais
  'para que', 'a fim de que', 'com o intuito de', 'com o propósito de', 
  'para', 'a fim de', 'com o objetivo de', 'visando a', 'de modo a',
  'com vistas a', 'objetivando', 'intencionando', 'tencionando',
  
  // Alternância
  'ou', 'ora... ora', 'quer... quer', 'seja... seja', 'nem... nem', 
  'já... já', 'alternativamente', 'em alternativa',
  
  // Propostas de intervenção
  'é necessário', 'é preciso', 'deve-se', 'cabe ao', 'cabe à',
  'é fundamental', 'urge que', 'faz-se necessário', 'torna-se essencial'
];

/**
 * Lista de palavras-chave associadas a repertório sociocultural
 */
const REPERTORIO_KEYWORDS = [
  // Repertório filosófico
  'platão', 'aristóteles', 'sócrates', 'kant', 'nietzsche', 'sartre', 'foucault',
  'marx', 'hegel', 'schopenhauer', 'rousseau', 'descartes', 'locke', 'hume',
  'spinoza', 'heidegger', 'voltaire', 'hobbes', 'bacon', 'arendt', 'bourdieu',
  
  // Conceitos filosóficos
  'ética', 'moral', 'epistemologia', 'metafísica', 'existencialismo', 'empirismo',
  'racionalismo', 'positivismo', 'fenomenologia', 'dialética', 'idealismo',
  'materialismo', 'utilitarismo', 'ontologia', 'determinismo', 'livre-arbítrio',
  
  // Repertório histórico
  'segunda guerra', 'guerra fria', 'revolução industrial', 'revolução francesa',
  'idade média', 'renascimento', 'iluminismo', 'colonização', 'ditadura',
  'república', 'império', 'escravidão', 'independência', 'golpe de',
  'proclamação da república', 'era vargas', 'nova república', 'período militar',
  
  // Repertório literário
  'machado de assis', 'clarice lispector', 'guimarães rosa', 'cecília meireles',
  'carlos drummond', 'shakespeare', 'dostoiévski', 'kafka', 'camus', 'orwell',
  'saramago', 'graciliano ramos', 'jorge amado', 'camões', 'érico veríssimo',
  
  // Repertório jurídico
  'constituição federal', 'código civil', 'código penal', 'estatuto da criança',
  'estatuto do idoso', 'lei maria da penha', 'direitos humanos', 'poder judiciário',
  'stf', 'supremo tribunal', 'devido processo legal', 'estado de direito',
  
  // Repertório científico
  'darwin', 'einstein', 'newton', 'freud', 'galileu', 'hawking', 'aquecimento global',
  'pandemia', 'teoria da relatividade', 'seleção natural', 'gravitação', 'genética',
  'método científico', 'crise climática', 'sustentabilidade', 'biodiversidade',
  
  // Referências a documentos/instituições
  'onu', 'unesco', 'oms', 'unicef', 'ibge', 'ipea', 'declaração universal',
  'agenda 2030', 'constituição de 1988', 'carta magna', 'pnud', 'ocde'
];

export const countConnectives = (text: string): number => {
  if (!text) return 0;
  
  const lowerText = text.toLowerCase();
  let count = 0;
  
  for (const connective of CONNECTIVES) {
    if (connective.includes('...')) {
      const parts = connective.split('...');
      const regex = new RegExp(`${parts[0]}[^.]*?${parts[1]}`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) count += matches.length;
    } else {
      const pattern = new RegExp(`\\b${connective.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = lowerText.match(pattern);
      if (matches) count += matches.length;
    }
  }
  
  return count;
};

export const detectSocioculturalRepertoire = (text: string): {
  present: boolean;
  examples: string[];
  quality: 'excellent' | 'good' | 'average' | 'poor';
  type: string;
} => {
  if (!text) return { present: false, examples: [], quality: 'poor', type: '' };
  
  const lowerText = text.toLowerCase();
  const foundRepertoire: string[] = [];
  
  REPERTORIO_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword.toLowerCase())) {
      const context = extractContext(lowerText, keyword.toLowerCase());
      if (context) foundRepertoire.push(context);
    }
  });
  
  const citations = text.match(/"([^"]+)"/g) || [];
  citations.forEach(citation => {
    if (citation.length > 15) {
      foundRepertoire.push(citation);
    }
  });
  
  let quality: 'excellent' | 'good' | 'average' | 'poor' = 'poor';
  if (foundRepertoire.length >= 5) {
    quality = 'excellent';
  } else if (foundRepertoire.length >= 3) {
    quality = 'good';
  } else if (foundRepertoire.length >= 1) {
    quality = 'average';
  }
  
  let type = '';
  if (foundRepertoire.some(r => 
    REPERTORIO_KEYWORDS.slice(0, 16).some(k => r.toLowerCase().includes(k.toLowerCase())))) {
    type += 'filosófico ';
  }
  if (foundRepertoire.some(r => 
    REPERTORIO_KEYWORDS.slice(32, 50).some(k => r.toLowerCase().includes(k.toLowerCase())))) {
    type += 'histórico ';
  }
  if (foundRepertoire.some(r => 
    REPERTORIO_KEYWORDS.slice(50, 65).some(k => r.toLowerCase().includes(k.toLowerCase())))) {
    type += 'literário ';
  }
  if (foundRepertoire.some(r => 
    REPERTORIO_KEYWORDS.slice(65, 77).some(k => r.toLowerCase().includes(k.toLowerCase())))) {
    type += 'jurídico ';
  }
  if (foundRepertoire.some(r => 
    REPERTORIO_KEYWORDS.slice(77, 93).some(k => r.toLowerCase().includes(k.toLowerCase())))) {
    type += 'científico ';
  }
  
  return {
    present: foundRepertoire.length > 0,
    examples: foundRepertoire.slice(0, 5),
    quality,
    type: type.trim() || 'não identificado'
  };
};

const extractContext = (text: string, keyword: string): string | null => {
  const index = text.indexOf(keyword);
  if (index === -1) return null;
  
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + keyword.length + 40);
  
  return text.substring(start, end).replace(/\s+/g, ' ').trim();
};

export const analyzeIntervention = (text: string): {
  hasIntervention: boolean;
  hasAgent: boolean;
  hasAction: boolean;
  hasMeans: boolean;
  hasEffect: boolean;
  respectsHumanRights: boolean;
  detailLevel: 'high' | 'medium' | 'low';
} => {
  if (!text) {
    return {
      hasIntervention: false,
      hasAgent: false,
      hasAction: false,
      hasMeans: false,
      hasEffect: false,
      respectsHumanRights: false,
      detailLevel: 'low'
    };
  }
  
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  if (paragraphs.length === 0) return {
    hasIntervention: false,
    hasAgent: false,
    hasAction: false,
    hasMeans: false,
    hasEffect: false,
    respectsHumanRights: false,
    detailLevel: 'low'
  };
  
  let lastParagraphs = '';
  if (paragraphs.length >= 2 && paragraphs[paragraphs.length-1].length < 300) {
    lastParagraphs = paragraphs[paragraphs.length-2] + ' ' + paragraphs[paragraphs.length-1];
  } else {
    lastParagraphs = paragraphs[paragraphs.length-1];
  }
  
  const lowerText = lastParagraphs.toLowerCase();
  
  const interventionIndicators = [
    'portanto', 'assim', 'logo', 'dessa forma', 'desse modo', 
    'é necessário', 'é preciso', 'deve-se', 'faz-se necessário',
    'propõe-se', 'sugere-se', 'urge que', 'cabe ao', 'cabe à'
  ];
  
  const hasIntervention = interventionIndicators.some(indicator => 
    lowerText.includes(indicator));
  
  const agentIndicators = [
    'governo', 'estado', 'ministério', 'prefeitura', 'congresso',
    'câmara', 'senado', 'mídia', 'escola', 'universidade', 'família',
    'sociedade', 'população', 'cidadãos', 'empresas', 'ongs', 'instituições'
  ];
  
  const hasAgent = agentIndicators.some(agent => 
    new RegExp(`\\b${agent}\\b`, 'i').test(lowerText));
  
  const actionIndicators = [
    'implementar', 'criar', 'desenvolver', 'promover', 'estabelecer',
    'garantir', 'assegurar', 'incentivar', 'fomentar', 'realizar',
    'proporcionar', 'investir', 'fiscalizar', 'ampliar', 'intensificar'
  ];
  
  const hasAction = actionIndicators.some(action => 
    new RegExp(`\\b${action}\\b`, 'i').test(lowerText));
  
  const meansIndicators = [
    'por meio de', 'através de', 'mediante', 'a partir de', 'utilizando',
    'com o apoio de', 'com o suporte de', 'em parceria com', 'por intermédio de'
  ];
  
  const hasMeans = meansIndicators.some(means => lowerText.includes(means));
  
  const effectIndicators = [
    'a fim de', 'para que', 'com o intuito de', 'visando', 'objetivando',
    'com o objetivo de', 'de modo a', 'para', 'com vistas a', 'no sentido de'
  ];
  
  const hasEffect = effectIndicators.some(effect => lowerText.includes(effect));
  
  const humanRightsIndicators = [
    'direitos humanos', 'dignidade', 'cidadania', 'direitos fundamentais',
    'respeito', 'igualdade', 'equidade', 'inclusão', 'democracia', 'diversidade'
  ];
  
  const respectsHumanRights = humanRightsIndicators.some(hr => lowerText.includes(hr));
  
  let detailLevel: 'high' | 'medium' | 'low' = 'low';
  
  const detailScore = [
    hasAgent, hasAction, hasMeans, hasEffect, respectsHumanRights
  ].filter(Boolean).length;
  
  if (detailScore >= 4) {
    detailLevel = 'high';
  } else if (detailScore >= 2) {
    detailLevel = 'medium';
  }
  
  return {
    hasIntervention,
    hasAgent,
    hasAction,
    hasMeans,
    hasEffect,
    respectsHumanRights,
    detailLevel
  };
};
