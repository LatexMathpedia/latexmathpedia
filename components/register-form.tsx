"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"


export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const router = useRouter();

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
      await fetch(`${apiUrl}/auth/create`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, password})
      });
      router.push('/auth/login')
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }
  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={register} {...props} >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Registrarse</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Introduce tus datos para crear una cuenta
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password2">Repetir contraseña</Label>
          <Input id="password2" type="password" required value={password2} onChange={e => setPassword2(e.target.value)}/>
        </div>
        <Button type="submit" className="w-full">
          Crear cuenta
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            O continúa con
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <FaGoogle />
          Inicia sesión con Google
        </Button>
      </div>
      <div className="text-center text-sm">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/auth/login" className="underline underline-offset-4">
          Inicia sesión
        </Link>
      </div>
    </form>
  )
}