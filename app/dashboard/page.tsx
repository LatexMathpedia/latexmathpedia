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

type SubCategories = {
  [key: string]: PDFDocument[]
}

type Categories = {
  [key: string]: SubCategories | PDFDocument[]
}

const sampleData: Categories = {
  "Matemáticas": {
    "Análisis": [
      { title: "Análisis: Límites", url: "https://example.com/", date: "15/1/2025", img: "/image.png" },
      { title: "Análisis: Derivadas", url: "https://example.com/", date: "18/1/2025", img: "/image.png" },
      { title: "Análisis: Integrales", url: "https://example.com/", date: "22/1/2025", img: "/image.png" },
    ],
    "Álgebra": [
      { title: "Álgebra: Matrices", url: "https://example.com/", date: "10/1/2025", img: "/image.png" },
      { title: "Álgebra: Determinantes", url: "https://example.com/", date: "14/1/2025", img: "/image.png" },
      { title: "Álgebra: Espacios Vectoriales", url: "https://example.com/", date: "19/1/2025", img: "/image.png" },
    ],
    "Geometría": [
      { title: "Geometría: Vectores", url: "https://example.com/", date: "8/1/2025", img: "/image.png" },
      { title: "Geometría: Curvas", url: "https://example.com/", date: "12/1/2025", img: "/image.png" },
      { title: "Geometría: Superficies", url: "https://example.com/", date: "17/1/2025", img: "/image.png" },
    ],
  },
  "Software": {
    "Frontend": [
      { title: "Frontend: React", url: "https://example.com/", date: "5/1/2025", img: "/image.png" },
      { title: "Frontend: CSS Avanzado", url: "https://example.com/", date: "9/1/2025", img: "/image.png" },
    ],
    "Backend": [
      { title: "Backend: Node.js", url: "https://example.com/", date: "7/1/2025", img: "/image.png" },
      { title: "Backend: Bases de Datos", url: "https://example.com/", date: "11/1/2025", img: "/image.png" },
    ],
    "DevOps": [
      { title: "DevOps: Docker", url: "https://example.com/", date: "6/1/2025", img: "/image.png" },
      { title: "DevOps: CI/CD", url: "https://example.com/", date: "13/1/2025", img: "/image.png" },
    ],
  },
  "recientes": [
    { title: "Topología Tema 1", url: "https://youtube.com/", date: "12/1/2025", img: "/image.png" },
    { title: "Topología Tema 2", url: "https://youtube.com/", date: "12/1/2025", img: "/image.png" },
    { title: "Topología Tema 3", url: "https://youtube.com/", date: "12/1/2025", img: "/image.png" },
    { title: "Topología Tema 4", url: "https://youtube.com/", date: "12/1/2025", img: "/image.png" },
  ],
}

const sampleDataBlog = [
  { title: "Resolución del examen de Análisis 20/12/2025", description: "Análisis es una de las asignaturas más importantes y desafiantes en el campo de las matemáticas. En este artículo, exploraremos la resolución del examen de Análisis", date: "20/2/2025", estimatedReadTime: "5 min", tags: ["Análisis", "Matemáticas"], link: "resolucion-examen-analisis-2025"},
  { title: "Introducción a React: Construyendo Interfaces de Usuario Dinámicas", description: "React es una biblioteca de JavaScript ampliamente utilizada para construir interfaces de usuario dinámicas y reactivas. En este artículo, exploraremos los conceptos básicos de React y cómo comenzar a desarrollar aplicaciones web con esta poderosa herramienta.", date: "15/2/2025", estimatedReadTime: "7 min", tags: ["React", "JavaScript", "Frontend"], link: "introduccion-react-interfaces-usuario"},
  { title: "Guía Completa de Docker: Contenedores para el Desarrollo Moderno", description: "Docker ha revolucionado la forma en que desarrollamos, implementamos y gestionamos aplicaciones. En esta guía completa, exploraremos qué es Docker, cómo funciona y cómo puedes utilizarlo para mejorar tu flujo de trabajo de desarrollo.", date: "10/2/2025", estimatedReadTime: "10 min", tags: ["Docker", "DevOps", "Contenedores"], link: "guia-completa-docker-contenedores"},
  { title: "Bases de Datos Relacionales vs NoSQL: ¿Cuál es la Mejor Opción para tu Proyecto?", description: "La elección entre bases de datos relacionales y NoSQL es una decisión crucial en el desarrollo de aplicaciones. En este artículo, compararemos ambas opciones, sus ventajas y desventajas, y te ayudaremos a decidir cuál es la mejor para tu proyecto.", date: "5/2/2025", estimatedReadTime: "6 min", tags: ["Bases de Datos", "SQL", "NoSQL"], link: "bases-datos-relacionales-vs-nosql"},
]

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
  const { searchQuery } = useSearch() // Usar el estado de búsqueda global
  const [displayedPDFs, setDisplayedPDFs] = useState<PDFDocument[]>(selectBests(sampleData.recientes as PDFDocument[]))
  const [pageTitle, setPageTitle] = useState("Últimos apuntes")

  const { isAuthenticated, login, isAdmin } = useAuth()

  const getAllPDFs = (): PDFDocument[] => {
    let allPDFs: PDFDocument[] = [...(sampleData.recientes as PDFDocument[])]

    Object.entries(sampleData).forEach(([key, value]) => {
      if (key !== "recientes") {
        if (Array.isArray(value)) {
          allPDFs = [...allPDFs, ...value]
        } else {
          Object.values(value).forEach(subcategoryPDFs => {
            allPDFs = [...allPDFs, ...subcategoryPDFs]
          })
        }
      }
    })

    return allPDFs
  }

  // Función para normalizar texto (eliminar tildes y acentos)
  const normalizeText = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  useEffect(() => {
    const allPDFs = getAllPDFs()

    if (searchQuery.trim() !== "") {
      const normalizedSearch = normalizeText(searchQuery);
      const filteredPDFs = allPDFs.filter(pdf =>
        normalizeText(pdf.title).includes(normalizedSearch)
      )
      setDisplayedPDFs(filteredPDFs)
      setPageTitle(`Resultados para: "${searchQuery}" (${filteredPDFs.length} encontrados)`)
      return
    }

    if (categoryFilter) {
      const category = sampleData[categoryFilter]
      if (!category) return

      if (subCategoryFilter && !Array.isArray(category)) {
        const subCategory = (category as SubCategories)[subCategoryFilter]
        if (subCategory) {
          setDisplayedPDFs(subCategory)
          setPageTitle(`${categoryFilter}: ${subCategoryFilter}`)
        }
      } else {
        if (Array.isArray(category)) {
          setDisplayedPDFs(category as PDFDocument[])
        } else {
          const allSubCategoryPDFs = Object.values(category as SubCategories).flat() as PDFDocument[]
          setDisplayedPDFs(allSubCategoryPDFs)
        }
        setPageTitle(categoryFilter)
      }
    } else {
      setDisplayedPDFs(selectBests(allPDFs))
      setPageTitle("Últimos apuntes")
    }
  }, [categoryFilter, subCategoryFilter, searchQuery])

  return (
    <>
      <div className="p-8 max-w-[1300px] mx-auto">
        <div className="bg-muted/50 rounded-xl w-full h-32" />
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{pageTitle}</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayedPDFs.map((pdf, index) => (
              <PDFCard
                key={index}
                title={pdf.title}
                url={pdf.url}
                date={pdf.date}
                img={pdf.img}
              />
            ))}
          </div>
          {displayedPDFs.length === 0 && (
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