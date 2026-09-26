import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Sin `apiKey` no hay forma de inicializar Firebase de verdad. Antes esto se daba por
// hecho (con `!`) y `getAuth()` reventaba en cuanto faltaba la variable — incluida
// durante `next build` (prerender de /auth/login), tumbando el build entero en
// cualquier entorno sin credenciales de Firebase configuradas (CI, checkout limpio...).
// Con el login por Google pendiente de revisión de todos modos (ver MIGRATION.md T-14,
// depende de Keycloak), degradamos con gracia: `auth` queda `undefined` y quien lo use
// (solo `login-form.new.tsx`, dentro de un try/catch) falla con un toast, no con un crash.
const hasFirebaseConfig = Boolean(firebaseConfig.apiKey);

let app: FirebaseApp | undefined;
export let auth: Auth | undefined;

if (hasFirebaseConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
} else if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  console.warn(
    "Firebase no está configurado (falta NEXT_PUBLIC_FIREBASE_API_KEY); el login con Google está deshabilitado."
  );
}
