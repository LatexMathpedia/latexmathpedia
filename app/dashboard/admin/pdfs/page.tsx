"use client"

import { useState, useEffect } from "react"
import { AlertCircleIcon, Check, CheckCircle2Icon, ChevronsUpDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import PDFAccordionCard from "@/components/ui/PDFAccordionCard"
import { cn } from "@/lib/utils"
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
import { renameCategory } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast";


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
    "Web e Interfaces",
    "Bases de Datos",
    "Redes y Seguridad"
  ]
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

type PDFFetchResponse = {
  pdf_id: string;
  pdf_link: string;
  pdf_last_time_edit: string;
  pdf_description: string;
  pdf_name: string;
  pdf_tag: string;
}


export default function WelcomePage() {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [subcategoryOpen, setSubcategoryOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const [existingPDFs, setExistingPDFs] = useState<Array<{
    id: string;
    link: string;
    lastEdited: string;
    description: string;
    name: string;
    pdfTag?: string;
  }>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPDFs, setFilteredPDFs] = useState<Array<{
    id: string;
    link: string;
    lastEdited: string;
    description: string;
    name: string;
    pdfTag?: string;
  }>>([]);


  async function fetchExistingPDFs() {
    try {
      const response = await fetch(`${apiUrl}/pdfs`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Error al obtener los PDFs existentes');
      }

      const data = await response.json();

      const pdfs = data.map((item: PDFFetchResponse) => ({
        id: item.pdf_id,
        link: item.pdf_link,
        lastEdited: new Date(item.pdf_last_time_edit).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        description: item.pdf_description,
        name: item.pdf_name,
        pdfTag: item.pdf_tag
      }));
      return pdfs;
    } catch (error) {
      toast.error("Error al obtener los PDFs existentes.")
      return [];
    }
  }

  const fetchAndSetPDFs = async () => {
    const pdfs = await fetchExistingPDFs();
    setExistingPDFs(pdfs || []);
    setFilteredPDFs(pdfs || []);
  };
  
  // Cargar PDFs cuando el componente se monta
  useEffect(() => {
    fetchAndSetPDFs();
  }, []);

  const handleSearch = (searchText: string) => {
    setSearchTerm(searchText);
    
    // Si no hay PDFs existentes, no hacemos nada
    if (!existingPDFs || existingPDFs.length === 0) {
      setFilteredPDFs([]);
      return;
    }
    
    // Si el término de búsqueda está vacío, mostramos todos los PDFs
    if (!searchText.trim()) {
      setFilteredPDFs(existingPDFs);
      return;
    }
    
    // Filtramos los PDFs basados en el término de búsqueda
    const filtered = existingPDFs.filter(pdf => 
      (pdf.name && pdf.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (pdf.pdfTag && pdf.pdfTag.toLowerCase().includes(searchText.toLowerCase())) ||
      (pdf.description && pdf.description.toLowerCase().includes(searchText.toLowerCase()))
    );
    
    setFilteredPDFs(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/pdfs/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: title,
          link: pdfUrl,
          pdfTag: renameCategory(selectedSubcategory),
          description: ""
        })
      });

      if (response.ok) {
        toast.success("PDF creado exitosamente.");

        setTitle("");
        setPdfUrl("");
        setSelectedCategory("");
        setSelectedSubcategory("");

        fetchAndSetPDFs();
      } else {
        toast.error("Error al crear el PDF.");
      }
    } catch (error) {
      toast.error("Error al crear el PDF.");
    }
  };


  return (
    <div className="p-8 w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">Administración de Contenidos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Subir un nuevo PDF</CardTitle>
          <CardDescription>Completa el formulario para agregar un nuevo documento PDF a la plataforma.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Título del documento</Label>
                <Input
                  id="title"
                  placeholder="Ej: Teorema de Pitágoras - Demostración y aplicaciones"
                  className="w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pdfUrl">Enlace al PDF</Label>
                <Input
                  id="pdfUrl"
                  placeholder="https://ejemplo.com/archivo.pdf"
                  className="w-full"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                />
              </div>

              <Separator className="my-4" />

              {/* Campos de categoría y subcategoría en fila para pantallas grandes */}
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
                                  setSelectedSubcategory("");
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
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            className="cursor-pointer"
            onClick={() => {
              setTitle("");
              setPdfUrl("");
              setSelectedCategory("");
              setSelectedSubcategory("");
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="cursor-pointer">Subir PDF</Button>
        </CardFooter>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Gestión de PDFs existentes</CardTitle>
          <CardDescription>Busca, edita o elimina documentos PDF ya subidos a la plataforma.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos por título, categoría o subcategoría..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  className="absolute right-0 top-0 h-full rounded-l-none px-3"
                  onClick={() => handleSearch("")}
                >
                  <span className="sr-only">Borrar</span>
                  <span>×</span>
                </Button>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredPDFs && filteredPDFs.length > 0 ? (
                filteredPDFs.map((pdf) => (
                  <PDFAccordionCard
                    key={pdf.id}
                    pdf={pdf}
                    onUpdate={(updatedPdf) => {
                      if (!existingPDFs) return;
                      // Actualizar el PDF en el estado local
                      const updatedPDFs = existingPDFs.map(item =>
                        item.id === updatedPdf.id ? updatedPdf : item
                      );
                      setExistingPDFs(updatedPDFs);
                      handleSearch(searchTerm); // Reaplica el filtro actual
                    }}
                    onDelete={(pdfId) => {
                      if (!existingPDFs) return;
                      // Eliminar el PDF del estado local
                      const updatedPDFs = existingPDFs.filter(item => item.id !== pdfId);
                      setExistingPDFs(updatedPDFs);
                      handleSearch(searchTerm); // Reaplica el filtro actual
                    }}
                  />
                ))
              ) : searchTerm ? (
                <div className="text-center py-6">
                  <AlertCircleIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                  <p>No se encontraron resultados para &quot;{searchTerm}&quot;</p>
                  <p className="text-sm text-muted-foreground mt-1">Intenta con otro término de búsqueda</p>
                </div>
              ) : (
                <p>No hay PDFs existentes. Haz clic en &quot;Ver PDFS&quot; para cargar los documentos.</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button onClick={fetchAndSetPDFs} className="cursor-pointer">Ver PDFS</Button>
        </CardFooter>
      </Card>
    </div>
  )
}