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
import { Avatar } from "@/components/ui/avatar"

type UserProfile = {
  email: string;
  username: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/profile`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('No se pudo obtener la información del usuario');
        }
        
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, apiUrl]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  if (!isAuthenticated && !isLoading) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Información de la cuenta</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : userProfile ? (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <span className="text-xl font-semibold">
                {userProfile.username?.charAt(0).toUpperCase() || userProfile.email.charAt(0).toUpperCase()}
              </span>
            </Avatar>
            <div>
              <CardTitle>{userProfile.username}</CardTitle>
              <CardDescription>{userProfile.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Correo electrónico</h3>
              <p className="text-muted-foreground">{userProfile.email}</p>
            </div>
            
            {userProfile.createdAt && (
              <div>
                <h3 className="font-medium mb-2">Miembro desde</h3>
                <p className="text-muted-foreground">
                  {new Date(userProfile.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}
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
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">No se pudo cargar la información del usuario</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
