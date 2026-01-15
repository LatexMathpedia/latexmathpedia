"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Edit, Trash, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { renameCategory, renameCategoryInverted } from "@/lib/utils";

const categories = {
  "Matemáticas": [
    "Análisis y Cálculo",
    "Álgebra y Geometría",
    "Topología",
    "Probabilidad y Estadística",
    "Ecuaciones Diferenciales y Métodos Numéricos",
    "Optimización y Programación Matemática"
  ],
  "Software": [
    "Fundamentos y Algoritmos",
    "Estructuras, Computación y Lenguajes",
    "Arquitectura y Sistemas",
    "Ingeniería del Software",
    "Bases de Datos",
    "Redes y Seguridad",
    "Web e Interfaces"
  ]
}

type PDFProps = {
  id: string;
  link: string;
  lastEdited: string;
  description: string;
  name: string;
  pdfTag?: string; // Código de categoría que viene de la base de datos
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

// Función para identificar la categoría principal a partir de la subcategoría
const getCategoryFromSubcategory = (subcategory: string): string => {
  for (const [category, subcategories] of Object.entries(categories)) {
    if (subcategories.includes(subcategory)) {
      return category;
    }
  }
  return "";
}

const PDFAccordionCard = ({
  pdf,
  onUpdate,
  onDelete
}: {
  pdf: PDFProps,
  onUpdate?: (updatedPdf: PDFProps) => void,
  onDelete?: (pdfId: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [pdfData, setPdfData] = useState<PDFProps>(pdf)
  const toast = useToast();

  // Si existe un pdfTag, convertimos el código a nombre de subcategoría
  const initialSubcategory = pdf.pdfTag ? renameCategoryInverted(pdf.pdfTag) : "";
  // Determinamos la categoría principal basada en la subcategoría
  const initialCategory = initialSubcategory ? getCategoryFromSubcategory(initialSubcategory) : "";

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  const [subcategoryOpen, setSubcategoryOpen] = useState(false)
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory)

  // Función para actualizar campos individuales
  const handleInputChange = (field: keyof PDFProps, value: string) => {
    setPdfData(prev => ({ ...prev, [field]: value }))
  }

  const handleUpdate = async () => {
    toast.info("Actualizando PDF...");
    // Actualizar el pdfData con el pdfTag antes de enviarlo
    const updatedPdf = {
      ...pdfData,
      pdfTag: selectedSubcategory ? renameCategory(selectedSubcategory) : undefined
    };

    try {
      const response = await fetch(`${apiUrl}/pdfs/update?pdfId=${pdfData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: updatedPdf.name,
          link: updatedPdf.link,
          pdfTag: updatedPdf.pdfTag,
          description: updatedPdf.description,
        })
      });

      if (response.ok) {
        toast.success("PDF actualizado correctamente.");
        if (onUpdate) {
          onUpdate(updatedPdf);
        }
      } else {
        toast.error("Error al actualizar el PDF.");
      }
    } catch (error) {
      toast.error("Error al actualizar el PDF.");
    } finally {
      setIsOpen(false);
    }
  }

  const handleDelete = async () => {
    toast.info("Eliminando PDF...");

    try {
      const response = await fetch(`${apiUrl}/pdfs/delete?pdfName=${pdf.name}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success("PDF eliminado correctamente.");
        if (onDelete) {
          onDelete(pdf.id);
        }
      } else {
        toast.error("Error al eliminar el PDF.");
      }
    } catch (error) {
      toast.error("Error al eliminar el PDF.");
    }
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-md mb-4 w-full"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex-col">
          <div className="flex items-center space-x-3">
            <div className="font-medium">{pdf.name}</div>
            <div className="text-xs text-muted-foreground">Última edición: {pdf.lastEdited}</div>
          </div>
          {selectedCategory && selectedSubcategory && (
            <div className="flex mt-1 items-center space-x-2">
              <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {selectedCategory}
              </div>
              <div className="text-xs bg-secondary/10 text-primary px-2 py-0.5 rounded-full">
                {selectedSubcategory}
              </div>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={handleDelete} className="cursor-pointer">
            <Trash className="h-4 w-4" />
          </Button>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="cursor-pointer">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent>
        <Separator />
        <div className="p-4 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título del documento</Label>
            <Input
              id="title"
              value={pdfData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pdfUrl">Enlace al PDF</Label>
            <Input
              id="pdfUrl"
              value={pdfData.link}
              onChange={(e) => handleInputChange('link', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={pdfData.description || ""}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full"
            />
          </div>

          <Separator className="my-4" />

          {/* Campos de categoría y subcategoría */}
          <div className="md:flex md:flex-row md:gap-6">
            <div className="flex-1 grid gap-2 mb-4 md:mb-0">
              <Label htmlFor="category">Categoría</Label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="category"
                    variant="outline"
                    role="combobox"
                    aria-expanded={categoryOpen}
                    className="w-full justify-between cursor-pointer"
                  >
                    {selectedCategory || "Selecciona una categoría"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar categoría..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron categorías.</CommandEmpty>
                      <CommandGroup>
                        {Object.keys(categories).map((category) => (
                          <CommandItem
                            key={category}
                            value={category}
                            onSelect={(value) => {
                              setSelectedCategory(value);
                              setSelectedSubcategory(""); // Reset subcategory
                              setCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCategory === category ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {category}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1 grid gap-2">
              <Label htmlFor="subcategory">Subcategoría</Label>
              <Popover
                open={subcategoryOpen && !!selectedCategory}
                onOpenChange={setSubcategoryOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    id="subcategory"
                    variant="outline"
                    role="combobox"
                    aria-expanded={subcategoryOpen}
                    className="w-full justify-between cursor-pointer"
                    disabled={!selectedCategory}
                  >
                    {selectedSubcategory || (selectedCategory ? "Selecciona una subcategoría" : "Primero selecciona una categoría")}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar subcategoría..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron subcategorías.</CommandEmpty>
                      <CommandGroup>
                        {selectedCategory && categories[selectedCategory as keyof typeof categories].map((subcategory) => (
                          <CommandItem
                            key={subcategory}
                            value={subcategory}
                            onSelect={(value) => {
                              setSelectedSubcategory(value);
                              setSubcategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedSubcategory === subcategory ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {subcategory}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="cursor-pointer">
              Cancelar
            </Button>
            <Button onClick={handleUpdate} className="cursor-pointer">
              Actualizar PDF
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default PDFAccordionCard
