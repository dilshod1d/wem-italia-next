"use client";

import { useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import type {
  HowItWorksSectionConfig,
  HowItWorksStageKey,
} from "../types/how-it-works-section";
import { useVideoDebugLogger } from "./use-video-debug-logger";

interface HowItWorksVideoState {
  lastStageKey: HowItWorksStageKey;
}

interface HowItWorksVideoOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
}

function getMobileVideoPanTransform(
  currentFrame: number,
  pans: HowItWorksSectionConfig["mobileVideoPan"],
) {
  const activePan = pans?.find(
    (pan) => currentFrame >= pan.startFrame && currentFrame <= pan.endFrame,
  );

  if (!activePan) return null;

  const progress =
    activePan.endFrame === activePan.startFrame
      ? 1
      : (currentFrame - activePan.startFrame) /
        (activePan.endFrame - activePan.startFrame);

  // const x = activePan.fromX + (activePan.toX - activePan.fromX) * progress;
  const easedProgress =
    progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

  const x = activePan.fromX + (activePan.toX - activePan.fromX) * easedProgress;

  return {
    x,
    widthPercent: activePan.widthPercent ?? 180,
  };
}

function applyMobileVideoPan(
  video: HTMLVideoElement | null,
  pan: { x: number; widthPercent: number } | null,
) {
  if (!video) return;

  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  if (pan && isMobile) {
    video.style.width = `${pan.widthPercent}%`;
    video.style.maxWidth = "none";
    video.style.left = "0";
    video.style.right = "auto";
    video.style.objectFit = "cover";
    video.style.transform = `translateX(${pan.x}%)`;
  } else {
    video.style.width = "";
    video.style.maxWidth = "";
    video.style.left = "";
    video.style.right = "";
    video.style.objectFit = "";
    video.style.transform = "";
  }
}

export function useHowItWorksVideo(
  config: HowItWorksSectionConfig,
  options: HowItWorksVideoOptions = {},
) {
  const { fps, stages, totalFrames, videoDuration, videoUrl } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stateRef = useRef<HowItWorksVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
  });
  const [activeStageKey, setActiveStageKey] = useState<HowItWorksStageKey>(
    stages[0]?.key ?? "intro",
  );
  const debugLogger = useVideoDebugLogger({
    label: "How It Works",
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

      const mobilePan = getMobileVideoPanTransform(
        currentFrame,
        config.mobileVideoPan,
      );

      if (video && video.readyState >= 1) {
        video.currentTime = currentTime;
      }

      applyMobileVideoPan(video, mobilePan);

      const { lastStageKey } = stateRef.current;
      const activeStage = stages.find(
        (stage) =>
          currentFrame >= stage.startFrame && currentFrame < stage.endFrame,
      );

      debugLogger.logProgress({
        progress,
        currentTime,
        marker: `${activeStage?.key ?? lastStageKey}@f${currentFrame}`,
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
