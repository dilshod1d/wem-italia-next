"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type {
  PortfolioResultsSectionConfig,
  PortfolioResultsStageKey,
} from "../types/portfolio-results-section";
import { useVideoDebugLogger } from "./use-video-debug-logger";

gsap.registerPlugin(ScrollTrigger);

const PORTFOLIO_RESULTS_SCROLL_DISTANCE = 1800;

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
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const enterRef = useRef(options.onEnter);
  const enterBackRef = useRef(options.onEnterBack);
  const progressRef = useRef(options.onProgress);
  const stateRef = useRef<PortfolioResultsHybridVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
  });
  const [activeStageKey, setActiveStageKey] =
    useState<PortfolioResultsStageKey>(stages[0]?.key ?? "intro");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const scrolledRef = useRef(false);
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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinTarget = section?.firstElementChild;

    if (!section || !(pinTarget instanceof HTMLElement)) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${PORTFOLIO_RESULTS_SCROLL_DISTANCE}`,
      scrub: true,
      pin: pinTarget,
      pinSpacing: true,
      onEnter: () => {
        enterRef.current?.();
      },
      onEnterBack: () => {
        enterBackRef.current?.();
      },
      onToggle: (self) => {
        section.style.zIndex = self.isActive ? "30" : "0";
        setIsActive(self.isActive);
      },
      onUpdate: (self) => {
        const progress = self.progress;
        const currentTime = videoDuration * Math.min(Math.max(progress, 0), 1);
        const currentFrame = Math.round(
          Math.min(Math.max(currentTime * fps, 0), totalFrames),
        );
        const video = videoRef.current;

        if (video && video.readyState >= 1) {
          video.currentTime = currentTime;
        }

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

        const nextScrolled = progress > 0.02;

        if (nextScrolled !== scrolledRef.current) {
          scrolledRef.current = nextScrolled;
          setIsScrolled(nextScrolled);
        }
      },
    });

    return () => {
      section.style.zIndex = "0";
      trigger.kill();
    };
  }, [fps, stages, totalFrames, videoDuration, debugLogger]);

  return {
    sectionRef,
    videoRef,
    activeStageKey,
    isScrolled,
    isActive,
  };
}
