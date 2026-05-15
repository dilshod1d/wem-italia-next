"use client";

import { useState } from "react";

import type {
  WhyWemWorksCopyItem,
  WhyWemWorksInsightBlock,
  WhyWemWorksProofPoint,
  WhyWemWorksSectionConfig,
} from "./why-wem-works.types";
import {
  getFrameWindowVisibility,
  getVisibleFrameItemsWithSignature,
} from "../../utils/frame-window";
import {
  useFrameDrivenVideoSection,
  useSignatureCommit,
} from "../../engine";

interface WhyWemWorksContentVisibility {
  showOpeningCopy: boolean;
  showOpeningCard: boolean;
  showSectionTitle: boolean;
}

interface WhyWemWorksVideoOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
}

export function useWhyWemWorksVideo(
  config: WhyWemWorksSectionConfig,
  options: WhyWemWorksVideoOptions = {},
) {
  const { fps, totalFrames, videoDuration, videoUrl } = config;
  const {
    opening,
    sectionTitle,
    copy,
    insightBlocks,
    proofPoints,
  } = config.contentItems;
  const commitIfChanged = useSignatureCommit<
    "content" | "blocks" | "copy" | "proof"
  >();
  const [contentVisibility, setContentVisibility] =
    useState<WhyWemWorksContentVisibility>({
      showOpeningCopy: true,
      showOpeningCard: false,
      showSectionTitle: false,
    });
  const [visibleCopyItems, setVisibleCopyItems] = useState<
    readonly WhyWemWorksCopyItem[]
  >([]);
  const [visibleBlocks, setVisibleBlocks] = useState<
    readonly WhyWemWorksInsightBlock[]
  >([]);
  const [visibleProofPoints, setVisibleProofPoints] = useState<
    readonly WhyWemWorksProofPoint[]
  >([]);
  const { sectionRef, videoRef, isScrolled, isActive, isAtHandoff } =
    useFrameDrivenVideoSection({
      label: "Perché Funziona",
      videoSrc: videoUrl,
      configuredDuration: videoDuration,
      fps,
      totalFrames,
      videoDuration,
      mobileVideoConfig: config.mobileVideoConfig,
      mobileVideoPan: config.mobileVideoPan,
      pinOptions: {
        onEnter: options.onEnter,
        onEnterBack: options.onEnterBack,
      },
      onFrame: ({ currentFrame }) => {
        const {
          visibility: nextContentVisibility,
          signature: nextContentSignature,
        } = getFrameWindowVisibility(currentFrame, {
          showOpeningCopy: opening.copy,
          showOpeningCard: opening.card,
          showSectionTitle: sectionTitle,
        });
        const {
          items: nextVisibleCopyItems,
          signature: nextCopySignature,
        } = getVisibleFrameItemsWithSignature(currentFrame, copy, {
          sort: (a, b) => a.order - b.order,
          getSignaturePart: (item) => item.key,
        });
        const {
          items: nextVisibleBlocks,
          signature: nextBlockSignature,
        } = getVisibleFrameItemsWithSignature(currentFrame, insightBlocks, {
          getSignaturePart: (block) => block.stage,
        });
        const {
          items: nextVisibleProofPoints,
          signature: nextProofSignature,
        } = getVisibleFrameItemsWithSignature(currentFrame, proofPoints, {
          getSignaturePart: (item) => item.titleLines.join("|"),
        });

        commitIfChanged("content", nextContentSignature, () => {
          setContentVisibility(nextContentVisibility);
        });

        commitIfChanged("blocks", nextBlockSignature, () => {
          setVisibleBlocks(nextVisibleBlocks);
        });

        commitIfChanged("copy", nextCopySignature, () => {
          setVisibleCopyItems(nextVisibleCopyItems);
        });

        commitIfChanged("proof", nextProofSignature, () => {
          setVisibleProofPoints(nextVisibleProofPoints);
        });

        const marker =
          nextVisibleProofPoints.length > 0
            ? "proof"
            : nextVisibleBlocks.map((block) => block.stage).join("+") ||
              nextVisibleCopyItems.map((item) => item.key).join("+") ||
              (nextContentVisibility.showOpeningCard
                ? "opening-card"
                : nextContentVisibility.showOpeningCopy
                  ? "opening-copy"
                  : nextContentVisibility.showSectionTitle
                    ? "section-title"
                    : "idle");

        return `${marker}@f${currentFrame}`;
      },
    });

  return {
    sectionRef,
    videoRef,
    contentVisibility,
    visibleCopyItems,
    visibleBlocks,
    visibleProofPoints,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
