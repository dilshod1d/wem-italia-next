"use client";

import { useMemo, useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import type {
  SystemFlowSectionConfig,
  SystemFlowStageKey,
} from "../types/system-flow-section";
import { useScrollVideoScrubber } from "./use-scroll-video-scrubber";
import {
  normalizeTimelineStepFrames,
  useSteppedVideoTimeline,
} from "./use-stepped-video-timeline";
import { useVideoDebugLogger } from "./use-video-debug-logger";

interface SystemFlowVideoState {
  lastStageKey: SystemFlowStageKey;
  lastLogoTheme: "light" | "dark";
}

interface SystemFlowVideoOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
  onLogoThemeChange?: (theme: "light" | "dark") => void;
}

function getMobileVideoPanTransform(
  currentFrame: number,
  pans: SystemFlowSectionConfig["mobileVideoPan"],
  mobileVideoConfig: SystemFlowSectionConfig["mobileVideoConfig"],
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

  const fromY = activePan.fromY ?? 0;
  const toY = activePan.toY ?? fromY;
  const fromScale = activePan.fromScale ?? 1;
  const toScale = activePan.toScale ?? fromScale;
  const x = activePan.fromX + (activePan.toX - activePan.fromX) * progress;
  const y = fromY + (toY - fromY) * progress;

  return {
    x,
    y,
    scale: fromScale + (toScale - fromScale) * progress,
    objectFit: mobileVideoConfig?.objectFit ?? "cover",
    objectPosition: mobileVideoConfig?.objectPosition ?? "center center",
    widthPercent: mobileVideoConfig?.widthPercent ?? 180,
    heightPercent: mobileVideoConfig?.heightPercent ?? 100,
    verticalAnchor: mobileVideoConfig?.verticalAnchor ?? "top",
  };
}

function applyMobileVideoPan(
  video: HTMLVideoElement | null,
  pan: {
    x: number;
    y: number;
    scale: number;
    objectFit: "cover" | "contain";
    objectPosition: "center center" | "center top" | "center bottom";
    widthPercent: number;
    heightPercent: number;
    verticalAnchor: "top" | "center" | "bottom";
  } | null,
) {
  if (!video) return;

  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  if (pan && isMobile) {
    video.style.width = `${pan.widthPercent}%`;
    video.style.height = `${pan.heightPercent}%`;
    video.style.maxWidth = "none";
    video.style.left = "0";
    video.style.right = "auto";
    video.style.top =
      pan.verticalAnchor === "center"
        ? `${(100 - pan.heightPercent) / 2}%`
        : pan.verticalAnchor === "bottom"
          ? "auto"
          : "0";
    video.style.bottom = pan.verticalAnchor === "bottom" ? "0" : "auto";
    video.style.objectFit = pan.objectFit;
    video.style.objectPosition = pan.objectPosition;
    video.style.transformOrigin = "center center";
    video.style.transform = `translate3d(${pan.x}%, ${pan.y}%, 0) scale(${pan.scale})`;
  } else {
    video.style.width = "";
    video.style.height = "";
    video.style.maxWidth = "";
    video.style.left = "";
    video.style.right = "";
    video.style.top = "";
    video.style.bottom = "";
    video.style.objectFit = "";
    video.style.objectPosition = "";
    video.style.transformOrigin = "";
    video.style.transform = "";
  }
}

function getSystemFlowTimelineStepFrames(config: SystemFlowSectionConfig) {
  return normalizeTimelineStepFrames(
    config.stages
      .filter((stage) => stage.key !== "intro")
      .map((stage) => stage.startFrame),
    config.totalFrames,
  );
}

export function useSystemFlowVideo(
  config: SystemFlowSectionConfig,
  options: SystemFlowVideoOptions = {},
) {
  const { fps, stages, totalFrames, videoDuration, videoUrl } = config;
  const lightSurfaceStartFrame =
    stages.find((stage) => stage.key === "body")?.startFrame ?? totalFrames;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrubVideo = useScrollVideoScrubber(videoRef);
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

  const { sectionRef, isScrolled, isActive, isAtHandoff } = useSectionPin({
    onEnter: options.onEnter,
    onEnterBack: options.onEnterBack,
  });

  const timelineStepFrames = useMemo(
    () => getSystemFlowTimelineStepFrames(config),
    [config],
  );

  useSteppedVideoTimeline({
    sectionRef,
    isActive,
    fps,
    totalFrames,
    videoDuration,
    stepFrames: timelineStepFrames,
    reserveExitScroll: true,
    onFrame: ({ progress, currentFrame, currentTime }) => {
      const video = videoRef.current;
      const mobilePan = getMobileVideoPanTransform(
        currentFrame,
        config.mobileVideoPan,
        config.mobileVideoConfig,
      );

      applyMobileVideoPan(video, mobilePan);

      const nextLogoTheme =
        currentFrame < lightSurfaceStartFrame ? "light" : "dark";

      scrubVideo(currentTime);

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
    isActive,
    isAtHandoff,
  };
}
