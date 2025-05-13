// import { ScoreCategories } from "../types/types";

// export const formatZeroFeedback = (motivo: string): string => {
//   let feedback = `# REDAÇÃO COM NOTA ZERO\n\n`;
//   feedback += `## Motivo\n${motivo}\n\n`;

//   feedback += `## Considerações\n`;
//   feedback += `De acordo com os critérios do ENEM, sua redação recebeu nota zero pelo motivo indicado acima. `;

//   if (motivo.includes("linhas") || motivo.includes("palavras")) {
//     feedback += `Redações com menos de 7 linhas são consideradas "textos insuficientes" e recebem automaticamente nota zero em todas as competências.`;
//   } else if (motivo.includes("tema")) {
//     feedback += `Redações que não abordam o tema proposto são consideradas "fugas ao tema" e recebem automaticamente nota zero em todas as competências.`;
//   } else if (motivo.includes("em branco")) {
//     feedback += `Folhas de redação em branco ou com apenas algumas palavras soltas recebem automaticamente nota zero.`;
//   } else if (
//     motivo.includes("impropério") ||
//     motivo.includes("desenho") ||
//     motivo.includes("ofensivo")
//   ) {
//     feedback += `Textos com impropérios, desenhos ou outras formas deliberadas de anulação são considerados "anulados" e recebem nota zero.`;
//   } else if (motivo.includes("parte ou integralmente")) {
//     feedback += `Textos copiados dos textos motivadores, sem autoria própria, recebem nota zero.`;
//   } else if (motivo.includes("não-dissertativo")) {
//     feedback += `Textos que não seguem o formato dissertativo-argumentativo (como poemas, receitas, cartas, etc.) recebem nota zero.`;
//   }

//   feedback += `\n\n## Recomendações\n`;
//   feedback += `Para melhorar em futuras produções, observe as seguintes recomendações:\n\n`;

//   if (motivo.includes("linhas") || motivo.includes("palavras")) {
//     feedback += `- Desenvolva seu texto com pelo menos 20-25 linhas (equivalente a cerca de 200-250 palavras)\n`;
//     feedback += `- Distribua adequadamente suas ideias em introdução, desenvolvimento (com pelo menos 2 parágrafos) e conclusão\n`;
//     feedback += `- Desenvolva seus argumentos com exemplos e explicações`;
//   } else if (motivo.includes("tema")) {
//     feedback += `- Leia atentamente a proposta de redação e os textos motivadores\n`;
//     feedback += `- Identifique claramente o tema antes de começar a escrever\n`;
//     feedback += `- Elabore uma tese relacionada diretamente ao tema proposto\n`;
//     feedback += `- Desenvolva argumentos que sustentem sua tese e estejam conectados ao tema`;
//   } else if (motivo.includes("dissertativo")) {
//     feedback += `- Estude a estrutura do texto dissertativo-argumentativo (introdução, desenvolvimento e conclusão)\n`;
//     feedback += `- Apresente um ponto de vista claro sobre o tema\n`;
//     feedback += `- Desenvolva argumentos que sustentem seu ponto de vista\n`;
//     feedback += `- Elabore uma proposta de intervenção para o problema abordado`;
//   }

//   return feedback;
// };

// export const formatFeedback = (
//   text: string,
//   categories: ScoreCategories,
//   totalScore: number,
//   zeroReason?: string | null,
//   title?: string
// ): string => {
//   if (zeroReason) {
//     return formatZeroFeedback(zeroReason);
//   }

//   let feedback = `# ANÁLISE DA REDAÇÃO - CRITÉRIOS ENEM\n\n`;

//   if (title) {
//     feedback += `## Título: ${title}\n\n`;
//   }

//   feedback += `## Competência 1 - Demonstrar domínio da norma padrão da língua escrita\n`;
//   feedback += `Nota: ${categories.competencia1}/200 pontos\n\n`;

