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
import type { BlogPostMeta } from "@/lib/content/posts";

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

export function DashboardFeed({ posts }: { posts: BlogPostMeta[] }) {
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
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                title={post.title}
                description={post.description}
                date={post.date}
                estimatedReadTime={post.estimatedReadTime}
                tags={post.tags}
                link={post.slug}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default DashboardFeed;
