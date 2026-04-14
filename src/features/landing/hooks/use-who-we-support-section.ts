"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const stateRef = useRef<WhoWeSupportScrollState>({
    lastStageKey: stages[0]?.key ?? "title",
  });
  const [activeStageKey, setActiveStageKey] = useState<WhoWeSupportStageKey>(
    stages[0]?.key ?? "title",
  );
  const [isScrolled, setIsScrolled] = useState(false);

  const syncActiveStage = useEffectEvent((progress: number) => {
    const { lastStageKey } = stateRef.current;
    const activeStage = stages.find(
      (stage) => progress >= stage.start && progress < stage.end,
    );

    if (activeStage && activeStage.key !== lastStageKey) {
      stateRef.current.lastStageKey = activeStage.key;
      setActiveStageKey(activeStage.key);
    }
  });

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: ({ progress }) => {
        setIsScrolled(progress > 0.05);
        syncActiveStage(progress);
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return {
    sectionRef,
    activeStageKey,
    isScrolled,
  };
}
