type WorkerMessage =
  | { type: "start"; cpu: number; memoryMB: number }
  | { type: "stop" };

let running = false;
const memoryBuckets: Float64Array[] = [];

function burnCPU(durationMs: number) {
  const end = performance.now() + durationMs;
  let x = 0;
  while (performance.now() < end) {
    x = Math.sqrt(Math.random()) * Math.PI;
  }
  return x; // evita que el compilador optimice el bucle
}

function allocateMemory(mb: number) {
  const elementsPerMB = 131_072;
  const bucket = new Float64Array(mb * elementsPerMB);
  bucket.fill(1.23456);
  memoryBuckets.push(bucket);
}

function freeMemory() {
  memoryBuckets.length = 0;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data;

  if (msg.type === "stop") {
    running = false;
    freeMemory();
    return;
  }

  if (msg.type === "start") {
    running = true;
    allocateMemory(msg.memoryMB);

    const cycleDurationMs = 100;

    const loop = () => {
      if (!running) return;

      const burnMs = (msg.cpu / 100) * cycleDurationMs;
      const sleepMs = cycleDurationMs - burnMs;

      burnCPU(burnMs);

      setTimeout(loop, sleepMs);
    };

    loop();
  }
};
