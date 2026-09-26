"use client";

import { useEffect, useMemo } from "react";
import PDFCard from "@/components/pdf-card";
import BlogCard from "@/components/blog-card";
import { useFilter } from "@/contexts/filter-context";
import { useSearch } from "@/contexts/search-context"; // Importar el contexto de búsqueda
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { usePdfs, usePublicPdfsNoLink } from "@/hooks/api/use-pdfs";
import { useSubjects, useSubjectUnits } from "@/hooks/api/use-subjects";

// Shape normalizado que usa esta página, independientemente de si el PDF viene con o
// sin `link` (según el usuario esté autenticado o no).
type DisplayPdf = {
  id: number;
  title: string;
  url?: string;
  lastTimeEdited: string;
  subjectId?: number;
  subjectUnitId?: number;
  subjectName?: string;
  subjectUnitName?: string;
};

function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Función para normalizar texto (eliminar tildes y acentos)
function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

const sampleDataBlog = [
  {
    title: "Ejercicios Resueltos Bases de Datos: De ER a Tablas",
    description:
      "Resolución de ejercicios de modelado de bases de datos, transformando diagramas ER en tablas SQL.",
    date: "2026-01-30",
    estimatedReadTime: "65 min",
    tags: ["Bases de Datos", "Modelado de Datos", "SQL", "ER a Tablas"],
    link: "/bbdd-ejercicios-ER-a-tablas",
  },
  {
    title: "Bases de Datos: Teoría de Laboratorio",
    description:
      "Conceptos teóricos fundamentales para el laboratorio de bases de datos, incluyendo comandos SQL y gestión de tablas.",
    date: "2026-01-30",
    estimatedReadTime: "190 min",
    tags: ["Bases de Datos", "SQL", "Comandos SQL", "Gestión de Tablas"],
    link: "/bbdd-teoria-laboratorio",
  },
  {
    title: "Bases de Datos - Tema 1",
    description:
      "Conceptos fundamentales de bases de datos, incluyendo modelos de datos, lenguajes DDL y DML, arquitectura de bases de datos y roles de usuarios.",
    date: "2026-01-30",
    estimatedReadTime: "30 min",
    tags: ["Bases de Datos", "SQL", "Comandos SQL", "Gestión de Tablas"],
    link: "/bbdd-teoria-tema-1",
  },
  {
    title: "Bases de Datos - Tema 2",
    description:
      "Estructura de bases de datos relacionales, tablas, claves primarias y foráneas en el modelo relacional.",
    date: "2026-01-30",
    estimatedReadTime: "85 min",
    tags: ["Bases de Datos", "SQL", "Comandos SQL", "Gestión de Tablas"],
    link: "/bbdd-teoria-tema-2",
  },
  {
    title: "Ejercicios Resueltos Arquitectura de Computadores - Parte I",
    description:
      "Resolución de ejercicios propuestos sobre representación de números en diferentes formatos y operaciones binarias.",
    date: "2026-01-30",
    estimatedReadTime: "150 min",
    tags: [
      "Arquitectura de Computadores",
      "Representación de Números",
      "Operaciones Binarias",
    ],
    link: "/ejercicios-ac-1",
  },
  {
    title: "Ejercicios Resueltos Arquitectura de Computadores - Parte II",
    description:
      "Resolución de ejercicios propuestos sobre representación de números en diferentes formatos y operaciones binarias.",
    date: "2026-01-30",
    estimatedReadTime: "110 min",
    tags: [
      "Arquitectura de Computadores",
      "Representación de Números",
      "Operaciones Binarias",
    ],
    link: "/ejercicios-ac-2",
  },
  {
    title: "Ejercicios Resueltos Probabilidad y Estadística - Parte I",
    description:
      "Resolución de ejercicios propuestos sobre variables aleatorias y funciones de distribución.",
    date: "2026-01-29",
    estimatedReadTime: "140 min",
    tags: [
      "Probabilidad y Estadística",
      "Variables Aleatorias",
      "Funciones de Distribución",
    ],
    link: "/pye-ejercicios-1",
  },
  {
    title: "Ejercicios Resueltos Probabilidad y Estadística - Parte II",
    description:
      "Resolución de ejercicios propuestos sobre variables aleatorias y funciones de distribución.",
    date: "2026-01-29",
    estimatedReadTime: "115 min",
    tags: [
      "Probabilidad y Estadística",
      "Variables Aleatorias",
      "Funciones de Distribución",
    ],
    link: "/pye-ejercicios-2",
  },
  {
    title: "Ejercicios Resueltos Probabilidad y Estadística - Parte III",
    description:
      "Resolución de ejercicios propuestos sobre variables aleatorias y funciones de distribución.",
    date: "2026-01-29",
    estimatedReadTime: "135 min",
    tags: [
      "Probabilidad y Estadística",
      "Variables Aleatorias",
      "Funciones de Distribución",
    ],
    link: "/pye-ejercicios-3",
  },
  {
    title: "Ejercicios Resueltos Probabilidad y Estadística - Parte IV",
    description:
      "Resolución de ejercicios propuestos sobre variables aleatorias y funciones de distribución.",
    date: "2026-01-29",
    estimatedReadTime: "105 min",
    tags: [
      "Probabilidad y Estadística",
      "Variables Aleatorias",
      "Funciones de Distribución",
    ],
    link: "/pye-ejercicios-4",
  },
  {
    title: "Ejercicios Resueltos Probabilidad y Estadística - Parte V",
    description:
      "Resolución de ejercicios propuestos sobre variables aleatorias y funciones de distribución.",
    date: "2026-01-29",
    estimatedReadTime: "80 min",
    tags: [
      "Probabilidad y Estadística",
      "Variables Aleatorias",
      "Funciones de Distribución",
    ],
    link: "/pye-ejercicios-5",
  },
  {
    title: "Ejercicios Resueltos Probabilidad y Estadística - Parte VI",
    description:
      "Resolución de ejercicios propuestos sobre variables aleatorias y funciones de distribución.",
    date: "2026-01-29",
    estimatedReadTime: "95 min",
    tags: [
      "Probabilidad y Estadística",
      "Variables Aleatorias",
      "Funciones de Distribución",
    ],
    link: "/pye-ejercicios-6",
  },
  {
    title: "Ejercicios Resueltos Probabilidad y Estadística - Parte VII",
    description:
      "Resolución de ejercicios propuestos sobre variables aleatorias y funciones de distribución.",
    date: "2026-01-29",
    estimatedReadTime: "180 min",
    tags: [
      "Probabilidad y Estadística",
      "Variables Aleatorias",
      "Funciones de Distribución",
    ],
    link: "/pye-ejercicios-7",
  },
  {
    title: "Ejercicios Resueltos Análisis III - Parte 1",
    description:
      "Ejercicios resueltos de la asignatura Análisis III de la Universidad de Oviedo",
    date: "2026-01-12",
    estimatedReadTime: "150 min",
    tags: [
      "Análisis III",
      "Ejercicios Resueltos",
      "Matemáticas",
      "Teoría de la Medida",
      "Lebesgue",
    ],
    link: "/analisis3-ejercicios-1",
  },
  {
    title: "Ejercicios Resueltos Análisis III - Parte 2",
    description:
      "Ejercicios resueltos de la asignatura Análisis III de la Universidad de Oviedo.",
    date: "2026-01-12",
    estimatedReadTime: "140 min",
    tags: [
      "Análisis III",
      "Ejercicios Resueltos",
      "Matemáticas",
      "Teoría de la Medida",
      "Lebesgue",
    ],
    link: "/analisis3-ejercicios-2",
  },
  {
    title: "Ejercicios Resueltos Análisis III - Parte 3",
    description:
      "Ejercicios resueltos de la asignatura Análisis III de la Universidad de Oviedo.",
    date: "2026-01-12",
    estimatedReadTime: "130 min",
    tags: [
      "Análisis III",
      "Ejercicios Resueltos",
      "Matemáticas",
      "Teoría de la Medida",
      "Lebesgue",
    ],
    link: "/analisis3-ejercicios-3",
  },
  {
    title: "Inferencia - Tema 0",
    description:
      "Conceptos básicos de probabilidad y estadística necesarios para el estudio de la inferencia estadística.",
    date: "2026-01-12",
    estimatedReadTime: "45 min",
    tags: ["inferencia estadística", "Probabilidad", "Estadística"],
    link: "/inferencia-tema-0",
  },
  {
    title: "Inferencia - Tema 1",
    description:
      "Estadígrafos de orden y sus propiedades en inferencia estadística. Definiciones y teoremas clave para el análisis de muestras ordenadas.",
    date: "2026-01-12",
    estimatedReadTime: "100 min",
    tags: [
      "inferencia estadística",
      "Estadígrafos de orden",
      "Muestras ordenadas",
    ],
    link: "/inferencia-tema-1",
  },
  {
    title: "Inferencia - Tema 2",
    description:
      "Suficiencia de un estadígrafo, Familia exponencial k-paramétrica, Estimación puntual y Método de los momentos",
    date: "2026-01-12",
    estimatedReadTime: "125 min",
    tags: ["Inferencia estadística", "Estadística", "Matemáticas"],
    link: "/inferencia-tema-2",
  },
  {
    title: "Apuntes MOR - Tema 1",
    description:
      "Apuntes sobre Introducción a la Teoría de Grafos para la asignatura de Modelos de Optimización de Redes.",
    date: "2026-01-12",
    estimatedReadTime: "120 min",
    tags: [
      "MOR",
      "Modelos de Optimización de Redes",
      "Teoría de Grafos",
      "Optimización",
    ],
    link: "/mor-tema-1",
  },
  {
    title: "Apuntes MOR - Tema 2",
    description:
      "Apuntes sobre árboles y arborescencias en Modelos de Optimización de Redes. Definiciones, teoremas y algoritmos clave.",
    date: "2026-01-12",
    estimatedReadTime: "80 min",
    tags: [
      "MOR",
      "Modelos de Optimización de Redes",
      "Teoría de Grafos",
      "Optimización",
    ],
    link: "/mor-tema-2",
  },
  {
    title: "Apuntes MOR - Tema 3",
    description:
      "Apuntes sobre caminos de menor valor en Modelos de Optimización de Redes. Definiciones, teoremas y algoritmos clave.",
    date: "2026-01-12",
    estimatedReadTime: "90 min",
    tags: [
      "MOR",
      "Modelos de Optimización de Redes",
      "Teoría de Grafos",
      "Optimización",
    ],
    link: "/mor-tema-3",
  },
  {
    title: "Análisis 3 - Tema 1",
    description:
      "Conceptos básicos sobre conjuntos, cardinalidad y conjuntos numerables. Introducción a la teoría de conjuntos.",
    date: "2026-01-11",
    estimatedReadTime: "90 min",
    tags: ["Matemáticas", "Análisis", "Cardinalidad", "Conjuntos Numerables"],
    link: "/analisis-3-tema-1",
  },
  {
    title: "Análisis 3 - Tema 2",
    description:
      "Introducción a los espacios de medida y sus propiedades fundamentales. Análisis de las σ-álgebras y medidas asociadas.",
    date: "2026-01-12",
    estimatedReadTime: "75 min",
    tags: ["Análisis III", "Medida", "Espacios de medida"],
    link: "/analisis-3-tema-2",
  },
  {
    title: "Análisis 3 - Tema 3",
    description:
      "Espacio de medida de Lebesgue en R^N. Conjuntos medibles de Lebesgue. Medida de Lebesgue y sus propiedades.",
    date: "2026-01-12",
    estimatedReadTime: "85 min",
    tags: ["Análisis III", "Matemáticas", "Medida de Lebesgue"],
    link: "/analisis-3-tema-3",
  },
  {
    title: "Análisis 3 - Tema 4",
    description:
      "Medibilidad de funciones. Operaciones con funciones medibles. Composición de funciones medibles y continuas.",
    date: "2026-01-12",
    estimatedReadTime: "70 min",
    tags: ["Análisis III", "Funciones Medibles", "Teoría de la Medida"],
    link: "/analisis-3-tema-4",
  },
  {
    title: "Análisis 3 - Tema 5",
    description:
      "Integral de Lebesgue para funciones simples y no negativas, propiedades fundamentales. Espacio de funciones integrables y sumables.",
    date: "2026-01-12",
    estimatedReadTime: "180 min",
    tags: [
      "Análisis III",
      "Integral de Lebesgue",
      "Funciones simples",
      "Funciones no negativas",
      "Espacio L1",
    ],
    link: "/analisis-3-tema-5",
  },
  {
    title: "Análisis 3 - Tema 6",
    description:
      "Espacios Lp, normas y desigualdades fundamentales asociadas a dichos espacios. Espacios vectoriales seminormados.",
    date: "2026-01-12",
    estimatedReadTime: "95 min",
    tags: [
      "Análisis III",
      "Análisis Matemático",
      "Espacios Lp",
      "Normas",
      "Desigualdades de Hölder y Minkowski",
      "Espacios vectoriales seminormados",
    ],
    link: "/analisis-3-tema-6",
  },
  {
    title: "Análisis 3 - Tema 7",
    description:
      "Series de Fourier y sistemas ortonormales en espacios de Hilbert. Teorema de Óptima Aproximación, Identidad de Parseval y Teorema de Riesz-Fischer.",
    date: "2026-01-12",
    estimatedReadTime: "110 min",
    tags: [
      "Análisis III",
      "Series de Fourier",
      "Espacios de Hilbert",
      "Sistemas Ortonormales",
    ],
    link: "/analisis-3-tema-7",
  },
  {
    title: "Apuntes TPP - Tema 1",
    description:
      "Principales conceptos sobre lenguajes y paradigmas de programación, incluyendo definiciones, clasificaciones y características destacadas",
    date: "2026-01-10",
    estimatedReadTime: "35 min",
    tags: ["TPP", "Programación", "Lenguajes de Programación", "Paradigmas"],
    link: "/tpp-tema-1",
  },
  {
    title: "Apuntes MOR - Tema 4",
    description:
      "Apuntes sobre Introducción a la Teoría de Grafos para la asignatura de Modelos de Optimización de Redes",
    date: "2025-12-20",
    estimatedReadTime: "120 min",
    tags: ["MOR", "Grafos", "Optimización", "Redes"],
    link: "/mor-tema-4",
  },
  {
    title: "Modelos para Vectores Aleatorios",
    description:
      "Apuntes sobre modelos para vectores aleatorios discretos y continuos. Distribución multinomial y distribución normal multivariante.",
    date: "2025-09-22",
    estimatedReadTime: "35 min",
    tags: ["Matemáticas", "Geometría", "Teoremas"],
    link: "/modelos-vectores-aleatorios",
  },
  {
    title: "Distribución Normal y Binomial: Relación y Aproximaciones",
    description:
      "Explicación detallada de las distribuciones binomial y normal, sus propiedades y su conexión a través del Teorema Central del Límite.",
    date: "2025-09-19",
    estimatedReadTime: "20 min",
    tags: [
      "Probabilidad",
      "Estadística",
      "Distribución normal",
      "Distribución binomial",
    ],
    link: "/normal-binomial",
  },
  {
    title: "Concepto de Métrica en Matemáticas",
    description:
      "Explicación detallada del concepto de métrica, propiedades y ejemplos en espacios métricos.",
    date: "2025-09-19",
    estimatedReadTime: "15 min",
    tags: ["Topología", "Métrica", "Espacios métricos", "Análisis"],
    link: "/que-es-metrica",
  },
  {
    title: "¿Por qué estudiar Matemáticas transforma tu forma de pensar?",
    description:
      "Reflexión sobre los beneficios intelectuales de estudiar matemáticas y cómo moldea una forma de pensar lógica, rigurosa y creativa.",
    date: "2025-09-19",
    estimatedReadTime: "12 min",
    tags: ["Matemáticas", "Educación", "Pensamiento crítico", "Lógica"],
    link: "/por-que-estudiar",
  },
  {
    title: "Resolución Examen Análisis 2025",
    description:
      "Resolución del examen de análisis de 2025 con explicaciones detalladas.",
    date: "2025-09-01",
    estimatedReadTime: "5 min",
    tags: ["Análisis", "Exámenes", "Cálculo", "Integrales"],
    link: "/resolucion-examen-analisis-2025",
  },
  {
    title: "Teorema de Pitágoras",
    description: "Explicación y demostración del Teorema de Pitágoras.",
    date: "2023-10-01",
    estimatedReadTime: "8 min",
    tags: ["Matemáticas", "Geometría", "Teoremas"],
    link: "/teorema-pitagoras",
  },
  {
    title: "Teorema de Darboux",
    description:
      "Explicación y demostración del Teorema de Darboux sobre la propiedad del valor intermedio de las derivadas.",
    date: "2023-10-01",
    estimatedReadTime: "10 min",
    tags: ["Matemáticas", "Geometría", "Teoremas"],
    link: "/teorema-darboux",
  },
];

