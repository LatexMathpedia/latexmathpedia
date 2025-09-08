"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
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
import Link from "next/link"

export function NavMain({
  items,
  title
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[],
  title: string
}) {
  const { categoryFilter, subCategoryFilter, setFilter } = useFilter()
  const router = useRouter();

  // Determina si el elemento es filtrable (matemáticas o software)
  const isFilterable = (title: string) => {
    return title === "Matemáticas" || title === "Software"
  }

  function handleClickOnCategory(category: string) {
    setFilter(category, null);
    router.push("/dashboard");
  }

  function handleClickOnSubCategory(category: string, subCategory: string) {
    setFilter(category, subCategory);
    router.push("/dashboard");
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              {isFilterable(item.title) ? (
                <SidebarMenuButton 
                  tooltip={item.title}
                  onClick={() => handleClickOnCategory(item.title)}
                  className={`cursor-pointer ${categoryFilter === item.title ? "text-primary" : ""}`}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
              
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          {isFilterable(item.title) ? (
                            <SidebarMenuSubButton 
                              onClick={() => handleClickOnSubCategory(item.title, subItem.title)}
                              className={`cursor-pointer ${categoryFilter === item.title && subCategoryFilter === subItem.title ? "text-primary" : ""}`}
                            >
                                <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          ) : (
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          )}
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
