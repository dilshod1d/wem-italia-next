"use client";

import { useLayoutEffect, useRef, useState } from "react";

import type {
  PortfolioResultsFocusItem,
  PortfolioResultsHeaderItem,
  PortfolioResultsDescriptionItem,
  PortfolioResultsPortfolioRail,
  PortfolioResultsSectionConfig,
} from "./portfolio-results.types";
import {
  getActiveFrameWindowItem,
  getVisibleFrameItemsWithSignature,
} from "../../utils/frame-window";
import {
  useFrameDrivenVideoSection,
  useSignatureCommit,
} from "../../engine";

interface PortfolioResultsVisualState {
  activeHeaderItem: PortfolioResultsHeaderItem | null;
  activePortfolioRail: PortfolioResultsPortfolioRail | null;
  activeFocusItem: PortfolioResultsFocusItem | null;
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
  const [visualState, setVisualState] = useState<PortfolioResultsVisualState>({
    activeHeaderItem: null,
    activePortfolioRail: null,
    activeFocusItem: null,
  });
  const [visibleDescriptionItems, setVisibleDescriptionItems] = useState<
    readonly PortfolioResultsDescriptionItem[]
  >([]);

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
        const nextActiveHeaderItem =
          getActiveFrameWindowItem(currentFrame, [header]) ?? null;
        const {
          items: nextVisibleDescriptionItems,
          signature: nextDescriptionSignature,
        } = getVisibleFrameItemsWithSignature(currentFrame, description, {
          getSignaturePart: (item) => item.key,
          sort: (left, right) => left.order - right.order,
        });
        const nextActivePortfolioRail =
          getActiveFrameWindowItem(currentFrame, [rail]) ?? null;
        const nextActiveFocusItem =
          getActiveFrameWindowItem(currentFrame, [focusItem]) ?? null;
        const nextVisibilitySignature = [
          nextActiveHeaderItem?.title ?? "",
          nextDescriptionSignature,
          nextActivePortfolioRail ? "1" : "0",
          nextActiveFocusItem?.itemId ?? "",
        ].join(":");

        progressRef.current?.({
          progress,
          currentFrame,
          currentTime,
        });

        commitIfChanged("content", nextVisibilitySignature, () => {
          setVisualState({
            activeHeaderItem: nextActiveHeaderItem,
            activePortfolioRail: nextActivePortfolioRail,
            activeFocusItem: nextActiveFocusItem,
          });
          setVisibleDescriptionItems(nextVisibleDescriptionItems);
        });

        const marker = nextActiveFocusItem
          ? "focus"
          : nextActivePortfolioRail
            ? "portfolio"
            : nextVisibleDescriptionItems.length > 0
              ? "description"
              : nextActiveHeaderItem
                ? "header"
                : "intro";

        return `${marker}@f${currentFrame}`;
      },
    });

  return {
    sectionRef,
    videoRef,
    activeHeaderItem: visualState.activeHeaderItem,
    activePortfolioRail: visualState.activePortfolioRail,
    activeFocusItem: visualState.activeFocusItem,
    visibleDescriptionItems,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