//   if (categories.competencia1 === 200) {
//     feedback += `**Nível 5:** Demonstra excelente domínio da modalidade escrita formal da língua portuguesa e de escolha de registro. Desvios gramaticais ou de convenções da escrita serão aceitos somente como excepcionalidade e quando não caracterizarem reincidência.\n\n`;
//   } else if (categories.competencia1 === 160) {
//     feedback += `**Nível 4:** Demonstra bom domínio da modalidade escrita formal da língua portuguesa e de escolha de registro, com poucos desvios gramaticais e de convenções da escrita.\n\n`;
//   } else if (categories.competencia1 === 120) {
//     feedback += `**Nível 3:** Demonstra domínio mediano da modalidade escrita formal da língua portuguesa e de escolha de registro, com alguns desvios gramaticais e de convenções da escrita.\n\n`;
//   } else if (categories.competencia1 === 80) {
//     feedback += `**Nível 2:** Demonstra domínio insuficiente da modalidade escrita formal da língua portuguesa, com muitos desvios gramaticais, de escolha de registro e de convenções da escrita.\n\n`;
//   } else if (categories.competencia1 === 40) {
//     feedback += `**Nível 1:** Demonstra domínio precário da modalidade escrita formal da língua portuguesa, de forma sistemática, com diversificados e frequentes desvios gramaticais, de escolha de registro e de convenções da escrita.\n\n`;
//   } else {
//     feedback += `**Nível 0:** Demonstra desconhecimento da modalidade escrita formal da língua portuguesa.\n\n`;
//   }

//   let comp1Comentarios = [`### Recomendações para melhorar:`];

//   if (categories.competencia1 < 160) {
//     comp1Comentarios.push(
//       `- Revise as regras de concordância verbal e nominal.`
//     );
//     comp1Comentarios.push(
//       `- Atente-se à pontuação, principalmente ao uso de vírgulas.`
//     );
//   }
//   if (categories.competencia1 < 120) {
//     comp1Comentarios.push(`- Evite expressões coloquiais e gírias.`);
//     comp1Comentarios.push(`- Cuide da ortografia e da acentuação.`);
//   }
//   if (categories.competencia1 < 80) {
//     comp1Comentarios.push(
//       `- Estude as regras básicas de sintaxe da língua portuguesa.`
//     );
//     comp1Comentarios.push(
//       `- Consulte um dicionário em caso de dúvidas na grafia das palavras.`
//     );
//   }

//   feedback += comp1Comentarios.join("\n") + "\n\n";

//   feedback += `## Competência 2 - Compreender a proposta e aplicar conceitos das várias áreas de conhecimento\n`;
//   feedback += `Nota: ${categories.competencia2}/200 pontos\n\n`;

//   if (categories.competencia2 === 200) {
//     feedback += `**Nível 5:** Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo e apresenta excelente domínio do texto dissertativo-argumentativo.\n\n`;
//   } else if (categories.competencia2 === 160) {
//     feedback += `**Nível 4:** Desenvolve o tema por meio de argumentação consistente e apresenta bom domínio do texto dissertativo-argumentativo, com proposição, argumentação e conclusão.\n\n`;
//   } else if (categories.competencia2 === 120) {
//     feedback += `**Nível 3:** Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano do texto dissertativo-argumentativo, com proposição, argumentação e conclusão.\n\n`;
//   } else if (categories.competencia2 === 80) {
//     feedback += `**Nível 2:** Desenvolve o tema recorrendo à cópia de trechos dos textos motivadores ou apresenta domínio insuficiente do texto dissertativo-argumentativo, não atendendo à estrutura com proposição, argumentação e conclusão.\n\n`;
//   } else if (categories.competencia2 === 40) {
//     feedback += `**Nível 1:** Apresenta o assunto, tangenciando o tema, ou demonstra domínio precário do texto dissertativo-argumentativo, com traços constantes de outros tipos textuais.\n\n`;
//   } else {
//     feedback += `**Nível 0:** Fuga ao tema/não atendimento à estrutura dissertativo-argumentativa.\n\n`;
//   }

//   let comp2Comentarios = [`### Recomendações para melhorar:`];

//   if (categories.competencia2 < 160) {
//     comp2Comentarios.push(
//       `- Enriqueça seu texto com repertório sociocultural (filosofia, literatura, história, ciências, etc.).`
//     );
//     comp2Comentarios.push(
//       `- Certifique-se de abordar o tema de forma direta, sem tangenciamentos.`
//     );
//   }
//   if (categories.competencia2 < 120) {
//     comp2Comentarios.push(
//       `- Estruture melhor seu texto em introdução, desenvolvimento e conclusão.`
//     );
//     comp2Comentarios.push(`- Evite copiar trechos dos textos motivadores.`);
//   }
//   if (categories.competencia2 < 80) {
//     comp2Comentarios.push(
//       `- Estude a estrutura do texto dissertativo-argumentativo.`
//     );
//     comp2Comentarios.push(
//       `- Leia sobre o tema antes de escrever, para ampliar seu repertório.`
//     );
//   }

//   feedback += comp2Comentarios.join("\n") + "\n\n";

//   feedback += `## Competência 3 - Selecionar, relacionar, organizar e interpretar informações\n`;
//   feedback += `Nota: ${categories.competencia3}/200 pontos\n\n`;

