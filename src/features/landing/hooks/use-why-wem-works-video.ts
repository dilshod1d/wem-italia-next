"use client";

import { useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import type {
  WhyWemWorksHandoffPhase,
  WhyWemWorksSectionConfig,
  WhyWemWorksStageKey,
} from "../types/why-wem-works-section";
import { useVideoDebugLogger } from "./use-video-debug-logger";

interface WhyWemWorksVideoState {
  lastStageKey: WhyWemWorksStageKey;
  lastHandoffPhase: WhyWemWorksHandoffPhase;
}

interface WhyWemWorksVideoOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
}

export function useWhyWemWorksVideo(
  config: WhyWemWorksSectionConfig,
  options: WhyWemWorksVideoOptions = {},
) {
  const { fps, handoff, stages, totalFrames, videoDuration, videoUrl } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stateRef = useRef<WhyWemWorksVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
    lastHandoffPhase: "copy",
  });
  const [activeStageKey, setActiveStageKey] = useState<WhyWemWorksStageKey>(
    stages[0]?.key ?? "intro",
  );
  const [handoffPhase, setHandoffPhase] =
    useState<WhyWemWorksHandoffPhase>("copy");
  const debugLogger = useVideoDebugLogger({
    label: "Perché Funziona",
    videoSrc: videoUrl,
    configuredDuration: videoDuration,
    videoRef,
  });

  const { sectionRef, isScrolled } = useSectionPin({
    onEnter: options.onEnter,
    onEnterBack: options.onEnterBack,
    onUpdate: (progress) => {
      const video = videoRef.current;
      const currentTime = videoDuration * Math.min(Math.max(progress, 0), 1);
      const currentFrame = Math.round(
        Math.min(Math.max(currentTime * fps, 0), totalFrames),
      );

      if (video && video.readyState >= 1) {
        video.currentTime = currentTime;
      }

      const { lastHandoffPhase, lastStageKey } = stateRef.current;
      let nextHandoffPhase: WhyWemWorksHandoffPhase = "done";

      if (currentFrame < handoff.cardAppearFrame) {
        nextHandoffPhase = "copy";
      } else if (currentFrame < handoff.endFrame) {
        nextHandoffPhase = "card";
      }

      const activeStage = stages.find(
        (stage) =>
          currentFrame >= stage.startFrame && currentFrame < stage.endFrame,
      );

      debugLogger.logProgress({
        progress,
        currentTime,
        marker: `${activeStage?.key ?? nextHandoffPhase ?? lastStageKey}@f${currentFrame}`,
      });

      if (activeStage && activeStage.key !== lastStageKey) {
        stateRef.current.lastStageKey = activeStage.key;
        setActiveStageKey(activeStage.key);
      }

      if (nextHandoffPhase !== lastHandoffPhase) {
        stateRef.current.lastHandoffPhase = nextHandoffPhase;
        setHandoffPhase(nextHandoffPhase);
      }
    },
  });

  return {
    sectionRef,
    videoRef,
    activeStageKey,
    handoffPhase,
    isScrolled,
  };
}
