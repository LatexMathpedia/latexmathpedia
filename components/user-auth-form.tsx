"use client"

import * as React from "react"
import { useRouter } from 'next/navigation'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-context"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [username, setUsername] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")
  const { login } = useAuth()
  const router = useRouter()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        router.push('/')
      } else {
        alert('Credenciales incorrectas')
      }
    } catch (error) {
      console.error('Error during login:', error)
      alert('Ocurrió un error durante el inicio de sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Usuario</Label>
          <Input
            id="username"
            placeholder="Tu nombre de usuario"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            placeholder="Tu contraseña"
            type="password"
            autoCapitalize="none"
            autoComplete="current-password"
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button disabled={isLoading} className="w-full">
          {isLoading && (
            <p>Loading</p>
          )}
          Continuar
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </div>
  )
}

