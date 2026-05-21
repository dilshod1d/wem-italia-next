"use client";

import { PortfolioResultsHybridSection } from "../sections/portfolio-results";
import { useLandingRuntime } from "./landing-runtime";

export function PortfolioResultsSectionSlot() {
  const { setLogoTheme, markSectionActive, getVideoPreloadStrategy } =
    useLandingRuntime();

  return (
    <PortfolioResultsHybridSection
      setLogoTheme={setLogoTheme}
      onSectionActive={() => markSectionActive(4)}
      preloadStrategy={getVideoPreloadStrategy(4)}
    />
  );
}
