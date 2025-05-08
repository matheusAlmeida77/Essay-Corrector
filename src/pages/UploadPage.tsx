import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from '../components/Layout';
import { analyzeEssayText } from '../services/analysisService';

const UploadPage = () => {
  const navigate = useNavigate();
  const [essayText, setEssayText] = useState('');
  const [theme, setTheme] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpload = async () => {
    if (!essayText) {
      toast.error('Por favor, digite o texto da redação.');
      return;
    }
    
    if (!theme) {
      toast.error('Por favor, informe o tema da redação.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const analysisResult = await analyzeEssayText(essayText, theme, title);
      
      navigate('/review', { 
        state: { 
          essayText,
          analysisResult,
          inputType: 'text',
          theme,
          title
        } 
      });
    } catch (error) {
      console.error('Erro ao analisar a redação:', error);
      toast.error('Erro ao analisar a redação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Análise de Redação</h1>
            <p className="text-gray-600">
              Digite o texto da redação para análise.
            </p>
          </div>
          
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Tema da Redação</Label>
                  <Input
                    id="theme"
                    type="text"
                    placeholder="Digite o tema da redação"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="title">Título da Redação (opcional)</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Digite o título da redação (opcional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="essay">Texto da Redação</Label>
                  <Textarea
                    id="essay"
                    placeholder="Digite o texto da redação aqui..."
                    rows={8}
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleUpload} 
                  disabled={isLoading}
                  className="w-full sesi-button"
                >
                  {isLoading ? 'Analisando...' : 'Analisar Redação'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UploadPage;