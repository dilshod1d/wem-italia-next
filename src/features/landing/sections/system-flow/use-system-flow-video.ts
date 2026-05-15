"use client";

import { useRef, useState } from "react";

import type {
  SystemFlowBodyItem,
  SystemFlowCard,
  SystemFlowHeaderItem,
  SystemFlowSectionConfig,
} from "./system-flow.types";
import {
  getActiveFrameWindowItem,
  getVisibleFrameItemsWithSignature,
} from "../../utils/frame-window";
import {
  useFrameDrivenVideoSection,
  useSignatureCommit,
} from "../../engine";

interface SystemFlowVisualState {
  activeHeaderItem: SystemFlowHeaderItem | null;
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
  const [visualState, setVisualState] = useState<SystemFlowVisualState>({
    activeHeaderItem: null,
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

        const nextActiveHeaderItem =
          getActiveFrameWindowItem(currentFrame, [header]) ?? null;
        const nextVisualState = {
          activeHeaderItem: nextActiveHeaderItem,
          isLightSurface: nextVisibleBodyItems.length > 0,
          isFinalPulse: nextVisibleCards.some(
            (card) => card.stage === "support",
          ),
        };
        const nextContentSignature = [
          nextActiveHeaderItem?.title ?? "",
          nextBodySignature,
          nextVisualState.isLightSurface ? "1" : "0",
          nextVisualState.isFinalPulse ? "1" : "0",
        ].join(":");
        const nextLogoTheme = nextVisualState.isLightSurface
          ? "dark"
          : "light";

        if (nextLogoTheme !== logoThemeRef.current) {
          logoThemeRef.current = nextLogoTheme;
          options.onLogoThemeChange?.(nextLogoTheme);
        }

        commitIfChanged("content", nextContentSignature, () => {
          setVisualState(nextVisualState);
          setVisibleBodyItems(nextVisibleBodyItems);
        });

        commitIfChanged("cards", nextCardSignature, () => {
          setVisibleCards(nextVisibleCards);
        });

        const marker =
          nextVisibleCards.map((card) => card.stage).join("+") ||
          (nextVisibleBodyItems.length > 0
            ? "body"
            : nextActiveHeaderItem
              ? "header"
              : "intro");

        return `${marker}@f${currentFrame}`;
      },
    });

  return {
    sectionRef,
    videoRef,
    activeHeaderItem: visualState.activeHeaderItem,
    isLightSurface: visualState.isLightSurface,
    isFinalPulse: visualState.isFinalPulse,
    visibleBodyItems,
    visibleCards,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
