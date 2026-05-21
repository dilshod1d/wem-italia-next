"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { ensureGsap, useDynamicViewportHeight } from "../engine";
import { HeroSection } from "../sections/hero";
import { LandingNavbar, type VideoPreloadStrategy } from "../shared";

const WhyWemWorksSection = dynamic(
  () =>
    import("../sections/why-wem-works").then(
      (mod) => mod.WhyWemWorksSection,
    ),
  {
    loading: () => (
      <section
        aria-hidden="true"
        className="relative bg-black"
        style={{ height: "1800px" }}
      />
    ),
  },
);

const SystemFlowSection = dynamic(
  () =>
    import("../sections/system-flow").then(
      (mod) => mod.SystemFlowSection,
    ),
  {
    loading: () => (
      <section
        aria-hidden="true"
        className="relative bg-white"
        style={{ height: "1800px" }}
      />
    ),
  },
);

const HowItWorksSection = dynamic(
  () =>
    import("../sections/how-it-works").then(
      (mod) => mod.HowItWorksSection,
    ),
  {
    loading: () => (
      <section
        aria-hidden="true"
        className="relative bg-white"
        style={{ height: "1800px" }}
      />
    ),
  },
);

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
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeVideoSectionIndex, setActiveVideoSectionIndex] = useState(0);
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
        void ensureGsap().then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
        });
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

  const resetScrollPosition = useCallback(
    ({ refresh = true }: { refresh?: boolean } = {}) => {
      if (window.scrollX !== 0 || window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }

      if (!refresh) return;

      void ensureGsap().then(({ ScrollTrigger }) => {
        ScrollTrigger.clearScrollMemory("manual");
        queueScrollTriggerRefresh();
      });
    },
    [queueScrollTriggerRefresh],
  );

  const resetToLandingStart = useCallback(() => {
    setLogoTheme("light");
    resetScrollPosition();
  }, [resetScrollPosition]);

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    resetScrollPosition({ refresh: false });
  }, [resetScrollPosition]);

  useEffect(() => {
    if (hasInteracted) return;

    const markInteracted = () => {
      setHasInteracted(true);
    };

    const interactionOptions: AddEventListenerOptions = { passive: true };

    window.addEventListener("wheel", markInteracted, interactionOptions);
    window.addEventListener("touchstart", markInteracted, interactionOptions);
    window.addEventListener("pointerdown", markInteracted, interactionOptions);
    window.addEventListener("keydown", markInteracted);

    return () => {
      window.removeEventListener("wheel", markInteracted, interactionOptions);
      window.removeEventListener(
        "touchstart",
        markInteracted,
        interactionOptions,
      );
      window.removeEventListener(
        "pointerdown",
        markInteracted,
        interactionOptions,
      );
      window.removeEventListener("keydown", markInteracted);
    };
  }, [hasInteracted]);

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

  const getVideoPreloadStrategy = useCallback(
    (sectionIndex: number): VideoPreloadStrategy => {
      if (!hasInteracted) {
        return sectionIndex === 0 ? "eager" : "none";
      }

      if (sectionIndex === 0 && activeVideoSectionIndex === 0) {
        return "eager";
      }

      if (Math.abs(sectionIndex - activeVideoSectionIndex) <= 1) {
        return "warm";
      }

      return "none";
    },
    [activeVideoSectionIndex, hasInteracted],
  );

  return (
    <>
      <LandingNavbar logoTheme={logoTheme} onHomeClick={resetToLandingStart} />
      <main id="main-content" className="relative bg-background">
        <HeroSection
          setLogoTheme={setLogoTheme}
          onSectionActive={() => setActiveVideoSectionIndex(0)}
          preloadStrategy={getVideoPreloadStrategy(0)}
          pinEnabled={hasInteracted}
        />
        <WhyWemWorksSection
          setLogoTheme={setLogoTheme}
          onSectionActive={() => setActiveVideoSectionIndex(1)}
          preloadStrategy={getVideoPreloadStrategy(1)}
        />
        <SystemFlowSection
          setLogoTheme={setLogoTheme}
          onSectionActive={() => setActiveVideoSectionIndex(2)}
          preloadStrategy={getVideoPreloadStrategy(2)}
        />
        <HowItWorksSection
          setLogoTheme={setLogoTheme}
          onSectionActive={() => setActiveVideoSectionIndex(3)}
          preloadStrategy={getVideoPreloadStrategy(3)}
        />
        <PortfolioResultsHybridSection
          setLogoTheme={setLogoTheme}
          onSectionActive={() => setActiveVideoSectionIndex(4)}
          preloadStrategy={getVideoPreloadStrategy(4)}
        />
        <WhoWeSupportSection />
        <FooterSection setLogoTheme={setLogoTheme} />
      </main>
    </>
  );
}
