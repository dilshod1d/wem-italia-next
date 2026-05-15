"use client";

import { useLayoutEffect, useRef, useState } from "react";

import type {
  WhyWemWorksOpeningPhase,
  WhyWemWorksSectionConfig,
  WhyWemWorksStageKey,
} from "./why-wem-works.types";
import {
  applyMobileVideoLayout,
  applyMobileVideoTransform,
  getResolvedMobileVideoLayout,
  resolveMobileVideoPanTransform,
  useScrollVideoScrubber,
  useSectionPin,
  useVideoDebugLogger,
} from "../../engine";

interface WhyWemWorksVideoState {
  lastStageKey: WhyWemWorksStageKey;
  lastOpeningPhase: WhyWemWorksOpeningPhase;
}

interface WhyWemWorksVideoOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
}

export function useWhyWemWorksVideo(
  config: WhyWemWorksSectionConfig,
  options: WhyWemWorksVideoOptions = {},
) {
  const { fps, opening, stages, totalFrames, videoDuration, videoUrl } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrubVideo = useScrollVideoScrubber(videoRef, { fps });
  const isMobileViewportRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const stateRef = useRef<WhyWemWorksVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
    lastOpeningPhase: "copy",
  });
  const [activeStageKey, setActiveStageKey] = useState<WhyWemWorksStageKey>(
    stages[0]?.key ?? "intro",
  );
  const [openingPhase, setOpeningPhase] =
    useState<WhyWemWorksOpeningPhase>("copy");
  const debugLogger = useVideoDebugLogger({
    label: "Perché Funziona",
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

      scrubVideo(currentFrame / fps);

      const { lastOpeningPhase, lastStageKey } = stateRef.current;
      let nextOpeningPhase: WhyWemWorksOpeningPhase = "done";

      if (currentFrame < opening.cardAppearFrame) {
        nextOpeningPhase = "copy";
      } else if (currentFrame < opening.endFrame) {
        nextOpeningPhase = "card";
      }

      const activeStage = stages.find(
        (stage) =>
          currentFrame >= stage.startFrame && currentFrame < stage.endFrame,
      );

      debugLogger.logProgress({
        progress,
        currentTime,
        marker: `${activeStage?.key ?? nextOpeningPhase ?? lastStageKey}@f${currentFrame}`,
      });

      if (activeStage && activeStage.key !== lastStageKey) {
        stateRef.current.lastStageKey = activeStage.key;
        setActiveStageKey(activeStage.key);
      }

      if (nextOpeningPhase !== lastOpeningPhase) {
        stateRef.current.lastOpeningPhase = nextOpeningPhase;
        setOpeningPhase(nextOpeningPhase);
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
    openingPhase,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
