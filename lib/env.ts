const DEV_DEFAULT_API_URL = "http://localhost:8081";

function resolveApiUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL;

  if (value && value.length > 0) {
    return value;
  }

  if (process.env.NODE_ENV !== "production") {
    return DEV_DEFAULT_API_URL;
  }

  throw new Error(
    "NEXT_PUBLIC_API_URL no está definida. Configúrala en el entorno (ver .env.example)."
  );
}

export const API_URL = resolveApiUrl();
