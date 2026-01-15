"use client"

import * as React from "react"
import {
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { useFilter } from "@/contexts/filter-context"
import { useSearch } from "@/contexts/search-context"
import Link from "next/link"
import logo from '@/public/icon.png'

const data = {
  navMain: [
    {
      title: "Matemáticas",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Análisis y Cálculo",
          url: "#",
        },
        {
          title: "Álgebra y Geometría",
          url: "#",
        },
        {
          title: "Topología",
          url: "#",
        },
        {
          title: "Probabilidad y Estadística",
          url: "#",
        },
        {
          title: "Ecuaciones Diferenciales y Métodos Numéricos",
          url: "#",
        },
        {
          title: "Optimización y Programación Matemática",
          url: "#",
        }
      ],
    },
    {
      title: "Software",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Fundamentos y Algoritmos",
          url: "#",
        },
        {
          title: "Estructuras, Computación y Lenguajes",
          url: "#",
        },
        {
          title: "Arquitectura y Sistemas",
          url: "#",
        },
        {
          title: "Ingeniería del Software",
          url: "#",
        },
        {
          title: "Bases de Datos",
          url: "#",
        },
        {
          title: "Web e Interfaces",
          url: "#",
        },
        {
          title: "Seguridad e IA",
          url: "#",
        }
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Ejercicios Resueltos Análisis III - Parte 1",
      url: "/dashboard/blog/analisis3-ejercicios-1",
      icon: Frame,
    },
    {
      name: "Apuntes MOR - Tema 4",
      url: "/dashboard/blog/mor-tema-4",
      icon: Map,
    },
    {
      name: "Apuntes TPP - Tema 1",
      url: "/dashboard/blog/tpp-tema-1",
      icon: SquareTerminal,
    },
    {
      name: "Solución del Exámen de CDI",
      url: "/dashboard/blog/resolucion-examen-analisis-2025",
      icon: PieChart,
    },
  ],
}

const dataAdminPanel = {
  adminPanel: [
    {
      title: "PDFs",
      url: "/dashboard/admin/pdfs",
      icon: Command,
      isActive: false,
    },
    {
      title: "Usuarios",
      url: "/dashboard/admin/users",
      icon: Bot,
      isActive: false,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAdmin, email, isAuthenticated } = useAuth();
  const { clearFilter } = useFilter();
  const { setSearchQuery } = useSearch();

  const dataUser = {
    name: email ? email.split('@')[0] : 'Usuario',
    email: email || ''
  }

  const handleLogoClick = () => {
    // Limpiar los filtros y la búsqueda
    clearFilter();
    setSearchQuery("");
  }



  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>

            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center space-x-2" onClick={handleLogoClick}>
                <img src={logo.src} alt="Logo" className="h-10 w-12 rounded-lg" />
                <div className="flex flex-col text-left">
                  <span className="truncate font-medium text-lg">MathTexpedia</span>
                  <span className="truncate text-sm text-gray-500">Apuntes bien guarrones</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} title="Apuntes" />
        <NavProjects projects={data.projects} />
        {/* Solo mostrar admin panel si está autenticado y es admin */}
        {isAuthenticated && isAdmin && (
          <NavMain items={dataAdminPanel.adminPanel} title="Admin Panel" />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dataUser} />
      </SidebarFooter>
    </Sidebar>
  )
}