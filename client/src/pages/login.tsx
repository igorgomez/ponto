import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import AdminAccessModal from "@/components/modals/admin-access-modal";
import { formatCPF } from "@/lib/utils";
import { signInWithGoogle } from "@/lib/firebase/auth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cpf: "",
      senha: "",
    },
  });

  const onSubmit = async (data: { cpf: string; senha: string }) => {
    try {
      const formattedCpf = data.cpf.replace(/\D/g, "");
      const result = await login(formattedCpf, data.senha);
      
      if (result.success) {
        if (result.firstAccess) {
          navigate("/first-access");
        } else if (result.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/employee");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: result.message || "Credenciais inválidas.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-light text-text-primary">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-primary">Sistema de Ponto Eletrônico</h1>
            <p className="text-text-secondary">Empregados Domésticos</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="000.000.000-00" 
                        {...field} 
                        onChange={(e) => {
                          const value = formatCPF(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-4 pt-4 flex flex-col items-center border-t border-gray-200">
            <p className="text-sm text-text-secondary mb-2">Ou entre com</p>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={async () => {
                try {
                  const result = await signInWithGoogle();
                  if (result.success && result.user) {
                    // Aqui você pode integrar o login do Google com seu backend
                    // Por exemplo, enviando o token para seu servidor para verificação
                    toast({
                      title: "Login com Google",
                      description: "Login realizado com sucesso via Google!",
                    });
                  } else {
                    toast({
                      variant: "destructive",
                      title: "Erro ao fazer login com Google",
                      description: "Não foi possível fazer login. Tente novamente.",
                    });
                  }
                } catch (error) {
                  toast({
                    variant: "destructive",
                    title: "Erro ao fazer login com Google",
                    description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
                  });
                }
              }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Google
            </Button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAdminModal(true)}
              className="text-primary text-sm hover:underline"
            >
              Acesso Administrativo
            </button>
          </div>
        </CardContent>
      </Card>

      <AdminAccessModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
}
