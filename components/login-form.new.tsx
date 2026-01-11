"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { AlertCircleIcon, LoaderIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const toast = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';


  // Limpia el timeout si el componente se desmonta
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setShowError(false);
    setShowTimeoutMessage(false);
    
    // Configurar un timeout para mostrar el mensaje después de 3 segundos
    timeoutRef.current = setTimeout(() => {
      setShowTimeoutMessage(true);
    }, 3000);
    
    try {
      await login({ email, password });
      
      // Limpiar el timeout ya que la operación se completó
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      router.push("/dashboard");
      toast.success("Has iniciado sesión correctamente");
      setShowError(false);
      setShowTimeoutMessage(false);
    } catch (error: unknown) {
      // Limpiar el timeout ya que la operación se completó con error
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      setShowError(true);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al iniciar sesión. Revisa tus credenciales.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgottenPassword = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();

    if (!email) {
      toast.error("Por favor, introduce tu correo electrónico para restablecer la contraseña.");
      return;
    }

    try {
      const response = fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({ email }),
      })
      toast.success("Si el correo existe, se ha enviado un email para restablecer la contraseña.");
    } catch (error) {
      toast.error("Error al enviar el correo de restablecimiento de contraseña.");
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Inicia sesión en tu cuenta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Introduce tus datos para acceder a tu cuenta
        </p>
      </div>
      <div className="grid gap-6 max-w-xs mx-auto w-full">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
              onClick={handleForgottenPassword}
            >
              Olvidaste tu contraseña?
            </a>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full cursor-pointer" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : "Iniciar sesión"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            O continúa con
          </span>
        </div>
        <Button variant="outline" className="w-full cursor-pointer" disabled={isLoading}>
          <FaGoogle className="mr-2" />
          Inicia sesión con Google
        </Button>
      </div>
      <div className="text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link href="/auth/register" className="underline underline-offset-4">
          Registrarse
        </Link>
      </div>
      
      {showTimeoutMessage && isLoading && (
        <Alert className="border-l-4 border-l-yellow-500">
          <AlertCircleIcon className="text-yellow-500" />
          <AlertTitle>El servidor está tardando en responder</AlertTitle>
          <AlertDescription>
            <p>Estamos esperando la respuesta del servidor. Esto puede deberse a:</p>
            <ul className="list-inside list-disc text-sm">
              <li>Alta carga en el servidor en este momento</li>
              <li>Conexión a internet lenta</li>
            </ul>
            <p className="mt-2 text-sm">Por favor, espera un momento mientras seguimos procesando tu solicitud.</p>
          </AlertDescription>
        </Alert>
      )}
      
      {showError && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error al iniciar sesión</AlertTitle>
          <AlertDescription>
            <p>Algunos motivos pueden ser:</p>
            <ul className="list-inside list-disc text-sm">
              <li>El servidor se ha caído, no podemos hacer nada :(</li>
              <li>Algún dato está mal.</li>
              <li>Si tenías una cuenta en la página antigua, ya no existe, debes volver a crearla.</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </form>
  )
}