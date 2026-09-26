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

- **T-01 · ✅ HECHO — Eliminar los hooks "power-user".** Borrados `hooks/use-load-simulator.ts`,
  `workers/load.worker.ts`, `config/loadSimulator.config.ts`, `hooks/use-indexeddb-load.ts`,
  `hooks/use-auto-refresh.ts`, `hooks/use-random-scroll.ts`, `hooks/use-random-mouse-movements.ts`,
  `hooks/use-power-user-features.ts`, `components/power-user-provider.tsx`,
  `hooks/use-user-profile.ts` (lista de emails), y las carpetas `workers/`/`config/` que quedaron
  vacías. Quitado `<PowerUserProvider />` (import y uso) de `app/layout.tsx`. Verificado con
  grep que no queda ninguna referencia.

- **T-02 · ✅ HECHO — Centralizar configuración de entorno.** Creado `lib/env.ts` (exporta
  `API_URL`; usa `http://localhost:8081` como default solo fuera de producción, y lanza si falta
  en producción). Sustituidas las 10 apariciones de `process.env.NEXT_PUBLIC_API_URL || '...'`
  por `import { API_URL } from '@/lib/env'` en `contexts/auth-context.tsx`, `app/dashboard/page.tsx`,
  `app/dashboard/admin/pdfs/page.tsx`, `app/dashboard/admin/users/page.tsx`,
  `app/dashboard/contact/contact-us/page.tsx`, `app/dashboard/profile/page.tsx`,
  `components/chat-widget.tsx`, `components/login-form.new.tsx`, `components/register-form.tsx`
  (corregido el fallback erróneo a `:4000`), `components/ui/PDFAccordionCard.tsx`. Añadido
  `.env.example` (con excepción en `.gitignore` para que no quede ignorado por `.env*`).

- **T-03 · ✅ HECHO — Generar tipos y cliente desde OpenAPI.** Añadidas `openapi-typescript`
  (dev) y `openapi-fetch` (dep). Script `npm run api:types` (`openapi-typescript api-docs.json -o
  lib/api/schema.d.ts`), ejecutado y comiteado `lib/api/schema.d.ts`. Creado `lib/api/client.ts`
  con `createClient<paths>({ baseUrl: API_URL })`, sin autenticación todavía. Ningún componente
  existente conectado aún a este cliente (eso es Fase 1).

- **T-04 · ✅ HECHO — Instalar TanStack Query.** Añadidas `@tanstack/react-query` (dep) y
  `@tanstack/react-query-devtools` (dev). Creado `components/providers/query-provider.tsx`
  (`QueryClient` con `staleTime: 60_000`) montado en `app/layout.tsx` por encima de `AuthProvider`.
  Devtools montados condicionalmente en `NODE_ENV === 'development'`. Añadido `lib/query/keys.ts`
  con la estructura base (vacío, a poblar en Fase 1).

  **Nota:** `npm run lint` falla actualmente por un conflicto de peer-deps preexistente entre
  `eslint@10` y `eslint-config-next@16.2.6` (no introducido por T-01..T-04; reproducible en
  `HEAD` antes de estos cambios). `npm run build` sí pasa. Conviene abrir una tarea aparte para
  resolver la versión de eslint antes de exigir lint limpio en CI.

- **T-05 · Revisar `next.config.ts` y `proxy.ts`.** Los headers `Access-Control-Allow-*`
  del `next.config.ts` son de respuesta y corresponden al **backend**, no a Next; probablemente
  sobran o estorban con Keycloak. `proxy.ts` (middleware) hoy no hace nada útil. Decidir con
  backend qué headers/cookies aplican tras Keycloak y limpiar. (Coordinar con T-10.)

### Fase 1 — Capa de datos de PDFs y taxonomía (depende de T-03, T-04)

- **T-06 · ✅ HECHO — Capa API de Subjects/Units.** Creado `lib/api/subjects.ts`
  (`getSubjects`, `getSubjectUnits`, `getSubjectPdfs` sobre `apiClient`/`openapi-fetch`,
  endpoints `GET /subject`, `/subject/{id}/units`, `/subject/{id}/pdfs`, públicos) y
  `hooks/api/use-subjects.ts` (`useSubjects`, `useSubjectUnits(id)`, `useSubjectPdfs(id)`,
  con `enabled` atado a que el id no sea `null`). Query keys centralizadas y jerárquicas en
  `lib/query/keys.ts` (`queryKeys.subjects.*`, `queryKeys.pdfs.*`): invalidar el prefijo
  `["subjects"]` invalida también `units`/`pdfs` por asignatura.

