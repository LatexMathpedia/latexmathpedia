// Cada X tiempo aleatorio, se hace un ligero scroll
import { useEffect } from "react";

export function useRandomScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(
      () => {
        const scrollAmount = Math.random() * 20 - 10;
        window.scrollBy(0, scrollAmount);
      },
      Math.random() * 100000 + 5000,
    ); // Intervalo entre 5 y 105 segundos

    return () => clearInterval(interval);
  }, [enabled]);
}
