import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/upload');
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gradient">Corretor de Redações SESI-SP</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramenta inteligente para análise e correção de redações estudantis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover-scale glass-card">
              <CardHeader>
                <CardTitle>Upload de Imagem</CardTitle>
                <CardDescription>Envie a foto da redação</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Faça o upload da foto da redação do aluno diretamente pelo seu dispositivo.</p>
                <Button className="sesi-button" onClick={() => navigate('/upload')}>Experimente</Button>
              </CardContent>
            </Card>
            
            <Card className="hover-scale glass-card">
              <CardHeader>
                <CardTitle>Inserir Texto</CardTitle>
                <CardDescription>Digite ou cole o texto</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Digite ou cole o texto da redação para análise rápida e detalhada.</p>
                <Button className="sesi-button-outline" onClick={() => navigate('/upload?tab=text')}>Experimentar</Button>
              </CardContent>
            </Card>
            
            <Card className="hover-scale glass-card">
              <CardHeader>
                <CardTitle>Fácil Integração</CardTitle>
                <CardDescription>Com seu processo de ensino</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Integre facilmente ao seu fluxo de trabalho educacional para acompanhamento.</p>
                <Button variant="outline" className="border-sesi-red text-sesi-red hover:bg-sesi-red hover:text-white">
                  Ver detalhes
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-semibold mb-6">Experimente agora mesmo</h2>
            <Button className="sesi-button text-lg px-8 py-3" onClick={handleStartClick}>
              Começar a usar
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
