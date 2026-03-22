// Cada 10-40 segundos, mueve entre 1-6 píxeles el ratón en una dirección aleatoria (horizontal o vertical)

import { useEffect } from "react";

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const moveMouseRandomly = () => {
  const xMovement = getRandomInt(-6, 6);
  const yMovement = getRandomInt(-6, 6);
  window.scrollBy(xMovement, yMovement);
};

export function useRandomMouseMovements(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(
      () => {
        moveMouseRandomly();
      },
      getRandomInt(10000, 40000),
    ); // 10-40 segundos

    return () => clearInterval(interval);
  }, [enabled]);
}
