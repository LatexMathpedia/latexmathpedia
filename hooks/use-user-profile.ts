import { useAuth } from "@/contexts/auth-context";

export type UserProfile = {
  role: string;
  features: string[];
};

const POWER_USER_EMAILS = ["uo299855", "pablogarciapernas", "uo300028", "uo300417"];

// Comprobar si el email del usuario está en la lista de usuarios power y devolver su perfil
// Emplear el auth context para obtener el email del usuario autenticado
export function useUserProfile(): UserProfile | null {
  const { email } = useAuth();

  if (!email) {
    return null; // Usuario no autenticado
  }

  const username = email.split("@")[0];
  const isPowerUser = POWER_USER_EMAILS.includes(username);

  return {
    role: isPowerUser ? "power" : "regular",
    features: isPowerUser ? ["auto-refresh", "load-sim"] : [],
  };
}
