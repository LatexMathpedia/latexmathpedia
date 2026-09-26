"use client";

import { useEffect, useMemo, useState } from "react";
import ContentCard from "@/components/content-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilter } from "@/contexts/filter-context";
import { useSearch } from "@/contexts/search-context"; // Importar el contexto de búsqueda
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { usePdfs, usePublicPdfsNoLink } from "@/hooks/api/use-pdfs";
import { usePublicQuizzes } from "@/hooks/api/use-quizzes";
import { useSubjects, useSubjectUnits } from "@/hooks/api/use-subjects";
import type { BlogPostMeta } from "@/lib/content/posts";
import type { ContentItem, DisplayPdf } from "@/lib/content/types";
import type { QuizDto } from "@/lib/api/quizzes";

// Función para normalizar texto (eliminar tildes y acentos)
function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

type TabKey = "all" | "pdf" | "quiz" | "blog";

const TAB_LABEL: Record<TabKey, string> = {
  all: "Todo",
  pdf: "PDFs",
  quiz: "Cuestionarios",
  blog: "Blog",
};

function itemDate(item: ContentItem): string {
  return item.kind === "blog" ? item.data.date : (item.data.lastTimeEdited ?? "");
}

function ContentGrid({
  items,
  isLoading,
  emptyMessage,
}: {
  items: ContentItem[];
  isLoading: boolean;
  emptyMessage: string;
}) {
  return (
    <>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-muted rounded-lg h-40"></div>
            ))
          : items.map((item) => (
              <ContentCard
                key={`${item.kind}-${item.kind === "blog" ? item.data.slug : item.data.id}`}
                item={item}
              />
            ))}
      </div>
      {!isLoading && items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </>
  );
}

