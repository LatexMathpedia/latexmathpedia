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

> **✅ 2026-09-26 — Actualización importante: Keycloak real ya existe, fusionado.** Un
> compañero implementó Keycloak directamente en `dev-restore` mientras esta rama seguía el
> plan de mockear T-13 (PR #195 "Añade integración directa con Keycloak", con Auth.js/NextAuth
> v5 + provider Keycloak). Se ha hecho **merge de `origin/dev-restore` en `feat-192`**
> reconciliando ambos trabajos: **T-10, T-11 y T-12 quedan resueltos** por esa implementación;
> T-13 (mock) **no se descarta**, sino que convive con ella detrás de un selector de modo —
> ver el resumen debajo de T-14.

- **T-10 · ✅ RESUELTO (PR #195) — Modelo de auth con Keycloak.** Decisión tomada e
  implementada: el frontend habla **directamente** con Keycloak vía Auth.js
  (`next-auth@5.0.0-beta.32`, provider `Keycloak`), no vía BFF. Cliente **público** (sin
  `client_secret`), protegido con **PKCE**; si se configura `KEYCLOAK_CLIENT_SECRET` pasa a
  cliente confidencial. Sesión con estrategia JWT (cookie de Auth.js, no la cookie
  `refreshToken` del backend que sugería el OpenAPI). Rol admin derivado del claim
  `realm_access`/`resource_access` del access token (rol configurable por
  `KEYCLOAK_ADMIN_ROLE`, default `ADMIN`), no de `GET /profile`. Ver `auth.ts` (raíz) y
  `lib/env.server.ts`.

- **T-11 · ✅ RESUELTO (PR #195 + integración) — Cliente API con token.** `contexts/auth-context.tsx`
  sincroniza el `accessToken` de la sesión de Keycloak con `lib/api/client.ts` (función
  `setApiAccessToken`, middleware `apiClient.use({ onRequest })` que añade
  `Authorization: Bearer`) — así todos los hooks de TanStack Query (`hooks/api/*`) llevan el
  token automáticamente sin tocarlos uno a uno. Para los componentes aún no migrados a
  `lib/api/*` (admin de usuarios, contacto, perfil, chat, ver T-19/T-15/T-16), el contexto
  expone `authFetch()`, que además reintenta una vez tras refrescar el token si la petición
  da 401.

- **T-12 · ✅ RESUELTO (PR #195 + integración) — `auth-context` con Keycloak real.**
  `contexts/auth-context.tsx` ahora expone **dos implementaciones** detrás de la misma
  interfaz pública, elegidas por `NEXT_PUBLIC_AUTH_MODE` (`lib/env.ts`, default `"mock"`):
  - `"keycloak"`: `KeycloakAuthProvider` (envuelve `SessionProvider` de `next-auth/react`).
    `login()`/`register()`/`changePassword()` ya no toman `credentials`, redirigen a
    Keycloak (`signIn('keycloak', ...)`, `signIn('keycloak-register', ...)`,
    `kc_action: 'UPDATE_PASSWORD'`). `login-form.new.tsx`/`register-form.tsx` se
    simplificaron a botones (sin campos de email/password) que llaman a estos métodos —
    **cambio de UX real**, ya no hay formulario local de email/contraseña.
  - `"mock"`: `MockAuthProvider`, la implementación de T-13 (ver más abajo), adaptada a la
    misma interfaz nueva (`login()`/`register()` ya no reciben `credentials`; en mock
    simplemente adoptan la identidad "usuario" y navegan, igual que antes por email).
  - Campos `identity`/`setIdentity` (del mock) pasan a ser **opcionales** en el tipo — solo
    existen en modo mock; `components/nav-user.tsx` los usa condicionalmente (el selector
    "Modo de prueba" solo se muestra en modo mock; en modo keycloak se muestra un botón real
    de "Iniciar sesión" cuando no hay sesión).
  - `lib/firebase.ts` **eliminado** (con él, el login con Google por Firebase); Google ahora
    entra por Keycloak (`login({ idpHint: 'google' })`, brokering de identidad en Keycloak).
  - `app/auth/pwd-email-sent/page.tsx` eliminada (ya no hace falta: el cambio/recuperación de
    contraseña lo gestiona la UI de Keycloak).

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

- **T-14 · ✅ RESUELTO EN MODO KEYCLOAK (PR #195 + integración) — Protección de rutas por
  middleware.** `proxy.ts` ahora se ramifica por `AUTH_MODE`:
  - En modo **keycloak**, importa dinámicamente `lib/auth/keycloak-middleware.ts`
    (`protectRoutes`, basado en `auth()` de Auth.js) y protege `/dashboard/admin/*` (rol
    admin), `/dashboard/profile` (sesión) y redirige fuera de `/auth/login`/`/auth/register`
    si ya hay sesión.
  - En modo **mock** (default), el middleware es un simple passthrough — **no importa
    `@/auth` en absoluto**, así que no hace falta ninguna variable `AUTH_SECRET`/`KEYCLOAK_*`
    para desarrollar sin Keycloak levantado. La protección la siguen dando los hooks de
    cliente `useProtectedRoute`/`useAdminRoute`, como antes de T-14.

> **✅ Resumen del merge `origin/dev-restore` → `feat-192` (2026-09-26):**
> Se fusionó el PR #195 (Keycloak real, mergeado en `dev-restore` por un compañero) con el
> trabajo de esta rama (T-01..T-09, T-13 mock). Piezas nuevas de esa fusión:
> - `NEXT_PUBLIC_AUTH_MODE` (`.env.example`, `lib/env.ts`): `"mock"` (default) o `"keycloak"`.
>   **Los dos modos comparten exactamente la misma interfaz `useAuth()`** — nada más en la
>   app necesita saber cuál está activo, salvo `nav-user.tsx` (para mostrar el selector de
>   prueba o el botón de login real) y `proxy.ts` (para no cargar Keycloak en modo mock).
> - `dashboard/page.tsx`, `admin/pdfs/page.tsx`, `PDFAccordionCard.tsx`: se mantuvo **nuestra**
>   versión (T-08/T-09, ya migrada a `lib/api/*` + TanStack Query); el pequeño parche del
>   compañero sobre la versión antigua (`fetch` → `authFetch`) quedó superado y no se aplicó
>   — en su lugar, el token se inyecta centralizadamente en `lib/api/client.ts` (T-11).
> - `admin/users/page.tsx`, `contact-us/page.tsx`, `profile/page.tsx`, `chat-widget.tsx`,
>   `login-form.new.tsx`, `register-form.tsx`: se tomó **la versión del compañero** (todavía
>   no estaban migrados a `lib/api/*` en esta rama, así que su patch de `authFetch` sí aporta).
>   `admin/users/page.tsx` sigue llamando a `/auth/change-role`, que no existe en el backend
>   — eso es un problema previo sin relación con este merge, pendiente de T-19.
> - `package.json`: añadido `next-auth`, quitado `firebase`; el resto de dependencias de esta
>   rama (TanStack Query, openapi-fetch/typescript, react-hook-form, zod) se conservan.
>   `package-lock.json` regenerado con `npm install` en vez de fusionado a mano.
> - Verificado: `npm run build` pasa limpio **en modo mock sin ninguna variable de entorno
>   configurada** (el objetivo pedido: no depender de Keycloak para el entorno de pruebas) y
>   también con `NEXT_PUBLIC_AUTH_MODE=keycloak` sin `KEYCLOAK_*` configuradas (no revienta el
>   build, solo fallaría en tiempo de request si de verdad se usa). `npx tsc --noEmit` limpio.

### Fase 3 — Contenido y funcionalidad nueva

- **T-15 · ✅ HECHO (parte de contenido; textos legales fuera de alcance) — Deduplicar el
  blog del feed.** Se eliminó el `sampleDataBlog` (~440 líneas escritas a mano en
  `dashboard/page.tsx`) que duplicaba título/descripción/fecha/tags de los mismos posts que
  ya existen como `.mdx` en `content/posts/` con su propio frontmatter.
  - Extraída la lógica de lectura (antes inline en `app/dashboard/blog/page.tsx`, con
    `fs`/`gray-matter`) a `lib/content/posts.ts` (`getAllBlogPosts(): BlogPostMeta[]`,
    server-only, sin `"use client"`). `blog/page.tsx` ahora solo llama a esa función.
    **Decisión:** de paso se ordenan los posts por `date` descendente dentro de
    `getAllBlogPosts()` (antes ni `sampleDataBlog` en `dashboard/page.tsx` ni
    `blog/page.tsx` garantizaban un orden fiable — `blog/page.tsx` dependía del orden de
    `fs.readdirSync`, alfabético por nombre de fichero); es una mejora de bajo riesgo, no
    solo una extracción literal.
  - `app/dashboard/page.tsx` pasa a ser un **Server Component** (sin `"use client"`, sin
    hooks) que llama a `getAllBlogPosts()` y se lo pasa como prop a un nuevo
    `components/dashboard-feed.tsx` (`"use client"`), que contiene todo lo interactivo que
    antes vivía en `WelcomePage` (fetch de PDFs, filtros, búsqueda, grid) — mismo patrón que
    ya usaba `blog/[slug]/page.tsx` (Server Component + componentes cliente para lo
    interactivo). El bloque "Blog" del feed ahora renderiza `BlogCard` a partir de esos
    posts reales.
  - **`components/nav-projects.tsx` también duplica datos del blog** (un array
    `data.projects` hardcodeado en `components/app-sidebar.tsx`: 4 posts "destacados" con
    `name`+`url`+`icon` a mano, no leído del frontmatter). Hoy los 4 slugs siguen
    existiendo en `content/posts/` (verificado), así que no está roto, pero es la misma
    duplicación de fondo: renombrar o borrar uno de esos posts lo desincronizaría en
    silencio. No se ha tocado en esta ronda tal y como permitía el enunciado ("no hace
    falta que lo arregles si no es trivial") — arreglarlo requeriría decidir qué criterio
    define "destacado" (¿los N más recientes? ¿un flag en el frontmatter?), que es una
    decisión de producto, no solo una refactorización.
  - Fuera de alcance en esta ronda (tal y como pedía el enunciado): las páginas legales
    (`legal/privacy-policy`, `terms-of-service`, `cookies-policy`) y `contact/about-us`/
    `contact/faq` siguen con su texto inline; moverlas a MDX no se ha hecho.

- **T-16 · ✅ HECHO — Perfil de usuario.** Nuevo `lib/api/profile.ts` (`getMe` → `GET /me`,
  `updateMe` → `PUT /me`, con `ApiError` de `lib/api/errors.ts` para distinguir el 400/401
  por status) + hooks `useMe()`/`useUpdateMe()` en `hooks/api/use-profile.ts`
  (`queryKeys.profile.me()`, nueva en `lib/query/keys.ts`). `app/dashboard/profile/page.tsx`
  reescrito: muestra nombre (editable con un form react-hook-form + zod que llama a
  `useUpdateMe()`), email, estado (`status`, como `Badge`) y fecha de alta (`createdAt`).
  Si `profileCompletedAt` es `null` se muestra un `Alert` opcional "Completa tu perfil"
  (no bloquea nada). Borrar cuenta y logout se mantienen tal cual estaban (ya usaban
  `authFetch`/`useAuth`, no tocado). **Decisión de implementación:** la página se dividió en
  dos pestañas con el nuevo `Tabs` de shadcn — "Perfil" (todo lo anterior) y "Mis
  cuestionarios" (histórico de intentos, ver T-17 parte 1 más abajo, que vive en esta misma
  página tal y como pide `UI-RESTRUCTURE.md` §6.3).

- **T-17 · ✅ HECHO (parte 1 y parte 2) — Cuestionarios completos.**

  **Parte 1 — cara de usuario:**
  - Nuevo `lib/api/quizzes.ts` + `hooks/api/use-quizzes.ts` + `queryKeys.quizzes.*` /
    `queryKeys.attempts.*` en `lib/query/keys.ts`: `getPublicQuizzes` (`GET /public/quiz`,
    anónimo), `getQuiz` (`GET /quiz/{id}`, autenticado no-admin), `getQuizForAttempt`
    (`GET /quiz/{id}/attempt`), `submitQuizAttempt` (`POST /quiz/{id}/submit`, con
    `ApiError`) y `getMyAttempts` (`GET /attempts`, paginado).
  - `/dashboard/quizzes`: catálogo público (grid de `QuizCard`, nuevo
    `components/quiz-card.tsx`), con badge de dificultad (`components/ui/quiz-difficulty-badge.tsx`,
    verde/ámbar/rojo) y filtro por asignatura (`Select` de shadcn, alimentado por
    `useSubjects()`).
  - `/dashboard/quizzes/[quizId]`: ficha (protegida con `useProtectedRoute`, `GET /quiz/{id}`
    no es público) con botón "Empezar cuestionario".
  - `/dashboard/quizzes/[quizId]/attempt`: todas las preguntas en scroll continuo (no wizard),
    `RadioGroup` de shadcn por pregunta, barra `Progress` con preguntas respondidas. Al
    enviar, **reemplaza el contenido de la misma página** por el resultado (mismo
    `QuizAttemptResultDto`, sin navegar): puntuación grande, y por pregunta la opción
    marcada, la correcta si falló, y la `explanation` en un `Alert`. **Decisión:** el envío
    se deshabilita solo si no se ha respondido nada (0 de N); con al menos una respuesta se
    permite enviar parcial, ya que el propio `QuizAttemptResultDto` expone
    `unansweredQuestions` (el backend ya lo tolera, confirmado en `api-docs.json`).
  - Histórico en el perfil (pestaña "Mis cuestionarios", `useMyAttempts()` + nuevo
    `Pagination` de shadcn). **Limitación conocida:** `QuizAttemptDto` solo trae `quizId`,
    no el nombre del cuestionario (gap ya anotado en `API-REQUESTS.md` §3/§9); se resuelve
    cruzando con la caché de `usePublicQuizzes()` y, si no se encuentra, se muestra
    "Cuestionario #id" en vez de fallar.
  - Añadida entrada "Cuestionarios" en `components/app-sidebar.tsx` (grupo propio, junto a
    "Apuntes", sin tocar el grupo "Blogs" que es de T-15).
  - Se instalaron con `npx shadcn@latest add tabs radio-group progress pagination select`
    (y también `alert-dialog` había quedado con el mismo problema): **el generador de shadcn
    en esta versión escribe `import { cn } from "cn"` en vez de `@/lib/utils`** en todos los
    componentes nuevos — se corrigió en los 6 ficheros afectados
    (`alert-dialog.tsx`, `tabs.tsx`, `radio-group.tsx`, `progress.tsx`, `pagination.tsx`,
    `select.tsx`) y se desinstaló la dependencia `cn` (quedaba sin uso). `select.tsx` existía
    pero estaba vacío (0 bytes, ya roto antes de esta ronda) — se regeneró con `--overwrite`.

  **Parte 2 — administración (`/dashboard/admin/quizzes`):**
  - `lib/api/quizzes.ts` ampliado con `createQuiz`/`updateQuiz`/`deleteQuiz` (con `ApiError`),
    `getQuizQuestions` (`QuestionDto[]`, distinto del `QuestionForAttemptDto` de la parte 1),
    `exportQuiz` y `importQuiz`. Nuevos `lib/api/questions.ts`
    (`createQuestion`/`updateQuestion`/`deleteQuestion`) y `lib/api/options.ts`
    (`createOption`/`updateOption`/`deleteOption`), mismo patrón `ApiError` que el resto.
    **Añadido no pedido explícitamente pero necesario:** `getQuestionOptions` en
    `lib/api/questions.ts` (`GET /question/{id}/options`, tag "Question" en `api-docs.json`,
    no "Option") — es el único endpoint que trae las opciones de una pregunta, y el editor
    las necesita.
  - Hooks nuevos: mutaciones de quiz en `hooks/api/use-quizzes.ts`
    (`useCreateQuiz`/`useUpdateQuiz`/`useDeleteQuiz`/`useImportQuiz`, invalidando
    `queryKeys.quizzes.all()`) + `useQuizQuestions`; `hooks/api/use-questions.ts`
    (`useQuestionOptions`, `useCreateQuestion`/`useUpdateQuestion`/`useDeleteQuestion`,
    reciben `quizId` en las variables de la mutación para invalidar
    `queryKeys.quizzes.questions(quizId)`, mismo patrón que `subjects.units(subjectId)` de
    T-18); `hooks/api/use-options.ts` (invalidan `queryKeys.questions.options(questionId)`
    leyendo `questionId` del propio DTO, ya que `Create/UpdateOptionDto` ya lo llevan).
    Claves nuevas en `lib/query/keys.ts`: `quizzes.questions(quizId)` y
    `questions.options(questionId)`.
  - `/dashboard/admin/quizzes`: listado (`usePublicQuizzes()` — no existe un endpoint de
    "listar todos como admin" distinto del público, tal y como anticipaba el enunciado)
    con buscador, y por fila: exportar (descarga el JSON de `exportQuiz()` vía Blob),
    editar (enlace al editor) y borrar (`AlertDialog`). Dos diálogos: **Crear** (formulario
    mínimo — nombre, dificultad, asignatura/tema — que llama a `createQuiz()` y navega al
    editor con el id ya real) e **Importar** (`<input type="file">` que parsea el JSON en el
    cliente + `SubjectUnitPicker` para asignatura/tema, ya que el JSON exportado no los
    incluye).
  - `/dashboard/admin/quizzes/[quizId]`: editor completo — formulario de metadatos
    (react-hook-form + zod, reutiliza `useQuiz()` de la parte 1 para los valores iniciales),
    y preguntas como `Accordion` (nuevo `components/ui/QuizQuestionAccordion.tsx`, mismo
    patrón de estado "en edición" local que `PDFAccordionCard`/`SubjectAccordionCard`): cada
    pregunta editable inline (texto, tipo, explicación) con sus opciones anidadas
    (texto editable, borrar, reordenar). Formulario "Añadir pregunta" al final de la lista y
    "Añadir opción" dentro de cada pregunta. Todos los borrados (quiz, pregunta, opción) con
    `AlertDialog`.
  - **Decisión — opción correcta:** se marca con un `RadioGroup` que envuelve todas las
    opciones de una pregunta (una sola correcta, coherente con el modelo de datos); al
    seleccionar una nueva, se lanzan en paralelo dos `PUT /option/update/{id}` (desmarcar la
    anterior, marcar la nueva) en vez de introducir un endpoint o campo nuevo.
  - **Decisión — reordenar por posición:** sin drag-and-drop (como sugería
    `UI-RESTRUCTURE.md` §7.3); botones ↑/↓ que intercambian el campo `position` entre la
    pregunta/opción movida y su vecina inmediata, vía dos `PUT` en paralelo.
  - Añadida entrada "Cuestionarios" a `dataAdminPanel.adminPanel` en
    `components/app-sidebar.tsx` y cuarta tarjeta en `app/dashboard/admin/page.tsx`.
  - Se instaló `accordion` con `npx shadcn@latest add accordion` — mismo problema de
    `import { cn } from "cn"` que en rondas anteriores; corregido en `accordion.tsx` y
    dependencia `cn` desinstalada de nuevo.

- **T-18 · ✅ HECHO — Admin de asignaturas/temas.** CRUD completo de `Subject`/`SubjectUnit`
  sobre `lib/api/subjects.ts` (ampliado con `createSubject`/`updateSubject`/`deleteSubject`/
  `createSubjectUnit`/`updateSubjectUnit`/`deleteSubjectUnit`, todos vía `apiClient`) y sus
  mutaciones TanStack Query correspondientes en `hooks/api/use-subjects.ts`, cada una
  invalidando `queryKeys.subjects.all()` (crear/borrar asignatura) o
  `queryKeys.subjects.units(subjectId)` (crear/editar/borrar tema).
  - Nueva página `app/dashboard/admin/subjects/page.tsx`: mismo patrón visual que
    `admin/pdfs/page.tsx` (protegida con `useAdminRoute`, formulario de alta con
    react-hook-form + zod, buscador, tarjetas expandibles vía `useSubjects()`).
  - Nuevo `components/ui/SubjectAccordionCard.tsx` (mismo patrón que `PDFAccordionCard`):
    nombre/descripción editables inline, y dentro, la lista de Temas de esa asignatura
    (`useSubjectUnits`) cada uno editable (nombre, posición) y borrable, más un formulario
    para añadir un tema nuevo. **Decisión de implementación:** los temas de una asignatura
    solo se piden (`useSubjectUnits`) cuando su tarjeta está expandida (`isOpen`), no de
    forma eager para todas las asignaturas del catálogo a la vez — a diferencia de la
    sidebar (T-07), aquí el listado puede crecer y no todas las tarjetas están abiertas.
  - Los 409 de conflicto (asignatura con temas / tema con PDFs) se distinguen del resto de
    errores por el **status HTTP de la respuesta**, no por el cuerpo: el `api-docs.json`
    reutiliza (por error, aparentemente) el mismo DTO de éxito como schema de los 409/401, así
    que se añadió una clase `ApiError` en `lib/api/subjects.ts` que lleva `status` y se lanza
    en las mutaciones nuevas; la UI hace `error instanceof ApiError && error.status === 409`
    para mostrar el `toast.error` de conflicto correcto.
  - Confirmaciones de borrado (asignatura y tema) con el nuevo `AlertDialog` de shadcn
    (`npx shadcn@latest add alert-dialog` — el generador escribió por error
    `import { cn } from "cn"` en vez de `@/lib/utils` como el resto de `components/ui/*`;
    se corrigió y se desinstaló la dependencia `cn` que había quedado sin uso). No se ha
    retro-aplicado a los borrados de PDFs existentes (T-06..T-09), tal y como pedía el
    enunciado de T-18.
  - Enlazada desde `dataAdminPanel.adminPanel` en `components/app-sidebar.tsx` ("Asignaturas")
    y como tercera tarjeta en `app/dashboard/admin/page.tsx`.

- **T-19 · ✅ HECHO — Admin de usuarios (adaptado, no reescrito de cero).**
  `app/dashboard/admin/users/page.tsx` ya no llama a `/auth/change-role` (no existe en
  `api-docs.json`) ni mantiene el shape viejo `{email, role}`. Nuevo `lib/api/users.ts`
  (`getAllUsers` → `GET /auth/all-users`, vía `apiClient`, no `authFetch` — el token ya se
  inyecta solo) + hook `useAllUsers()` en `hooks/api/use-users.ts`
  (`queryKeys.users.all()`, añadida a `lib/query/keys.ts`). La tabla ahora muestra las
  columnas de `UserDTO`: usuario (`username`), correo, nombre completo (`firstName`+
  `lastName`), rol, estado activo/inactivo (`enabled`) y fecha de alta (`createdAt`).
  **Decisión de implementación:** el rol pasa a ser un `Badge` de solo lectura con un
  `Tooltip` ("La gestión de roles se hace desde Keycloak") en vez del combobox que llamaba
  al endpoint inexistente; no se ha inventado ningún endpoint puente. Esto resuelve la
  pregunta abierta de la §6 de más abajo.

### Fase 4 — PDFs vía S3 y pulido

- **T-20 · Visor de PDF embebido desde S3.** Hoy `PDFCard` hace `<a href={url} target="_blank">`.
  Cuando el backend sirva los PDFs embebidos desde S3 (¿presigned URL / endpoint proxy?), adaptar:
  probablemente pedir la URL/recurso bajo demanda y mostrarlo en un visor embebido en vez de
  enlazar. Confirmar el mecanismo exacto con backend antes de implementar.

- **T-21 · ✅ HECHO — Chatbot.** `components/chat-widget.tsx` ya enviaba el `ChatRequest`
  correcto; ahora también lee `relevantResources` y `status` de la respuesta:
  - Nuevo `lib/api/chatbot.ts` (`sendChatMessage(body: ChatRequest): Promise<ChatResponse>`)
    + hook `useSendChatMessage()` en `hooks/api/use-chatbot.ts`, sustituyendo el `authFetch`
    directo (el token, si hay sesión, lo inyecta `apiClient` solo). No hacía falta manejar
    streaming, así que la modernización no complicó el estado de carga existente.
  - Si `status === "ERROR"`, se trata como fallo (mismo `toast.error` + mensaje de error que
    ya usaba el `catch`) aunque el HTTP sea 200.
  - Si `relevantResources` no viene vacío, se muestran debajo del mensaje del asistente como
    una lista de enlaces pequeños (icono según `type`: `FileText` para PDF, `BookOpen` para
    BLOG_POST, `Link2` para PAGE). **Decisión:** se usa `next/link` cuando la URL empieza
    por `/` (interna) y `<a target="_blank">` en cualquier otro caso, ya que `api-docs.json`
    no especifica el formato exacto de `ChatResource.url`.
  - El rate-limit por `localStorage` se mantiene sin cambios, tal y como permitía el
    enunciado.

- **T-22 · ✅ HECHO — Contacto/Mail.** El shape que ya enviaba `contact-us` contra
  `POST /mail/send` era correcto (`{from?, subject, body}`); solo se modernizó el cliente:
  nuevo `lib/api/mail.ts` (`sendMail(body: Mail)`) + hook `useSendMail()` en
  `hooks/api/use-mail.ts`, sustituyendo el `authFetch` directo en
  `app/dashboard/contact/contact-us/page.tsx` por la misma mutación de TanStack Query que
  usa el resto de la app.

---

## 5. Orden sugerido de ejecución
1. ~~**Fase 0** (T-01…T-04) — cimientos.~~ ✅ Hecho.
2. ~~**T-13** (mock auth completo, admin/usuario/anónimo).~~ ✅ Hecho — desbloquea todo lo
   autenticado sin esperar a Keycloak.
3. ~~**Fase 1** (T-06…T-09: Subjects/Units + PDFs)~~ ✅ Hecho — sobre el API tal cual está hoy
   en `api-docs.json` (sin S3, eso es T-20/Fase 4 y sigue sin tocarse).
4. ~~**Fase 2 real (T-10, T-11, T-12, T-14)**~~ ✅ Resuelta vía PR #195 (Keycloak real) +
   integración del selector `NEXT_PUBLIC_AUTH_MODE` (fusionado en `feat-192`). Mock (T-13) y
   Keycloak real conviven detrás de la misma interfaz — ver el resumen del merge más arriba.
5. ~~**Fase 3**~~ (perfil, contenido, quizzes, admin de asignaturas/usuarios) ✅ Completa:
   ~~T-18 (admin de asignaturas) y T-19 (admin de usuarios)~~, ~~T-16 (perfil)~~, ~~T-17
   (cuestionarios, partes 1 y 2)~~ y ~~T-15 (deduplicar blog del feed)~~ — todas hechas.
6. ~~**Fase 4**~~ (chatbot, mail) — ~~T-21 (chatbot)~~ y ~~T-22 (mail)~~ ✅ Hechas, sin
   esperar al resto de la fase ya que no dependían de S3. Queda **T-20** (PDFs vía S3),
   bloqueada hasta que backend defina el mecanismo — no se toca.

## 6. Decisiones abiertas (para backend/producto)
- ~~**T-10:** modelo Keycloak~~ **Resuelto** (PR #195): directo (Auth.js + provider Keycloak),
  cliente público + PKCE, ver T-10 arriba.
- ~~**T-19:** ¿cómo se cambian roles ahora?~~ **Resuelto** (T-19): el frontend ya no cambia
  roles (se quitó el combobox que llamaba a `/auth/change-role`, inexistente); se muestra
  como `Badge` de solo lectura con nota de que se gestiona desde Keycloak. Sigue abierto si
  hace falta un endpoint puente en el futuro, pero no bloquea nada hoy.
- **T-20:** mecanismo exacto de servido de PDFs desde S3 (presigned vs proxy; embebido). **No
  se toca todavía** — los PDFs se siguen sirviendo como `link` directo, tal cual lo modela
  `PDFDto` en `api-docs.json` hoy.
- `/public/auth/login`/`/public/auth/create` (los del backend, no Keycloak) quedan sin uso
  ahora que el login real pasa por Keycloak directamente — confirmar con backend si se
  retiran del OpenAPI o si tienen otro propósito (¿sincronizar el `UserAccountDto` local del
  backend con el usuario de Keycloak en el primer login, vía `GET /me`?).
