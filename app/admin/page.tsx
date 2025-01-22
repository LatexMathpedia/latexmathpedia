"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminPDFManager } from "@/components/admin-pdf-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Panel de Administración</h1>
        <Tabs defaultValue="pdfs" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pdfs">Gestión de PDFs</TabsTrigger>
            <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
            <TabsTrigger value="events">Gestión de Eventos</TabsTrigger>
          </TabsList>
          <TabsContent value="pdfs">
            <AdminPDFManager />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