- **T-07 · ✅ HECHO — Sustituir la taxonomía hardcodeada por Subjects.** Eliminadas
  `renameCategory`/`renameCategoryInverted` de `lib/utils.ts`, el `tagToCategory` de
  `dashboard/page.tsx` y los objetos `categories` duplicados de `admin/pdfs/page.tsx` y
  `PDFAccordionCard.tsx` (estos dos últimos terminados de migrar en T-09). `FilterContext`
  ahora guarda `subjectId`/`subjectUnitId` (`number | null`) en vez de strings de
  categoría/subcategoría. La sidebar (`app-sidebar.tsx`) ya no usa el `NavMain` con
  `data.navMain` hardcodeado para "Apuntes": se creó `components/nav-subjects.tsx`
  (`NavSubjects`), que consume `useSubjects()` a nivel 1 y `useSubjectUnits(subjectId)` por
  cada asignatura (precargado, no perezoso — catálogo pequeño) a nivel 2; el click en
  asignatura/tema llama a `setFilter(subjectId, subjectUnitId)` con ids numéricos y navega a
  `/dashboard`. `NavMain` se simplificó a una lista de enlaces planos (solo la usa ya el panel
  de Admin). El grupo "Blogs" (`nav-projects.tsx`) no se tocó, como pedía la tarea.

- **T-08 · ✅ HECHO — Migrar catálogo de PDFs (home).** Creados `lib/api/pdfs.ts`
  (`getPdfs` → `GET /pdf`, `getPublicPdfsNoLink` → `GET /public/pdf/no-link`) y
  `hooks/api/use-pdfs.ts` (`usePdfs`, `usePublicPdfsNoLink`, con parámetro `enabled` para
  elegir uno u otro según `isAuthenticated`). Reescrito `app/dashboard/page.tsx`: sin `fetch`
  manual ni tipos `APIPDFDocument`/`ExtendedPDFDocument` a mano; filtra por
  `subjectId`/`subjectUnitId` de `FilterContext`; usa `lastTimeEdited` (ISO) directamente con
  un formateador simple (`toLocaleDateString`) en vez del parseo `dd/mm/yyyy` casero.
  `components/pdf-card.tsx` recibe `subjectName`/`subjectUnitName` (con badges) en vez de un
  `tag` de 2 letras, y el botón de descarga ahora depende también de que exista `url` (los
  PDFs anónimos vía `PDFNoLinkDto` no traen `link`). `sampleDataBlog` no se tocó (queda para
  T-15).

- **T-09 · ✅ HECHO — Migrar admin de PDFs.** `app/dashboard/admin/pdfs/page.tsx` y
  `components/ui/PDFAccordionCard.tsx` ya no hacen `fetch` manual: usan
  `useCreatePdf`/`useUpdatePdf`/`useDeletePdf` (`hooks/api/use-pdfs.ts`, mutaciones de
  TanStack Query sobre `POST /pdf/create`, `PUT /pdf/update/{pdfId}`,
  `DELETE /pdf/delete/{pdfName}` con `CreatePDFDto`/`UpdatePDFDto` reales —
  `subjectId`/`subjectUnitId`, no `pdfTag`) e invalidan `["pdfs"]`/`["subjects"]` al terminar
  (por la jerarquía de `queryKeys` esto también refresca los PDFs por asignatura). El
  combobox hardcodeado de categoría/subcategoría se sustituyó por
  `components/ui/subject-unit-picker.tsx` (`SubjectUnitPicker`), un componente compartido
  entre el formulario de creación y el de edición inline que usa `useSubjects()`/
  `useSubjectUnits()` — misma fuente de verdad que la sidebar. Ambos formularios (creación y
  edición) se migraron a `react-hook-form` + `zod` (`@hookform/resolvers/zod`), con
  validación de `name`/`link` (URL) y de que se haya elegido una asignatura. El botón manual
  "Ver PDFS" se eliminó: la lista se carga sola vía `usePdfs()` y se refresca sola tras cada
  mutación (ya no hace falta refetch manual).

### Fase 2 — Autenticación con Keycloak (transversal; empezar pronto por su impacto)

