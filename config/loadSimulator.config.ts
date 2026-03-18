export const LOAD_SIMULATOR_CONFIG = {
  cpu: 60, // % de ocupación del worker (0-100)
  memoryMB: 1024, // MB a reservar en el worker
  workers: 2, // número de workers en paralelo
} as const;
