import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { FilterProvider } from "@/contexts/filter-context"
import { SearchProvider } from "@/contexts/search-context"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
