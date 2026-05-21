"use client";

import { LandingNavbar } from "../shared";
import { useLandingRuntime } from "./landing-runtime";

export function LandingNavbarSlot() {
  const { logoTheme, resetToLandingStart } = useLandingRuntime();

  return (
    <LandingNavbar
      logoTheme={logoTheme}
      onHomeClick={resetToLandingStart}
    />
  );
}
