"use client";

import { useEffect, useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import type {
  HeroBodyItem,
  HeroSectionConfig,
  HeroSupportCardItem,
} from "../types/hero-section";
import { useVideoDebugLogger } from "./use-video-debug-logger";

interface HeroVideoState {
  lastStageId: number;
  lastBodySignature: string;
  lastSupportCardSignature: string;
}

interface HeroSectionVideoOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
}

function getMobileVideoPanTransform(
  currentFrame: number,
  pans: HeroSectionConfig["mobileVideoPan"],
) {
  const activePan = pans?.find(
    (pan) => currentFrame >= pan.startFrame && currentFrame <= pan.endFrame,
  );

  if (!activePan) return null;

  return {
    x: activePan.fromX,
    widthPercent: activePan.widthPercent ?? 150,
  };
}

function applyMobileVideoPan(
  video: HTMLVideoElement | null,
  pan: { x: number; widthPercent: number } | null,
) {
  if (!video) return;

  if (pan && window.innerWidth < 768) {
    video.style.width = `${pan.widthPercent}%`;
    video.style.maxWidth = "none";
    video.style.left = "0";
    video.style.right = "auto";
    video.style.objectFit = "cover";
    video.style.transform = `translateX(${pan.x}%)`;
  } else {
    video.style.width = "";
    video.style.maxWidth = "";
    video.style.left = "";
    video.style.right = "";
    video.style.objectFit = "";
    video.style.transform = "";
  }
}

export function useHeroSectionVideo(
  config: HeroSectionConfig,
  options: HeroSectionVideoOptions = {},
) {
  const { fps, stages, totalFrames, videoDuration, videoUrl } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stateRef = useRef<HeroVideoState>({
    lastStageId: stages[0]?.id ?? 0,
    lastBodySignature: "",
    lastSupportCardSignature: "",
  });
  const [activeStageId, setActiveStageId] = useState<number>(
    stages[0]?.id ?? 0,
  );
  const [visibleBodyItems, setVisibleBodyItems] = useState<
    readonly HeroBodyItem[]
  >([]);
  const [visibleSupportCardItems, setVisibleSupportCardItems] = useState<
    readonly HeroSupportCardItem[]
  >([]);
  const debugLogger = useVideoDebugLogger({
    label: "Hero",
    videoSrc: videoUrl,
    configuredDuration: videoDuration,
    videoRef,
  });

  useEffect(() => {
    const firstPan = config.mobileVideoPan?.[0];

    if (!firstPan) return;

    applyMobileVideoPan(videoRef.current, {
      x: firstPan.fromX,
      widthPercent: firstPan.widthPercent ?? 150,
    });
  }, [config.mobileVideoPan]);

  const { sectionRef, isScrolled } = useSectionPin({
    onEnter: options.onEnter,
    onEnterBack: options.onEnterBack,
    onUpdate: (progress) => {
      const video = videoRef.current;
      const currentTime = videoDuration * Math.min(Math.max(progress, 0), 1);
      const currentFrame = Math.round(
        Math.min(Math.max(currentTime * fps, 0), totalFrames),
      );

      const mobilePan = getMobileVideoPanTransform(
        currentFrame,
        config.mobileVideoPan,
      );

      if (video) {
        applyMobileVideoPan(video, mobilePan);
      }

      if (video && video.readyState >= 1) {
        video.currentTime = currentTime;
      }

      const { lastStageId } = stateRef.current;
      const visibleBodies = config.bodyItems
        .filter(
          (item) =>
            currentFrame >= item.fromFrame && currentFrame < item.toFrame,
        )
        .sort((a, b) => a.order - b.order);
      const nextBodySignature = visibleBodies.map((item) => item.key).join("|");
      const visibleSupportCards = config.supportCardItems
        .filter(
          (item) =>
            currentFrame >= item.fromFrame && currentFrame < item.toFrame,
        )
        .sort((a, b) => a.order - b.order);
      const nextSupportCardSignature = visibleSupportCards
        .map((item) => item.key)
        .join("|");
      const activeStage = stages.find(
        (stage) =>
          currentFrame >= stage.startFrame && currentFrame < stage.endFrame,
      );

      debugLogger.logProgress({
        progress,
        currentTime,
        marker: `${activeStage?.id ?? lastStageId}@f${currentFrame}`,
      });

      if (activeStage && activeStage.id !== lastStageId) {
        stateRef.current.lastStageId = activeStage.id;
        setActiveStageId(activeStage.id);
      }

      if (nextBodySignature !== stateRef.current.lastBodySignature) {
        stateRef.current.lastBodySignature = nextBodySignature;
        setVisibleBodyItems(visibleBodies);
      }

      if (
        nextSupportCardSignature !== stateRef.current.lastSupportCardSignature
      ) {
        stateRef.current.lastSupportCardSignature = nextSupportCardSignature;
        setVisibleSupportCardItems(visibleSupportCards);
      }
    },
  });

  return {
    sectionRef,
    videoRef,
    activeStageId,
    visibleBodyItems,
    visibleSupportCardItems,
    isScrolled,
  };
}
