"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PORTFOLIO_RESULTS_RAIL_SCROLL_DISTANCE = 900;

interface UsePortfolioResultsRailOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
  onProgress?: (progress: number) => void;
}

export function usePortfolioResultsRail(
  options: UsePortfolioResultsRailOptions = {},
) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinnedRef = useRef<HTMLDivElement | null>(null);
  const enterRef = useRef(options.onEnter);
  const enterBackRef = useRef(options.onEnterBack);
  const progressRef = useRef(options.onProgress);
  const [isPinned, setIsPinned] = useState(false);

  useLayoutEffect(() => {
    enterRef.current = options.onEnter;
    enterBackRef.current = options.onEnterBack;
    progressRef.current = options.onProgress;
  }, [options.onEnter, options.onEnterBack, options.onProgress]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;

    if (!section || !pinned) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${PORTFOLIO_RESULTS_RAIL_SCROLL_DISTANCE}`,
      scrub: true,
      pin: pinned,
      pinSpacing: true,
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

    return () => {
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
