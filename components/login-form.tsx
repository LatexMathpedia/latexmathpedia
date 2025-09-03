"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {isAuthenticated,login} = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (error) {
      alert(error);
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
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Olvidaste tu contraseña?
            </a>
          </div>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Iniciar sesión
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            O continúa con
          </span>
        </div>
        <Button variant="outline" className="w-full cursor-pointer">
          <FaGoogle />
          Inicia sesión con Google
        </Button>
      </div>
      <div className="text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link href="/auth/register" className="underline underline-offset-4">
          Registrarse
        </Link>
      </div>
    </form>
  )
}