//   if (categories.competencia3 === 200) {
//     feedback += `**Nível 5:** Apresenta informações, fatos e opiniões relacionados ao tema proposto, de forma consistente e organizada, configurando autoria, em defesa de um ponto de vista.\n\n`;
//   } else if (categories.competencia3 === 160) {
//     feedback += `**Nível 4:** Apresenta informações, fatos e opiniões relacionados ao tema, de forma organizada, com indícios de autoria, em defesa de um ponto de vista.\n\n`;
//   } else if (categories.competencia3 === 120) {
//     feedback += `**Nível 3:** Apresenta informações, fatos e opiniões relacionados ao tema, limitados aos argumentos dos textos motivadores e pouco organizados, em defesa de um ponto de vista.\n\n`;
//   } else if (categories.competencia3 === 80) {
//     feedback += `**Nível 2:** Apresenta informações, fatos e opiniões relacionados ao tema, mas desorganizados ou contraditórios e limitados aos argumentos dos textos motivadores, em defesa de um ponto de vista.\n\n`;
//   } else if (categories.competencia3 === 40) {
//     feedback += `**Nível 1:** Apresenta informações, fatos e opiniões pouco relacionados ao tema ou incoerentes e sem defesa de um ponto de vista.\n\n`;
//   } else {
//     feedback += `**Nível 0:** Apresenta informações, fatos e opiniões não relacionados ao tema e sem defesa de um ponto de vista.\n\n`;
//   }

//   let comp3Comentarios = [`### Recomendações para melhorar:`];

//   if (categories.competencia3 < 160) {
//     comp3Comentarios.push(
//       `- Organize melhor seus argumentos, desenvolvendo-os de forma mais aprofundada.`
//     );
//     comp3Comentarios.push(
//       `- Apresente exemplos concretos para fundamentar seus argumentos.`
//     );
//   }
//   if (categories.competencia3 < 120) {
//     comp3Comentarios.push(
//       `- Articule melhor as informações, evitando contradições entre seus argumentos.`
//     );
//     comp3Comentarios.push(
//       `- Vá além dos textos motivadores, trazendo informações de seu conhecimento.`
//     );
//   }
//   if (categories.competencia3 < 80) {
//     comp3Comentarios.push(
//       `- Defina claramente seu ponto de vista logo na introdução.`
//     );
//     comp3Comentarios.push(
//       `- Selecione informações relevantes e pertinentes ao tema.`
//     );
//   }

//   feedback += comp3Comentarios.join("\n") + "\n\n";

//   feedback += `## Competência 4 - Demonstrar conhecimento dos mecanismos linguísticos\n`;
//   feedback += `Nota: ${categories.competencia4}/200 pontos\n\n`;

//   if (categories.competencia4 === 200) {
//     feedback += `**Nível 5:** Articula bem as partes do texto e apresenta repertório diversificado de recursos coesivos.\n\n`;
//   } else if (categories.competencia4 === 160) {
//     feedback += `**Nível 4:** Articula as partes do texto com poucas inadequações e apresenta repertório diversificado de recursos coesivos.\n\n`;
//   } else if (categories.competencia4 === 120) {
//     feedback += `**Nível 3:** Articula as partes do texto, de forma mediana, com inadequações, e apresenta repertório pouco diversificado de recursos coesivos.\n\n`;
//   } else if (categories.competencia4 === 80) {
//     feedback += `**Nível 2:** Articula as partes do texto, de forma insuficiente, com muitas inadequações, e apresenta repertório limitado de recursos coesivos.\n\n`;
//   } else if (categories.competencia4 === 40) {
//     feedback += `**Nível 1:** Articula as partes do texto de forma precária e apresenta repertório limitado de recursos coesivos.\n\n`;
//   } else {
//     feedback += `**Nível 0:** Não articula as informações.\n\n`;
//   }

//   let comp4Comentarios = [`### Recomendações para melhorar:`];

//   if (categories.competencia4 < 160) {
//     comp4Comentarios.push(
//       `- Utilize mais conectivos para articular ideias (portanto, entretanto, além disso, etc.).`
//     );
//     comp4Comentarios.push(
//       `- Evite repetições desnecessárias, usando pronomes e sinônimos.`
//     );
//   }
//   if (categories.competencia4 < 120) {
//     comp4Comentarios.push(`- Dê mais atenção às transições entre parágrafos.`);
//     comp4Comentarios.push(
//       `- Diversifique o vocabulário e os recursos coesivos.`
//     );
//   }
//   if (categories.competencia4 < 80) {
//     comp4Comentarios.push(`- Estude os mecanismos de coesão textual.`);
//     comp4Comentarios.push(
//       `- Revise a estrutura dos períodos, preferindo frases mais claras e diretas.`
//     );
//   }