> **⏸ 2025-XX-XX — Decisión de producto:** Keycloak se implementará **cuando su responsable
> lo aborde en el backend**; hasta entonces el frontend usa **T-13 (mock local)** como auth
> "de verdad" para poder construir y probar todo lo demás (admin, PDFs, asignaturas,
> cuestionarios), no como un puente menor de un día. T-10/T-11/T-12 quedan **en pausa** — no
> las ejecutes salvo que se te pida explícitamente tras esa decisión de backend.

- **T-10 · ⏸ EN PAUSA — [DECISIÓN] Definir el modelo de auth con Keycloak.** Antes de
  codificar, acordar con backend: ¿el frontend obtiene el token directamente de Keycloak
  (`keycloak-js` / Auth.js con provider Keycloak) o el backend actúa como **BFF** y gestiona
  la sesión por cookie httpOnly? ¿Dónde viven access/refresh token? El OpenAPI mantiene
  `/public/auth/login` con `bearerAuth` (JWT) y una cookie `refreshToken` → sugiere que el
  backend intermedia. **Bloquea T-11/T-12.** Documentar aquí la decisión cuando se tome.

- **T-11 · ⏸ EN PAUSA — Cliente API con token.** Según T-10, añadir a `lib/api/client.ts` la
  inyección del `Authorization: Bearer` (o `credentials: 'include'` si es cookie) y el manejo
  de 401 → refresh/redirect a login. Un único punto, no por componente.

- **T-12 · ⏸ EN PAUSA — Reescribir `auth-context` con Keycloak real.** Sustituir el actual
  (cookies + status 480-490 + Firebase + `setTimeout(300)` "para Safari") por el flujo
  Keycloak. Rol admin desde `GET /profile` (`UserProfile.role === 'ADMIN'`) o desde el claim
  del token, no desde `/auth/is-admin`. Reescribir `login`, `logout`, `register`
  (`/public/auth/create`), reset (`/public/auth/reset-password`), cambio de contraseña
  (`/auth/change-password`). Actualizar `login-form.new.tsx`, `register-form.tsx`,
  `nav-user.tsx`. **Cuando se retome, sustituye la implementación de T-13 detrás de la misma
  interfaz — el resto de la app no debería enterarse del cambio.**

- **T-13 · ✅ HECHO — Mock de auth local (auth vigente hasta que exista Keycloak).**
  Reescrito `contexts/auth-context.tsx`: ya **no llama a ningún endpoint de auth del
  backend** (se quitaron `/auth/validate`, `/auth/login`, `/auth/google-login`,
  `/auth/logout`, `/auth/is-admin`). Tres identidades locales: `admin`
  (`admin@local.test`, "Admin (local)"), `user` (`user@local.test`, "Usuario (local)") y
  `anonymous` (por defecto si no hay nada guardado). La identidad se persiste en
  `localStorage` (`mathtexpedia-mock-identity`) y se lee en el primer render. La interfaz
  pública se mantiene igual (`isAuthenticated`, `loading`, `isAdmin`, `email`, `login`,
  `loginWithGoogle`, `logout`, `checkAuth`) más dos campos nuevos, aditivos y no
  disruptivos: `identity` (`"admin" | "user" | "anonymous"`) y `setIdentity`. `login()`
  conserva su validación de email/password y, en vez de llamar al backend, cambia a la
  identidad `admin` si el email coincide con `admin@local.test` o a `user` en cualquier
  otro caso; `loginWithGoogle()` cambia siempre a `user`; `logout()` cambia a `anonymous`.
  El selector de identidad vive en `components/nav-user.tsx`: se rediseñó para que el
  `DropdownMenu` esté siempre visible (antes solo aparecía autenticado y en su lugar se
  mostraba un botón "Login" en anónimo, lo que impedía cambiar de modo desde ahí) y se le
  añadió un `DropdownMenuGroup` "Modo de prueba" con las 3 opciones y un check en la
  activa, reutilizando el mismo dropdown que ya tenía Profile/Donate/Log out.
  `app-sidebar.tsx` usa el nuevo campo `displayName` del contexto para mostrar "Admin
  (local)"/"Usuario (local)" en vez de derivar el nombre del email.
  **Importante:** el mock no produce un JWT real, así que las llamadas a endpoints
  protegidos del backend (`GET /pdf`, `POST /pdf/create`, …) devuelven 401 de verdad contra
  `localhost:8081` aunque `isAuthenticated`/`isAdmin` sean `true` en el mock. Es un límite
  conocido y aceptado por ahora (se resuelve en T-11/T-12): el código ya está listo para
  ese momento, no se ha intentado "arreglar" generando tokens falsos.

