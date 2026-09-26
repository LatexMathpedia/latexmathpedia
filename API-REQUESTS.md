# Peticiones al backend derivadas del rediseño de frontend

Escrito para: quien mantenga/priorice el backend (Diego / equipo backend), a partir del
análisis de `MIGRATION.md` y `UI-RESTRUCTURE.md`. Ninguno de estos puntos bloquea empezar
la migración: son mejoras que evitarían trabajo extra o llamadas redundantes en el
frontend. Contrastado contra `api-docs.json` (OpenAPI actual).

---

## 1. Contadores en `SubjectDto` / `SubjectUnitDto`

**Por qué:** el catálogo de asignaturas (`/dashboard/subjects`) y el acordeón de temas
(`/dashboard/subjects/[id]`) quieren mostrar "12 PDFs · 3 cuestionarios" en la tarjeta/fila
**sin** tener que pedir `/subject/{id}/pdfs` + `/subject/{id}/quizzes` de cada asignatura
solo para contar `.length`.

**Petición:** añadir a `SubjectDto` (y opcionalmente `SubjectUnitDto`) algo como:
```json
{ "pdfCount": 12, "quizCount": 3, "unitCount": 5 }
```

## 2. Número de preguntas en `QuizDto`

**Por qué:** la tarjeta de cuestionario en el feed y la ficha (`/dashboard/quizzes/[id]`)
quieren mostrar "10 preguntas" / "~15 min" sin pedir `GET /quiz/{id}/questions` completo
solo para contar.

**Petición:** añadir `questionCount: number` a `QuizDto` (no solo a
`QuizForAttemptDto`/exportable, donde ya se puede derivar de `questions.length`).

## 3. "¿Este usuario ya intentó este quiz?" sin traer todo el histórico

