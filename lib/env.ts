const DEV_DEFAULT_API_URL = "http://localhost:8081";

function resolveApiUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL;

  if (value && value.length > 0) {
    return value;
  }

  // No lanzar nunca en build/prerender (SSR/SSG) ni en servidor: reventaría `next build`
  // o cualquier página server-rendered en cuanto faltase la variable, incluida en CI.
  // Solo avisamos en el navegador y en producción, sin romper nada.
  if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
    console.warn(
      "NEXT_PUBLIC_API_URL no está definida; usando el valor por defecto de desarrollo " +
        `(${DEV_DEFAULT_API_URL}). Configúrala en el entorno (ver .env.example).`
    );
  }

  return DEV_DEFAULT_API_URL;
}

export const API_URL = resolveApiUrl();
