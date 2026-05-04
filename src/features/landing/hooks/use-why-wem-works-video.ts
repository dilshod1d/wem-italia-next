"use client";

import { useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import type {
  WhyWemWorksOpeningPhase,
  WhyWemWorksSectionConfig,
  WhyWemWorksStageKey,
} from "../types/why-wem-works-section";
import { useVideoDebugLogger } from "./use-video-debug-logger";

interface WhyWemWorksVideoState {
  lastStageKey: WhyWemWorksStageKey;
  lastOpeningPhase: WhyWemWorksOpeningPhase;
}

interface WhyWemWorksVideoOptions {
  onEnter?: () => void;
  onEnterBack?: () => void;
}

function getMobileVideoPanTransform(
  currentFrame: number,
  pans: WhyWemWorksSectionConfig["mobileVideoPan"],
  mobileVideoConfig: WhyWemWorksSectionConfig["mobileVideoConfig"],
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
  const x = activePan.fromX + (activePan.toX - activePan.fromX) * progress;
  const y = fromY + (toY - fromY) * progress;

  return {
    x,
    y,
    scale: fromScale + (toScale - fromScale) * progress,
    objectFit: mobileVideoConfig?.objectFit ?? "cover",
    objectPosition: mobileVideoConfig?.objectPosition ?? "center center",
    widthPercent: mobileVideoConfig?.widthPercent ?? 180,
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

export function useWhyWemWorksVideo(
  config: WhyWemWorksSectionConfig,
  options: WhyWemWorksVideoOptions = {},
) {
  const { fps, opening, stages, totalFrames, videoDuration, videoUrl } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stateRef = useRef<WhyWemWorksVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
    lastOpeningPhase: "copy",
  });
  const [activeStageKey, setActiveStageKey] = useState<WhyWemWorksStageKey>(
    stages[0]?.key ?? "intro",
  );
  const [openingPhase, setOpeningPhase] =
    useState<WhyWemWorksOpeningPhase>("copy");
  const debugLogger = useVideoDebugLogger({
    label: "Perché Funziona",
    videoSrc: videoUrl,
    configuredDuration: videoDuration,
    videoRef,
  });

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

      applyMobileVideoPan(video, mobilePan);

      if (video && video.readyState >= 1) {
        video.currentTime = currentTime;
      }

      const { lastOpeningPhase, lastStageKey } = stateRef.current;
      let nextOpeningPhase: WhyWemWorksOpeningPhase = "done";

      if (currentFrame < opening.cardAppearFrame) {
        nextOpeningPhase = "copy";
      } else if (currentFrame < opening.endFrame) {
        nextOpeningPhase = "card";
      }

      const activeStage = stages.find(
        (stage) =>
          currentFrame >= stage.startFrame && currentFrame < stage.endFrame,
      );

      debugLogger.logProgress({
        progress,
        currentTime,
        marker: `${activeStage?.key ?? nextOpeningPhase ?? lastStageKey}@f${currentFrame}`,
      });

      if (activeStage && activeStage.key !== lastStageKey) {
        stateRef.current.lastStageKey = activeStage.key;
        setActiveStageKey(activeStage.key);
      }

      if (nextOpeningPhase !== lastOpeningPhase) {
        stateRef.current.lastOpeningPhase = nextOpeningPhase;
        setOpeningPhase(nextOpeningPhase);
      }
    },
  });

  return {
    sectionRef,
    videoRef,
    activeStageKey,
    openingPhase,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
