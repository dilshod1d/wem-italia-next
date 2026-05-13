"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useDynamicViewportHeight } from "../engine";
import { HeroSection } from "../sections/hero";
import { HowItWorksSection } from "../sections/how-it-works";
import { SystemFlowSection } from "../sections/system-flow";
import { WhyWemWorksSection } from "../sections/why-wem-works";
import { LandingNavbar } from "../shared";

gsap.registerPlugin(ScrollTrigger);

const PortfolioResultsHybridSection = dynamic(
  () =>
    import("../sections/portfolio-results").then(
      (mod) => mod.PortfolioResultsHybridSection,
    ),
  {
    loading: () => (
      <section
        aria-hidden="true"
        className="relative bg-black"
        style={{ height: "2600px" }}
      />
    ),
  },
);

const WhoWeSupportSection = dynamic(
  () =>
    import("../sections/who-we-support").then(
      (mod) => mod.WhoWeSupportSection,
    ),
  {
    loading: () => (
      <section
        aria-hidden="true"
        className="relative bg-white"
        style={{ minHeight: "1100px" }}
      />
    ),
  },
);

const FooterSection = dynamic(
  () => import("../sections/footer").then((mod) => mod.FooterSection),
  {
    loading: () => (
      <footer
        aria-hidden="true"
        className="relative bg-footer-bg"
        style={{ minHeight: "960px" }}
      />
    ),
  },
);

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
