"use client";

import { useState } from "react";

import type {
  WhyWemWorksCopyItem,
  WhyWemWorksInsightBlock,
  WhyWemWorksOpeningBodyItem,
  WhyWemWorksOpeningCardItem,
  WhyWemWorksOpeningCopyItem,
  WhyWemWorksProofPoint,
  WhyWemWorksSectionTitleItem,
  WhyWemWorksSectionConfig,
} from "./why-wem-works.types";
import {
  getActiveFrameWindowItem,
  getVisibleFrameItemsWithSignature,
} from "../../utils/frame-window";
import {
  useFrameDrivenVideoSection,
  useSignatureCommit,
} from "../../engine";

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
  const [activeOpeningHeaderItem, setActiveOpeningHeaderItem] = useState<
    WhyWemWorksOpeningCopyItem | null
  >(opening.header);
  const [activeOpeningCardItem, setActiveOpeningCardItem] = useState<
    WhyWemWorksOpeningCardItem | null
  >(null);
  const [activeSectionTitleItem, setActiveSectionTitleItem] = useState<
    WhyWemWorksSectionTitleItem | null
  >(null);
  const [visibleOpeningBodyItems, setVisibleOpeningBodyItems] = useState<
    readonly WhyWemWorksOpeningBodyItem[]
  >([]);
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
        const nextActiveOpeningHeaderItem =
          getActiveFrameWindowItem(currentFrame, [opening.header]) ?? null;
        const nextActiveOpeningCardItem =
          getActiveFrameWindowItem(currentFrame, [opening.card]) ?? null;
        const nextActiveSectionTitleItem =
          getActiveFrameWindowItem(currentFrame, [sectionTitle]) ?? null;
        const {
          items: nextVisibleOpeningBodyItems,
          signature: nextOpeningBodySignature,
        } = getVisibleFrameItemsWithSignature(currentFrame, opening.body, {
          sort: (a, b) => a.order - b.order,
          getSignaturePart: (item) => item.key,
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

        const nextContentSignature = [
          nextActiveOpeningHeaderItem?.titleLines.join("|") ?? "",
          nextOpeningBodySignature,
          nextActiveOpeningCardItem?.card.title ?? "",
          nextActiveSectionTitleItem?.text ?? "",
        ].join(":");

        commitIfChanged("content", nextContentSignature, () => {
          setActiveOpeningHeaderItem(nextActiveOpeningHeaderItem);
          setVisibleOpeningBodyItems(nextVisibleOpeningBodyItems);
          setActiveOpeningCardItem(nextActiveOpeningCardItem);
          setActiveSectionTitleItem(nextActiveSectionTitleItem);
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
              nextOpeningBodySignature ||
              (nextActiveOpeningCardItem
                ? "opening-card"
                : nextActiveOpeningHeaderItem
                  ? "opening-copy"
                  : nextActiveSectionTitleItem
                    ? "section-title"
                    : "idle");

        return `${marker}@f${currentFrame}`;
      },
    });

  return {
    sectionRef,
    videoRef,
    activeOpeningHeaderItem,
    visibleOpeningBodyItems,
    activeOpeningCardItem,
    activeSectionTitleItem,
    visibleCopyItems,
    visibleBlocks,
    visibleProofPoints,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
