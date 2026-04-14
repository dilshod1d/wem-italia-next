"use client";

import { useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import { mapVideoProgress } from "./map-video-progress";
import type {
  HowItWorksSectionConfig,
  HowItWorksStageKey,
} from "../types/how-it-works-section";

interface HowItWorksVideoState {
  lastStageKey: HowItWorksStageKey;
}

export function useHowItWorksVideo(config: HowItWorksSectionConfig) {
  const { stages, videoDuration } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stateRef = useRef<HowItWorksVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
  });
  const [activeStageKey, setActiveStageKey] = useState<HowItWorksStageKey>(
    stages[0]?.key ?? "intro",
  );

  const { sectionRef, isScrolled } = useSectionPin({
    onUpdate: (progress) => {
      const video = videoRef.current;
      const currentTime = videoDuration * mapVideoProgress(progress);

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
