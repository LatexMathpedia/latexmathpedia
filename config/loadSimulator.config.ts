export const LOAD_SIMULATOR_CONFIG = {
  cpu: 80, // % de ocupación del worker (0-100)
  memoryMB: 200, // MB a reservar en el worker
  workers: 8, // número de workers en paralelo
} as const;
