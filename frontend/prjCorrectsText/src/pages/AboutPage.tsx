
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import Layout from '../components/Layout';

const AboutPage = () => {
  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Sobre o Projeto</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça mais sobre o Corretor Inteligente de Redações desenvolvido
              para o SESI-SP Sorocaba.
            </p>
          </div>
          
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">Visão Geral</h2>
              <p className="text-gray-700 mb-4">
                O Corretor Inteligente de Redações é um projeto desenvolvido para auxiliar 
                professores de Língua Portuguesa do SESI-SP Sorocaba na correção de redações escolares.
                Utilizando tecnologias avançadas de Inteligência Artificial, o sistema é capaz de analisar
                textos, identificar erros ortográficos e gramaticais, além de avaliar aspectos estruturais
                da redação.
              </p>
              <p className="text-gray-700 mb-4">
                Além da análise automática, a plataforma permite que os professores avaliem o trabalho,
                adicionem comentários personalizados e exportem os resultados para planilhas Excel,
                facilitando o acompanhamento pedagógico dos alunos.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">Tecnologias</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3">Frontend</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>React com Vite</li>
                      <li>JavaScript</li>
                      <li>Tailwind CSS</li>
                      <li>Componentes Shadcn UI</li>
                      <li>Design Responsivo</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3">Backend</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Python</li>
                      <li>Modelo de IA personalizado</li>
                      <li>Processamento de Linguagem Natural</li>
                      <li>Análise de texto</li>
                      <li>API para integração</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">Funcionalidades</h2>
              <div className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-medium">
                      Upload e Processamento de Redações
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      Os professores podem facilmente fazer upload de imagens das redações dos alunos.
                      O sistema processa a imagem e encaminha para o modelo de IA para análise do texto.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg font-medium">
                      Análise Automática de Textos
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      A IA analisa ortografia, gramática, coesão, coerência e estrutura textual.
                      Identifica erros específicos e fornece sugestões de correção, além de atribuir
                      pontuações em diferentes categorias de avaliação.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg font-medium">
                      Avaliação e Comentários do Professor
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      Os professores podem revisar as análises automáticas, adicionar seus próprios
                      comentários, ajustar notas e fornecer feedback personalizado para cada aluno.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-lg font-medium">
                      Exportação para Excel
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      Todas as avaliações, incluindo dados do aluno, notas e comentários, podem ser
                      exportadas para planilhas Excel, facilitando o acompanhamento pedagógico e 
                      a organização das informações por turma.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-lg font-medium">
                      Integração com IA Personalizada
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      A plataforma permite a integração com o modelo de IA Python desenvolvido
                      especificamente para esta aplicação, com foco nas necessidades específicas
                      dos professores de Língua Portuguesa do SESI-SP.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">Equipe</h2>
              <p className="text-gray-700 mb-4">
                Este projeto foi desenvolvido como trabalho escolar para o SESI-SP Sorocaba,
                com o objetivo de aplicar conhecimentos de programação e inteligência artificial
                em uma solução prática para o ambiente educacional.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-3">Alunos Desenvolvedores</h3>
                <p className="text-gray-700">
                  <span className="font-medium">Nome:</span> Murilo Moreno e Rafael Prudencio<br />
                  <span className="font-medium">Orientação:</span> Professor Tiago Henrique B. da Silva
                </p>
              </div>
            </section>
          </div>
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-gray-600 mb-6">
              Experimente agora mesmo o Corretor Inteligente de Redações.
            </p>
            <Link to="/login">
              <Button className="sesi-button px-8 py-6 text-base">
                Acessar como Professor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
