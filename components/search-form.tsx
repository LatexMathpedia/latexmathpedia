import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import { SidebarInput } from "@/components/ui/sidebar"
import { useSearch } from "@/contexts/search-context"

export function SearchForm({
  onSearch,
  ...props
}: React.ComponentProps<"form"> & { onSearch?: (query: string) => void }) {
  // Usamos el contexto de búsqueda para mantener el estado consistente
  const { searchQuery } = useSearch();
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(event.target.value)
    }
  }

  // Esta función previene el envío del formulario (comportamiento predeterminado)
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  }

  return (
    <form {...props} onSubmit={handleSubmit}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Buscar apuntes
        </Label>
        <SidebarInput
          id="search"
          placeholder="Buscar apuntes..."
          className="h-8 pl-7"
          onChange={handleInputChange}
          value={searchQuery} // Mantener el valor actual del input
          autoComplete="off" // Desactivar autocompletado para mejor experiencia
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>
    </form>
  )
}
