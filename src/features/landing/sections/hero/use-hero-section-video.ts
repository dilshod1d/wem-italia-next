"use client";

import { useState } from "react";

import type {
  HeroBodyItem,
  HeroHeaderItem,
  HeroSectionConfig,
  HeroSupportCardItem,
} from "./hero.types";
import { getVisibleFrameItemsWithSignature } from "../../utils/frame-window";
import { getActiveFrameWindowItem } from "../../utils/frame-window";
import {
  useFrameDrivenVideoSection,
  useSignatureCommit,
} from "../../engine";

interface HeroSectionVideoOptions {
  pinEnabled?: boolean;
  onEnter?: () => void;
  onEnterBack?: () => void;
}

export function useHeroSectionVideo(
  config: HeroSectionConfig,
  options: HeroSectionVideoOptions = {},
) {
  const { fps, totalFrames, videoDuration, videoUrl } = config;
  const { headers, body, supportCards } = config.contentItems;
  const commitIfChanged = useSignatureCommit<
    "header" | "body" | "support-cards"
  >();
  const [activeHeaderItem, setActiveHeaderItem] = useState<
    HeroHeaderItem | undefined
  >(headers[0]);
  const [visibleBodyItems, setVisibleBodyItems] = useState<
    readonly HeroBodyItem[]
  >([]);

  const [visibleSupportCardItems, setVisibleSupportCardItems] = useState<
    readonly HeroSupportCardItem[]
  >([]);
  const { sectionRef, videoRef, isScrolled, isActive, isAtHandoff } =
    useFrameDrivenVideoSection({
      label: "Hero",
      videoSrc: videoUrl,
      configuredDuration: videoDuration,
      fps,
      totalFrames,
      videoDuration,
      mobileVideoConfig: config.mobileVideoConfig,
      mobileVideoPan: config.mobileVideoPan,
      mobileVideoLayoutDefaults: { widthPercent: 150 },
      pinOptions: {
        enabled: options.pinEnabled,
        armImmediately: true,
        onEnter: options.onEnter,
        onEnterBack: options.onEnterBack,
      },
      onFrame: ({ currentFrame }) => {
        const nextHeaderItem = getActiveFrameWindowItem(currentFrame, headers);
        const nextHeaderKey = nextHeaderItem?.key ?? "";
        const {
          items: visibleBodies,
          signature: nextBodySignature,
        } = getVisibleFrameItemsWithSignature(currentFrame, body, {
          sort: (a, b) => a.order - b.order,
          getSignaturePart: (item) => item.key,
        });
        const {
          items: visibleSupportCards,
          signature: nextSupportCardSignature,
        } = getVisibleFrameItemsWithSignature(
          currentFrame,
          supportCards,
          {
            sort: (a, b) => a.order - b.order,
            getSignaturePart: (item) => item.key,
          },
        );
        commitIfChanged("header", nextHeaderKey, () => {
          setActiveHeaderItem(nextHeaderItem);
        });

        commitIfChanged("body", nextBodySignature, () => {
          setVisibleBodyItems(visibleBodies);
        });

        commitIfChanged("support-cards", nextSupportCardSignature, () => {
          setVisibleSupportCardItems(visibleSupportCards);
        });
        return `${nextHeaderKey || visibleSupportCards[0]?.key || visibleBodies[0]?.key || "idle"}@f${currentFrame}`;
      },
    });

  return {
    sectionRef,
    videoRef,
    activeHeaderItem,
    visibleBodyItems,
    visibleSupportCardItems,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