function WelcomePage() {
  const toast = useToast();
  const { subjectId, subjectUnitId } = useFilter();
  const { searchQuery } = useSearch();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const authedPdfsQuery = usePdfs(!authLoading && isAuthenticated);
  const publicPdfsQuery = usePublicPdfsNoLink(!authLoading && !isAuthenticated);

  const { data: subjects } = useSubjects();
  const { data: subjectUnits } = useSubjectUnits(subjectId);

  const activePdfsQuery = isAuthenticated ? authedPdfsQuery : publicPdfsQuery;
  const isLoading = authLoading || activePdfsQuery.isLoading;

  useEffect(() => {
    if (activePdfsQuery.error) {
      toast.error("Error al cargar los PDFs.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePdfsQuery.error]);

  const allPDFs: DisplayPdf[] = useMemo(() => {
    const raw = activePdfsQuery.data ?? [];
    return raw.map((pdf, index) => ({
      id: pdf.id ?? index,
      title: pdf.name ?? "",
      url: (pdf as { link?: string }).link,
      lastTimeEdited: pdf.lastTimeEdited ?? "",
      subjectId: pdf.subject?.id,
      subjectUnitId: pdf.subjectUnit?.id,
      subjectName: pdf.subject?.name,
      subjectUnitName: pdf.subjectUnit?.name,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePdfsQuery.data]);

  const activeSubjectName = subjects?.find((s) => s.id === subjectId)?.name;
  const activeSubjectUnitName = subjectUnits?.find((u) => u.id === subjectUnitId)?.name;

  const { displayedPDFs, pageTitle } = useMemo(() => {
    if (searchQuery.trim() !== "") {
      const normalizedSearch = normalizeText(searchQuery);
      const filteredPDFs = allPDFs.filter((pdf) =>
        normalizeText(pdf.title).includes(normalizedSearch),
      );
      return {
        displayedPDFs: filteredPDFs,
        pageTitle: `Resultados para: "${searchQuery}" (${filteredPDFs.length} encontrados)`,
      };
    }

    if (subjectId != null) {
      const filteredPDFs = allPDFs.filter((pdf) => {
        if (pdf.subjectId !== subjectId) return false;
        if (subjectUnitId != null) return pdf.subjectUnitId === subjectUnitId;
        return true;
      });

      return {
        displayedPDFs: filteredPDFs,
        pageTitle: activeSubjectUnitName
          ? `${activeSubjectName ?? "Asignatura"}: ${activeSubjectUnitName}`
          : (activeSubjectName ?? "Asignatura"),
      };
    }

    const bestPDFs = [...allPDFs]
      .sort(
        (a, b) =>
          new Date(b.lastTimeEdited).getTime() - new Date(a.lastTimeEdited).getTime(),
      )
      .slice(0, 8);

    return { displayedPDFs: bestPDFs, pageTitle: "Últimos apuntes" };
  }, [allPDFs, searchQuery, subjectId, subjectUnitId, activeSubjectName, activeSubjectUnitName]);

  return (
    <>
      <div className="p-8 max-w-325 mx-auto">
        {/* <div className="bg-muted/50 rounded-xl w-full h-32" /> */}
        {/* <div className="bg-muted/50 rounded-xl w-full h-32 mt-12" /> */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{pageTitle}</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {isLoading
              ? // Muestra indicadores de carga si los datos se están cargando
                Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse bg-muted rounded-lg h-40"
                  ></div>
                ))
              : // Muestra los PDFs una vez cargados
                displayedPDFs.map((pdf) => (
                  <PDFCard
                    key={pdf.id}
                    title={pdf.title}
                    url={pdf.url}
                    date={formatDate(pdf.lastTimeEdited)}
                    subjectName={pdf.subjectName}
                    subjectUnitName={pdf.subjectUnitName}
                  />
                ))}
          </div>
          {!isLoading && displayedPDFs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No se encontraron apuntes para esta categoría
              </p>
            </div>
          )}
        </section>
        <section className="mb-12">
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
  );
}
export default WelcomePage;

