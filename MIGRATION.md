# Plan de migración del frontend — Mathtexpedia

Análisis del estado actual y hoja de ruta para migrar el frontend al nuevo backend
(Keycloak, DTOs camelCase, Subjects/Units, cuestionarios, PDFs vía S3).

> **Cómo usar este documento:** cada tarea (T-XX) es autocontenida y pensada para
> ejecutarse por separado (por otro agente/desarrollador). Están ordenadas por fases;
> respeta las dependencias indicadas. La fuente de verdad del contrato es `api-docs.json`.

---

## 1. Resumen ejecutivo

El frontend es un Next.js 16 / React 19 razonablemente moderno en lo visual (shadcn/ui,
Tailwind v4), pero la **capa de datos y de autenticación está acoplada, duplicada y
desalineada con el nuevo backend**. Los problemas no son de "estilo de componentes"
sino estructurales:

1. **No hay capa de acceso a datos.** Hay `fetch()` a pelo repartido por ~12 componentes
   y páginas, cada uno con su propio manejo de errores, su propio `process.env.NEXT_PUBLIC_API_URL`
   y su propio tipo de respuesta.
2. **Los contratos ya no coinciden.** El código usa el shape antiguo (`pdf_id`, `pdf_link`,
   `pdf_tag`) y endpoints antiguos (`/pdfs`, `/auth/validate`, `/auth/is-admin`…). El backend
   nuevo usa DTOs camelCase planos y otra estructura de rutas.
3. **La taxonomía está hardcodeada** (sistema de tags `AC/AG/...`) cuando el backend ya
   modela `Subject` + `SubjectUnit` como entidades.
4. **Auth frágil y a medio camino** (cookies + status codes custom + Firebase) que además
   se va a sustituir por Keycloak.
5. **Grandes cantidades de contenido y datos dentro de componentes** (blog, textos legales).
6. **Hooks "power-user" maliciosos** que degradan el navegador de usuarios concretos.
7. **Falta toda la superficie nueva**: cuestionarios, gestión de asignaturas/temas, perfil.

La recomendación central es introducir **TanStack Query** + una **capa API tipada generada
desde el OpenAPI**, y reconstruir auth sobre **Keycloak**. Con eso, la mayoría de páginas
se simplifican mucho.

---

## 2. Mapa del estado actual

### Stack
Next.js 16 (App Router, Turbopack), React 19, TS strict, Tailwind v4, shadcn/ui,
next-themes, react-hot-toast, next-mdx-remote + KaTeX, Firebase (Google login), Vercel Analytics.

### Rutas (`app/`)
- `/` → redirect a `/dashboard`.
- `/dashboard` — home: catálogo de PDFs (fetch) + blog (**hardcoded**). 708 líneas.
- `/dashboard/blog` y `/dashboard/blog/[slug]` — blog MDX desde `content/posts`.
- `/dashboard/admin`, `/admin/pdfs`, `/admin/users` — panel admin.
- `/dashboard/profile`, `/dashboard/billing`.
- `/dashboard/contact/*` (about-us, contact-us, faq), `/dashboard/legal/*` (privacy, terms, cookies).
- `/auth/login`, `/auth/register`, `/auth/pwd-email-sent`.

### Dónde se llama hoy a la API (todo será refactorizado)
| Fichero | Llamadas actuales (API vieja) |
|---|---|
| `contexts/auth-context.tsx` | `/auth/validate`, `/auth/login`, `/auth/google-login`, `/auth/logout`, `/auth/is-admin` |
| `app/dashboard/page.tsx` | `/pdfs`, `/pdfs/no-link` |
| `app/dashboard/admin/pdfs/page.tsx` | `/pdfs`, `/pdfs/create` |
| `components/ui/PDFAccordionCard.tsx` | `/pdfs/update?pdfId=`, `/pdfs/delete?pdfName=` |
| `app/dashboard/admin/users/page.tsx` | `/auth/all-users`, `/auth/change-role` |
| `app/dashboard/profile/page.tsx` | `/auth/reset-password`, `/auth/delete-account` |
| `components/register-form.tsx` | `/auth/create` |
| `components/login-form.new.tsx` | `/auth/reset-password` |
| `app/dashboard/contact/contact-us/page.tsx` | `/mail/send` |
| `components/chat-widget.tsx` | `/chatbot/chat` |