**Por qué:** en la ficha de un cuestionario (`/dashboard/quizzes/[id]`) queremos mostrar
"Tu mejor puntuación: 8/10" o "Aún no lo has intentado". Hoy la única forma es
`GET /quiz/{id}/attempts` (que **según el OpenAPI devuelve los intentos de "el" usuario
autenticado para ese quiz" — a confirmar, el summary dice "Obtiene los intentos de un
cuestionario", ambiguo entre "todos los intentos de todos" y "los míos") y quedarse solo
con el mejor. Si esa lista puede ser grande (muchos usuarios resolviendo el mismo quiz),
sería mejor:

**Petición:** clarificar el alcance de `GET /quiz/{id}/attempts` (¿del usuario autenticado
o de todos? si es "de todos", debería requerir rol ADMIN, no estar en la sección general de
"Quiz") y, si hace falta, añadir un endpoint ligero tipo
`GET /quiz/{id}/my-best-attempt` → `QuizAttemptDto | null`.

## 4. Búsqueda server-side (a futuro, si el catálogo crece)

**Por qué:** hoy el buscador del frontend filtra en cliente sobre la lista completa de
PDFs/quizzes cargada. Es razonable mientras el catálogo sea de cientos de elementos, pero
no escala indefinidamente, y con 3 tipos de contenido mezclados en el feed el filtrado en
cliente se complica.

**Petición (no urgente):** endpoint de búsqueda simple, p. ej.
`GET /pdf/search?q=` y `GET /public/quiz/search?q=` (o uno combinado
`GET /search?q=&type=pdf,quiz`), devolviendo los DTOs ya existentes. Se puede posponer
hasta que el volumen lo justifique.

## 5. Subida real de PDFs (S3) — endpoint de creación distinto al actual

**Por qué:** `CreatePDFDto`/`UpdatePDFDto` hoy reciben un campo `link` de tipo string libre
(se asume que hoy se pega una URL de Drive a mano). Si los PDFs van a servirse embebidos
desde S3, el admin necesitará **subir el archivo**, no pegar un link.

**Petición:** confirmar el flujo exacto y, si aplica, un endpoint tipo
`POST /pdf/upload` (`multipart/form-data`) que devuelva la clave/URL de S3 a usar luego en
`CreatePDFDto.link`, o que `CreatePDFDto` acepte directamente el archivo. Afecta
directamente a `MIGRATION.md` T-09 y T-20 — es la pieza más urgente de aclarar de esta
lista si el cambio a S3 va antes que el resto.

## 6. Mecanismo de visualización embebida del PDF

**Por qué:** para embeber un PDF servido desde S3 en el navegador (en vez de
`<a href target="_blank">` a una URL pública de Drive), el frontend necesita saber si:
- `PDFDto.link` pasa a ser una URL firmada (presigned, con expiración) que se puede usar
  directamente en un `<iframe>`/visor, o
- hay que pedir la URL bajo demanda a un endpoint tipo `GET /pdf/{id}/view-url` que la
  genere en el momento (para no cachear una URL firmada que caduca).

**Petición:** aclarar esto antes de tocar `PDFCard`/`PDFAccordionCard` (T-20 en
`MIGRATION.md`).

## 7. Rol de usuario: cómo se gestiona tras quitar `/auth/change-role`

**Por qué:** `app/dashboard/admin/users/page.tsx` usa hoy `POST /auth/change-role`, que
**no existe** en `api-docs.json`. `GET /auth/all-users` sigue existiendo (`UserDTO` con
campo `role`), pero no hay forma de cambiarlo desde este backend.

**Petición:** confirmar si el cambio de rol pasa a gestionarse **desde Keycloak**
directamente (grupos/roles de Keycloak) y, si es así, si hace falta algún endpoint puente
en este backend para que el admin de Mathtexpedia no tenga que entrar a la consola de
Keycloak a mano. Bloquea `MIGRATION.md` T-19.

## 8. Alcance real de `GET /public/quiz` vs. `/subject/.../quizzes`

**Por qué:** `/public/quiz` (tag "Cuestionarios públicos") no requiere auth y no aparece
acotado por asignatura; `/subject/{id}/quizzes` y `/subject/unit/{id}/quizzes` sí requieren
autenticación aunque no rol ADMIN. Para el catálogo `/dashboard/quizzes` (pensado para
verse igual que el blog, público) conviene saber si `/public/quiz` devuelve **todos** los
quizzes o si hay algún criterio de "publicado"/visibilidad que distinga lo que se puede
listar sin sesión.

**Petición:** confirmar semántica de "público" para quizzes (¿todos los quizzes son
públicos para listar, y solo `/attempt`+`/submit` requieren sesión? ¿o hay un flag de
visibilidad que falta en el DTO?).

## 9. Paginación en listados que hoy no la tienen

**Por qué:** `GET /subject`, `GET /pdf`, `GET /public/pdf/no-link`, `GET /public/quiz`
devuelven arrays completos sin paginar. Con `/attempts` ya se ve el patrón `Pageable` +
`PageQuizAttemptDto` del backend — sería consistente aplicar lo mismo a estos listados
cuando el catálogo crezca (hoy no es bloqueante, el volumen es pequeño).

**Petición (no urgente):** si se prevé que el catálogo de PDFs/quizzes crezca mucho,
paginar estos endpoints con el mismo patrón `Pageable`/`Page*Dto` ya usado en `/attempts`,
para no tener que migrarlo dos veces.

---

## Resumen de prioridad

| # | Tema | Urgencia |
|---|---|---|
| 5, 6 | Subida y visualización de PDFs vía S3 | **Alta** — bloquea T-09/T-20 de `MIGRATION.md` |
| 7 | Cambio de rol tras quitar `/auth/change-role` | **Alta** — bloquea T-19 |
| 8 | Semántica de "público" en quizzes | Media — antes de construir `/dashboard/quizzes` |
| 3 | Mejor intento por usuario/quiz | Media — mejora la ficha de quiz, no la bloquea |
| 1, 2 | Contadores en Subject/Quiz DTOs | Baja — evita N+1, no bloquea nada |
| 4, 9 | Búsqueda y paginación server-side | Baja — solo si el volumen de datos crece |
