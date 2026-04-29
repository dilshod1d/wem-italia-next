"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { HeroSection } from "./sections/hero-section";
import { HowItWorksSection } from "./sections/how-it-works-section";
import { LandingNavbar } from "./landing-navbar";
import { FooterSection } from "./sections/footer-section";
import { PortfolioResultsHybridSection } from "./sections/portfolio-results-hybrid-section";
import { SystemFlowSection } from "./sections/system-flow-section";
import { WhoWeSupportSection } from "./sections/who-we-support-section";
import { WhyWemWorksSection } from "./sections/why-wem-works-section";

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
  const [logoTheme, setLogoTheme] = useState<"light" | "dark">("light");

  // const resetScrollPosition = useCallback(() => {
  //   ScrollTrigger.clearScrollMemory("manual");
  //   window.scrollTo(0, 0);
  //   requestAnimationFrame(() => ScrollTrigger.refresh());
  // }, []);

  // const resetToLandingStart = useCallback(() => {
  //   setLogoTheme("light");
  //   resetScrollPosition();
  // }, [resetScrollPosition]);

  // useLayoutEffect(() => {
  //   const previousScrollRestoration = window.history.scrollRestoration;

  //   window.history.scrollRestoration = "manual";
  //   resetScrollPosition();

  //   return () => {
  //     window.history.scrollRestoration = previousScrollRestoration;
  //   };
  // }, [resetScrollPosition]);

  return (
    <>
      <LandingNavbar logoTheme={logoTheme} onHomeClick={() => {}} />
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
