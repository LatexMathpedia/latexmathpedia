export const LOAD_SIMULATOR_CONFIG = {
  maxWorkers: 6, // máximo simultáneos (nunca 8)
  cpuBurstPercent: 95, // durante el burst
  burstDurationMs: [800, 3500], // entre 0.8 y 3.5 segundos de quema
  idleDurationMs: [8000, 45000], // 8–45 segundos de descanso
  memoryPerBurstMB: [15, 45], // solo 15–45 MB extra por burst
  totalMemoryCapMB: 450, // límite global para no explotar
} as const;
