"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/contexts/auth-context"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"
import { Mail, KeyRound, LogOut, UserX, Shield, UserRound, Sparkles } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useDeleteAccount, useMe, useUpdateMe } from "@/hooks/api/use-profile"
import { useMyAttempts, usePublicQuizzes } from "@/hooks/api/use-quizzes"
import { formatDate } from "@/lib/utils"

const updateNameSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
})

type UpdateNameFormValues = z.infer<typeof updateNameSchema>

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  SUSPENDED: "Suspendido",
}

function AttemptsHistoryTab() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useMyAttempts(page, 10)
  const { data: quizzes } = usePublicQuizzes()

  const quizNameById = useMemo(() => {
    const map = new Map<number, string>()
    quizzes?.forEach((quiz) => {
      if (quiz.id != null && quiz.name) map.set(quiz.id, quiz.name)
    })
    return map
  }, [quizzes])

  const attempts = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis cuestionarios</CardTitle>
        <CardDescription>Histórico de intentos realizados.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cuestionario</TableHead>
                <TableHead>Puntuación</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Cargando intentos...
                  </TableCell>
                </TableRow>
              ) : attempts.length > 0 ? (
                attempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell className="font-medium">
                      {attempt.quizId != null
                        ? quizNameById.get(attempt.quizId) ?? `Cuestionario #${attempt.quizId}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {attempt.score != null && attempt.totalQuestions != null
                        ? `${attempt.score}/${attempt.totalQuestions}`
                        : "-"}
                    </TableCell>
                    <TableCell>{formatDate(attempt.submittedAt)}</TableCell>
                    <TableCell>
                      {attempt.quizId != null && (
                        <Link
                          href={`/dashboard/quizzes/${attempt.quizId}`}
                          className="text-sm text-primary hover:underline"
                        >
                          Ver detalle
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Todavía no has hecho ningún cuestionario.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.max(0, p - 1))
                  }}
                  className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={i === page}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(i)
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }}
                  className={page >= totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  )
}

export default function ProfilePage() {
  const { email, logout, changePassword, isAuthenticated } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const queryClient = useQueryClient()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isChangingPwd, setIsChangingPwd] = useState(false)

  const { data: me, isLoading: meLoading } = useMe(isAuthenticated)
  const updateMe = useUpdateMe()
  const deleteAccount = useDeleteAccount()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateNameFormValues>({
    resolver: zodResolver(updateNameSchema),
    values: { name: me?.name ?? "" },
  })

  const onSubmitName = async (values: UpdateNameFormValues) => {
    try {
      await updateMe.mutateAsync({ name: values.name })
      toast.success("Nombre actualizado correctamente.")
      reset(values)
    } catch (error) {
      toast.error("No se pudo actualizar el nombre.")
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      // Evita que datos de esta sesión (perfil, intentos) sobrevivan en caché tras el logout.
      queryClient.clear()
      router.push('/auth/login')
      toast.success("Sesión cerrada exitosamente")
    } catch (error) {
      toast.error("Error al cerrar sesión")
    }
  }

  const handlePwdChange = async () => {
    setIsChangingPwd(true)
    try {
      // Redirige a Keycloak; al terminar vuelve a esta página
      await changePassword()
    } catch (error) {
      toast.error("Error al abrir el cambio de contraseña. Inténtalo de nuevo.")
      setIsChangingPwd(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)

    try {
      await deleteAccount.mutateAsync()
      toast.success("Cuenta eliminada exitosamente")
      await logout()
      queryClient.clear()
      router.push('/')
    } catch (error) {
      toast.error("Error al eliminar la cuenta")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const getInitials = () => {
    const source = me?.name || email.split('@')[0]
    return source.slice(0, 2).toUpperCase()
  }

  const getDisplayName = () => {
    return me?.name || email.split('@')[0]
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

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="quizzes">Mis cuestionarios</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8 mt-6">
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
                  <CardTitle className="text-2xl">{getDisplayName()}</CardTitle>
                  <CardDescription className="text-base mt-1">{email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />

              {!meLoading && me?.profileCompletedAt == null && (
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle>Completa tu perfil</AlertTitle>
                  <AlertDescription>
                    Todavía no has puesto tu nombre. Añádelo abajo para que aparezca en tus
                    cuestionarios y en el resto de la plataforma.
                  </AlertDescription>
                </Alert>
              )}

              {/* Datos personales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserRound className="h-5 w-5" />
                  Datos personales
                </h3>
                <form onSubmit={handleSubmit(onSubmitName)} className="grid gap-2 sm:flex sm:items-end sm:gap-4">
                  <div className="flex-1 grid gap-1.5">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <Button type="submit" className="cursor-pointer" disabled={isSubmitting || !isDirty}>
                    Guardar
                  </Button>
                </form>
              </div>

              <Separator />

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Información de la cuenta
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/50">
                    <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Correo electrónico</p>
                      <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/50">
                    <Shield className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Estado</p>
                      <p className="text-sm text-muted-foreground">
                        {me?.status ? (
                          <Badge
                            variant={
                              me.status === "ACTIVE"
                                ? "default"
                                : me.status === "SUSPENDED"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {STATUS_LABEL[me.status] ?? me.status}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/50 sm:col-span-2">
                    <UserRound className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Miembro desde</p>
                      <p className="text-sm text-muted-foreground">{formatDate(me?.createdAt)}</p>
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
                    disabled={isChangingPwd}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <KeyRound className="h-5 w-5" />
                      <div className="text-left flex-1">
                        <p className="font-medium">Cambiar contraseña</p>
                        <p className="text-xs text-muted-foreground">
                          Serás redirigido a la página segura para cambiarla
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
        </TabsContent>

        <TabsContent value="quizzes" className="mt-6">
          <AttemptsHistoryTab />
        </TabsContent>
      </Tabs>

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
