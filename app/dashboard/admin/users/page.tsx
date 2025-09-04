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

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

// Tipos para los usuarios
type User = {
  email: string;
  role: "admin" | "user";
}

// Posibles roles
const roles = ["admin", "user"];

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
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
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
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (apiUrl === '') {
      setUsers([
        { email: 'maria@example.com', role: 'admin' },
        { email: 'juan@example.com', role: 'user' },
        { email: 'ana@example.com', role: 'user' },
        { email: 'carlos@example.com', role: 'user' },
      ]);
    } else {
      loadUsers();
    }
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
            user.email === userEmail ? { ...user, role: newRole as "admin" | "user" } : user
          )
        );
        console.log(`Rol del usuario ${userEmail} actualizado a ${newRole}`);
      } else {
        console.error('Error al actualizar el rol del usuario');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
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
                                className="w-[120px] justify-between"
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
          <Button onClick={loadUsers} disabled={loading}>
            {loading ? "Cargando..." : "Refrescar Lista"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}