### Contratos: viejo → nuevo (resumen)
| Concepto | Frontend actual | Backend nuevo (`api-docs.json`) |
|---|---|---|
| PDF (shape) | `{pdf_id, pdf_link, pdf_name, pdf_tag, pdf_last_time_edit, pdf_description}` | `PDFDto {id, name, link, description, lastTimeEdited, subject, subjectUnit}` |
| PDF listar (auth) | `GET /pdfs` | `GET /pdf` |
| PDF catálogo público | `GET /pdfs/no-link` | `GET /public/pdf/no-link` → `PDFNoLinkDto` |
| PDF crear/editar/borrar | `/pdfs/create`, `/pdfs/update?pdfId=`, `/pdfs/delete?pdfName=` | `POST /pdf/create`, `PUT /pdf/update/{pdfId}`, `DELETE /pdf/delete/{pdfName}` |
| Taxonomía | tag `AC/AG/...` hardcoded | `GET /subject`, `/subject/{id}/units`, `/subject/{id}/pdfs`, CRUD subjects/units |
| Login / registro | `/auth/login`, `/auth/create` | `POST /public/auth/login`, `/public/auth/create` (→ **Keycloak**) |
| Reset / cambio pwd | `/auth/reset-password` | `POST /public/auth/reset-password`, `POST /auth/change-password` |
| Usuarios (admin) | `/auth/all-users`, `/auth/change-role` | `GET /auth/all-users` → `UserDTO`; **no hay `change-role`** (revisar con backend) |
| Perfil | (no existía) | `GET/PUT /me` (`UserAccountDto`), `GET /profile` (`UserProfile {email, role, id}`) |
| Borrar cuenta | `/auth/delete-account` | `DELETE /auth/delete-account` |
| Cuestionarios | (no existe en front) | `Quiz`, `Question`, `Option`, `/quiz/{id}/attempt`, `/quiz/{id}/submit`, `/attempts`, import/export |
| Chatbot | `/chatbot/chat` | `POST /chatbot/chat` (igual, revisar shape `ChatRequest/ChatResponse`) |
| Mail | `/mail/send` | `POST /mail/send` (shape `Mail {from?, subject, body}`) |

### Duplicación detectada
- Lista de categorías/subcategorías **hardcodeada en 4 sitios**: `lib/utils.ts`
  (`renameCategory`/`renameCategoryInverted`), `app/dashboard/page.tsx` (`tagToCategory`),
  `app/dashboard/admin/pdfs/page.tsx` (`categories`), `components/ui/PDFAccordionCard.tsx`
  (`categories`), y otra vez en `components/app-sidebar.tsx` (nav). Todo esto lo reemplaza `Subject`.
- Shapes de PDF redefinidos por cada componente (`APIPDFDocument`, `PDFFetchResponse`, `PDFProps`).
- `process.env.NEXT_PUBLIC_API_URL || ''` repetido ~10 veces (uno con fallback erróneo a `:4000`).

---

## 3. Decisiones tecnológicas recomendadas

| Necesidad | Recomendación | Por qué |
|---|---|---|
| Estado de servidor (fetch/caché/loading/error) | **TanStack Query v5** | Elimina el `fetch`+`useState`+`useEffect` manual de cada página, da caché/dedupe/revalidación y updates optimistas (clave para el admin). Es el mayor salto de mantenibilidad. |
| Tipos + cliente HTTP | **`openapi-typescript` + `openapi-fetch`** generados desde `api-docs.json` | Ya existe un OpenAPI 3.1. Tipos siempre sincronizados con el backend, sin escribir DTOs a mano. `openapi-fetch` es minúsculo y encaja con Query. (Alternativa: `orval` si se prefiere generar hooks de Query directamente.) |
| Auth | **Keycloak** — decidir modelo (ver T-10) | Requisito del proyecto. |
| Formularios | **react-hook-form + zod** | Hoy los forms son `useState` manual sin validación. Vienen muchos (quiz admin, subjects, perfil). |
| Filtros/estado en URL | **nuqs** (o searchParams nativos) | Hoy `categoryFilter`/`searchQuery` viven en Context; en URL serían compartibles y SSR-friendly. Opcional. |
| Validación de entorno | `@t3-oss/env-nextjs` o un `lib/env.ts` con zod | Centraliza `NEXT_PUBLIC_API_URL` etc. Opcional pero barato. |

