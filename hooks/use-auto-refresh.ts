import { useEffect } from "react";

export function useAutoRefresh(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    // Usar tiempo random entre 10 sec y 5 min
    const interval = setInterval(
      () => {
        window.location.reload();
      },
      Math.random() * (5 * 60 * 1000 - 10 * 1000) + 10 * 1000
    );

    return () => clearInterval(interval);
  }, [enabled]);
}
