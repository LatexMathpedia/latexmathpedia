import PDFCard from "@/components/pdf-card";
import BlogCard from "@/components/blog-card";
import { QuizCard } from "@/components/quiz-card";
import { CONTENT_TYPES } from "@/lib/content/registry";
import type { ContentItem } from "@/lib/content/types";

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

// Insignia de tipo (icono + texto corto) compartida por los 3 tipos de tarjeta, para que
// el grid "Todo" se pueda escanear aunque mezcle PDFs/Cuestionarios/Blog. Se superpone en
// la esquina superior en vez de tocar el layout interno de cada tarjeta (ver
// UI-RESTRUCTURE.md §2/§5.2: el registro centraliza esto para no repetirlo por tipo).
function TypeBadge({ kind }: { kind: ContentItem["kind"] }) {
  const meta = CONTENT_TYPES[kind];
  const Icon = meta.icon;
  return (
    <div
      className={`absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium shadow-sm ${meta.accentClass}`}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </div>
  );
}

export function ContentCard({ item }: { item: ContentItem }) {
  return (
    <div className="relative h-full">
      <TypeBadge kind={item.kind} />
      {item.kind === "pdf" && (
        <PDFCard
          title={item.data.title}
          url={item.data.url}
          date={formatDate(item.data.lastTimeEdited)}
          subjectName={item.data.subjectName}
          subjectUnitName={item.data.subjectUnitName}
        />
      )}
      {item.kind === "quiz" && <QuizCard quiz={item.data} />}
      {item.kind === "blog" && (
        <BlogCard
          title={item.data.title}
          description={item.data.description}
          date={item.data.date}
          estimatedReadTime={item.data.estimatedReadTime}
          tags={item.data.tags}
          link={item.data.slug}
        />
      )}
    </div>
  );
}

export default ContentCard;
