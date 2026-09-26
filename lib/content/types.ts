import type { QuizDto } from "@/lib/api/quizzes";
import type { components } from "@/lib/api/schema";
import type { BlogPostMeta } from "@/lib/content/posts";

// Shape normalizado de un PDF para la UI. El contenido nunca viene en el DTO: se abre en el
// visor (/dashboard/pdfs/[id]), que lo pide autenticado. Vive aquí (no en dashboard-feed.tsx)
// para que registry.ts y content-card.tsx también puedan importarlo.
export type DisplayPdf = {
  id: number;
  title: string;
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

// Normaliza un PDFDto crudo (GET /public/pdf/no-link o GET /subject/{id}/pdfs) al shape que
// usa la UI.
export function toDisplayPdf(pdf: components["schemas"]["PDFDto"], fallbackId: number): DisplayPdf {
  return {
    id: pdf.id ?? fallbackId,
    title: pdf.name ?? "",
    lastTimeEdited: pdf.lastTimeEdited ?? "",
    subjectId: pdf.subject?.id,
    subjectUnitId: pdf.subjectUnit?.id,
    subjectName: pdf.subject?.name,
    subjectUnitName: pdf.subjectUnit?.name,
  };
}
