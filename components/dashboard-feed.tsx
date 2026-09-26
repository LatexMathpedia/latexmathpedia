"use client";

import { useEffect, useMemo, useState } from "react";
import ContentCard from "@/components/content-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearch } from "@/contexts/search-context"; // Importar el contexto de búsqueda
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { usePdfs, usePublicPdfsNoLink } from "@/hooks/api/use-pdfs";
import { usePublicQuizzes } from "@/hooks/api/use-quizzes";
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
  const { searchQuery } = useSearch();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const authedPdfsQuery = usePdfs(!authLoading && isAuthenticated);
  const publicPdfsQuery = usePublicPdfsNoLink(!authLoading && !isAuthenticated);
  const activePdfsQuery = isAuthenticated ? authedPdfsQuery : publicPdfsQuery;
  const pdfsLoading = authLoading || activePdfsQuery.isLoading;

  // Mismo endpoint público que usa el catálogo de /dashboard/quizzes, sin depender de auth.
  const quizzesQuery = usePublicQuizzes();

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

  const normalizedSearch = normalizeText(searchQuery.trim());
  const isSearching = normalizedSearch !== "";

  // El filtro por asignatura/tema del feed general se retiró: la sidebar (nav-subjects.tsx)
  // ahora navega directamente a la ficha de asignatura (/dashboard/subjects/[id]), que ya
  // agrupa PDFs y cuestionarios por tema — no hace falta mantener dos formas de ver lo
  // mismo. Aquí solo queda la búsqueda como filtro.
  const pdfsToShow = useMemo(() => {
    if (!isSearching) return allPdfs;
    return allPdfs.filter((pdf) => normalizeText(pdf.title).includes(normalizedSearch));
  }, [allPdfs, isSearching, normalizedSearch]);

  const quizzesToShow = useMemo(() => {
    if (!isSearching) return allQuizzes;
    return allQuizzes.filter((quiz) => normalizeText(quiz.name ?? "").includes(normalizedSearch));
  }, [allQuizzes, isSearching, normalizedSearch]);

  const blogTabToShow = useMemo(() => {
    if (!isSearching) return posts;
    return posts.filter((post) => normalizeText(post.title).includes(normalizedSearch));
  }, [posts, isSearching, normalizedSearch]);

  const allItems: ContentItem[] = useMemo(() => {
    const items: ContentItem[] = [
      ...pdfsToShow.map((data) => ({ kind: "pdf" as const, data })),
      ...quizzesToShow.map((data) => ({ kind: "quiz" as const, data })),
      ...blogTabToShow.map((data) => ({ kind: "blog" as const, data })),
    ];
    return items.sort(
      (a, b) => new Date(itemDate(b)).getTime() - new Date(itemDate(a)).getTime(),
    );
  }, [pdfsToShow, quizzesToShow, blogTabToShow]);

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
    return TAB_LABEL[activeTab];
  }, [isSearching, searchQuery, activeTab, countByTab]);

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
