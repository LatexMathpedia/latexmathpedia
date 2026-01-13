"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Mail, KeyRound, LogOut, UserX, Shield } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const { email, logout } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
      toast.success("Sesión cerrada exitosamente")
    } catch (error) {
      toast.error("Error al cerrar sesión")
    }
  }

  const handlePwdChange = async () => {
    setIsSendingEmail(true)
    try {
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        throw new Error('Failed to send password reset email')
      }
      
      toast.info("Correo de restablecimiento de contraseña enviado")
      
      await logout()
    } catch (error) {
      toast.error("Error al enviar el correo de restablecimiento de contraseña")
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)

    try {
      const res = await fetch(`${apiUrl}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error('Failed to delete account')
      }
      toast.success("Cuenta eliminada exitosamente")
      await logout()
      router.push('/')
    } catch (error) {
      toast.error("Error al eliminar la cuenta")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const getInitials = () => {
    const username = email.split('@')[0]
    return username.slice(0, 2).toUpperCase()
  }

  const getUsername = () => {
    return email.split('@')[0]
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Perfil de usuario</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 grid place-items-center rounded-full bg-linear-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
              <span className="text-2xl font-bold">
                {getInitials()}
              </span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{getUsername()}</CardTitle>
              <CardDescription className="text-base mt-1">{email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          
          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Información de la cuenta
            </h3>
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/50">
                <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Correo electrónico</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Security Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Seguridad
            </h3>
            <div className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3"
                onClick={handlePwdChange}
                disabled={isSendingEmail}
              >
                <div className="flex items-center gap-3 w-full">
                  <KeyRound className="h-5 w-5" />
                  <div className="text-left flex-1">
                    <p className="font-medium">Cambiar contraseña</p>
                    <p className="text-xs text-muted-foreground">
                      Te enviaremos un correo para restablecer tu contraseña
                    </p>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="justify-start h-auto py-3"
                onClick={handleLogout}
              >
                <div className="flex items-center gap-3 w-full">
                  <LogOut className="h-5 w-5" />
                  <div className="text-left flex-1">
                    <p className="font-medium">Cerrar sesión</p>
                    <p className="text-xs text-muted-foreground">
                      Cierra sesión en este dispositivo
                    </p>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
              <UserX className="h-5 w-5" />
              Zona de peligro
            </h3>
            <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
              <Button 
                variant="destructive" 
                className="w-full justify-start h-auto py-3"
                onClick={() => setShowDeleteDialog(true)}
              >
                <div className="flex items-center gap-3 w-full">
                  <UserX className="h-5 w-5" />
                  <div className="text-left flex-1">
                    <p className="font-medium">Eliminar cuenta</p>
                    <p className="text-xs opacity-90">
                      Esta acción es permanente y no se puede deshacer
                    </p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              <p>
                Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.
              </p>
              <p className="font-medium text-foreground">
                Esta acción no se puede deshacer.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Sí, eliminar mi cuenta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
