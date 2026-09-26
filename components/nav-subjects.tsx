"use client"

import { BookOpen, ChevronRight } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useSubjects, useSubjectUnits } from "@/hooks/api/use-subjects"
import type { SubjectDto } from "@/lib/api/subjects"

function SubjectNavItem({ subject }: { subject: SubjectDto }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: units } = useSubjectUnits(subject.id)

  // Ahora que el clic navega a la ficha de asignatura (en vez de aplicar FilterContext), el
  // resaltado "activo" se deriva de la ruta actual, no de un filtro en memoria.
  const isActiveSubject =
    subject.id != null && pathname === `/dashboard/subjects/${subject.id}`
  const activeUnitId = isActiveSubject ? searchParams.get("unit") : null

  // Clic en la asignatura: navega a su ficha (§4/§6.1 de UI-RESTRUCTURE.md) en vez de
  // filtrar el feed -- evita mantener dos formas de ver lo mismo.
  function handleClickSubject() {
    if (subject.id == null) return
    router.push(`/dashboard/subjects/${subject.id}`)
  }

  // Clic en un tema: también va a la ficha de asignatura, con ese tema ya expandido
  // (?unit=X), en vez de aplicar el filtro sobre /dashboard -- misma razón que arriba, y
  // así el tema muestra su contenido agrupado (PDFs + cuestionarios) en vez de mezclado en
  // el feed general.
  function handleClickUnit(unitId?: number) {
    if (subject.id == null || unitId == null) return
    router.push(`/dashboard/subjects/${subject.id}?unit=${unitId}`)
  }

  return (
    <Collapsible asChild defaultOpen={isActiveSubject}>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={subject.name}
          onClick={handleClickSubject}
          className={`cursor-pointer ${isActiveSubject ? "text-primary" : ""}`}
        >
          <BookOpen />
          <span>{subject.name}</span>
        </SidebarMenuButton>

        {units && units.length > 0 && (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRight />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {units.map((unit) => (
                  <SidebarMenuSubItem key={unit.id}>
                    <SidebarMenuSubButton
                      onClick={() => handleClickUnit(unit.id)}
                      className={`cursor-pointer ${
                        unit.id != null && activeUnitId === String(unit.id)
                          ? "text-primary"
                          : ""
                      }`}
                    >
                      <span>{unit.name}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        )}
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function NavSubjects({ title }: { title: string }) {
  const { data: subjects, isLoading } = useSubjects()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span className="text-muted-foreground text-sm">Cargando asignaturas...</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {subjects?.map((subject) => (
          <SubjectNavItem key={subject.id} subject={subject} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