No hace falta un state manager global (Redux/Zustand): con Query + Context puntual + estado
de URL es suficiente para esta app.

### Estructura de carpetas propuesta
```
lib/
  api/
    client.ts        # openapi-fetch + inyección de token (Keycloak) + baseUrl desde env
    schema.d.ts      # GENERADO desde api-docs.json (no editar a mano)
    pdfs.ts          # funciones por recurso (getPdfs, createPdf, ...)
    subjects.ts
    quizzes.ts
    auth.ts / profile.ts
  query/
    keys.ts          # query keys centralizadas
  env.ts
hooks/
  api/               # hooks TanStack Query: usePdfs, useSubjects, useQuizAttempt, ...
features/            # (opcional) agrupar UI por dominio: pdfs/, quizzes/, admin/
content/
  legal/ blog/ ...   # textos hoy embebidos en TSX
types/               # solo tipos NO derivables del OpenAPI
```

---

## 4. Fases y tareas

### Fase 0 — Limpieza y cimientos (sin dependencias, hacer primero)

- **T-01 · Eliminar los hooks "power-user".** Borra `hooks/use-load-simulator.ts`,
  `workers/load.worker.ts`, `config/loadSimulator.config.ts`, `hooks/use-indexeddb-load.ts`,
  `hooks/use-auto-refresh.ts`, `hooks/use-random-scroll.ts`, `hooks/use-random-mouse-movements.ts`,
  `hooks/use-power-user-features.ts`, `components/power-user-provider.tsx`,
  `hooks/use-user-profile.ts` (lista de emails). Quita `<PowerUserProvider />` de
  `app/layout.tsx`. Justificación: degradan a propósito el navegador de usuarios concretos;
  son un riesgo sin valor de producto.

- **T-02 · Centralizar configuración de entorno.** Crear `lib/env.ts` (valida y exporta
  `API_URL` desde `NEXT_PUBLIC_API_URL`). Sustituir las ~10 apariciones de
  `process.env.NEXT_PUBLIC_API_URL || ''`. Corregir el fallback `:4000` de `register-form.tsx`.
  Documentar variables en un `.env.example`.

- **T-03 · Generar tipos y cliente desde OpenAPI.** Añadir `openapi-typescript` (dev) y
  `openapi-fetch`. Script `npm run api:types` que genere `lib/api/schema.d.ts` desde
  `api-docs.json` (o desde `http://localhost:8081/v3/api-docs`). Crear `lib/api/client.ts`
  con `createClient({ baseUrl })`. Todavía sin auth (se añade en T-11).

- **T-04 · Instalar TanStack Query.** Añadir `@tanstack/react-query`, crear
  `components/providers/query-provider.tsx` con `QueryClient` y montarlo en `app/layout.tsx`
  (encima de los demás providers). Añadir `lib/query/keys.ts`. (Opcional: devtools en dev.)

- **T-05 · Revisar `next.config.ts` y `proxy.ts`.** Los headers `Access-Control-Allow-*`
  del `next.config.ts` son de respuesta y corresponden al **backend**, no a Next; probablemente
  sobran o estorban con Keycloak. `proxy.ts` (middleware) hoy no hace nada útil. Decidir con
  backend qué headers/cookies aplican tras Keycloak y limpiar. (Coordinar con T-10.)

### Fase 1 — Capa de datos de PDFs y taxonomía (depende de T-03, T-04)

- **T-06 · Capa API de Subjects/Units.** `lib/api/subjects.ts` + hooks `useSubjects`,
  `useSubjectUnits(id)`, `useSubjectPdfs(id)`. Endpoints `GET /subject`, `/subject/{id}/units`,
  `/subject/{id}/pdfs`.

- **T-07 · Sustituir la taxonomía hardcodeada por Subjects.** Eliminar
  `renameCategory`/`renameCategoryInverted` de `lib/utils.ts`, `tagToCategory` de
  `dashboard/page.tsx` y los objetos `categories` duplicados. La navegación lateral
  (`app-sidebar.tsx` / `nav-main.tsx`) y los filtros (`filter-context.tsx`) deben poblarse
  desde `useSubjects()`. Depende de T-06.

