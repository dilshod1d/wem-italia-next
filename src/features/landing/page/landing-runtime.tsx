"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ensureGsap, useDynamicViewportHeight } from "../engine";
import type { VideoPreloadStrategy } from "../shared";

type LogoTheme = "light" | "dark";

interface LandingRuntimeValue {
  logoTheme: LogoTheme;
  setLogoTheme: (theme: LogoTheme) => void;
  hasInteracted: boolean;
  markSectionActive: (sectionIndex: number) => void;
  getVideoPreloadStrategy: (sectionIndex: number) => VideoPreloadStrategy;
  resetToLandingStart: () => void;
}

const LandingRuntimeContext = createContext<LandingRuntimeValue | null>(null);

export function LandingRuntimeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [logoTheme, setLogoTheme] = useState<LogoTheme>("light");
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

  const markSectionActive = useCallback((sectionIndex: number) => {
    setActiveVideoSectionIndex(sectionIndex);
  }, []);

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

  const value = useMemo<LandingRuntimeValue>(
    () => ({
      logoTheme,
      setLogoTheme,
      hasInteracted,
      markSectionActive,
      getVideoPreloadStrategy,
      resetToLandingStart,
    }),
    [
      getVideoPreloadStrategy,
      hasInteracted,
      logoTheme,
      markSectionActive,
      resetToLandingStart,
    ],
  );

  return (
    <LandingRuntimeContext.Provider value={value}>
      {children}
    </LandingRuntimeContext.Provider>
  );
}

export function useLandingRuntime() {
  const context = useContext(LandingRuntimeContext);

  if (!context) {
    throw new Error("useLandingRuntime must be used within LandingRuntimeProvider");
  }

  return context;
}
