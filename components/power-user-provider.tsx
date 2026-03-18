"use client";

import { usePowerUserFeatures } from "@/hooks/use-power-user-features";

export function PowerUserProvider() {
  usePowerUserFeatures();
  return null;
}