> **✅ Verificación T-13/T-06..T-09 (2026-09-26):** `npm run build` y `npx tsc --noEmit` pasan
> limpios en un shell sin ninguna variable de entorno configurada. Se corrigieron dos bugs
> encontrados en esa verificación (no introducidos por T-06..T-09, preexistentes de T-01/T-02
> y del código original):
> - `lib/env.ts` (T-02) lanzaba en `next build` si faltaba `NEXT_PUBLIC_API_URL`, tumbando el
>   build entero (incluido en cualquier CI sin esa variable). Ahora solo avisa por consola en
>   cliente+producción y siempre cae al default de dev.
> - `lib/firebase.ts` (preexistente) llamaba a `getAuth()` de forma eager y reventaba en
>   `next build` (prerender de `/auth/login`) si faltaban las credenciales de Firebase. Ahora
>   `auth` es `Auth | undefined`; `login-form.new.tsx` comprueba antes de usarlo.
>
> Comprobado también contra el backend real en `localhost:8081`: el feed anónimo de PDFs
> (`GET /public/pdf/no-link`) funciona end-to-end. **`GET /subject` y derivados devuelven 401**
> pese a estar documentados como públicos — la sidebar de asignaturas (T-07) se queda vacía en
> anónimo por esto, no por un bug del frontend. Detalle y petición al backend en
> `API-REQUESTS.md` §10. `/public/auth/login` y `/public/auth/create` reales devuelven 401/500
> hoy (§11 de `API-REQUESTS.md`) — confirma que mockear el auth (T-13) era lo correcto.

- **T-14 · ⏸ EN PAUSA — Protección de rutas por middleware.** `useProtectedRoute`/`useAdminRoute`
  hoy solo protegen en cliente y `proxy.ts` no hace nada; con el mock de T-13 esto es
  suficiente por ahora. Mover la protección a **middleware** (`middleware.ts`) y eliminar
  Firebase (`lib/firebase.ts`) se retoma junto con T-12, cuando Keycloak sea real.

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
1. ~~**Fase 0** (T-01…T-04) — cimientos.~~ ✅ Hecho.
2. ~~**T-13** (mock auth completo, admin/usuario/anónimo).~~ ✅ Hecho — desbloquea todo lo
   autenticado sin esperar a Keycloak.
3. ~~**Fase 1** (T-06…T-09: Subjects/Units + PDFs)~~ ✅ Hecho — sobre el API tal cual está hoy
   en `api-docs.json` (sin S3, eso es T-20/Fase 4 y sigue sin tocarse).
4. **Fase 2 real (T-10, T-11, T-12, T-14)** — **en pausa**, se retoma cuando el responsable de
   Keycloak lo aborde en el backend. No es parte del trabajo activo actual.
5. **Fase 3** (perfil, contenido, quizzes, admin de asignaturas/usuarios) sobre la base ya
   migrada. La taxonomía de Subjects/Units se construye con los endpoints que ya existen en
   `api-docs.json`; los campos extra de `API-REQUESTS.md` (contadores, etc.) son mejoras
   futuras, no bloquean nada de esto.
6. **Fase 4** (S3, chatbot, mail) al final o cuando el backend exponga esas piezas.

## 6. Decisiones abiertas (para backend/producto)
- **T-10:** modelo Keycloak (directo vs BFF; ubicación de tokens; refresh). **Diferido**:
  lo resolverá quien implemente Keycloak; hasta entonces el frontend usa el mock de T-13.
- **T-19:** ¿cómo se cambian roles ahora? (`/auth/change-role` ya no existe).
- **T-20:** mecanismo exacto de servido de PDFs desde S3 (presigned vs proxy; embebido). **No
  se toca todavía** — los PDFs se siguen sirviendo como `link` directo, tal cual lo modela
  `PDFDto` en `api-docs.json` hoy.
- Google login: ¿se mantiene? Si va por Keycloak, retirar Firebase. Mientras tanto, con el
  mock de T-13 el botón de Google puede quedar deshabilitado/oculto.
- `/public/auth/login` devuelve `200` sin body tipado en el OpenAPI: confirmar qué devuelve
  (token en body vs cookie) — afecta a T-11/T-12 cuando se retomen.
