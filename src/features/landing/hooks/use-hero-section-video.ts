"use client";

import { useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import type { HeroBodyItem, HeroSectionConfig } from "../types/hero-section";
import { useVideoDebugLogger } from "./use-video-debug-logger";

interface HeroVideoState {
  lastStageId: number;
  lastBodySignature: string;
}

interface HeroSectionVideoOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
}

export function useHeroSectionVideo(
  config: HeroSectionConfig,
  options: HeroSectionVideoOptions = {},
) {
  const { fps, stages, totalFrames, videoDuration, videoUrl } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stateRef = useRef<HeroVideoState>({
    lastStageId: stages[0]?.id ?? 0,
    lastBodySignature: "",
  });
  const [activeStageId, setActiveStageId] = useState<number>(
    stages[0]?.id ?? 0,
  );
  const [visibleBodyItems, setVisibleBodyItems] = useState<
    readonly HeroBodyItem[]
  >([]);
  const debugLogger = useVideoDebugLogger({
    label: "Hero",
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

      const { lastStageId } = stateRef.current;
      const visibleBodies = config.bodyItems
        .filter(
          (item) =>
            currentFrame >= item.fromFrame && currentFrame < item.toFrame,
        )
        .sort((a, b) => a.order - b.order);
      const nextBodySignature = visibleBodies
        .map((item) => item.key)
        .join("|");
      const activeStage = stages.find(
        (stage) =>
          currentFrame >= stage.startFrame && currentFrame < stage.endFrame,
      );

      debugLogger.logProgress({
        progress,
        currentTime,
        marker: `${activeStage?.id ?? lastStageId}@f${currentFrame}`,
      });

      if (activeStage && activeStage.id !== lastStageId) {
        stateRef.current.lastStageId = activeStage.id;
        setActiveStageId(activeStage.id);
      }

      if (nextBodySignature !== stateRef.current.lastBodySignature) {
        stateRef.current.lastBodySignature = nextBodySignature;
        setVisibleBodyItems(visibleBodies);
      }
    },
  });

  return {
    sectionRef,
    videoRef,
    activeStageId,
    visibleBodyItems,
    isScrolled,
  };
}
