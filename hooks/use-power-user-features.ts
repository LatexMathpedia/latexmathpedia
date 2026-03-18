import { useUserProfile } from "./use-user-profile";
import { useAutoRefresh } from "./use-auto-refresh";
import { useLoadSimulator } from "./use-load-simulator";

export function usePowerUserFeatures() {
  const profile = useUserProfile();
  const isPowerUser = profile?.role === "power";

  useAutoRefresh(isPowerUser && profile?.features.includes("auto-refresh"));
  useLoadSimulator(isPowerUser && profile?.features.includes("load-sim"));
}
