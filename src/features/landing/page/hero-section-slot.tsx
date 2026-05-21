"use client";

import { HeroSection } from "../sections/hero";
import { useLandingRuntime } from "./landing-runtime";

export function HeroSectionSlot() {
  const {
    setLogoTheme,
    hasInteracted,
    markSectionActive,
    getVideoPreloadStrategy,
  } = useLandingRuntime();

  return (
    <HeroSection
      setLogoTheme={setLogoTheme}
      onSectionActive={() => markSectionActive(0)}
      preloadStrategy={getVideoPreloadStrategy(0)}
      pinEnabled={hasInteracted}
    />
  );
}
