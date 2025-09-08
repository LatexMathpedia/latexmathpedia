"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

// Tipos para los usuarios
type User = {
  email: string;
  role: "admin" | "user" | "moderator";
}

// Posibles roles
const roles = ["admin", "user", "moderator"];

let numUsers = 0;

async function fetchUsers() {
  try {
    const response = await fetch(`${apiUrl}/auth/all-users`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Error al obtener los usuarios');
    }
    const data = await response.json();
    numUsers = data.length;
    return data;
  } catch (error) {
    <Alert variant="destructive">
      <AlertCircleIcon />
        <AlertTitle>Error al cargar usuarios</AlertTitle>
        <AlertDescription>
          <p>No se pudieron cargar los usuarios. Por favor, intenta de nuevo más tarde.</p>
          <ul className="list-inside list-disc text-sm">
            <li>Verifica tu conexión a internet.</li>
            <li>Si el problema persiste, contacta al soporte técnico.</li>
          </ul>
        </AlertDescription>
      </Alert>
    return [];
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Cargar usuarios
  const loadUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      <Alert variant="destructive">
        <AlertCircleIcon />
          <AlertTitle>Error al cargar usuarios</AlertTitle>
          <AlertDescription>
            <p>No se pudieron cargar los usuarios. Por favor, intenta de nuevo más tarde.</p>
            <ul className="list-inside list-disc text-sm">
              <li>Verifica tu conexión a internet.</li>
              <li>Si el problema persiste, contacta al soporte técnico.</li>
            </ul>
          </AlertDescription>
        </Alert>
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const updateUserRole = async (userEmail: string, newRole: string) => {
    try {
      const response = await fetch(`${apiUrl}/auth/change-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userEmail,
          role: newRole
        })
      });
      
      if (response.ok) {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.email === userEmail ? { ...user, role: newRole as "admin" | "user" | "moderator" } : user
          )
        );
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Rol actualizado</AlertTitle>
          <AlertDescription>
            El rol del usuario {userEmail} ha sido actualizado a {newRole}.
          </AlertDescription>
        </Alert>
      } else {
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error al actualizar rol</AlertTitle>
          <AlertDescription>
            No se pudo actualizar el rol del usuario {userEmail}. Por favor, intenta de nuevo más tarde.
          </AlertDescription>
        </Alert>
      }
    } catch (error) {
      <Alert variant="destructive">
        <AlertCircleIcon />
          <AlertTitle>Error al actualizar rol</AlertTitle>
          <AlertDescription>
            No se pudo actualizar el rol del usuario {userEmail}. Por favor, intenta de nuevo más tarde.
          </AlertDescription>
        </Alert>
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">Administración de Usuarios</h1>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Busca y modifica roles de usuarios registrados en la plataforma.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
              <Input
              placeholder="Buscar usuarios por correo electrónico..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Correo Electrónico</TableHead>
                    <TableHead>Rol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.email}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-[120px] justify-between cursor-pointer"
                              >
                                {user.role}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[120px] p-0">
                              <Command>
                                <CommandInput placeholder="Buscar rol..." />
                                <CommandEmpty>No se encontraron roles.</CommandEmpty>
                                <CommandGroup>
                                  {roles.map((role) => (
                                    <CommandItem
                                      key={role}
                                      value={role}
                                      onSelect={() => {
                                        if (role !== user.role) {
                                          updateUserRole(user.email, role);
                                        }
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          user.role === role ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {role}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        {loading ? "Cargando usuarios..." : "No se encontraron usuarios con ese criterio de búsqueda."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <p className="text-sm text-muted-foreground mr-auto">
            Total de usuarios: {numUsers || 0}
          </p>
          <Button onClick={loadUsers} disabled={loading} className="cursor-pointer">
            {loading ? "Cargando..." : "Refrescar Lista"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}