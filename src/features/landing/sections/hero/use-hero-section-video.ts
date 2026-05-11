"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useSectionPin } from "@/features/landing/engine/use-section-pin";

import type {
  HeroBodyItem,
  HeroSectionConfig,
  HeroSupportCardItem,
} from "./hero.types";
import { useScrollVideoScrubber, useVideoDebugLogger } from "../../engine";

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
  mobileVideoConfig: HeroSectionConfig["mobileVideoConfig"],
) {
  const activePan = pans?.find(
    (pan) => currentFrame >= pan.startFrame && currentFrame <= pan.endFrame,
  );

  if (!activePan) return null;

  const progress =
    activePan.endFrame === activePan.startFrame
      ? 1
      : (currentFrame - activePan.startFrame) /
        (activePan.endFrame - activePan.startFrame);
  const fromY = activePan.fromY ?? 0;
  const toY = activePan.toY ?? fromY;
  const fromScale = activePan.fromScale ?? 1;
  const toScale = activePan.toScale ?? fromScale;

  return {
    x: activePan.fromX + (activePan.toX - activePan.fromX) * progress,
    y: fromY + (toY - fromY) * progress,
    scale: fromScale + (toScale - fromScale) * progress,
    objectFit: mobileVideoConfig?.objectFit ?? "cover",
    objectPosition: mobileVideoConfig?.objectPosition ?? "center center",
    widthPercent: mobileVideoConfig?.widthPercent ?? 150,
    heightPercent: mobileVideoConfig?.heightPercent ?? 100,
    verticalAnchor: mobileVideoConfig?.verticalAnchor ?? "top",
  };
}

function applyMobileVideoPan(
  video: HTMLVideoElement | null,
  pan: {
    x: number;
    y: number;
    scale: number;
    objectFit: "cover" | "contain";
    objectPosition: "center center" | "center top" | "center bottom";
    widthPercent: number;
    heightPercent: number;
    verticalAnchor: "top" | "center" | "bottom";
  } | null,
) {
  if (!video) return;

  if (pan && window.innerWidth < 768) {
    video.style.width = `${pan.widthPercent}%`;
    video.style.height = `${pan.heightPercent}%`;
    video.style.maxWidth = "none";
    video.style.left = "0";
    video.style.right = "auto";
    video.style.top =
      pan.verticalAnchor === "center"
        ? `${(100 - pan.heightPercent) / 2}%`
        : pan.verticalAnchor === "bottom"
          ? "auto"
          : "0";
    video.style.bottom = pan.verticalAnchor === "bottom" ? "0" : "auto";
    video.style.objectFit = pan.objectFit;
    video.style.objectPosition = pan.objectPosition;
    video.style.transformOrigin = "center center";
    video.style.transform = `translate3d(${pan.x}%, ${pan.y}%, 0) scale(${pan.scale})`;
  } else {
    video.style.width = "";
    video.style.height = "";
    video.style.maxWidth = "";
    video.style.left = "";
    video.style.right = "";
    video.style.top = "";
    video.style.bottom = "";
    video.style.objectFit = "";
    video.style.objectPosition = "";
    video.style.transformOrigin = "";
    video.style.transform = "";
  }
}

export function useHeroSectionVideo(
  config: HeroSectionConfig,
  options: HeroSectionVideoOptions = {},
) {
  const { fps, stages, totalFrames, videoDuration, videoUrl } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrubVideo = useScrollVideoScrubber(videoRef);

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

  useLayoutEffect(() => {
    const firstPan = config.mobileVideoPan?.[0];

    if (!firstPan) return;

    applyMobileVideoPan(
      videoRef.current,
      getMobileVideoPanTransform(
        firstPan.startFrame,
        config.mobileVideoPan,
        config.mobileVideoConfig,
      ),
    );
  }, [config.mobileVideoConfig, config.mobileVideoPan]);

  const { sectionRef, isScrolled, isActive, isAtHandoff } = useSectionPin({
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
        config.mobileVideoConfig,
      );

      if (video) {
        applyMobileVideoPan(video, mobilePan);
      }

      scrubVideo(currentFrame / fps);

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
    isActive,
    isAtHandoff,
  };
}