- **T-08 · Migrar catálogo de PDFs (home).** Reescribir `app/dashboard/page.tsx` para usar
  `PDFDto`/`PDFNoLinkDto` y los endpoints nuevos (`GET /pdf` autenticado, `GET /public/pdf/no-link`
  anónimo) vía hooks de Query. Extraer `PDFCard`/tipos a shape nuevo. Quitar el parseo de fechas
  `dd/mm/yyyy` casero (usar `lastTimeEdited` ISO). Sacar `sampleDataBlog` del componente (T-15).

- **T-09 · Migrar admin de PDFs.** `app/dashboard/admin/pdfs/page.tsx` y
  `components/ui/PDFAccordionCard.tsx`: usar `POST /pdf/create`, `PUT /pdf/update/{pdfId}`,
  `DELETE /pdf/delete/{pdfName}` con `CreatePDFDto`/`UpdatePDFDto` (incluyen `subjectId`/`subjectUnitId`,
  no tags). Selección de asignatura/tema desde la API. Mutaciones con invalidación de queries.
  Migrar los formularios a react-hook-form + zod.

### Fase 2 — Autenticación con Keycloak (transversal; empezar pronto por su impacto)

- **T-10 · [DECISIÓN] Definir el modelo de auth con Keycloak.** Antes de codificar, acordar
  con backend: ¿el frontend obtiene el token directamente de Keycloak (`keycloak-js` / Auth.js
  con provider Keycloak) o el backend actúa como **BFF** y gestiona la sesión por cookie
  httpOnly? ¿Dónde viven access/refresh token? El OpenAPI mantiene `/public/auth/login` con
  `bearerAuth` (JWT) y una cookie `refreshToken` → sugiere que el backend intermedia. **Bloquea
  T-11/T-12.** Documentar la decisión aquí.

- **T-11 · Cliente API con token.** Según T-10, añadir a `lib/api/client.ts` la inyección del
  `Authorization: Bearer` (o `credentials: 'include'` si es cookie) y el manejo de 401 →
  refresh/redirect a login. Un único punto, no por componente.

- **T-12 · Reescribir `auth-context`.** Sustituir el actual (cookies + status 480-490 + Firebase +
  `setTimeout(300)` "para Safari") por el flujo Keycloak. Rol admin desde `GET /profile`
  (`UserProfile.role === 'ADMIN'`) o desde el claim del token, no desde `/auth/is-admin`.
  Reescribir `login`, `logout`, `register` (`/public/auth/create`), reset (`/public/auth/reset-password`),
  cambio de contraseña (`/auth/change-password`). Actualizar `login-form.new.tsx`,
  `register-form.tsx`, `nav-user.tsx`.

- **T-13 · Mock de auth local (puente hasta que Keycloak esté listo).** Implementar un
  `AuthProvider` alternativo activable por env (p. ej. `NEXT_PUBLIC_AUTH_MODE=mock`) que exponga
  la misma interfaz que el real y permita alternar entre un **usuario admin local** y uno
  **normal local** (sin llamar a Keycloak). Así el resto de fases (admin, perfil, quizzes) avanzan
  en paralelo. Debe compartir interfaz con T-12 para que el cambio sea transparente. Puede hacerse
  **antes** que T-10/T-11 para desbloquear.

- **T-14 · Protección de rutas.** `useProtectedRoute`/`useAdminRoute` hoy solo protegen en cliente
  y `proxy.ts` no hace nada. Con Keycloak, mover la protección a **middleware** (`middleware.ts`)
  para `/dashboard/admin/*` y rutas autenticadas, además del guard de cliente. Eliminar Firebase
  (`lib/firebase.ts`, dependencia `firebase`) si Google login pasa por Keycloak.

### Fase 3 — Contenido y funcionalidad nueva

- **T-15 · Sacar el contenido estático de los componentes.** Mover `sampleDataBlog`
  (~470 líneas en `dashboard/page.tsx`) y los textos legales (`legal/privacy-policy` 303 líneas,
  `terms-of-service` 355, `cookies-policy` 388, `faq` 264, `about-us`, `contact-us`) a
  `content/` (MDX o JSON) y renderizarlos. El blog ya usa MDX en `content/posts`; unificar la
  fuente para que `dashboard/page.tsx`, `nav-projects.tsx` y `blog/page.tsx` lean del mismo sitio
  (leer frontmatter en vez de duplicar títulos/fechas).

