"use client";

import { useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import type {
  SystemFlowSectionConfig,
  SystemFlowStageKey,
} from "../types/system-flow-section";
import { useVideoDebugLogger } from "./use-video-debug-logger";

interface SystemFlowVideoState {
  lastStageKey: SystemFlowStageKey;
}

export function useSystemFlowVideo(config: SystemFlowSectionConfig) {
  const { stages, videoDuration, videoUrl } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stateRef = useRef<SystemFlowVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
  });
  const [activeStageKey, setActiveStageKey] = useState<SystemFlowStageKey>(
    stages[0]?.key ?? "intro",
  );
  const debugLogger = useVideoDebugLogger({
    label: "System Flow",
    videoSrc: videoUrl,
    configuredDuration: videoDuration,
    videoRef,
  });

  const { sectionRef, isScrolled } = useSectionPin({
    onUpdate: (progress) => {
      const video = videoRef.current;
      const currentTime = videoDuration * Math.min(Math.max(progress, 0), 1);

      if (video && video.readyState >= 1) {
        video.currentTime = currentTime;
      }

      const { lastStageKey } = stateRef.current;
      const activeStage = stages.find(
        (stage) => currentTime >= stage.start && currentTime < stage.end,
      );

      debugLogger.logProgress({
        progress,
        currentTime,
        marker: activeStage?.key ?? lastStageKey,
      });

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
