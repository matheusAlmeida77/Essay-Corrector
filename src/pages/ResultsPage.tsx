import { useState } from "react";
import { Button } from "@/components/ui/button";
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

const ResultsPage = () => {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const classes = ["2º Ano A", "2º Ano B", "3º Ano A", "3º Ano B"];

  const mockResults = [
    {
      id: 1,
      name: "Ana Clara Silva",
      class: "2º Ano A",
      number: "01",
      date: "12/05/2023",
      grade: "8.5",
      comments:
        "Boa estrutura de texto, precisa trabalhar concordância verbal.",
    },
    {
      id: 2,
      name: "Bruno Oliveira",
      class: "2º Ano A",
      number: "03",
      date: "12/05/2023",
      grade: "9.0",
      comments: "Excelente redação, poucos erros ortográficos.",
    },
    {
      id: 3,
      name: "Carla Mendes",
      class: "2º Ano B",
      number: "05",
      date: "13/05/2023",
      grade: "7.5",
      comments: "Precisa melhorar a conclusão do texto.",
    },
    {
      id: 4,
      name: "Daniel Santos",
      class: "2º Ano B",
      number: "08",
      date: "13/05/2023",
      grade: "6.5",
      comments: "Muitos erros de ortografia, argumentação confusa.",
    },
    {
      id: 5,
      name: "Elena Martins",
      class: "3º Ano A",
      number: "02",
      date: "14/05/2023",
      grade: "9.5",
      comments: "Redação exemplar, ótimos argumentos.",
    },
    {
      id: 6,
      name: "Felipe Costa",
      class: "3º Ano A",
      number: "07",
      date: "14/05/2023",
      grade: "8.0",
      comments: "Bom desenvolvimento, precisa melhorar introdução.",
    },
    {
      id: 7,
      name: "Gabriela Lima",
      class: "3º Ano B",
      number: "04",
      date: "15/05/2023",
      grade: "7.0",
      comments: "Argumentos pouco desenvolvidos.",
    },
    {
      id: 8,
      name: "Henrique Alves",
      class: "3º Ano B",
      number: "09",
      date: "15/05/2023",
      grade: "8.5",
      comments: "Boa coesão textual, poucos erros.",
    },
  ];

  const filteredResults = mockResults.filter((result) => {
    const matchesClass =
      selectedClass === "all" || result.class === selectedClass;
    const matchesSearch =
      result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.number.includes(searchTerm);
    return matchesClass && matchesSearch;
  });

  const classAverages = classes.map((className) => {
    const classResults = mockResults.filter(
      (result) => result.class === className
    );
    const average =
      classResults.reduce((sum, result) => sum + parseFloat(result.grade), 0) /
      classResults.length;
    return { class: className, average: average.toFixed(1) };
  });

  const handleExportToExcel = () => {
    alert("Erro");
  };

  return (
    <Layout>
      <div className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Resultados das Redações</h1>
            <p className="text-gray-600">
              Visualize, filtre e exporte os resultados das correções.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <div className="w-full md:w-auto flex items-end">
                  <Button
                    onClick={handleExportToExcel}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                  >
                    Exportar para Excel
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Número</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Comentários
                      </TableHead>
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
                          <TableCell>{result.date}</TableCell>
                          <TableCell className="font-bold">
                            {result.grade}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="max-w-xs truncate">
                              {result.comments}
                            </div>
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
    </Layout>
  );
};

export default ResultsPage;
