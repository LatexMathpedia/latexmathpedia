// El body de error que documenta api-docs.json para varios 409/401 reutiliza por error el
// DTO de éxito del recurso como schema de error; lo único fiable para distinguir esos casos
// (p. ej. un 409 de conflicto) es el status HTTP de la respuesta, así que lo llevamos aquí.
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
