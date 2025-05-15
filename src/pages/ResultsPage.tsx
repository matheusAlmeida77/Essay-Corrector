import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from "../components/Layout";
import { useStudents } from "@/hooks/useStudents";
import { useEssays } from "@/hooks/useEssays";
import { useGrades } from "@/hooks/useGrades";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/entities";
import { studentService } from "@/services/api";

const ResultsPage = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentEssays, setSelectedStudentEssays] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState([]);

  const classes = ["3º Ano A", "3º Ano B", "3º Ano C", "3º Ano D", "3º Ano E"];

  const { data: students = [], isLoading: loadingStudents } = useStudents();
  const { data: essays = [], isLoading: loadingEssays } = useEssays();
  const { data: grades = [], isLoading: loadingGrades } = useGrades();

  const enrichedResults = useMemo(() => {
    return students.map((student) => {
      const studentEssays = essays.filter(
        (essay) => essay.studentId === student._id
      );
      const latestEssay = studentEssays.sort(
        (a, b) =>
          new Date(b.correctedAt).getTime() - new Date(a.correctedAt).getTime()
      )[0];

      const grade = latestEssay
        ? grades.find((g) => g.essayId === latestEssay._id)
        : null;

      return {
        id: student._id,
        name: student.name,
        class: student.class,
        number: student.number,
        date: latestEssay?.correctedAt
          ? new Date(latestEssay.correctedAt).toLocaleDateString("pt-BR")
          : "—",
        grade: grade?.overallScore ? grade.overallScore : "—",
        comments: latestEssay?.feedback || "—",
      };
    });
  }, [students, essays, grades]);

  const filteredResults = enrichedResults.filter((result) => {
    const matchesClass =
      selectedClass === "all" || result.class === selectedClass;
    const matchesSearch =
      result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.number.includes(searchTerm);
    return matchesClass && matchesSearch;
  });

  const classAverages = useMemo(() => {
    return classes.map((className) => {
      const classResults = enrichedResults.filter(
        (r) => r.class === className && !isNaN(Number(r.grade))
      );
      const average =
        classResults.reduce((sum, r) => sum + parseFloat(r.grade), 0) /
        (classResults.length || 1);
      return { class: className, average: average.toFixed(1) };
    });
  }, [enrichedResults]);

  const openModal = (studentId) => {
    const studentEssays = essays
      .filter((essay) => essay.studentId === studentId)
      .map((essay) => {
        const grade = grades.find((g) => g.essayId === essay._id);
        return {
          title: essay.title || "Redação",
          correctedAt: essay.correctedAt,
          feedback: essay.feedback,
          grade: grade?.overallScore ?? "—",
          content: essay.content || "Redação indisponível.",
        };
      });
    setSelectedStudentEssays(studentEssays);
    setModalOpen(true);
  };

  const toggleDropdown = (index) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // const handleSave = async () => {
  //   try {
  //       const newStudent: Student = {
  //         userId,
  //         name,
  //         class,
  //         number,
  //       };

  //       const result = await studentService.create(newStudent);
  //       console.log(result);
  //     } catch (error) {
  //       console.error("Erro ao salvar:", error);
  //   };
  // }

  return (
    <Layout>
      <div className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Resultados das Redações</h1>
            <p className="text-gray-600">
              Visualize e filtre os resultados das correções.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {classAverages.map((item, index) => (
              <Card key={index} className="hover-scale">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-bold mb-1">{item.class}</h3>
                  <div className="text-3xl font-bold text-sesi-red">
                    {item.average}
                  </div>
                  <p className="text-sm text-gray-500">Média da Turma</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border border-gray-200 shadow-sm mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search" className="mb-2 block">
                    Buscar Aluno
                  </Label>
                  <Input
                    id="search"
                    placeholder="Nome ou número"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Label htmlFor="class-filter" className="mb-2 block">
                    Filtrar por Turma
                  </Label>
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger id="class-filter">
                      <SelectValue placeholder="Todas as Turmas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Turmas</SelectItem>
                      {classes.map((className, index) => (
                        <SelectItem key={index} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Número</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.length > 0 ? (
                      filteredResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">
                            {result.name}
                          </TableCell>
                          <TableCell>{result.class}</TableCell>
                          <TableCell>{result.number}</TableCell>
                          <TableCell colSpan={2}>
                            <Button
                              className="sesi-button-outline"
                              onClick={() => openModal(result.id)}
                            >
                              Ver detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Nenhum resultado encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Redações do Estudante</h2>
            <ul className="space-y-4">
              {selectedStudentEssays.length > 0 ? (
                selectedStudentEssays.map((essay, index) => (
                  <li key={index} className="border p-4 rounded-md">
                    <div className="text-sm text-gray-500 mb-1">
                      {new Date(essay.correctedAt).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="text-base font-semibold mb-1">
                      {essay.title}
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">Nota:</span> {essay.grade}
                    </div>
                    <div>
                      <span className="font-medium">Feedback:</span>{" "}
                      {essay.feedback || "—"}
                    </div>
                    <button
                      className="text-sm text-sesi-red underline hover:opacity-80"
                      onClick={() => toggleDropdown(index)}
                    >
                      {expandedIndexes.includes(index)
                        ? "Ocultar Redação"
                        : "Ver Redação Completa"}
                    </button>
                    {expandedIndexes.includes(index) && (
                      <div className="mt-3 p-3 border rounded bg-gray-50 whitespace-pre-wrap text-sm text-gray-800">
                        {essay.content}
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <p>Este aluno ainda não possui redações corrigidas.</p>
              )}
            </ul>
            <button
              className="mt-6 bg-sesi-red text-white px-4 py-2 rounded hover:opacity-90"
              onClick={() => setModalOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ResultsPage;
