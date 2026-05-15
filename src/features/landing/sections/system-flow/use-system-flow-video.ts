"use client";

import { useLayoutEffect, useRef, useState } from "react";

import type {
  SystemFlowSectionConfig,
  SystemFlowStageKey,
} from "./system-flow.types";
import {
  applyMobileVideoLayout,
  applyMobileVideoTransform,
  getResolvedMobileVideoLayout,
  resolveMobileVideoPanTransform,
  useScrollVideoScrubber,
  useSectionPin,
  useVideoDebugLogger,
} from "../../engine";

interface SystemFlowVideoState {
  lastStageKey: SystemFlowStageKey;
  lastLogoTheme: "light" | "dark";
}

interface SystemFlowVideoOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
  onLogoThemeChange?: (theme: "light" | "dark") => void;
}

export function useSystemFlowVideo(
  config: SystemFlowSectionConfig,
  options: SystemFlowVideoOptions = {},
) {
  const { fps, stages, totalFrames, videoDuration, videoUrl } = config;
  const lightSurfaceStartFrame =
    stages.find((stage) => stage.key === "body")?.startFrame ?? totalFrames;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrubVideo = useScrollVideoScrubber(videoRef, { fps });
  const isMobileViewportRef = useRef(false);
  const lastFrameRef = useRef(-1);
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
    onUpdate: (progress) => {
      const video = videoRef.current;
      const currentTime = videoDuration * Math.min(Math.max(progress, 0), 1);
      const currentFrame = Math.round(
        Math.min(Math.max(currentTime * fps, 0), totalFrames),
      );
      if (currentFrame === lastFrameRef.current) return;
      lastFrameRef.current = currentFrame;

      applyMobileVideoTransform(
        video,
        resolveMobileVideoPanTransform(currentFrame, config.mobileVideoPan),
        isMobileViewportRef.current,
      );

      const nextLogoTheme =
        currentFrame < lightSurfaceStartFrame ? "light" : "dark";

      scrubVideo(currentFrame / fps);

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

  useLayoutEffect(() => {
    const video = videoRef.current;
    const mobileLayout = getResolvedMobileVideoLayout(config.mobileVideoConfig);
    const initialFrame = config.mobileVideoPan?.[0]?.startFrame ?? 0;
    const syncLayout = (matches: boolean) => {
      isMobileViewportRef.current = matches;
      applyMobileVideoLayout(video, mobileLayout, matches);
      applyMobileVideoTransform(
        video,
        resolveMobileVideoPanTransform(initialFrame, config.mobileVideoPan),
        matches,
      );
    };

    syncLayout(window.matchMedia("(max-width: 767px)").matches);

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (event: MediaQueryListEvent) => {
      syncLayout(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [config.mobileVideoConfig, config.mobileVideoPan, isActive]);

  return {
    sectionRef,
    videoRef,
    activeStageKey,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
