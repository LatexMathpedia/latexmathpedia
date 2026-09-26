"use client"

import { BookOpen, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
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
import { useFilter } from "@/contexts/filter-context"
import { useSubjects, useSubjectUnits } from "@/hooks/api/use-subjects"
import type { SubjectDto } from "@/lib/api/subjects"

function SubjectNavItem({ subject }: { subject: SubjectDto }) {
  const router = useRouter()
  const { subjectId, subjectUnitId, setFilter } = useFilter()
  const { data: units } = useSubjectUnits(subject.id)

  const isActiveSubject = subject.id != null && subjectId === subject.id

  function handleClickSubject() {
    if (subject.id == null) return
    setFilter(subject.id, null)
    router.push("/dashboard")
  }

  function handleClickUnit(unitId?: number) {
    if (subject.id == null || unitId == null) return
    setFilter(subject.id, unitId)
    router.push("/dashboard")
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
                        isActiveSubject && unit.id != null && subjectUnitId === unit.id
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
