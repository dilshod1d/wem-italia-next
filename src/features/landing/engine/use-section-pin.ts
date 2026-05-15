"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ensureGsap } from "./ensure-gsap";

export const CHAPTER_SCROLL_DISTANCE = 1800;
const CHAPTER_HANDOFF_PROGRESS = 0.985;

interface UseSectionPinOptions {
  pinDistance?: number;
  enabled?: boolean;
  armImmediately?: boolean;
  armMargin?: string;
  onUpdate?: (progress: number) => void;
  onEnter?: () => void;
  onEnterBack?: () => void;
}

export function useSectionPin({
  pinDistance = CHAPTER_SCROLL_DISTANCE,
  enabled = true,
  armImmediately = false,
  armMargin = "100% 0px",
  onUpdate,
  onEnter,
  onEnterBack,
}: UseSectionPinOptions = {}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrolledRef = useRef(false);
  const updateRef = useRef(onUpdate);
  const enterRef = useRef(onEnter);
  const enterBackRef = useRef(onEnterBack);
  const activeRef = useRef(false);
  const handoffRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isAtHandoff, setIsAtHandoff] = useState(false);
  const [isArmed, setIsArmed] = useState(armImmediately);

  useEffect(() => {
    updateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    enterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    enterBackRef.current = onEnterBack;
  }, [onEnterBack]);

  useEffect(() => {
    if (!enabled) return;
    if (armImmediately) return;

    const section = sectionRef.current;
    if (!section || isArmed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsArmed(true);
        observer.disconnect();
      },
      {
        rootMargin: armMargin,
        threshold: 0.01,
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [armImmediately, armMargin, enabled, isArmed]);

  useLayoutEffect(() => {
    if (!enabled || !isArmed) return;

    const section = sectionRef.current;
    const pinTarget = section?.firstElementChild;

    if (!section || !(pinTarget instanceof HTMLElement)) return;

    let cleanup = () => {
      section.style.zIndex = "0";
    };
    let cancelled = false;

    const syncActive = (active: boolean) => {
      section.style.zIndex = active ? "30" : "0";

      if (active === activeRef.current) return;

      activeRef.current = active;
      setIsActive(active);
    };

    const syncHandoff = (handoff: boolean) => {
      if (handoff === handoffRef.current) return;

      handoffRef.current = handoff;
      setIsAtHandoff(handoff);
    };

    void ensureGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return;

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
          if (!self.isActive) syncHandoff(false);
        },
        onRefresh: (self) => {
          syncActive(self.isActive);
          syncHandoff(
            self.isActive && self.progress >= CHAPTER_HANDOFF_PROGRESS,
          );
        },
        onUpdate: (self) => {
          updateRef.current?.(self.progress);
          syncHandoff(
            self.isActive && self.progress >= CHAPTER_HANDOFF_PROGRESS,
          );

          const nextScrolled = self.progress > 0.02;

          if (nextScrolled !== scrolledRef.current) {
            scrolledRef.current = nextScrolled;
            setIsScrolled(nextScrolled);
          }
        },
      });

      syncActive(trigger.isActive);
      cleanup = () => {
        section.style.zIndex = "0";
        trigger.kill();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled, isArmed, pinDistance]);

  return {
    sectionRef,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
