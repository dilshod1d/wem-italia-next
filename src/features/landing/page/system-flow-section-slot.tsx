"use client";

import { SystemFlowSection } from "../sections/system-flow";
import { useLandingRuntime } from "./landing-runtime";

export function SystemFlowSectionSlot() {
  const { setLogoTheme, markSectionActive, getVideoPreloadStrategy } =
    useLandingRuntime();

  return (
    <SystemFlowSection
      setLogoTheme={setLogoTheme}
      onSectionActive={() => markSectionActive(2)}
      preloadStrategy={getVideoPreloadStrategy(2)}
    />
  );
}
