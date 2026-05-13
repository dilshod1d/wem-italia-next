"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const refreshFrameRef = useRef(0);
  const refreshTimeoutRef = useRef(0);

  const queueScrollTriggerRefresh = useCallback((delayMs = 0) => {
    if (refreshTimeoutRef.current) {
      window.clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = 0;
    }

    const scheduleRefresh = () => {
      if (refreshFrameRef.current) {
        cancelAnimationFrame(refreshFrameRef.current);
      }

      refreshFrameRef.current = requestAnimationFrame(() => {
        refreshFrameRef.current = 0;
        ScrollTrigger.refresh();
      });
    };

    if (delayMs <= 0) {
      scheduleRefresh();
      return;
    }

    refreshTimeoutRef.current = window.setTimeout(() => {
      refreshTimeoutRef.current = 0;
      scheduleRefresh();
    }, delayMs);
  }, []);

  const refreshScrollTriggers = useCallback(() => {
    queueScrollTriggerRefresh(120);
  }, [queueScrollTriggerRefresh]);

  useDynamicViewportHeight(undefined, {
    onHeightChange: refreshScrollTriggers,
  });

  const resetScrollPosition = useCallback(() => {
    ScrollTrigger.clearScrollMemory("manual");
    window.scrollTo(0, 0);
    queueScrollTriggerRefresh();
  }, [queueScrollTriggerRefresh]);

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

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }

      if (refreshFrameRef.current) {
        cancelAnimationFrame(refreshFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <LandingNavbar logoTheme={logoTheme} onHomeClick={resetToLandingStart} />
      <main id="main-content" className="relative bg-background">
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
