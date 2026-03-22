// Cada 30-90segundos, guarda una entrada basura de 50-200KB en indexedDB

import { useEffect } from "react";

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomData = (sizeInKB: number) => {
  const sizeInBytes = sizeInKB * 1024;
  const randomData = new Uint8Array(sizeInBytes);
  crypto.getRandomValues(randomData);
  return randomData;
};

export function useIndexedDBLoad(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const dbName = "PowerUserDB";
    const storeName = "RandomDataStore";

    const openDB = () => {
      const request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { autoIncrement: true });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        const sizeInKB = getRandomInt(50, 200);
        const randomData = generateRandomData(sizeInKB);
        store.add(randomData);

        transaction.oncomplete = () => {
          db.close();
        };
      };

      request.onerror = () => {
        console.error("Error opening IndexedDB:", request.error);
      };
    };

    const intervalId = setInterval(openDB, getRandomInt(30000, 90000)); // Cada 30-90 segundos

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled]);
}
