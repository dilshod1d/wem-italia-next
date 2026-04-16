"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { CHAPTER_SCROLL_DISTANCE } from "@/components/Chapter/useSectionPin";

import type {
  WhoWeSupportSectionConfig,
  WhoWeSupportStageKey,
} from "../types/who-we-support-section";

gsap.registerPlugin(ScrollTrigger);

interface WhoWeSupportScrollState {
  lastStageKey: WhoWeSupportStageKey;
}

export function useWhoWeSupportSection(config: WhoWeSupportSectionConfig) {
  const { stages } = config;
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinnedRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<WhoWeSupportScrollState>({
    lastStageKey: stages[0]?.key ?? "title",
  });
  const [activeStageKey, setActiveStageKey] = useState<WhoWeSupportStageKey>(
    stages[0]?.key ?? "title",
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const scrolledRef = useRef(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;

    if (!section || !pinned) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${CHAPTER_SCROLL_DISTANCE}`,
      scrub: true,
      pin: pinned,
      pinSpacing: true,
      onToggle: (self) => {
        setIsPinned(self.isActive);
        section.style.zIndex = self.isActive ? "25" : "0";
      },
      onUpdate: (self) => {
        const progress = self.progress;
        const activeStage = stages.find(
          (stage) => progress >= stage.start && progress < stage.end,
        );

        if (activeStage && activeStage.key !== stateRef.current.lastStageKey) {
          stateRef.current.lastStageKey = activeStage.key;
          setActiveStageKey(activeStage.key);
        }

        const nextScrolled = progress > 0.02;

        if (nextScrolled !== scrolledRef.current) {
          scrolledRef.current = nextScrolled;
          setIsScrolled(nextScrolled);
        }
      },
    });

    return () => {
      section.style.zIndex = "0";
      trigger.kill();
    };
  }, [stages]);

  return {
    sectionRef,
    pinnedRef,
    activeStageKey,
    isScrolled,
    isPinned,
  };
}
