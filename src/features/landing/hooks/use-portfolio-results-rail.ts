"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PORTFOLIO_RESULTS_RAIL_FALLBACK_SCROLL_DISTANCE = 900;

interface UsePortfolioResultsRailOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
  onProgress?: (progress: number) => void;
  getScrollDistance?: () => number;
}

export function usePortfolioResultsRail(
  options: UsePortfolioResultsRailOptions = {},
) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinnedRef = useRef<HTMLDivElement | null>(null);
  const enterRef = useRef(options.onEnter);
  const enterBackRef = useRef(options.onEnterBack);
  const progressRef = useRef(options.onProgress);
  const distanceRef = useRef(options.getScrollDistance);
  const [isPinned, setIsPinned] = useState(false);

  useLayoutEffect(() => {
    enterRef.current = options.onEnter;
    enterBackRef.current = options.onEnterBack;
    progressRef.current = options.onProgress;
    distanceRef.current = options.getScrollDistance;
  }, [
    options.onEnter,
    options.onEnterBack,
    options.onProgress,
    options.getScrollDistance,
  ]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;

    if (!section || !pinned) return;

    let refreshFrame = 0;
    const refresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () =>
        `+=${Math.max(
          Math.round(
            distanceRef.current?.() ??
              PORTFOLIO_RESULTS_RAIL_FALLBACK_SCROLL_DISTANCE,
          ),
          PORTFOLIO_RESULTS_RAIL_FALLBACK_SCROLL_DISTANCE,
        )}`,
      scrub: true,
      pin: pinned,
      pinSpacing: true,
      invalidateOnRefresh: true,
      onEnter: () => {
        enterRef.current?.();
      },
      onEnterBack: () => {
        enterBackRef.current?.();
      },
      onToggle: (self) => {
        setIsPinned(self.isActive);
        section.style.zIndex = self.isActive ? "28" : "0";
        pinned.style.zIndex = self.isActive ? "32" : "";
      },
      onUpdate: (self) => {
        progressRef.current?.(self.progress);
      },
    });

    refresh();
    window.addEventListener("resize", refresh);

    return () => {
      cancelAnimationFrame(refreshFrame);
      window.removeEventListener("resize", refresh);
      section.style.zIndex = "0";
      pinned.style.zIndex = "";
      trigger.kill();
    };
  }, []);

  return {
    sectionRef,
    pinnedRef,
    isPinned,
  };
}
