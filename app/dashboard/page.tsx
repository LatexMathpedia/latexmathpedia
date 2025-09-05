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

// Extendemos el tipo PDFDocument para incluir la etiqueta original
type ExtendedPDFDocument = PDFDocument & { originalTag?: string };

type SubCategories = {
  [key: string]: PDFDocument[]
}

type Categories = {
  [key: string]: SubCategories | PDFDocument[]
}

const sampleDataBlog = [
  { title: "Resolución Examen Análisis 2025", description: "Resolución del examen de análisis de 2025 con explicaciones detalladas.", date: "2025-09-01", estimatedReadTime: "5 min", tags: ["Análisis", "Exámenes", "Cálculo", "Integrales"], link: "/resolucion-examen-analisis-2025" },
  { title: "Teorema de Pitágoras", description: "Explicación y demostración del Teorema de Pitágoras.", date: "15/2/2025", estimatedReadTime: "7 min", tags: ["Matemáticas", "Geometría", "Teoremas"], link: "/teorema-pitagoras" },
  { title: "Teorema de Darboux", description: "Descripción y aplicaciones del Teorema de Darboux.", date: "10/3/2025", estimatedReadTime: "6 min", tags: ["Matemáticas", "Análisis", "Teoremas"], link: "/teorema-darboux" },
]

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

function selectBests(pdfs: ExtendedPDFDocument[]): ExtendedPDFDocument[] {
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
  const [displayedPDFs, setDisplayedPDFs] = useState<ExtendedPDFDocument[]>([])
  const [allPDFs, setAllPDFs] = useState<ExtendedPDFDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageTitle, setPageTitle] = useState("Últimos apuntes")
  const { isAuthenticated } = useAuth();

  function convertApiPdfToDocument(apiPdf: APIPDFDocument): ExtendedPDFDocument {
    const date = new Date(apiPdf.pdf_last_time_edit);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return {
      title: apiPdf.pdf_name,
      url: apiPdf.pdf_link || '#',
      date: formattedDate,
      img: apiPdf.pdf_image_link || '/image.png',
      originalTag: apiPdf.pdf_tag || undefined // Preservamos la etiqueta original
    };
  }

  async function fetchPDFs(): Promise<APIPDFDocument[]> {

    try {
      let response;
      if (isAuthenticated) {
        console.log("User is authenticated, fetching all PDFs.");
        response = await fetch(`${apiUrl}/pdfs`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        console.log("User is not authenticated, fetching public PDFs.");
        response = await fetch(`${apiUrl}/pdfs/no-link`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
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

  async function getAllPDFs(): Promise<ExtendedPDFDocument[]> {
    const apiPdfs = await fetchPDFs();
    // Convierte los PDF de la API a nuestro formato de documento extendido
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

  const tagToCategory: { [key: string]: { category: string, subcategory?: string } } = {
    // Matemáticas
    "AC": { category: "Matemáticas", subcategory: "Análisis y Cálculo" },
    "AG": { category: "Matemáticas", subcategory: "Álgebra y Geometría" },
    "TE": { category: "Matemáticas", subcategory: "Probabilidad y Estadística" },
    "PE": { category: "Matemáticas", subcategory: "Probabilidad y Estadística" },
    "EM": { category: "Matemáticas", subcategory: "Ecuaciones Diferenciales y Métodos Numéricos" },
    "OP": { category: "Matemáticas", subcategory: "Optimización y Programación Matemática" },

    // Software
    "FA": { category: "Software", subcategory: "Fundamentos y Algoritmos" },
    "EL": { category: "Software", subcategory: "Estructuras, Computación y Lenguajes" },
    "AS": { category: "Software", subcategory: "Arquitectura y Sistemas" },
    "IP": { category: "Software", subcategory: "Ingeniería de Software" },
    "BD": { category: "Software", subcategory: "Bases de Datos" },
    "RS": { category: "Software", subcategory: "Redes y Seguridad" },
    "WI": { category: "Software", subcategory: "Web e Interfaces" }
  };

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

    if (categoryFilter) {
      const filteredPDFs = allPDFs.filter(pdf => {
        const pdfTag = (pdf as any).originalTag;

        if (!pdfTag) return false;

        const tagInfo = tagToCategory[pdfTag];

        if (!tagInfo) return false;

        if (subCategoryFilter) {
          return tagInfo.category === categoryFilter && tagInfo.subcategory === subCategoryFilter;
        }

        return tagInfo.category === categoryFilter;
      });

      setDisplayedPDFs(filteredPDFs);
      setPageTitle(subCategoryFilter
        ? `${categoryFilter}: ${subCategoryFilter}`
        : categoryFilter);
    } else {
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