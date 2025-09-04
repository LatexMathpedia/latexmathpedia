"use client"

import { useEffect, useState } from "react"
import PDFCard from "@/components/pdf-card"
import BlogCard from "@/components/blog-card"
import { useFilter } from "@/contexts/filter-context"
import { useSearch } from "@/contexts/search-context" // Importar el contexto de búsqueda
import { useAuth } from "@/contexts/auth-context"

type PDFDocument = {
  title: string
  url: string
  date: string
  img: string
}

// Tipo para los PDFs que vienen de la API
type APIPDFDocument = {
  pdf_id: number
  pdf_link?: string
  pdf_last_time_edit: string
  pdf_description: string | null
  pdf_name: string
  pdf_image_link: string | null
  pdf_tag: string | null
}

type SubCategories = {
  [key: string]: PDFDocument[]
}

type Categories = {
  [key: string]: SubCategories | PDFDocument[]
}

const sampleDataBlog = [
  { title: "Resolución del examen de Análisis 20/12/2025", description: "Análisis es una de las asignaturas más importantes y desafiantes en el campo de las matemáticas. En este artículo, exploraremos la resolución del examen de Análisis", date: "20/2/2025", estimatedReadTime: "5 min", tags: ["Análisis", "Matemáticas"], link: "resolucion-examen-analisis-2025" },
  { title: "Introducción a React: Construyendo Interfaces de Usuario Dinámicas", description: "React es una biblioteca de JavaScript ampliamente utilizada para construir interfaces de usuario dinámicas y reactivas. En este artículo, exploraremos los conceptos básicos de React y cómo comenzar a desarrollar aplicaciones web con esta poderosa herramienta.", date: "15/2/2025", estimatedReadTime: "7 min", tags: ["React", "JavaScript", "Frontend"], link: "introduccion-react-interfaces-usuario" },
  { title: "Guía Completa de Docker: Contenedores para el Desarrollo Moderno", description: "Docker ha revolucionado la forma en que desarrollamos, implementamos y gestionamos aplicaciones. En esta guía completa, exploraremos qué es Docker, cómo funciona y cómo puedes utilizarlo para mejorar tu flujo de trabajo de desarrollo.", date: "10/2/2025", estimatedReadTime: "10 min", tags: ["Docker", "DevOps", "Contenedores"], link: "guia-completa-docker-contenedores" },
  { title: "Bases de Datos Relacionales vs NoSQL: ¿Cuál es la Mejor Opción para tu Proyecto?", description: "La elección entre bases de datos relacionales y NoSQL es una decisión crucial en el desarrollo de aplicaciones. En este artículo, compararemos ambas opciones, sus ventajas y desventajas, y te ayudaremos a decidir cuál es la mejor para tu proyecto.", date: "5/2/2025", estimatedReadTime: "6 min", tags: ["Bases de Datos", "SQL", "NoSQL"], link: "bases-datos-relacionales-vs-nosql" },
]

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

function selectBests(pdfs: PDFDocument[]): PDFDocument[] {
  return pdfs.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number)
    const [dayB, monthB, yearB] = b.date.split("/").map(Number)
    const dateA = new Date(yearA, monthA - 1, dayA)
    const dateB = new Date(yearB, monthB - 1, dayB)
    return dateB.getTime() - dateA.getTime()
  }).slice(0, 8)
}

function WelcomePage() {
  const { categoryFilter, subCategoryFilter } = useFilter()
  const { searchQuery } = useSearch()
  const [displayedPDFs, setDisplayedPDFs] = useState<PDFDocument[]>([])
  const [allPDFs, setAllPDFs] = useState<PDFDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageTitle, setPageTitle] = useState("Últimos apuntes")
  const { isAdmin } = useAuth();

  function convertApiPdfToDocument(apiPdf: APIPDFDocument): PDFDocument {
    const date = new Date(apiPdf.pdf_last_time_edit);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return {
      title: apiPdf.pdf_name,
      url: apiPdf.pdf_link || '#',
      date: formattedDate,
      img: apiPdf.pdf_image_link || '/image.png',
    };
  }

  async function fetchPDFs(): Promise<APIPDFDocument[]> {
    const apiQuery = isAdmin ? '/pdfs' : '/pdfs/no-link';

    try {
      const response = await fetch(`${apiUrl}${apiQuery}`);
      if (!response.ok) {
        throw new Error('Error fetching PDFs');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  }

  async function getAllPDFs(): Promise<PDFDocument[]> {
    const apiPdfs = await fetchPDFs();
    // Convierte los PDF de la API a nuestro formato de documento
    return apiPdfs.map(apiPdf => convertApiPdfToDocument(apiPdf));
  }


  // Función para normalizar texto (eliminar tildes y acentos)
  const normalizeText = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  useEffect(() => {
    async function loadPDFs() {
      setIsLoading(true);
      const pdfs = await getAllPDFs();
      setAllPDFs(pdfs);
      setIsLoading(false);
    }

    loadPDFs();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (searchQuery.trim() !== "") {
      const normalizedSearch = normalizeText(searchQuery);
      const filteredPDFs = allPDFs.filter(pdf =>
        normalizeText(pdf.title).includes(normalizedSearch)
      );
      setDisplayedPDFs(filteredPDFs);
      setPageTitle(`Resultados para: "${searchQuery}" (${filteredPDFs.length} encontrados)`);
      return;
    }

    //TODO
    // Por ahora, los filtros por categoría no funcionarán hasta que tengamos
    // la estructura de categorías en la API. Podemos implementar esto más tarde
    if (categoryFilter) {
      // Filtrar por etiqueta (pdf_tag) cuando tengamos esa funcionalidad
      // Por ahora, simplemente mostraremos todos los PDFs y cambiaremos el título
      setDisplayedPDFs(allPDFs);
      setPageTitle(subCategoryFilter
        ? `${categoryFilter}: ${subCategoryFilter}`
        : categoryFilter);
    } else {
      // Si no hay filtros, mostrar los PDFs más recientes
      setDisplayedPDFs(selectBests(allPDFs));
      setPageTitle("Últimos apuntes");
    }
  }, [categoryFilter, subCategoryFilter, searchQuery, allPDFs, isLoading]);

  return (
    <>
      <div className="p-8 max-w-[1300px] mx-auto">
        <div className="bg-muted/50 rounded-xl w-full h-32" />
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{pageTitle}</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {isLoading ? (
              // Muestra indicadores de carga si los datos se están cargando
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse bg-muted rounded-lg h-40"></div>
              ))
            ) : (
              // Muestra los PDFs una vez cargados
              displayedPDFs.map((pdf, index) => (
                <PDFCard
                  key={index}
                  title={pdf.title}
                  url={pdf.url}
                  date={pdf.date}
                  img={pdf.img}
                />
              ))
            )}
          </div>
          {!isLoading && displayedPDFs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron apuntes para esta categoría</p>
            </div>
          )}
        </section>
        <div className="bg-muted/50 rounded-xl w-full h-32 mt-12" />
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold mt-8">Blog</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {sampleDataBlog.map((blog, index) => (
              <BlogCard
                key={index}
                title={blog.title}
                description={blog.description}
                date={blog.date}
                estimatedReadTime={blog.estimatedReadTime}
                tags={blog.tags}
                link={blog.link}
              />
            ))}
          </div>
        </section>
      </div>

    </>
  )
}
export default WelcomePage