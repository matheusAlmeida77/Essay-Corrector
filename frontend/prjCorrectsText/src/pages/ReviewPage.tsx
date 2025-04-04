import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Layout from '../components/Layout';
import { saveResults, ResultData, AnalysisResult } from '../services/aiService';

interface LocationState {
  preview?: string;
  essayText?: string;
  analysisResult: AnalysisResult;
  inputType: 'image' | 'text';
}

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;
  
  const [studentName, setStudentName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [grade, setGrade] = useState('');
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  if (!state || !state.analysisResult) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Nenhuma redação para analisar</h2>
          <p className="text-gray-600 mb-8">
            Você precisa fazer upload de uma redação primeiro.
          </p>
          <Button onClick={() => navigate('/upload')} className="sesi-button">
            Ir para Upload
          </Button>
        </div>
      </Layout>
    );
  }
  
  const { preview, essayText, analysisResult, inputType = 'image' } = state;
  
  const handleSave = async () => {
    if (!studentName || !studentClass) {
      toast.error('Por favor, preencha pelo menos o nome e a turma do aluno.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const resultData: ResultData = {
        studentInfo: {
          name: studentName,
          number: studentNumber,
          class: studentClass,
        },
        essayAnalysis: analysisResult,
        teacherInput: {
          grade,
          comments,
        },
        inputType,
        timestamp: new Date().toISOString(),
      };
      
      console.log('Enviando dados para salvamento:', resultData);
      
      const result = await saveResults(resultData);
      
      if (result.success) {
        toast.success(result.message || 'Resultado salvo com sucesso!');
        navigate('/results');
      } else {
        toast.error(result.message || 'Erro ao salvar os resultados.');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar os resultados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Revisão e Correção</h1>
            <p className="text-gray-600">
              Revise a análise da IA, faça ajustes necessários e salve o resultado.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card className="border border-gray-200 h-full">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Redação Original</h2>
                    
                    {inputType === 'image' ? (
                      <div className="border rounded-lg overflow-hidden">
                        <img 
                          src={preview} 
                          alt="Redação original" 
                          className="w-full object-contain max-h-[400px]"
                        />
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 bg-gray-50 max-h-[400px] overflow-y-auto">
                        <p className="whitespace-pre-wrap">{essayText}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6 mt-8">
                    <div>
                      <h3 className="font-medium mb-2">Texto {inputType === 'image' ? 'Extraído' : 'Inserido'}</h3>
                      <div className="p-4 bg-gray-50 rounded-lg text-sm">
                        {analysisResult.text}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Tabs defaultValue="analysis" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analysis">Análise da IA</TabsTrigger>
                  <TabsTrigger value="teacher">Avaliação do Professor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="space-y-6">
                  <Card className="border border-gray-200">
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <h2 className="text-xl font-bold mb-4">Correções Sugeridas</h2>
                        <div className="space-y-2">
                          {analysisResult.corrections.length > 0 ? (
                            analysisResult.corrections.map((correction, index) => (
                              <div key={index} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-sm">
                                  <span className="font-medium">Original:</span> {correction.original}
                                </p>
                                <p className="text-sm text-emerald-600">
                                  <span className="font-medium">Sugestão:</span> {correction.suggested}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Tipo: {correction.type === 'spelling' ? 'Ortografia' : 
                                        correction.type === 'grammar' ? 'Gramática' : 'Estilo'}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm text-green-600">
                                Nenhuma correção necessária. O texto está bem escrito.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-bold mb-4">Pontuação por Categoria</h2>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(analysisResult.score.categories).map(([category, score]) => {
                            let numericScore = 0;
                            if (score !== undefined && score !== null) {
                              numericScore = typeof score === 'number' ? score : parseFloat(String(score)) || 0;
                            }
                            const percentage = (numericScore / 10) * 100;
                            
                            return (
                              <div key={category} className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium mb-1">
                                  {category === 'grammar' ? 'Gramática' :
                                   category === 'coherence' ? 'Coerência' :
                                   category === 'cohesion' ? 'Coesão' :
                                   category === 'adherenceToTheme' ? 'Aderência ao Tema' :
                                   'Qualidade da Argumentação'}
                                </p>
                                <div className="flex items-center">
                                  <Progress value={percentage} className="h-2 flex-1 mr-2" />
                                  <span className="text-sm font-medium">
                                    {numericScore.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="mt-4 p-4 bg-sesi-red/10 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Nota Final</p>
                            <p className="text-xl font-bold">{analysisResult.score.total.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-bold mb-2">Feedback da IA</h2>
                        <div className="p-4 bg-gray-50 rounded-lg text-sm">
                          {analysisResult.feedback}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="teacher" className="space-y-6">
                  <Card className="border border-gray-200">
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="studentName">Nome do Aluno</Label>
                          <Input
                            id="studentName"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Nome completo"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="studentNumber">Número</Label>
                          <Input
                            id="studentNumber"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            placeholder="Ex: 15"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="studentClass">Turma</Label>
                          <Input
                            id="studentClass"
                            value={studentClass}
                            onChange={(e) => setStudentClass(e.target.value)}
                            placeholder="Ex: 9º ano A"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="grade">Nota Final</Label>
                          <Input
                            id="grade"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            placeholder="Ex: 8.5"
                          />
                          <p className="text-xs text-gray-500">
                            Deixe em branco para usar a nota sugerida pela IA ({analysisResult.score.total.toFixed(1)})
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="comments">Comentários do Professor</Label>
                        <Textarea
                          id="comments"
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder="Adicione seus comentários sobre a redação do aluno..."
                          rows={6}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSave} 
                        disabled={isLoading}
                        className="w-full sesi-button"
                      >
                        {isLoading ? 'Salvando...' : 'Salvar e Finalizar'}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewPage;