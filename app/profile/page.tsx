"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [nombre, setNombre] = useState(user?.nombre || "")
  const [apellidos, setApellidos] = useState(user?.apellidos || "")

  if (!user) {
    return <div>Por favor, inicia sesión para ver esta página.</div>
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUser({ nombre, apellidos })
      alert("Perfil actualizado con éxito")
    } catch (error) {
      console.error("Error al actualizar el perfil:", error)
      alert("Error al actualizar el perfil. Por favor, inténtalo de nuevo.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Mi Perfil</h1>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" value={user.email} disabled className="bg-gray-100" />
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Input value={user.admin ? "Administrador" : "Usuario"} disabled className="bg-gray-100" />
              </div>
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                Actualizar Perfil
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

