import { useEffect } from "react";

export function useAutoRefresh(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    // Usar tiempo random entre 10 y 20 segundos
    const interval = setInterval(
      () => {
        window.location.reload();
      },
      Math.random() * 10000 + 10000,
    );

    return () => clearInterval(interval);
  }, [enabled]);
}