//   feedback += comp4Comentarios.join("\n") + "\n\n";

//   feedback += `## Competência 5 - Elaborar proposta de intervenção para o problema\n`;
//   feedback += `Nota: ${categories.competencia5}/200 pontos\n\n`;

//   if (categories.competencia5 === 200) {
//     feedback += `**Nível 5:** Elabora muito bem proposta de intervenção, detalhada, relacionada ao tema e articulada à discussão desenvolvida no texto.\n\n`;
//   } else if (categories.competencia5 === 160) {
//     feedback += `**Nível 4:** Elabora bem proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto.\n\n`;
//   } else if (categories.competencia5 === 120) {
//     feedback += `**Nível 3:** Elabora, de forma mediana, proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto.\n\n`;
//   } else if (categories.competencia5 === 80) {
//     feedback += `**Nível 2:** Elabora, de forma insuficiente, proposta de intervenção relacionada ao tema, ou não articulada com a discussão desenvolvida no texto.\n\n`;
//   } else if (categories.competencia5 === 40) {
//     feedback += `**Nível 1:** Apresenta proposta de intervenção vaga, precária ou relacionada apenas ao assunto.\n\n`;
//   } else {
//     feedback += `**Nível 0:** Não apresenta proposta de intervenção ou apresenta proposta não relacionada ao tema ou ao assunto.\n\n`;
//   }

//   let comp5Comentarios = [`### Recomendações para melhorar:`];

//   if (categories.competencia5 < 160) {
//     comp5Comentarios.push(
//       `- Detalhe mais sua proposta de intervenção, especificando agentes, ações, meios e efeitos.`
//     );
//     comp5Comentarios.push(
//       `- Articule melhor a proposta com os argumentos desenvolvidos no texto.`
//     );
//   }
//   if (categories.competencia5 < 120) {
//     comp5Comentarios.push(
//       `- Desenvolva uma proposta viável e específica, não genérica.`
//     );
//     comp5Comentarios.push(
//       `- Explique como sua proposta poderia ser implementada na prática.`
//     );
//   }
//   if (categories.competencia5 < 80) {
//     comp5Comentarios.push(
//       `- Sempre inclua uma proposta de intervenção na conclusão.`
//     );
//     comp5Comentarios.push(
//       `- Mencione explicitamente os agentes responsáveis pela intervenção.`
//     );
//   }

//   feedback += comp5Comentarios.join("\n") + "\n\n";

//   feedback += `# Nota Final: ${totalScore}/1000 pontos\n\n`;
//   feedback += `## Avaliação Geral\n`;

//   if (totalScore >= 900) {
//     feedback += `Sua redação está excelente! Você demonstra ótimo domínio da escrita formal, argumentação consistente, repertório sociocultural produtivo e proposta de intervenção bem detalhada. Continue assim para manter esse alto nível de desempenho.\n\n`;
//   } else if (totalScore >= 800) {
//     feedback += `Sua redação está muito boa! Você demonstra bom domínio da escrita formal, argumentação bem desenvolvida e proposta de intervenção adequada. Com alguns ajustes pontuais, poderá alcançar a faixa de excelência.\n\n`;
//   } else if (totalScore >= 700) {
//     feedback += `Sua redação está acima da média! Você demonstra domínio adequado da escrita formal e boa compreensão do tema. Para melhorar, enriqueça seu repertório sociocultural e torne sua proposta de intervenção mais detalhada.\n\n`;
//   } else if (totalScore >= 600) {
//     feedback += `Sua redação está na média. Você compreende a estrutura dissertativa-argumentativa, mas ainda há aspectos a melhorar, como coesão textual, desenvolvimento dos argumentos e elaboração da proposta de intervenção.\n\n`;
//   } else if (totalScore >= 500) {
//     feedback += `Sua redação precisa de aprimoramento. Há fragilidades na argumentação, uso dos recursos coesivos e domínio da norma padrão. Recomenda-se mais leitura e prática de escrita.\n\n`;
//   } else {
//     feedback += `Sua redação apresenta diversos pontos críticos que precisam ser trabalhados. Recomenda-se revisar a estrutura dissertativa-argumentativa, estudar a norma padrão e praticar mais a escrita.\n\n`;
//   }

//   return feedback;
// };
