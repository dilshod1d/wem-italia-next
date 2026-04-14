"use client";

import { useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import type {
  WhyWemWorksSectionConfig,
  WhyWemWorksStageKey,
} from "../types/why-wem-works-section";

interface WhyWemWorksVideoState {
  lastStageKey: WhyWemWorksStageKey;
}

export function useWhyWemWorksVideo(config: WhyWemWorksSectionConfig) {
  const { stages, videoDuration } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stateRef = useRef<WhyWemWorksVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
  });
  const [activeStageKey, setActiveStageKey] = useState<WhyWemWorksStageKey>(
    stages[0]?.key ?? "intro",
  );

  const { sectionRef, isScrolled } = useSectionPin({
    onUpdate: (progress) => {
      const video = videoRef.current;
      const currentTime = videoDuration * progress;

      if (video && video.readyState >= 1) {
        video.currentTime = currentTime;
      }

      const { lastStageKey } = stateRef.current;
      const activeStage = stages.find(
        (stage) => currentTime >= stage.start && currentTime < stage.end,
      );

      if (activeStage && activeStage.key !== lastStageKey) {
        stateRef.current.lastStageKey = activeStage.key;
        setActiveStageKey(activeStage.key);
      }
    },
  });

  return {
    sectionRef,
    videoRef,
    activeStageKey,
    isScrolled,
  };
}