- **T-16 · Perfil de usuario.** Nuevo en el backend: `GET/PUT /me` (`UserAccountDto`,
  `UpdateUserAccountDto`), flag `profileCompletedAt`. Reescribir `app/dashboard/profile/page.tsx`
  para leer/editar el perfil real (nombre, estado, fechas) y borrar cuenta (`DELETE /auth/delete-account`).

- **T-17 · Cuestionarios (feature nueva completa).** No existe en el frontend. Construir:
  - Listado público (`GET /public/quiz`) y por asignatura/tema (`/subject/{id}/quizzes`, `/subject/unit/{id}/quizzes`).
  - Resolución: `GET /quiz/{id}/attempt` (`QuizForAttemptDto`, sin respuestas correctas) →
    `POST /quiz/{id}/submit` (`SubmitQuizAttemptDto`) → mostrar `QuizAttemptResultDto`.
  - Historial: `GET /attempts` (paginado, `Pageable`) y `GET /quiz/{id}/attempts`.
  - Admin: CRUD de `Quiz`/`Question`/`Option`, más import/export JSON (`/quiz/{id}/export`,
    `/quiz/import?subjectId=`). Es la mayor pieza nueva; dividir en subtareas al abordarla.

- **T-18 · Admin de asignaturas/temas.** CRUD `Subject`/`SubjectUnit`
  (`/subject/create`, `/subject/update/{id}`, `/subject/delete/{id}`, `/subject/{id}/unit/create`, …).
  No existe UI hoy.

- **T-19 · Admin de usuarios.** `app/dashboard/admin/users/page.tsx` usa `/auth/change-role`,
  que **no aparece** en el OpenAPI nuevo. Confirmar con backend cómo se cambian roles (¿desde
  Keycloak?) y adaptar. `GET /auth/all-users` → `UserDTO` (shape distinto: `username`, `firstName`,
  `lastName`, `enabled`).

### Fase 4 — PDFs vía S3 y pulido

- **T-20 · Visor de PDF embebido desde S3.** Hoy `PDFCard` hace `<a href={url} target="_blank">`.
  Cuando el backend sirva los PDFs embebidos desde S3 (¿presigned URL / endpoint proxy?), adaptar:
  probablemente pedir la URL/recurso bajo demanda y mostrarlo en un visor embebido en vez de
  enlazar. Confirmar el mecanismo exacto con backend antes de implementar.

- **T-21 · Chatbot.** Verificar que `components/chat-widget.tsx` cumple `ChatRequest`/`ChatResponse`
  del OpenAPI (campo `message` + `conversationHistory`, respuesta con `relevantResources`).
  Renderizar `relevantResources` (PDF/BLOG_POST/PAGE) como enlaces. El rate-limit por
  `localStorage` puede mantenerse.

- **T-22 · Contacto/Mail.** `contact-us` usa `POST /mail/send`; alinear con el shape `Mail`
  (`subject`, `body`, `from?`).

---

## 5. Orden sugerido de ejecución
1. **Fase 0 completa** (T-01…T-05) — cimientos.
2. **T-13** (mock auth) en paralelo, para desbloquear todo lo autenticado.
3. **Fase 1** (PDFs + Subjects) — es el core actual y valida la nueva capa de datos end-to-end.
4. **T-10** (decisión Keycloak) cuanto antes; luego **T-11, T-12, T-14**.
5. **Fase 3** (perfil, contenido, quizzes, admin) sobre la base ya migrada.
6. **Fase 4** (S3, chatbot, mail) al final o cuando el backend exponga esas piezas.

## 6. Decisiones abiertas (para backend/producto)
- **T-10:** modelo Keycloak (directo vs BFF; ubicación de tokens; refresh).
- **T-19:** ¿cómo se cambian roles ahora? (`/auth/change-role` ya no existe).
- **T-20:** mecanismo exacto de servido de PDFs desde S3 (presigned vs proxy; embebido).
- Google login: ¿se mantiene? Si va por Keycloak, retirar Firebase.
- `/public/auth/login` devuelve `200` sin body tipado en el OpenAPI: confirmar qué devuelve
  (token en body vs cookie) — afecta a T-11/T-12.
