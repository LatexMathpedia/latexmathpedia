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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Matemáticas",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Análisis",
          url: "#",
        },
        {
          title: "Álgebra",
          url: "#",
        },
        {
          title: "Geometría",
          url: "#",
        },
      ],
    },
    {
      title: "Software",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Frontend",
          url: "#",
        },
        {
          title: "Backend",
          url: "#",
        },
        {
          title: "DevOps",
          url: "#",
        },
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">MathTexpedia</span>
                  <span className="truncate text-xs">Apuntes bien guarrones</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user}/>
      </SidebarFooter>
    </Sidebar>
  )
}