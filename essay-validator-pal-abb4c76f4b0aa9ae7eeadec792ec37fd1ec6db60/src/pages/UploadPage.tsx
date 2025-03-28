
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Layout from '../components/Layout';
import { analyzeEssay } from '../services/aiService';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    handleFile(selectedFile);
  };

  const handleFile = (selectedFile?: File) => {
    if (!selectedFile) return;
    
    // Check if the file is an image
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida.');
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    handleFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Por favor, selecione uma imagem da redação.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Chama a IA para analisar a redação
      const analysisResult = await analyzeEssay(file);
      
      toast.success('Redação analisada com sucesso!');
      navigate('/review', { 
        state: { 
          preview,
          analysisResult 
        } 
      });
    } catch (error) {
      toast.error('Erro ao processar a redação. Tente novamente.');
      console.error('Erro na análise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Upload de Redação</h1>
            <p className="text-gray-600">
              Envie a imagem da redação do aluno para análise automática.
            </p>
          </div>
          
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                           ${isDragging ? 'border-sesi-red bg-sesi-red/5' : 'border-gray-300 hover:border-sesi-red hover:bg-gray-50'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {preview ? (
                  <div className="space-y-4">
                    <img 
                      src={preview} 
                      alt="Preview da redação" 
                      className="max-h-[400px] mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-gray-500 text-sm">
                      Clique na imagem para selecionar outra redação
                    </p>
                  </div>
                ) : (
                  <div className="py-10">
                    <div className="text-4xl mb-4">📄</div>
                    <h3 className="text-lg font-medium mb-1">
                      Arraste e solte a imagem da redação aqui
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      ou clique para selecionar um arquivo
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileInput();
                      }}
                      className="sesi-button-outline"
                    >
                      Selecionar Arquivo
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || isLoading}
                  className="w-full sesi-button"
                >
                  {isLoading ? 'Processando com IA...' : 'Enviar para Análise'}
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Dicas para melhor análise:</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  <li>Certifique-se que a imagem está nítida e bem iluminada</li>
                  <li>Enquadre apenas a redação, evitando outros elementos na foto</li>
                  <li>A redação deve estar escrita em letra legível</li>
                  <li>Formatos suportados: JPG, PNG, GIF</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UploadPage;
