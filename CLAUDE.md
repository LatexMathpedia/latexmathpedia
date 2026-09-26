# CLAUDE.md — Mathtexpedia Frontend

Guía para agentes/IA que trabajen en este repo. Contexto que **no** se deduce del código.

## Qué es
Frontend de Mathtexpedia (repositorio de apuntes universitarios de la UniOvi: PDFs + blog MDX + chatbot, y próximamente cuestionarios). Next.js App Router.

## Stack
- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript** (strict).
- **Tailwind v4** + **shadcn/ui** (estilo `new-york`, baseColor `zinc`) en `components/ui/`.
- `next-themes`, `react-hot-toast`, `lucide-react` / `react-icons`.
- Blog en **MDX** (`content/posts/*.mdx`) vía `next-mdx-remote`, con `remark-math` + `rehype-katex` (KaTeX) y `remark-gfm`. Componentes MDX propios en `components/mdx/`.
- Alias de imports: `@/*` → raíz del repo.
- `NEXT_PUBLIC_API_URL` = base del backend (dev: `http://localhost:8081`).

## Comandos
- `npm run dev` (Turbopack) · `npm run build` · `npm run lint`.

## Estado de la migración (IMPORTANTE)
El backend se ha **reescrito por completo**. El frontend actual habla con la **API antigua** y hay que migrarlo. Antes de tocar nada relacionado con datos/auth, lee **`MIGRATION.md`** en la raíz: contiene el análisis y la lista de tareas ordenada por fases.

Puntos clave a tener presente:
- Contrato nuevo documentado en `api-docs.json` (OpenAPI 3.1, servidor `http://localhost:8081`).
- Los DTOs nuevos son **camelCase y planos** (`PDFDto`, `SubjectDto`, `QuizDto`…). El código actual usa el shape viejo (`pdf_id`, `pdf_link`, `pdf_tag`…) — está **obsoleto**.
- Auth pasará a **Keycloak** (hoy es cookie + endpoints custom + Firebase para Google). No añadas más lógica sobre el auth-context actual; se sustituye.
- La categorización por **tags** (`AC`, `AG`, …, en `lib/utils.ts` y duplicada en varios sitios) se sustituye por las entidades **Subject / SubjectUnit** del backend.
- Los PDFs pasarán a servirse **embebidos desde S3**, no por URL directa.

## Convenciones al implementar la migración
- **Nada de `fetch` suelto en componentes.** Toda llamada a la API va por la capa `lib/api/` y se consume con hooks de **TanStack Query** (ver `MIGRATION.md`).
- Tipos de la API: **generados desde `api-docs.json`**, no escritos a mano.
- Formularios nuevos: `react-hook-form` + `zod`.
- No reintroducir los hooks "power-user" (ver más abajo).

## ⚠️ Código a eliminar, no mantener
`hooks/use-load-simulator.ts` + `workers/load.worker.ts`, `hooks/use-indexeddb-load.ts`, `hooks/use-auto-refresh.ts`, `hooks/use-random-scroll.ts`, `hooks/use-random-mouse-movements.ts`, `hooks/use-power-user-features.ts`, `components/power-user-provider.tsx`, `config/loadSimulator.config.ts` y `hooks/use-user-profile.ts` (lista de emails).
Estos hooks degradan a propósito el navegador de usuarios concretos (quema de CPU, recargas, basura en IndexedDB) y se activan por email hardcodeado. No aportan valor de producto y deben retirarse en la migración.

## Ficheros de referencia
- `api-docs.json` — contrato del backend nuevo (fuente de verdad).
- `MIGRATION.md` — plan de migración de datos/auth por fases + tareas.
- `UI-RESTRUCTURE.md` — rediseño de la arquitectura de información y las vistas (feed
  mixto PDF/Quiz/Blog, asignaturas, panel de admin). Léelo antes de tocar navegación,
  rutas o layouts nuevos.
- `API-REQUESTS.md` — mejoras/endpoints a pedir al backend, detectadas al diseñar la UI.
- `docs/endpoints.md` — endpoints de la API **antigua** (histórico; no usar como referencia nueva).
