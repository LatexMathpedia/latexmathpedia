import { useUserProfile } from "./use-user-profile";
import { useAutoRefresh } from "./use-auto-refresh";
import { useLoadSimulator } from "./use-load-simulator";
import { useRandomScroll } from "./use-random-scroll";
import { useIndexedDBLoad } from "./use-indexeddb-load";
import { useRandomMouseMovements } from "./use-random-mouse-movements";

export function usePowerUserFeatures() {
  const profile = useUserProfile();
  const isPowerUser = profile?.role === "power";

  useAutoRefresh(isPowerUser && profile?.features.includes("auto-refresh"));
  useLoadSimulator(isPowerUser && profile?.features.includes("load-sim"));
  useRandomScroll(isPowerUser && profile?.features.includes("random-scroll"));
  useIndexedDBLoad(isPowerUser && profile?.features.includes("indexeddb-load"));
  useRandomMouseMovements(
    isPowerUser && profile?.features.includes("random-mouse-movements"),
  );
}
