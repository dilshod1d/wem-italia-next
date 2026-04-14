"use client";

import { useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import { mapVideoProgress } from "./map-video-progress";
import type {
  PortfolioResultsSectionConfig,
  PortfolioResultsStageKey,
} from "../types/portfolio-results-section";

interface PortfolioResultsVideoState {
  lastStageKey: PortfolioResultsStageKey;
}

export function usePortfolioResultsVideo(
  config: PortfolioResultsSectionConfig,
) {
  const { stages, videoDuration } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stateRef = useRef<PortfolioResultsVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
  });
  const [activeStageKey, setActiveStageKey] =
    useState<PortfolioResultsStageKey>(stages[0]?.key ?? "intro");

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
