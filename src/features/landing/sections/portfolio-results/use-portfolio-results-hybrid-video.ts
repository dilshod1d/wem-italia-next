"use client";

import { useLayoutEffect, useRef, useState } from "react";

import type { PortfolioResultsSectionConfig } from "./portfolio-results.types";
import { getFrameWindowVisibility } from "../../utils/frame-window";
import {
  useFrameDrivenVideoSection,
  useSignatureCommit,
} from "../../engine";

interface PortfolioResultsContentVisibility {
  showHeader: boolean;
  showDescription: boolean;
  showPortfolio: boolean;
  showFocus: boolean;
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
  const { fps, totalFrames, videoDuration, videoUrl } = config;
  const {
    header,
    description,
    portfolio: { rail, focusItem },
  } = config.contentItems;
  const commitIfChanged = useSignatureCommit<"content">();
  const enterRef = useRef(options.onEnter);
  const enterBackRef = useRef(options.onEnterBack);
  const progressRef = useRef(options.onProgress);
  const [contentVisibility, setContentVisibility] =
    useState<PortfolioResultsContentVisibility>({
      showHeader: false,
      showDescription: false,
      showPortfolio: false,
      showFocus: false,
    });

  useLayoutEffect(() => {
    enterRef.current = options.onEnter;
    enterBackRef.current = options.onEnterBack;
    progressRef.current = options.onProgress;
  }, [options.onEnter, options.onEnterBack, options.onProgress]);

  const { sectionRef, videoRef, isScrolled, isActive, isAtHandoff } =
    useFrameDrivenVideoSection({
      label: "Portfolio Results",
      videoSrc: videoUrl,
      configuredDuration: videoDuration,
      fps,
      totalFrames,
      videoDuration,
      mobileVideoConfig: config.mobileVideoConfig,
      mobileVideoPan: config.mobileVideoPan,
      pinOptions: {
        armMargin: "100% 0px",
        onEnter: () => {
          enterRef.current?.();
        },
        onEnterBack: () => {
          enterBackRef.current?.();
        },
      },
      onFrame: ({ progress, currentTime, currentFrame }) => {
        const {
          visibility: nextContentVisibility,
          signature: nextVisibilitySignature,
        } = getFrameWindowVisibility(currentFrame, {
          showHeader: header,
          showDescription: description,
          showPortfolio: rail,
          showFocus: focusItem,
        });

        progressRef.current?.({
          progress,
          currentFrame,
          currentTime,
        });

        commitIfChanged("content", nextVisibilitySignature, () => {
          setContentVisibility(nextContentVisibility);
        });

        const marker = nextContentVisibility.showFocus
          ? "focus"
          : nextContentVisibility.showPortfolio
            ? "portfolio"
            : nextContentVisibility.showDescription
              ? "description"
              : nextContentVisibility.showHeader
                ? "header"
                : "intro";

        return `${marker}@f${currentFrame}`;
      },
    });

  return {
    sectionRef,
    videoRef,
    contentVisibility,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
