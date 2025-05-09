import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  return (
    <Layout fullWidth>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-white to-gray-100 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-sesi-red/5 rounded-bl-[200px] -z-10" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-sesi-red/10 rounded-full -z-10" />
      <div className="absolute top-32 right-12 w-20 h-20 bg-sesi-red/10 rounded-full -z-10" />

      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-6 md:pr-12">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight
                       transition-all duration-700 delay-100
                       ${
                         isVisible
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 translate-y-10"
                       }`}
          >
            Corretor Inteligente de{" "}
            <span className="text-gradient">Redações</span>
          </h1>
          <p
            className={`text-lg text-gray-700 mb-8 max-w-xl
                       transition-all duration-700 delay-300
                       ${
                         isVisible
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 translate-y-10"
                       }`}
          >
            Otimize o processo de correção de redações com nossa ferramenta
            avançada de IA, desenvolvida exclusivamente para professores de
            português do SESI-SP Sorocaba.
          </p>
          <div
            className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4
                       transition-all duration-700 delay-500
                       ${
                         isVisible
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 translate-y-10"
                       }`}
          >
            <Link to="/auth">
              <Button className="sesi-button px-8 py-6 text-base">
                Área do Professor
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                className="sesi-button-outline border-2 px-8 py-6 text-base"
              >
                Saiba Mais
              </Button>
            </Link>
          </div>
        </div>

        <div
          className={`mt-12 md:mt-0 md:w-1/2
                     transition-all duration-1000 delay-700
                     ${
                       isVisible
                         ? "opacity-100 translate-x-0"
                         : "opacity-0 translate-x-20"
                     }`}
        >
          <div className="relative">
            <div className="glass-card rounded-2xl shadow-2xl p-4 transform rotate-6">
              <img
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                alt="Redação escolar"
                className="rounded-xl w-full h-full object-cover"
              />
            </div>
            <div className="glass-card rounded-2xl shadow-2xl p-4 absolute -bottom-10 -left-10 transform -rotate-3">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                alt="Estudantes do SESI"
                className="rounded-xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: "Análise de Ortografia",
      description:
        "Identificação automática de erros ortográficos e gramaticais com sugestões de correção.",
      icon: "📝",
    },
    {
      title: "Exportação para Excel",
      description:
        "Salve as avaliações e comentários automaticamente em planilhas organizadas.",
      icon: "📊",
    },
    {
      title: "Interface Intuitiva",
      description:
        "Design pensado para facilitar o trabalho dos professores, com fluxo simplificado.",
      icon: "🖥️",
    },
    {
      title: "Relatórios Detalhados",
      description:
        "Acompanhe o desempenho dos alunos com análises e estatísticas detalhadas.",
      icon: "📈",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Recursos Poderosos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nossa ferramenta foi desenvolvida para otimizar o trabalho dos
            professores de português e melhorar o processo de correção de
            redações.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover-scale border border-gray-100 rounded-xl overflow-hidden"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Faça Upload da Redação",
      description:
        "Tire uma foto ou faça upload da redação do aluno no sistema.",
    },
    {
      number: "02",
      title: "Análise Inteligente",
      description:
        "Nossa IA identifica erros e analisa a estrutura do texto automaticamente.",
    },
    {
      number: "03",
      title: "Revisão e Comentários",
      description:
        "Revise as correções e adicione seus comentários personalizados.",
    },
    {
      number: "04",
      title: "Exportação Automática",
      description:
        "Envie os resultados para uma planilha Excel organizada por turmas.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Funciona</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Um processo simples e eficiente para otimizar a correção de
            redações.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-sesi-red/20 hidden md:block" />

          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
                  <div className="relative">
                    <div className="w-16 h-16 bg-sesi-red text-white rounded-full flex items-center justify-center text-xl font-bold z-10 relative">
                      {step.number}
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-sesi-red/10 rounded-full" />
                  </div>
                </div>

                <div
                  className={`md:w-1/2 ${
                    index % 2 === 0 ? "md:pl-12" : "md:pr-12"
                  } text-center md:text-left ${
                    index % 2 === 1 ? "md:text-right" : ""
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "Esta ferramenta revolucionou meu processo de correção, poupando horas de trabalho manual.",
      author: "Maria Lucia",
      role: "Professora de Português",
    },
    {
      quote:
        "A precisão da análise de texto e a facilidade de exportar dados para planilhas é impressionante.",
      author: "Carlos Silva",
      role: "Coordenador Pedagógico",
    },
    {
      quote:
        "Consegui reduzir pela metade o tempo que gastava com correções, sem perder a qualidade da avaliação.",
      author: "Ana Beatriz",
      role: "Professora de Redação",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Depoimentos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Veja o que os professores do SESI-SP estão falando sobre nossa
            ferramenta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="hover-scale border border-gray-100 rounded-xl overflow-hidden"
            >
              <CardContent className="p-8">
                <div className="text-3xl text-sesi-red mb-4">"</div>
                <p className="text-gray-700 mb-4 italic">{testimonial.quote}</p>
                <div className="mt-4">
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 bg-sesi-red text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Pronto para começar?
        </h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
          Junte-se aos professores que já estão otimizando seu processo de
          correção de redações com nossa ferramenta inteligente.
        </p>
        <Link to="/auth">
          <Button
            className="bg-white text-sesi-red hover:bg-gray-100 font-medium rounded-md px-8 py-6 text-base
                       transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            Acessar como Professor
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default LandingPage;