export function DashboardFeed({ posts }: { posts: BlogPostMeta[] }) {
  const toast = useToast();
  const { subjectId, subjectUnitId } = useFilter();
  const { searchQuery } = useSearch();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const authedPdfsQuery = usePdfs(!authLoading && isAuthenticated);
  const publicPdfsQuery = usePublicPdfsNoLink(!authLoading && !isAuthenticated);
  const activePdfsQuery = isAuthenticated ? authedPdfsQuery : publicPdfsQuery;
  const pdfsLoading = authLoading || activePdfsQuery.isLoading;

  // Mismo endpoint público que usa el catálogo de /dashboard/quizzes, sin depender de auth.
  const quizzesQuery = usePublicQuizzes();

  const { data: subjects } = useSubjects();
  const { data: subjectUnits } = useSubjectUnits(subjectId);

  useEffect(() => {
    if (activePdfsQuery.error) {
      toast.error("Error al cargar los PDFs.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePdfsQuery.error]);

  useEffect(() => {
    if (quizzesQuery.error) {
      toast.error("Error al cargar los cuestionarios.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizzesQuery.error]);

  const allPdfs: DisplayPdf[] = useMemo(() => {
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

  const allQuizzes: QuizDto[] = quizzesQuery.data ?? [];

  const activeSubjectName = subjects?.find((s) => s.id === subjectId)?.name;
  const activeSubjectUnitName = subjectUnits?.find((u) => u.id === subjectUnitId)?.name;

  function matchesSubjectFilter(itemSubjectId?: number, itemSubjectUnitId?: number): boolean {
    if (subjectId == null) return true;
    if (itemSubjectId !== subjectId) return false;
    if (subjectUnitId != null) return itemSubjectUnitId === subjectUnitId;
    return true;
  }

  const normalizedSearch = normalizeText(searchQuery.trim());
  const isSearching = normalizedSearch !== "";

  // Igual que hacía el buscador original sobre PDFs: buscar y filtrar por asignatura son
  // mutuamente excluyentes (buscar es una intención distinta de navegar por asignatura),
  // así que al escribir en el buscador se consulta sobre el universo completo del tipo.
  const pdfsToShow = useMemo(() => {
    if (isSearching) {
      return allPdfs.filter((pdf) => normalizeText(pdf.title).includes(normalizedSearch));
    }
    return allPdfs.filter((pdf) => matchesSubjectFilter(pdf.subjectId, pdf.subjectUnitId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPdfs, isSearching, normalizedSearch, subjectId, subjectUnitId]);

  const quizzesToShow = useMemo(() => {
    if (isSearching) {
      return allQuizzes.filter((quiz) => normalizeText(quiz.name ?? "").includes(normalizedSearch));
    }
    return allQuizzes.filter((quiz) => matchesSubjectFilter(quiz.subject?.id, quiz.subjectUnit?.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allQuizzes, isSearching, normalizedSearch, subjectId, subjectUnitId]);

  // La pestaña "Blog" propia siempre muestra todos los posts (solo la búsqueda los filtra):
  // los posts de content/posts no tienen relación con Subject/SubjectUnit hoy (decisión de
  // producto pendiente, ver UI-RESTRUCTURE.md §10), así que el filtro de asignatura de la
  // sidebar no les aplica.
  const blogTabToShow = useMemo(() => {
    if (isSearching) {
      return posts.filter((post) => normalizeText(post.title).includes(normalizedSearch));
    }
    return posts;
  }, [posts, isSearching, normalizedSearch]);

  // Dentro de "Todo", si hay un filtro de asignatura/tema activo (y no se está buscando),
  // el blog simplemente no se intercala -- no hay forma de saber si un post pertenece a esa
  // asignatura. Al buscar, el blog sí participa igual que los otros dos tipos.
  const blogForAll = isSearching ? blogTabToShow : subjectId == null ? posts : [];

  const allItems: ContentItem[] = useMemo(() => {
    const items: ContentItem[] = [
      ...pdfsToShow.map((data) => ({ kind: "pdf" as const, data })),
      ...quizzesToShow.map((data) => ({ kind: "quiz" as const, data })),
      ...blogForAll.map((data) => ({ kind: "blog" as const, data })),
    ];
    return items.sort(
      (a, b) => new Date(itemDate(b)).getTime() - new Date(itemDate(a)).getTime(),
    );
  }, [pdfsToShow, quizzesToShow, blogForAll]);

  const pdfItems: ContentItem[] = useMemo(
    () => pdfsToShow.map((data) => ({ kind: "pdf" as const, data })),
    [pdfsToShow],
  );
  const quizItems: ContentItem[] = useMemo(
    () => quizzesToShow.map((data) => ({ kind: "quiz" as const, data })),
    [quizzesToShow],
  );
  const blogItems: ContentItem[] = useMemo(
    () => blogTabToShow.map((data) => ({ kind: "blog" as const, data })),
    [blogTabToShow],
  );

  const countByTab: Record<TabKey, number> = {
    all: allItems.length,
    pdf: pdfItems.length,
    quiz: quizItems.length,
    blog: blogItems.length,
  };

  const pageTitle = useMemo(() => {
    if (isSearching) {
      return `Resultados para: "${searchQuery}" (${countByTab[activeTab]} encontrados)`;
    }

    const base = TAB_LABEL[activeTab];
    if (subjectId != null && activeTab !== "blog") {
      const subjectPart = activeSubjectName ?? "Asignatura";
      return activeSubjectUnitName
        ? `${base} · ${subjectPart}: ${activeSubjectUnitName}`
        : `${base} · ${subjectPart}`;
    }
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching, searchQuery, activeTab, countByTab, subjectId, activeSubjectName, activeSubjectUnitName]);

  const loadingByTab: Record<TabKey, boolean> = {
    all: pdfsLoading || quizzesQuery.isLoading,
    pdf: pdfsLoading,
    quiz: quizzesQuery.isLoading,
    blog: false,
  };

  return (
    <div className="p-8 max-w-325 mx-auto">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabKey)}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h2 className="text-2xl font-bold">{pageTitle}</h2>
          <TabsList>
            <TabsTrigger value="all">Todo</TabsTrigger>
            <TabsTrigger value="pdf">PDFs</TabsTrigger>
            <TabsTrigger value="quiz">Cuestionarios</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <ContentGrid
            items={allItems}
            isLoading={loadingByTab.all}
            emptyMessage="No se encontraron resultados para esta categoría"
          />
        </TabsContent>
        <TabsContent value="pdf">
          <ContentGrid
            items={pdfItems}
            isLoading={loadingByTab.pdf}
            emptyMessage="No se encontraron apuntes para esta categoría"
          />
        </TabsContent>
        <TabsContent value="quiz">
          <ContentGrid
            items={quizItems}
            isLoading={loadingByTab.quiz}
            emptyMessage="No se encontraron cuestionarios para esta categoría"
          />
        </TabsContent>
        <TabsContent value="blog">
          <ContentGrid
            items={blogItems}
            isLoading={loadingByTab.blog}
            emptyMessage="No se encontraron artículos"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DashboardFeed;
