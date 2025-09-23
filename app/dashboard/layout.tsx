"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { FilterProvider } from "@/contexts/filter-context"
import { SearchProvider } from "@/contexts/search-context"
import { useProtectedRoute } from "@/hooks/use-protected-route"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Proteger todas las rutas del dashboard
  const { isAuthenticated, loading } = useProtectedRoute();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Solo renderizar el contenido si está autenticado
  if (!isAuthenticated) {
    return null; // El hook ya maneja la redirección
  }

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SearchProvider>
        <FilterProvider>
          <SidebarProvider className="flex flex-col">
            <SiteHeader />
            <div className="flex flex-1">
              <AppSidebar />
              <SidebarInset>
                {children}
              </SidebarInset>
            </div>
          </SidebarProvider>
        </FilterProvider>
      </SearchProvider>
    </div>
  )
}
