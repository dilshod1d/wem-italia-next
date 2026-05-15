"use client";

import { useState } from "react";

import type {
  HowItWorksCopyItem,
  HowItWorksHeaderItem,
  HowItWorksSectionConfig,
  HowItWorksStep,
} from "./how-it-works.types";
import {
  getActiveFrameWindowItem,
  getVisibleFrameItemsWithSignature,
} from "../../utils/frame-window";
import {
  useFrameDrivenVideoSection,
  useSignatureCommit,
} from "../../engine";

interface HowItWorksVisualState {
  activeHeaderItem: HowItWorksHeaderItem | null;
  isStepRailVisible: boolean;
}

interface HowItWorksVideoOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
}

export function useHowItWorksVideo(
  config: HowItWorksSectionConfig,
  options: HowItWorksVideoOptions = {},
) {
  const { fps, totalFrames, videoDuration, videoUrl } = config;
  const { header, copy, stepRail, steps } = config.contentItems;
  const commitIfChanged = useSignatureCommit<"content" | "steps">();
  const [visualState, setVisualState] = useState<HowItWorksVisualState>({
    activeHeaderItem: header,
    isStepRailVisible: true,
  });
  const [visibleCopyItems, setVisibleCopyItems] = useState<
    readonly HowItWorksCopyItem[]
  >([]);
  const [visibleSteps, setVisibleSteps] = useState<readonly HowItWorksStep[]>(
    [],
  );

  const { sectionRef, videoRef, isScrolled, isActive, isAtHandoff } =
    useFrameDrivenVideoSection({
      label: "How It Works",
      videoSrc: videoUrl,
      configuredDuration: videoDuration,
      fps,
      totalFrames,
      videoDuration,
      mobileVideoConfig: config.mobileVideoConfig,
      mobileVideoPan: config.mobileVideoPan,
      mobilePanEasing: (value) => 1 - (1 - value) ** 3,
      pinOptions: {
        onEnter: options.onEnter,
        onEnterBack: options.onEnterBack,
      },
      onFrame: ({ currentFrame }) => {
        const nextActiveHeaderItem =
          getActiveFrameWindowItem(currentFrame, [header]) ?? null;
        const {
          items: nextVisibleCopyItems,
          signature: nextCopySignature,
        } = getVisibleFrameItemsWithSignature(currentFrame, copy, {
          getSignaturePart: (item) => item.key,
          sort: (left, right) => left.order - right.order,
        });
        const nextIsStepRailVisible = Boolean(
          getActiveFrameWindowItem(currentFrame, [stepRail]),
        );
        const {
          items: nextVisibleSteps,
          signature: nextStepSignature,
        } = getVisibleFrameItemsWithSignature(currentFrame, steps, {
          getSignaturePart: (step) => step.stage,
        });
        const nextContentSignature = [
          nextActiveHeaderItem?.title ?? "",
          nextCopySignature,
          nextIsStepRailVisible ? "1" : "0",
        ].join(":");

        commitIfChanged("content", nextContentSignature, () => {
          setVisualState({
            activeHeaderItem: nextActiveHeaderItem,
            isStepRailVisible: nextIsStepRailVisible,
          });
          setVisibleCopyItems(nextVisibleCopyItems);
        });

        commitIfChanged("steps", nextStepSignature, () => {
          setVisibleSteps(nextVisibleSteps);
        });

        const marker =
          nextVisibleSteps.map((step) => step.stage).join("+") ||
          (nextVisibleCopyItems.length > 0
            ? "description"
            : nextActiveHeaderItem
              ? "header"
              : "idle");

        return `${marker}@f${currentFrame}`;
      },
    });

  return {
    sectionRef,
    videoRef,
    activeHeaderItem: visualState.activeHeaderItem,
    isStepRailVisible: visualState.isStepRailVisible,
    visibleCopyItems,
    visibleSteps,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
