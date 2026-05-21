"use client";

import { WhyWemWorksSection } from "../sections/why-wem-works";
import { useLandingRuntime } from "./landing-runtime";

export function WhyWemWorksSectionSlot() {
  const { setLogoTheme, markSectionActive, getVideoPreloadStrategy } =
    useLandingRuntime();

  return (
    <WhyWemWorksSection
      setLogoTheme={setLogoTheme}
      onSectionActive={() => markSectionActive(1)}
      preloadStrategy={getVideoPreloadStrategy(1)}
    />
  );
}
