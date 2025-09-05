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
import { NavSecondary } from "@/components/nav-secondary"
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
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Matemáticas",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
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
          title: "Web e interfaces",
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
      name: "Solución del Exámen de CDI",
      url: "/dashboard/blog/resolucion-examen-analisis-2025",
      icon: PieChart,
    },
    {
      name: "Teorema de Pitágoras",
      url: "/dashboard/blog/teorema-pitagoras",
      icon: Frame,
    },
    {
      name: "Teorema de Darboux",
      url: "/dashboard/blog/teorema-darboux",
      icon: Map,
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
  const { isAdmin } = useAuth()

  //TODO: recibir los datos del usuario y pasarlos al NavUser
  const dataUser = {
    name: "shadcn",
    email: "shadcn@gmai.com",
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
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">MathTexpedia</span>
                  <span className="truncate text-xs">Apuntes bien guarrones</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} title="Apuntes"/>
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        { isAdmin && (
          <NavMain items={dataAdminPanel.adminPanel} title="Admin Panel"/>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dataUser}/>
      </SidebarFooter>
    </Sidebar>
  )
}