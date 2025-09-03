"use client"

import { ChevronRight, SidebarIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import { SearchForm } from "@/components/search-form"
import { useSearch } from "@/contexts/search-context" // Importar el contexto de búsqueda
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const { setSearchQuery } = useSearch()
  const pathname = usePathname() // Obtener la ruta actual

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Dividir la ruta en segmentos para generar los breadcrumbs
  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">MathTexpedia</BreadcrumbLink>
            </BreadcrumbItem>
            <ChevronRight size={13}/>
            {pathSegments.map((segment, index) => {
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`
              const isLast = index === pathSegments.length - 1

              return (
                <BreadcrumbItem key={href}>
                  {isLast ? (
                    <BreadcrumbPage>{capitalizeFirstLetter(decodeURIComponent(segment))}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>
                      {capitalizeFirstLetter(decodeURIComponent(segment))}
                    </BreadcrumbLink>
                  )}
                  {!isLast && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className="w-full sm:ml-auto sm:w-auto" onSearch={handleSearch} />
        <ModeToggle />
      </div>
    </header>
  )
}
