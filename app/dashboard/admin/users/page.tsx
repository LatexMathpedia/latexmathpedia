"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAdminRoute } from "@/hooks/use-protected-route"
import { useAllUsers } from "@/hooks/api/use-users"
import { useToast } from "@/hooks/use-toast"
import { formatDate as formatCreatedAt } from "@/lib/utils"

export default function UsersPage() {
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  // Proteger esta ruta de administración
  const { isAuthenticated, isAdmin, loading: authLoading } = useAdminRoute();

  const { data: users, isLoading: usersLoading, isError: usersError } = useAllUsers(isAuthenticated && isAdmin)

  useEffect(() => {
    if (usersError) {
      toast.error("Error al cargar los usuarios.")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersError])

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Si no está autenticado o no es admin, el hook maneja la redirección
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const filteredUsers = (users ?? []).filter((user) => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    return (
      user.email?.toLowerCase().includes(term) ||
      user.username?.toLowerCase().includes(term) ||
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="p-8 w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">Administración de Usuarios</h1>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Consulta los usuarios registrados en la plataforma.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Buscar usuarios por correo, usuario o nombre..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Correo Electrónico</TableHead>
                    <TableHead>Nombre completo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Alta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersError ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-destructive">
                        No se pudieron cargar los usuarios. Inténtalo de nuevo.
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {[user.firstName, user.lastName].filter(Boolean).join(" ") || "-"}
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                {user.role}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              La gestión de roles se hace desde Keycloak.
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.enabled ? "default" : "destructive"}>
                            {user.enabled ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCreatedAt(user.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {usersLoading ? "Cargando usuarios..." : "No se encontraron usuarios con ese criterio de búsqueda."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Total de usuarios: {users?.length ?? 0}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
