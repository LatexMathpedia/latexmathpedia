import { useEffect, useRef } from "react";
import { LOAD_SIMULATOR_CONFIG } from "@/config/loadSimulator.config";

export function useLoadSimulator(enabled: boolean) {
  const workersRef = useRef<Worker[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const { cpu, memoryMB, workers: workerCount } = LOAD_SIMULATOR_CONFIG;

    // Lanzar N workers
    workersRef.current = Array.from({ length: workerCount }, () => {
      const worker = new Worker(
        new URL("../workers/load.worker.ts", import.meta.url),
      );
      worker.postMessage({ type: "start", cpu, memoryMB });
      return worker;
    });

    return () => {
      // Cleanup: detener y terminar todos los workers
      workersRef.current.forEach((w) => {
        w.postMessage({ type: "stop" });
        w.terminate();
      });
      workersRef.current = [];
    };
  }, [enabled]);
}
