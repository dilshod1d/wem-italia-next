"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type {
  PortfolioResultsSectionConfig,
  PortfolioResultsStageKey,
} from "./portfolio-results.types";
import { useScrollVideoScrubber, useVideoDebugLogger } from "../../engine";

gsap.registerPlugin(ScrollTrigger);

const PORTFOLIO_RESULTS_SCROLL_DISTANCE = 1800;
const PORTFOLIO_RESULTS_HANDOFF_PROGRESS = 0.985;

interface PortfolioResultsHybridVideoState {
  lastStageKey: PortfolioResultsStageKey;
}

function getMobileVideoPanTransform(
  currentFrame: number,
  pans: PortfolioResultsSectionConfig["mobileVideoPan"],
  mobileVideoConfig: PortfolioResultsSectionConfig["mobileVideoConfig"],
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

  const isMobile = window.matchMedia("(max-width: 767px)").matches;



  if (pan && isMobile) {
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

export function usePortfolioResultsHybridVideo(
  config: PortfolioResultsSectionConfig,
  options: {
    onEnter?: () => void;
    onEnterBack?: () => void;
    onProgress?: (state: {
      progress: number;
      currentFrame: number;
      currentTime: number;
    }) => void;
  } = {},
) {
  const { fps, stages, totalFrames, videoDuration, videoUrl } = config;
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrubVideo = useScrollVideoScrubber(videoRef, { fps });
  const enterRef = useRef(options.onEnter);
  const enterBackRef = useRef(options.onEnterBack);
  const progressRef = useRef(options.onProgress);
  const stateRef = useRef<PortfolioResultsHybridVideoState>({
    lastStageKey: stages[0]?.key ?? "intro",
  });
  const [activeStageKey, setActiveStageKey] =
    useState<PortfolioResultsStageKey>(stages[0]?.key ?? "intro");
  const [isScrolled, setIsScrolled] = useState(false);
  const activeRef = useRef(true);
  const handoffRef = useRef(false);
  const [isActive, setIsActive] = useState(true);
  const [isAtHandoff, setIsAtHandoff] = useState(false);
  const scrolledRef = useRef(false);
  const debugLogger = useVideoDebugLogger({
    label: "Portfolio Results",
    videoSrc: videoUrl,
    configuredDuration: videoDuration,
    videoRef,
  });

  useLayoutEffect(() => {
    enterRef.current = options.onEnter;
    enterBackRef.current = options.onEnterBack;
    progressRef.current = options.onProgress;
  }, [options.onEnter, options.onEnterBack, options.onProgress]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinTarget = section?.firstElementChild;

    if (!section || !(pinTarget instanceof HTMLElement)) return;

    const syncActive = (active: boolean) => {
      section.style.zIndex = active ? "30" : "0";

      if (active === activeRef.current) return;

      activeRef.current = active;
      setIsActive(active);
    };

    const syncHandoff = (handoff: boolean) => {
      if (handoff === handoffRef.current) return;

      handoffRef.current = handoff;
      setIsAtHandoff(handoff);
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${PORTFOLIO_RESULTS_SCROLL_DISTANCE}`,
      scrub: true,
      pin: pinTarget,
      pinSpacing: true,
      onEnter: () => {
        enterRef.current?.();
      },
      onEnterBack: () => {
        enterBackRef.current?.();
      },
      onToggle: (self) => {
        syncActive(self.isActive);
        if (!self.isActive) syncHandoff(false);
      },
      onRefresh: (self) => {
        syncActive(self.isActive);
        syncHandoff(
          self.isActive && self.progress >= PORTFOLIO_RESULTS_HANDOFF_PROGRESS,
        );
      },
      onUpdate: (self) => {
        const progress = self.progress;
        const currentTime = videoDuration * Math.min(Math.max(progress, 0), 1);
        const currentFrame = Math.round(
          Math.min(Math.max(currentTime * fps, 0), totalFrames),
        );
        const video = videoRef.current;

        const mobilePan = getMobileVideoPanTransform(
          currentFrame,
          config.mobileVideoPan,
          config.mobileVideoConfig,
        );

        applyMobileVideoPan(video, mobilePan);

        scrubVideo(currentFrame / fps);

        const activeStage = stages.find(
          (stage) =>
            currentFrame >= stage.startFrame && currentFrame < stage.endFrame,
        );
        const nextStageKey = activeStage?.key ?? stateRef.current.lastStageKey;

        debugLogger.logProgress({
          progress,
          currentTime,
          marker: `${nextStageKey}@f${currentFrame}`,
        });

        progressRef.current?.({
          progress,
          currentFrame,
          currentTime,
        });

        if (activeStage && activeStage.key !== stateRef.current.lastStageKey) {
          stateRef.current.lastStageKey = activeStage.key;
          setActiveStageKey(activeStage.key);
        }

        const nextScrolled = progress > 0.02;
        syncHandoff(
          self.isActive && progress >= PORTFOLIO_RESULTS_HANDOFF_PROGRESS,
        );

        if (nextScrolled !== scrolledRef.current) {
          scrolledRef.current = nextScrolled;
          setIsScrolled(nextScrolled);
        }
      },
    });

    syncActive(trigger.isActive);

    return () => {
      section.style.zIndex = "0";
      trigger.kill();
    };
  }, [
    fps,
    stages,
    totalFrames,
    videoDuration,
    debugLogger,
    config.mobileVideoConfig,
    config.mobileVideoPan,
    scrubVideo,
  ]);

  return {
    sectionRef,
    videoRef,
    activeStageKey,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
