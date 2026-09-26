import type { QuizDto } from "@/lib/api/quizzes";
import type { BlogPostMeta } from "@/lib/content/posts";

// Shape normalizado que usa el feed, independientemente de si el PDF viene con o sin
// `link` (según el usuario esté autenticado o no). Vive aquí (no en dashboard-feed.tsx)
// para que registry.ts y content-card.tsx también puedan importarlo.
export type DisplayPdf = {
  id: number;
  title: string;
  url?: string;
  lastTimeEdited: string;
  subjectId?: number;
  subjectUnitId?: number;
  subjectName?: string;
  subjectUnitName?: string;
};

// Unión discriminada que homogeneiza los tres tipos de recurso que hoy mezcla el feed
// (ver UI-RESTRUCTURE.md §2). Añadir un cuarto tipo implica extender esta unión + el
// registro en registry.ts + un componente de tarjeta, sin tocar el feed en sí.
export type ContentItem =
  | { kind: "pdf"; data: DisplayPdf }
  | { kind: "quiz"; data: QuizDto }
  | { kind: "blog"; data: BlogPostMeta };
