"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

import type {
  WhoWeSupportSectionConfig,
  WhoWeSupportStageKey,
} from "../types/who-we-support-section";

gsap.registerPlugin(ScrollTrigger);

const WHO_WE_SUPPORT_SCROLL_DISTANCE = 500;
const WHO_WE_SUPPORT_MOBILE_SCROLL_DISTANCE = 720;

interface WhoWeSupportScrollState {
  lastStageKey: WhoWeSupportStageKey;
}

interface WhoWeSupportSectionOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
}

export function useWhoWeSupportSection(
  config: WhoWeSupportSectionConfig,
  options: WhoWeSupportSectionOptions = {},
) {
  const { stages } = config;
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinnedRef = useRef<HTMLDivElement | null>(null);
  const enterRef = useRef(options.onEnter);
  const enterBackRef = useRef(options.onEnterBack);
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
    enterRef.current = options.onEnter;
    enterBackRef.current = options.onEnterBack;
  }, [options.onEnter, options.onEnterBack]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;

    if (!section || !pinned) return;

    const pinDistance = window.matchMedia("(max-width: 639px)").matches
      ? WHO_WE_SUPPORT_MOBILE_SCROLL_DISTANCE
      : WHO_WE_SUPPORT_SCROLL_DISTANCE;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${pinDistance}`,
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
        section.style.zIndex = self.isActive ? "25" : "0";
        pinned.style.zIndex = self.isActive ? "45" : "";
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
      pinned.style.zIndex = "";
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
