"use client";

import { useLayoutEffect, useRef, useState } from "react";

import type {
  PortfolioResultsSectionConfig,
  PortfolioResultsStageKey,
} from "./portfolio-results.types";
import {
  applyMobileVideoLayout,
  applyMobileVideoTransform,
  getResolvedMobileVideoLayout,
  resolveMobileVideoPanTransform,
  useScrollVideoScrubber,
  useSectionPin,
  useVideoDebugLogger,
} from "../../engine";

interface PortfolioResultsHybridVideoState {
  lastStageKey: PortfolioResultsStageKey;
}

export function usePortfolioResultsHybridVideo(
  config: PortfolioResultsSectionConfig,
  options: {
    onEnter?: () => void;
    onEnterBack?: () => void;
    onProgress?: (state: {
      progress: number;
      currentFrame: number;
      currentTime: number;
    }) => void;
  } = {},
) {
  const { fps, stages, totalFrames, videoDuration, videoUrl } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrubVideo = useScrollVideoScrubber(videoRef, { fps });
  const enterRef = useRef(options.onEnter);
  const enterBackRef = useRef(options.onEnterBack);
  const progressRef = useRef(options.onProgress);
  const isMobileViewportRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const stateRef = useRef<PortfolioResultsHybridVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
  });
  const [activeStageKey, setActiveStageKey] =
    useState<PortfolioResultsStageKey>(stages[0]?.key ?? "intro");
  const debugLogger = useVideoDebugLogger({
    label: "Portfolio Results",
    videoSrc: videoUrl,
    configuredDuration: videoDuration,
    videoRef,
  });

  useLayoutEffect(() => {
    enterRef.current = options.onEnter;
    enterBackRef.current = options.onEnterBack;
    progressRef.current = options.onProgress;
  }, [options.onEnter, options.onEnterBack, options.onProgress]);

  const { sectionRef, isScrolled, isActive, isAtHandoff } = useSectionPin({
    armMargin: "100% 0px",
    onEnter: () => {
      enterRef.current?.();
    },
    onEnterBack: () => {
      enterBackRef.current?.();
    },
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

      scrubVideo(currentFrame / fps);

      const activeStage = stages.find(
        (stage) =>
          currentFrame >= stage.startFrame && currentFrame < stage.endFrame,
      );
      const nextStageKey = activeStage?.key ?? stateRef.current.lastStageKey;

      debugLogger.logProgress({
        progress,
        currentTime,
        marker: `${nextStageKey}@f${currentFrame}`,
      });

      progressRef.current?.({
        progress,
        currentFrame,
        currentTime,
      });

      if (activeStage && activeStage.key !== stateRef.current.lastStageKey) {
        stateRef.current.lastStageKey = activeStage.key;
        setActiveStageKey(activeStage.key);
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
