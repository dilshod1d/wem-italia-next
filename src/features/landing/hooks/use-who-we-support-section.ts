"use client";

import { useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import type {
  WhoWeSupportSectionConfig,
  WhoWeSupportStageKey,
} from "../types/who-we-support-section";

interface WhoWeSupportScrollState {
  lastStageKey: WhoWeSupportStageKey;
}

export function useWhoWeSupportSection(config: WhoWeSupportSectionConfig) {
  const { stages } = config;
  const stateRef = useRef<WhoWeSupportScrollState>({
    lastStageKey: stages[0]?.key ?? "title",
  });
  const [activeStageKey, setActiveStageKey] = useState<WhoWeSupportStageKey>(
    stages[0]?.key ?? "title",
  );

  const { sectionRef, isScrolled } = useSectionPin({
    onUpdate: (progress) => {
      const { lastStageKey } = stateRef.current;
      const activeStage = stages.find(
        (stage) => progress >= stage.start && progress < stage.end,
      );
     

      if (activeStage && activeStage.key !== lastStageKey) {
        stateRef.current.lastStageKey = activeStage.key;
        setActiveStageKey(activeStage.key);
      }
    },
  });

  return {
    sectionRef,
    activeStageKey,
    isScrolled,
  };
}
