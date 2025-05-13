import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import imgHeader from "../assets/logoFooter.webp";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (activeTab === "login") {
        await login(formData.email, formData.password);
        toast({
          title: "Login bem-sucedido",
          description: "Bem Vindo ao Corretor de Redações!",
        });
      } else {
        if (!formData.name || formData.name.trim() === "") {
          throw new Error("Nome é obrigatório");
        }
        await signup(
          formData.name,
          formData.email,
          formData.password,
          formData.role
        );
        toast({
          title: "Conta criada",
          description: "Sua conta foi criada com sucesso!",
        });
      }
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao entrar. Por favor, tente novamente.";
      setError(errorMessage);
      toast({
        title: "Erro ao entrar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setError(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex flex-col">
        <header className="w-full px-6 pt-6 flex justify-between items-center z-10">
          <Link to="/" className="">
            <img className="w-64" src={imgHeader} alt="" />
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <Card className="shadow-xl border-opacity-30 dark:bg-slate-900/90 backdrop-blur-lg">
              <Tabs
                defaultValue="login"
                value={activeTab}
                onValueChange={switchTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Cadastre-se</TabsTrigger>
                </TabsList>

                <CardContent className="p-6 pt-8">
                  <motion.div
                    key={activeTab}
                    initial={{
                      opacity: 0,
                      x: activeTab === "login" ? -20 : 20,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <CardTitle className="text-2xl font-bold">
                      {activeTab === "login"
                        ? "Bem-vindo de volta"
                        : "Criar conta"}
                    </CardTitle>

                    <CardDescription>
                      {activeTab === "login"
                        ? "Digite suas credenciais para acessar sua conta"
                        : "Preencha seus dados para criar uma nova conta"}
                    </CardDescription>

                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {activeTab === "signup" && (
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Nome Completo
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              className="pl-10"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          Senha
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      {activeTab === "signup" && (
                        <div className="space-y-2">
                          <label htmlFor="role" className="text-sm font-medium">
                            Função
                          </label>
                          <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed md:text-sm"
                          >
                            <option className="text-muted-foreground" value="">
                              Selecione uma opção
                            </option>
                            <option value="user">Estudante</option>
                            <option value="admin">Administrador</option>
                          </select>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <>
                            {activeTab === "login" ? "Login" : "Criar Conta"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </motion.div>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AuthPage;
