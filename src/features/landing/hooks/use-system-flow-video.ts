"use client";

import { useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import type {
  SystemFlowSectionConfig,
  SystemFlowStageKey,
} from "../types/system-flow-section";

interface SystemFlowVideoState {
  lastStageKey: SystemFlowStageKey;
}

export function useSystemFlowVideo(config: SystemFlowSectionConfig) {
  const { stages, videoDuration } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stateRef = useRef<SystemFlowVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
  });
  const [activeStageKey, setActiveStageKey] = useState<SystemFlowStageKey>(
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
