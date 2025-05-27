export const connectivesList = [
  // Aditivos
  "além disso",
  "ademais",
  "também",
  "e",
  "não só... mas também",
  "tanto... quanto",
  "não apenas... como também",
  // Adversativos
  "mas",
  "porém",
  "todavia",
  "contudo",
  "entretanto",
  "no entanto",
  "apesar de",
  "embora",
  "ainda que",
  // Causais
  "porque",
  "pois",
  "já que",
  "uma vez que",
  "visto que",
  "devido a",
  "por causa de",
  "como",
  "sendo assim",
  // Conclusivos
  "portanto",
  "logo",
  "por conseguinte",
  "por isso",
  "assim",
  "dessa forma",
  "desse modo",
  "então",
  "em conclusão",
  // Explicativos
  "ou seja",
  "isto é",
  "a saber",
  "em outras palavras",
  "quer dizer",
  "por exemplo",
  // Temporais
  "quando",
  "enquanto",
  "antes que",
  "depois que",
  "logo que",
  "desde que",
  "até que",
  "sempre que",
  // Conformativos
  "conforme",
  "segundo",
  "consoante",
  "de acordo com",
  "como",
  // Comparativos
  "mais que",
  "menos que",
  "como",
  "assim como",
  "tal qual",
  "tanto quanto",
  // Concessivos
  "embora",
  "apesar de",
  "mesmo que",
  "ainda que",
  "se bem que",
  "posto que",
  // Finais
  "para que",
  "a fim de que",
  "com o intuito de",
  "com o propósito de",
  "para",
  "a fim de",
];

/**
 * Conta o número de conectivos presentes no texto
 * @param text Texto a ser analisado
 * @returns Número de conectivos encontrados
 */
export function countConnectives(text: string): number {
  let count = 0;
  const lowerText = text.toLowerCase();

  connectivesList.forEach((connective) => {
    // Usar expressão regular para encontrar todas as ocorrências
    const regex = new RegExp(`\\b${connective}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) {
      count += matches.length;
    }
  });

  return count;
}
