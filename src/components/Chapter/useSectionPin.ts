"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const CHAPTER_SCROLL_DISTANCE = 1800;

interface UseSectionPinOptions {
  pinDistance?: number;
  onUpdate?: (progress: number) => void;
  onEnter?: () => void;
  onEnterBack?: () => void;
}

export function useSectionPin({
  pinDistance = CHAPTER_SCROLL_DISTANCE,
  onUpdate,
  onEnter,
  onEnterBack,
}: UseSectionPinOptions = {}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrolledRef = useRef(false);
  const updateRef = useRef(onUpdate);
  const enterRef = useRef(onEnter);
  const enterBackRef = useRef(onEnterBack);
  const activeRef = useRef(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    updateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    enterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    enterBackRef.current = onEnterBack;
  }, [onEnterBack]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinTarget = section?.firstElementChild;

    if (!section || !(pinTarget instanceof HTMLElement)) return;

    const syncActive = (active: boolean) => {
      section.style.zIndex = active ? "30" : "0";

      if (active === activeRef.current) return;

      activeRef.current = active;
      setIsActive(active);
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${pinDistance}`,
      scrub: true,
      pin: pinTarget,
      pinSpacing: true,
      onEnter: () => {
        enterRef.current?.();
      },
      onEnterBack: () => {
        enterBackRef.current?.();
      },
      onToggle: (self) => {
        syncActive(self.isActive);
      },
      onRefresh: (self) => {
        syncActive(self.isActive);
      },
      onUpdate: (self) => {
        updateRef.current?.(self.progress);

        const nextScrolled = self.progress > 0.02;

        if (nextScrolled !== scrolledRef.current) {
          scrolledRef.current = nextScrolled;
          setIsScrolled(nextScrolled);
        }
      },
    });

    syncActive(trigger.isActive);

    return () => {
      section.style.zIndex = "0";
      trigger.kill();
    };
  }, [pinDistance]);

  return {
    sectionRef,
    isScrolled,
    isActive,
  };
}
