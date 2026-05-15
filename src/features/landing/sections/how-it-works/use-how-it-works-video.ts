"use client";

import { useState } from "react";

import type { HowItWorksSectionConfig, HowItWorksStep } from "./how-it-works.types";
import {
  getFrameWindowVisibility,
  getVisibleFrameItemsWithSignature,
} from "../../utils/frame-window";
import {
  useFrameDrivenVideoSection,
  useSignatureCommit,
} from "../../engine";

interface HowItWorksContentVisibility {
  showHeading: boolean;
  showDescription: boolean;
  showStepRail: boolean;
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
  const { header, description, stepRail, steps } = config.contentItems;
  const commitIfChanged = useSignatureCommit<"content" | "steps">();
  const [contentVisibility, setContentVisibility] =
    useState<HowItWorksContentVisibility>({
      showHeading: true,
      showDescription: false,
      showStepRail: true,
    });
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
        const {
          visibility: nextContentVisibility,
          signature: nextContentSignature,
        } = getFrameWindowVisibility(currentFrame, {
          showHeading: header,
          showDescription: description,
          showStepRail: stepRail,
        });
        const {
          items: nextVisibleSteps,
          signature: nextStepSignature,
        } = getVisibleFrameItemsWithSignature(currentFrame, steps, {
          getSignaturePart: (step) => step.stage,
        });

        commitIfChanged("content", nextContentSignature, () => {
          setContentVisibility(nextContentVisibility);
        });

        commitIfChanged("steps", nextStepSignature, () => {
          setVisibleSteps(nextVisibleSteps);
        });

        const marker =
          nextVisibleSteps.map((step) => step.stage).join("+") ||
          (nextContentVisibility.showDescription
            ? "description"
            : nextContentVisibility.showHeading
              ? "header"
              : "idle");

        return `${marker}@f${currentFrame}`;
      },
    });

  return {
    sectionRef,
    videoRef,
    contentVisibility,
    visibleSteps,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
