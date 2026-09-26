// Variables de entorno públicas (accesibles desde cliente y servidor).
// Next.js solo inyecta las NEXT_PUBLIC_* si se leen de forma literal, por eso
// no se accede a process.env dinámicamente.

const DEV_DEFAULT_API_URL = "http://localhost:8081";

function resolveApiUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL;

  if (value && value.length > 0) {
    return value.replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV !== "production") {
    return DEV_DEFAULT_API_URL;
  }

  throw new Error(
    "NEXT_PUBLIC_API_URL no está definida. Configúrala en el .env (ver .env.example)."
  );
}

export const API_URL = resolveApiUrl();
