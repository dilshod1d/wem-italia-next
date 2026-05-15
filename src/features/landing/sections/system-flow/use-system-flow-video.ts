"use client";

import { useRef, useState } from "react";

import type {
  SystemFlowBodyItem,
  SystemFlowCard,
  SystemFlowSectionConfig,
} from "./system-flow.types";
import {
  getFrameWindowVisibility,
  getVisibleFrameItemsWithSignature,
} from "../../utils/frame-window";
import {
  useFrameDrivenVideoSection,
  useSignatureCommit,
} from "../../engine";

interface SystemFlowContentVisibility {
  showHeader: boolean;
  showBody: boolean;
  isLightSurface: boolean;
  isFinalPulse: boolean;
}

interface SystemFlowVideoOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
  onLogoThemeChange?: (theme: "light" | "dark") => void;
}

export function useSystemFlowVideo(
  config: SystemFlowSectionConfig,
  options: SystemFlowVideoOptions = {},
) {
  const { fps, totalFrames, videoDuration, videoUrl } = config;
  const { header, body, cards } = config.contentItems;
  const commitIfChanged = useSignatureCommit<"content" | "cards">();
  const logoThemeRef = useRef<"light" | "dark">("light");
  const [contentVisibility, setContentVisibility] =
    useState<SystemFlowContentVisibility>({
      showHeader: false,
      showBody: false,
      isLightSurface: false,
      isFinalPulse: false,
    });
  const [visibleCards, setVisibleCards] = useState<readonly SystemFlowCard[]>(
    [],
  );
  const [visibleBodyItems, setVisibleBodyItems] = useState<
    readonly SystemFlowBodyItem[]
  >([]);
  const { sectionRef, videoRef, isScrolled, isActive, isAtHandoff } =
    useFrameDrivenVideoSection({
      label: "System Flow",
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
          items: nextVisibleBodyItems,
          signature: nextBodySignature,
        } = getVisibleFrameItemsWithSignature(currentFrame, body, {
          getSignaturePart: (item) => item.key,
          sort: (left, right) => left.order - right.order,
        });
        const {
          items: nextVisibleCards,
          signature: nextCardSignature,
        } = getVisibleFrameItemsWithSignature(currentFrame, cards, {
          getSignaturePart: (card) => card.stage,
        });
        const {
          visibility: baseContentVisibility,
          signature: baseContentSignature,
        } = getFrameWindowVisibility(currentFrame, { showHeader: header });
        const nextContentVisibility = {
          showHeader: baseContentVisibility.showHeader,
          showBody: nextVisibleBodyItems.length > 0,
          isLightSurface: nextVisibleBodyItems.length > 0,
          isFinalPulse: nextVisibleCards.some(
            (card) => card.stage === "support",
          ),
        };
        const nextContentSignature = `${baseContentSignature}:${nextContentVisibility.showBody ? "1" : "0"}:${nextContentVisibility.isLightSurface ? "1" : "0"}:${nextBodySignature}:${nextContentVisibility.isFinalPulse ? "1" : "0"}`;
        const nextLogoTheme = nextContentVisibility.isLightSurface
          ? "dark"
          : "light";

        if (nextLogoTheme !== logoThemeRef.current) {
          logoThemeRef.current = nextLogoTheme;
          options.onLogoThemeChange?.(nextLogoTheme);
        }

        commitIfChanged("content", nextContentSignature, () => {
          setContentVisibility(nextContentVisibility);
          setVisibleBodyItems(nextVisibleBodyItems);
        });

        commitIfChanged("cards", nextCardSignature, () => {
          setVisibleCards(nextVisibleCards);
        });

        const marker =
          nextVisibleCards.map((card) => card.stage).join("+") ||
          (nextContentVisibility.showBody
            ? "body"
            : nextContentVisibility.showHeader
              ? "header"
              : "intro");

        return `${marker}@f${currentFrame}`;
      },
    });

  return {
    sectionRef,
    videoRef,
    contentVisibility,
    visibleBodyItems,
    visibleCards,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
