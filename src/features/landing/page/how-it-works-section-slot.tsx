"use client";

import { HowItWorksSection } from "../sections/how-it-works";
import { useLandingRuntime } from "./landing-runtime";

export function HowItWorksSectionSlot() {
  const { setLogoTheme, markSectionActive, getVideoPreloadStrategy } =
    useLandingRuntime();

  return (
    <HowItWorksSection
      setLogoTheme={setLogoTheme}
      onSectionActive={() => markSectionActive(3)}
      preloadStrategy={getVideoPreloadStrategy(3)}
    />
  );
}
