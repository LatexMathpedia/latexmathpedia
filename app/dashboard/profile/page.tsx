"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"


export default function ProfilePage() {
  const { email, logout } = useAuth()
  const router = useRouter()

  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';


  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };


  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Información de la cuenta</h1>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-16 w-16 grid place-items-center rounded-full bg-primary text-primary-foreground">
              <span className="text-xl font-semibold">
                {email.split('@')[0].charAt(0).toUpperCase()+email.split('@')[0].charAt(1).toUpperCase()}
              </span>
            </div>
            <div className="space-y-2">
              <CardTitle>{email.split('@')[0]}</CardTitle>
              <CardDescription>{email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Correo electrónico</h3>
              <p className="text-muted-foreground">{email}</p>
            </div>
            
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline">
              <Link href="/dashboard/profile/reset-password">
                Cambiar contraseña
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </CardFooter>
        </Card>
    </div>
  )
}
