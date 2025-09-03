# Endpoints de la API

## Auth

### `POST /auth/login`
- **Body:**  
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Descripción:** Inicia sesión y devuelve un JWT en una cookie.

---

### `POST /auth/create`
- **Body:**  
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Descripción:** Crea un nuevo usuario.

---

### `POST /auth/reset-password`
- **Body:**  
  ```json
  {
    "email": "string"
  }
  ```
- **Descripción:** Envía un correo para restablecer la contraseña.

---

### `POST /auth/change-role`
- **Headers:** JWT en cookie  
- **Body:**  
  ```json
  {
    "email": "string",
    "role": "user | admin | moderator"
  }
  ```
- **Descripción:** Cambia el rol de un usuario (solo admin/moderador).

---

### `GET /auth/validate`
- **Headers:** JWT en cookie  
- **Descripción:** Valida el token y devuelve el userId.

---

### `GET /auth/is-admin`
- **Headers:** JWT en cookie  
- **Descripción:** Devuelve `true` si el usuario es admin.

---

## PDFs

### `GET /pdfs/no-link`
- **Descripción:** Devuelve todos los PDFs sin el campo `pdf_link`.

---

### `GET /pdfs`
- **Headers:** JWT en cookie  
- **Descripción:** Devuelve todos los PDFs.

---

### `GET /pdfs/pdf?pdfName=string`
- **Headers:** JWT en cookie  
- **Query:**  
  - `pdfName`: nombre del PDF  
- **Descripción:** Devuelve un PDF por nombre.

---

### `POST /pdfs/create`
- **Headers:** JWT en cookie  
- **Body:**  
  ```json
  {
    "name": "string",
    "link": "string",
    "imageLink": "string",
    "pdfTag": "AC | AG | TE | EM | PE | OP | FA | EL | AS | IP | BD | WI | SI",
    "description": "string (opcional)"
  }
  ```
- **Descripción:** Crea un nuevo PDF (solo admin/moderador).

---

### `DELETE /pdfs/delete?pdfName=string`
- **Headers:** JWT en cookie  
- **Query:**  
  - `pdfName`: nombre del PDF  
- **Descripción:** Elimina un PDF por nombre (solo admin/moderador).

---

### `PATCH /pdfs/update?pdfName=string`
- **Headers:** JWT en cookie  
- **Query:**  
  - `pdfName`: nombre del PDF  
- **Body:**  
  ```json
  {
    "name": "string",
    "link": "string",
    "imageLink": "string",
    "pdfTag": "AC | AG | TE | EM | PE | OP | FA | EL | AS | IP | BD | WI | SI",
    "description": "string (opcional)"
  }
  ```
- **Descripción:** Actualiza un PDF (solo admin/moderador).

---

## Cron

### `GET /cron/endpoints`
- **Descripción:** Devuelve la lista de endpoints disponibles.

---

## Otros

### `/`
- **GET:** Devuelve "Hello World!"

---

> **Nota:** Los endpoints protegidos requieren JWT en la cookie. Los roles válidos son: `user`, `admin

El campo pdfTag en los endpoints relacionados con PDFs es una etiqueta que clasifica el PDF según su área temática. Los valores posibles para pdfTag son:

AC: Álgebra y Cálculo
AG: Álgebra General
TE: Teoría
EM: Ecuaciones y Modelos
PE: Problemas y Ejercicios
OP: Optimización
FA: Física Aplicada
EL: Electrónica
AS: Astronomía
IP: Ingeniería de Procesos
BD: Bases de Datos
WI: Web e Internet
SI: Sistemas de Informació