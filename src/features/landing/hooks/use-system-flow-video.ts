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
  lastLogoTheme: "light" | "dark";
}

const LOGO_DARK_LEAD_FRAMES = 8;

interface SystemFlowVideoOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
  onLogoThemeChange?: (theme: "light" | "dark") => void;
}

function getMobileVideoPanTransform(
  currentFrame: number,
  pans: SystemFlowSectionConfig["mobileVideoPan"],
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

  const x = activePan.fromX + (activePan.toX - activePan.fromX) * progress;

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

  console.log("mobile pan", {
    isMobile,
    pan,
    width: window.innerWidth,
  });

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

export function useSystemFlowVideo(
  config: SystemFlowSectionConfig,
  options: SystemFlowVideoOptions = {},
) {
  const { fps, stages, totalFrames, videoDuration, videoUrl } = config;
  const titleStartFrame =
    stages.find((stage) => stage.key === "title")?.startFrame ?? totalFrames;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stateRef = useRef<SystemFlowVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
    lastLogoTheme: "light",
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

      applyMobileVideoPan(video, mobilePan);

      const nextLogoTheme =
        currentFrame < Math.max(titleStartFrame - LOGO_DARK_LEAD_FRAMES, 0)
          ? "light"
          : "dark";

      if (video && video.readyState >= 1) {
        video.currentTime = currentTime;
      }

      const { lastLogoTheme, lastStageKey } = stateRef.current;
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

      if (nextLogoTheme !== lastLogoTheme) {
        stateRef.current.lastLogoTheme = nextLogoTheme;
        options.onLogoThemeChange?.(nextLogoTheme);
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
