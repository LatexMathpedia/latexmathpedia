type WorkerMessage =
  | {
      type: "start";
      cpuPercent: number;
      burstMinMs: number;
      burstMaxMs: number;
      idleMinMs: number;
      idleMaxMs: number;
      chunkMinMB: number;
      chunkMaxMB: number;
      memoryCapMB: number;
    }
  | { type: "stop" };

let running = false;
const memoryBuckets: Float64Array[] = [];
let totalAllocatedMB = 0;

function burnCPU(ms: number) {
  const end = performance.now() + ms;
  let x = 0;
  while (performance.now() < end) {
    x = Math.sqrt(Math.random()) * Math.PI + Math.sin(x);
  }
  return x;
}

function allocateChunk(mb: number, cap: number) {
  if (totalAllocatedMB + mb > cap) return;
  const elements = mb * 131072; // 1 MB = 131072 Float64
  const bucket = new Float64Array(elements);
  bucket.fill(Math.random());
  memoryBuckets.push(bucket);
  totalAllocatedMB += mb;
}

function freeSomeMemory() {
  if (memoryBuckets.length > 3 && Math.random() < 0.35) {
    memoryBuckets.shift();
    totalAllocatedMB = Math.max(0, totalAllocatedMB - 30);
  }
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  if (e.data.type === "stop") {
    running = false;
    memoryBuckets.length = 0;
    totalAllocatedMB = 0;
    return;
  }

  if (e.data.type === "start") {
    running = true;
    const {
      cpuPercent,
      burstMinMs,
      burstMaxMs,
      idleMinMs,
      idleMaxMs,
      chunkMinMB,
      chunkMaxMB,
      memoryCapMB,
    } = e.data;

    const loop = () => {
      if (!running) return;

      // === BURST (usa los valores de config) ===
      const burstMs = burstMinMs + Math.random() * (burstMaxMs - burstMinMs);
      const chunkMB = chunkMinMB + Math.random() * (chunkMaxMB - chunkMinMB);

      allocateChunk(chunkMB, memoryCapMB);
      burnCPU(burstMs * (cpuPercent / 100));

      // === IDLE ===
      const idleMs = idleMinMs + Math.random() * (idleMaxMs - idleMinMs);
      freeSomeMemory();

      setTimeout(loop, idleMs);
    };

    // Pequeño retraso inicial aleatorio para que ni siquiera el primer burst sea sincronizado
    setTimeout(loop, Math.random() * 300);
  }
};
