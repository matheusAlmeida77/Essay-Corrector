import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import Layout from "../components/Layout";
import ThemeField from "../components/ThemeField";
import TitleField from "../components/TitleField";
import HighlightedText from "../components/HighlightedText";
import { saveResults, ResultData } from "../services/aiService";
import GrammarErrorDetails from "../components/GrammarErrorDetails";
import ArgumentAnalysisDetails from "../components/ArgumentAnalysisDetails";
import EvaluationChecklist from "../components/EvaluationChecklist";
import { Combobox, ComboboxOption } from "@/components/ui/Combobox";
import { Essay, Grade, Student, User } from "@/types/entities";
import { useStudents } from "@/hooks/useStudents";
import { essayService, gradeService } from "@/services/api";

interface LocationState {
  analysisResult: any;
  title?: string;
  theme: string;
  content: string;
  studentId: string;
}

const ReviewPage = () => {
  const { data: students, error } = useStudents();

  const studentOptions: ComboboxOption[] = Array.isArray(students)
    ? students.map((student: Student) => ({
        label: student.name,
        class: student.class,
        number: student.number,
        value: student._id,
      }))
    : [];

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;

  const [studentId, setStudentId] = useState("");
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [theme, setTheme] = useState(
    state?.theme || state?.analysisResult?.theme || ""
  );
  const [title, setTitle] = useState(
    state?.title || state?.analysisResult?.title || ""
  );
  const [content, setContent] = useState(
    state?.content || state?.analysisResult?.text || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "radar">("radar");

  const handleStudentSelect = (value: string) => {
    setStudentId(value);
  };

  if (!state.analysisResult) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Nenhuma redação para analisar
          </h2>
          <p className="text-gray-600 mb-8">
            Você precisa fazer upload de uma redação primeiro.
          </p>
          <Button onClick={() => navigate("/upload")} className="sesi-button">
            Ir para Upload
          </Button>
        </div>
      </Layout>
    );
  }

  const { analysisResult } = state;

  const prepareChartData = () => {
    if (!analysisResult.score || !analysisResult.score.categories) return [];

    return [
      {
        name: "Competência 1",
        pontos: analysisResult.score.categories.competencia1,
        fullMark: 200,
      },
      {
        name: "Competência 2",
        pontos: analysisResult.score.categories.competencia2,
        fullMark: 200,
      },
      {
        name: "Competência 3",
        pontos: analysisResult.score.categories.competencia3,
        fullMark: 200,
      },
      {
        name: "Competência 4",
        pontos: analysisResult.score.categories.competencia4,
        fullMark: 200,
      },
      {
        name: "Competência 5",
        pontos: analysisResult.score.categories.competencia5,
        fullMark: 200,
      },
    ];
  };

  const chartData = prepareChartData();

  const handleSave = async () => {
    if (!theme.trim()) {
      toast.error("Por favor, informe o tema da redação.");
      return;
    }

    setIsLoading(true);

    try {
      const resultData: Essay = {
        studentId,
        title,
        theme,
        content,
        feedback,
      };

      const result = await essayService.create(resultData);

      console.log(result.newEntry._id);

      if (result && result.newEntry._id) {
        const essayId = result.newEntry._id;

        const gradeData: Grade = {
          overallScore: analysisResult.score.total || 0,
          criteria: {
            argumentation: analysisResult.score.categories.competencia1 || 0,
            coherence: analysisResult.score.categories.competencia2 || 0,
            grammar: analysisResult.score.categories.competencia3 || 0,
            structure: analysisResult.score.categories.competencia4 || 0,
          },
          essayId: essayId,
        };

        const gradeResult = await gradeService.create(gradeData);
        console.log("Grade criada com sucesso:", gradeResult);
      } else {
        console.error(
          "Erro ao criar a essay. Não foi possível obter o essayId."
        );
      }

      if (result.success) {
        toast.success(result.message || "Resultado salvo com sucesso!");
        navigate("/results");
      } else {
        toast.error(result.message || "Erro ao salvar os resultados.");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar os resultados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const isZeroScore =
    analysisResult.zeroReason ||
    (analysisResult.score && analysisResult.score.total === 0);

  const mockGrammarErrorCounts = {
    spelling:
      analysisResult.corrections.filter((c) => c.type === "spelling").length ||
      2,
    grammar:
      analysisResult.corrections.filter((c) => c.type === "grammar").length ||
      1,
    punctuation:
      analysisResult.corrections.filter((c) => c.type === "punctuation")
        .length || 3,
    agreement:
      analysisResult.corrections.filter((c) => c.type === "agreement").length ||
      0,
    syntax:
      analysisResult.corrections.filter((c) => c.type === "syntax").length || 1,
    formality:
      analysisResult.corrections.filter((c) => c.type === "formality").length ||
      0,
  };

  const mockChecklist = {
    competencia1: {
      correctSpelling: mockGrammarErrorCounts.spelling <= 2,
      properAgreement: mockGrammarErrorCounts.agreement <= 1,
      goodPunctuation: mockGrammarErrorCounts.punctuation <= 2,
      formalLanguage: mockGrammarErrorCounts.formality === 0,
      syntaxCoherence: mockGrammarErrorCounts.syntax <= 1,
    },
    competencia2: {
      followsTopic: true,
      usesKnowledge: analysisResult.score.categories.competencia2 >= 120,
      hasEssayStructure: analysisResult.statistics.paragraphsCount >= 3,
    },
    competencia3: {
      hasThesis: true,
      hasArguments: analysisResult.score.categories.competencia3 >= 120,
      usesConnectives: analysisResult.statistics.connectivesCount >= 5,
      topicProgression: analysisResult.score.categories.competencia3 >= 160,
      counterArgument: analysisResult.score.categories.competencia3 >= 180,
    },
    competencia4: {
      usesConnectives: analysisResult.statistics.connectivesCount >= 5,
      variedVocabulary: true,
      paragraphCohesion: analysisResult.score.categories.competencia4 >= 120,
    },
    competencia5: {
      hasSolution: analysisResult.score.categories.competencia5 >= 80,
      detailedSolution: analysisResult.score.categories.competencia5 >= 120,
      feasibleSolution: analysisResult.score.categories.competencia5 >= 160,
      respectsHumanRights: true,
    },
  };

  const mockArgumentAnalysis = {
    hasThesis: true,
    hasConclusion: true,
    argumentCount: Math.max(
      1,
      Math.round(analysisResult.statistics.paragraphsCount * 0.7) - 1
    ),
    counterArgumentPresent: analysisResult.score.categories.competencia3 >= 180,
    connectivesUsed: [
      "portanto",
      "além disso",
      "por outro lado",
      "assim",
      "entretanto",
    ].slice(0, Math.min(5, analysisResult.statistics.connectivesCount)),
    topicCoherence: Math.min(
      95,
      analysisResult.score.categories.competencia3 / 2
    ),
    paragraphProgression: analysisResult.score.categories.competencia3 >= 160,
    socioculturalReferences: {
      present: analysisResult.socioculturalReferences?.present || false,
      examples: analysisResult.socioculturalReferences?.examples || [],
      quality: analysisResult.socioculturalReferences?.quality || "poor",
      type: analysisResult.socioculturalReferences?.type || "não identificado",
    },
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Revisão e Correção</h1>
            <p className="text-gray-600">
              Revise a análise da IA, faça ajustes necessários e salve o
              resultado.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card className="border border-gray-200 h-full">
                <CardContent className="p-6">
                  {isZeroScore && (
                    <div className="mb-6">
                      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg mb-4">
                        <h3 className="text-xl font-bold text-red-600 mb-2">
                          REDAÇÃO COM NOTA ZERO
                        </h3>
                        <p className="font-medium text-red-700">
                          Motivo: {analysisResult.zeroReason}
                        </p>
                        <p className="mt-2 text-sm">
                          De acordo com os critérios do ENEM, esta redação
                          recebeu nota zero pelo motivo indicado acima. Para
                          mais informações, consulte as orientações sobre os
                          critérios de avaliação do ENEM.
                        </p>
                      </div>
                    </div>
                  )}

                  {!isZeroScore && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-4">
                        Pontuação por Competência ENEM
                      </h2>
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        {analysisResult.score &&
                          analysisResult.score.categories &&
                          Object.entries(analysisResult.score.categories).map(
                            ([category, score]) => {
                              let numericScore = 0;
                              if (score !== undefined && score !== null) {
                                numericScore =
                                  typeof score === "number"
                                    ? score
                                    : parseFloat(String(score)) || 0;
                              }
                              const percentage = (numericScore / 200) * 100;

                              let progressColor = "";
                              let borderColor = "";
                              let categoryName = "";

                              switch (category) {
                                case "competencia1":
                                  progressColor = "bg-blue-500";
                                  borderColor = "border-blue-500";
                                  categoryName =
                                    "Competência 1 - Domínio da Norma Culta";
                                  break;
                                case "competencia2":
                                  progressColor = "bg-green-500";
                                  borderColor = "border-green-500";
                                  categoryName =
                                    "Competência 2 - Compreensão da Proposta";
                                  break;
                                case "competencia3":
                                  progressColor = "bg-amber-500";
                                  borderColor = "border-amber-500";
                                  categoryName =
                                    "Competência 3 - Organização de Argumentos";
                                  break;
                                case "competencia4":
                                  progressColor = "bg-purple-500";
                                  borderColor = "border-purple-500";
                                  categoryName =
                                    "Competência 4 - Uso de Mecanismos Linguísticos";
                                  break;
                                case "competencia5":
                                  progressColor = "bg-rose-500";
                                  borderColor = "border-rose-500";
                                  categoryName =
                                    "Competência 5 - Proposta de Intervenção";
                                  break;
                                default:
                                  progressColor = "bg-gray-500";
                                  borderColor = "border-gray-500";
                                  categoryName = category;
                              }

                              return (
                                <div
                                  key={category}
                                  className={`p-3 bg-gray-50 rounded-lg border-l-4 ${borderColor}`}
                                >
                                  <p className="text-sm font-medium mb-1">
                                    {categoryName}
                                  </p>
                                  <div className="flex items-center">
                                    <div className="h-2 flex-1 mr-2 bg-gray-200 rounded-full">
                                      <div
                                        className={`h-2 rounded-full ${progressColor}`}
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium">
                                      {numericScore}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                          )}
                      </div>

                      <div className="p-4 bg-sesi-red/10 rounded-lg mb-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Nota Final</p>
                          <p className="text-xl font-bold">
                            {analysisResult.score && analysisResult.score.total
                              ? analysisResult.score.total.toFixed(0)
                              : "0"}
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2">
                          Feedback da IA
                        </h2>
                        <div className="p-4 bg-gray-50 rounded-lg text-sm">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: analysisResult.feedback,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Texto Inserido</h3>
                      <div className="p-4 bg-gray-50 rounded-lg text-sm">
                        <HighlightedText
                          content={analysisResult.text}
                          corrections={analysisResult.corrections || []}
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                          <span className="w-3 h-0.5 bg-red-500 mr-1 decoration-wavy"></span>{" "}
                          Erros de ortografia
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                          <span className="w-3 h-0.5 bg-yellow-500 mr-1 decoration-wavy"></span>{" "}
                          Erros gramaticais
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          <span className="w-3 h-0.5 bg-green-800 mr-1"></span>{" "}
                          Conectivos
                        </span>
                      </div>
                    </div>

                    <ThemeField theme={theme} setTheme={setTheme} />
                    <TitleField title={title} setTitle={setTitle} />

                    <div className="mb-6">
                      <h3 className="font-medium mb-2">Estatísticas</h3>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-gray-500">Parágrafos</p>
                          <p className="text-sm font-medium">
                            {analysisResult.statistics.paragraphsCount}
                          </p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-gray-500">Palavras</p>
                          <p className="text-sm font-medium">
                            {analysisResult.statistics.wordsCount}
                          </p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-gray-500">Linhas (real)</p>
                          <p className="text-sm font-medium">
                            {analysisResult.statistics.linesCount ||
                              countLines(analysisResult.text)}
                          </p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-gray-500">
                            Linhas (estimativa)
                          </p>
                          <p className="text-sm font-medium">
                            {analysisResult.statistics.estimatedLines ||
                              Math.ceil(
                                analysisResult.statistics.wordsCount / 10
                              )}
                          </p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-gray-500">Conectivos</p>
                          <p className="text-sm font-medium">
                            {analysisResult.statistics.connectivesCount}
                          </p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-gray-500">Repertório</p>
                          <p className="text-sm font-medium">
                            {analysisResult.socioculturalReferences?.type ||
                              "Não identificado"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">
                          Desempenho por Competência
                        </h3>
                        <div className="flex justify-end mb-2">
                          <div className="flex space-x-2">
                            <Button
                              variant={
                                chartType === "radar" ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setChartType("radar")}
                            >
                              Radar
                            </Button>
                            <Button
                              variant={
                                chartType === "bar" ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setChartType("bar")}
                            >
                              Barras
                            </Button>
                          </div>
                        </div>

                        <div className="p-2 border rounded-lg bg-white h-[250px]">
                          {chartType === "radar" ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart
                                cx="50%"
                                cy="50%"
                                outerRadius="80%"
                                data={chartData}
                              >
                                <PolarGrid />
                                <PolarAngleAxis dataKey="name" />
                                <PolarRadiusAxis angle={90} domain={[0, 200]} />
                                <Radar
                                  name="Pontuação"
                                  dataKey="pontos"
                                  stroke="#8884d8"
                                  fill="#8884d8"
                                  fillOpacity={0.6}
                                />
                                <Tooltip
                                  formatter={(value) => [
                                    `${value} pontos`,
                                    "Pontuação",
                                  ]}
                                />
                                <Legend />
                              </RadarChart>
                            </ResponsiveContainer>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={chartData}
                                margin={{
                                  top: 5,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 200]} />
                                <Tooltip
                                  formatter={(value) => [
                                    `${value} pontos`,
                                    "Pontuação",
                                  ]}
                                />
                                <Legend />
                                <Bar
                                  dataKey="pontos"
                                  name="Pontuação"
                                  fill="#8884d8"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          )}
                        </div>
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
                  <TabsTrigger value="teacher">
                    Avaliação do Professor
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-6">
                  <Card className="border border-gray-200">
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <h2 className="text-xl font-bold mb-4">
                          Análise Detalhada
                        </h2>

                        <GrammarErrorDetails
                          errorCounts={mockGrammarErrorCounts}
                        />

                        <div className="mt-6">
                          <ArgumentAnalysisDetails
                            argumentAnalysis={mockArgumentAnalysis}
                          />
                        </div>

                        <div className="mt-6">
                          <EvaluationChecklist checklist={mockChecklist} />
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
                          <label
                            htmlFor="studentId"
                            className="block text-sm font-medium mb-1"
                          >
                            Selecionar Aluno
                          </label>
                          <Combobox
                            options={studentOptions}
                            value={studentId}
                            onChange={handleStudentSelect}
                            placeholder="Selecione um aluno"
                            searchable
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="grade">Nota Final</Label>
                          <Input
                            id="grade"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            placeholder="Ex: 920"
                          />
                          <p className="text-xs text-gray-500">
                            Deixe em branco para usar a nota sugerida pela IA (
                            {analysisResult.score && analysisResult.score.total
                              ? analysisResult.score.total.toFixed(1)
                              : "0.0"}
                            )
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="feedback">
                          Comentários do Professor
                        </Label>
                        <Textarea
                          className="resize-none"
                          id="feedback"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Adicione seus comentários sobre a redação do aluno..."
                          rows={6}
                        />
                      </div>

                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full sesi-button"
                      >
                        {isLoading ? "Salvando..." : "Salvar e Finalizar"}
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

const countLines = (text: string): number => {
  if (!text) return 0;

  const lines = text.split("\n");
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

  return nonEmptyLines.length;
};

export default ReviewPage;
