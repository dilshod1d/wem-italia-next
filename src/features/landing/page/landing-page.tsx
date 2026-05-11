"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useDynamicViewportHeight } from "../engine";
import { FooterSection } from "../sections/footer";
import { HeroSection } from "../sections/hero";
import { HowItWorksSection } from "../sections/how-it-works";
import { PortfolioResultsHybridSection } from "../sections/portfolio-results";
import { SystemFlowSection } from "../sections/system-flow";
import { WhoWeSupportSection } from "../sections/who-we-support";
import { WhyWemWorksSection } from "../sections/why-wem-works";
import { LandingNavbar } from "../shared";

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
  const [logoTheme, setLogoTheme] = useState<"light" | "dark">("light");

  const refreshScrollTriggers = useCallback(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  useDynamicViewportHeight(undefined, {
    onHeightChange: refreshScrollTriggers,
  });

  const resetScrollPosition = useCallback(() => {
    ScrollTrigger.clearScrollMemory("manual");
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const resetToLandingStart = useCallback(() => {
    setLogoTheme("light");
    resetScrollPosition();
  }, [resetScrollPosition]);

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";
    resetScrollPosition();

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [resetScrollPosition]);

  return (
    <>
      <LandingNavbar logoTheme={logoTheme} onHomeClick={resetToLandingStart} />
      <main className="relative bg-background">
        <HeroSection setLogoTheme={setLogoTheme} />
        <WhyWemWorksSection setLogoTheme={setLogoTheme} />
        <SystemFlowSection setLogoTheme={setLogoTheme} />
        <HowItWorksSection setLogoTheme={setLogoTheme} />
        <PortfolioResultsHybridSection setLogoTheme={setLogoTheme} />
        <WhoWeSupportSection />
        <FooterSection setLogoTheme={setLogoTheme} />
      </main>
    </>
  );
}
