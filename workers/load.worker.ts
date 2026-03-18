type WorkerMessage =
  | { type: "start"; cpu: number; memoryMB: number }
  | { type: "stop" };

// Función para generar tiempo aleatorio entre 1segundo y 20 segundos
function randomDuration() {
  return 1000 + Math.random() * 19_000;
}

// Función para generar sleep aleatorio entre 0 y 5 segundos
function randomSleep() {
  return Math.random() * 5000;
}

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

    const cycleDurationMs = randomDuration();

    const loop = () => {
      if (!running) return;

      const sleepMs = randomSleep();
      const burnMs = cycleDurationMs - sleepMs;

      burnCPU(burnMs);

      setTimeout(loop, sleepMs);
    };

    loop();
  }
};
