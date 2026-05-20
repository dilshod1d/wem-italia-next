"use client";

import { useLayoutEffect, useRef } from "react";

import type {
  MobileVideoConfig,
  MobileVideoPan,
} from "../types/mobile-frame-types";
import {
  applyMobileVideoLayout,
  applyMobileVideoTransform,
  getResolvedMobileVideoLayout,
  resolveMobileVideoPanTransform,
} from "./mobile-video-pan";
import { useScrollVideoScrubber } from "./use-scroll-video-scrubber";
import { useSectionPin } from "./use-section-pin";
import { useVideoDebugLogger } from "./use-video-debug-logger";

interface MobileVideoLayoutDefaults {
  objectFit?: "cover" | "contain";
  objectPosition?: "center center" | "center top" | "center bottom";
  widthPercent?: number;
  heightPercent?: number;
  verticalAnchor?: "top" | "center" | "bottom";
}

interface FrameDrivenSectionPinOptions {
  enabled?: boolean;
  armImmediately?: boolean;
  armMargin?: string;
  onEnter?: () => void;
  onEnterBack?: () => void;
}

interface FrameDrivenVideoSectionFrameContext {
  progress: number;
  currentTime: number;
  currentFrame: number;
  video: HTMLVideoElement | null;
  isMobileViewport: boolean;
}

interface UseFrameDrivenVideoSectionOptions {
  label: string;
  videoSrc: string;
  configuredDuration: number;
  fps: number;
  totalFrames: number;
  videoDuration: number;
  mobileVideoConfig?: MobileVideoConfig;
  mobileVideoPan?: readonly MobileVideoPan[];
  mobileVideoLayoutDefaults?: MobileVideoLayoutDefaults;
  mobilePanEasing?: (progress: number) => number;
  pinOptions?: FrameDrivenSectionPinOptions;
  onFrame: (context: FrameDrivenVideoSectionFrameContext) => string | undefined;
}

export function useFrameDrivenVideoSection({
  label,
  videoSrc,
  configuredDuration,
  fps,
  totalFrames,
  videoDuration,
  mobileVideoConfig,
  mobileVideoPan,
  mobileVideoLayoutDefaults,
  mobilePanEasing,
  pinOptions,
  onFrame,
}: UseFrameDrivenVideoSectionOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrubVideo = useScrollVideoScrubber(videoRef, { fps });
  const isMobileViewportRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const debugLogger = useVideoDebugLogger({
    label,
    videoSrc,
    configuredDuration,
    videoRef,
  });

  const { sectionRef, isScrolled, isActive, isAtHandoff } = useSectionPin({
    enabled: pinOptions?.enabled,
    armImmediately: pinOptions?.armImmediately,
    armMargin: pinOptions?.armMargin,
    onEnter: pinOptions?.onEnter,
    onEnterBack: pinOptions?.onEnterBack,
    onUpdate: (progress) => {
      const video = videoRef.current;
      const currentTime = videoDuration * Math.min(Math.max(progress, 0), 1);
      const currentFrame = Math.round(
        Math.min(Math.max(currentTime * fps, 0), totalFrames),
      );

      if (currentFrame === lastFrameRef.current) return;
      lastFrameRef.current = currentFrame;

      applyMobileVideoTransform(
        video,
        resolveMobileVideoPanTransform(
          currentFrame,
          mobileVideoPan,
          mobilePanEasing,
        ),
        isMobileViewportRef.current,
      );

      scrubVideo(currentFrame / fps);

      const marker =
        onFrame({
          progress,
          currentTime,
          currentFrame,
          video,
          isMobileViewport: isMobileViewportRef.current,
        }) ?? `f${currentFrame}`;

      debugLogger.logProgress({
        progress,
        currentTime,
        marker,
      });
    },
  });

  useLayoutEffect(() => {
    const video = videoRef.current;
    const mobileLayout = getResolvedMobileVideoLayout(
      mobileVideoConfig,
      mobileVideoLayoutDefaults,
    );
    const initialFrame = mobileVideoPan?.[0]?.startFrame ?? 0;
    const syncLayout = (matches: boolean) => {
      isMobileViewportRef.current = matches;
      applyMobileVideoLayout(video, mobileLayout, matches);
      applyMobileVideoTransform(
        video,
        resolveMobileVideoPanTransform(
          initialFrame,
          mobileVideoPan,
          mobilePanEasing,
        ),
        matches,
      );
    };

    syncLayout(window.matchMedia("(max-width: 767px)").matches);

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (event: MediaQueryListEvent) => {
      syncLayout(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [
    isActive,
    mobilePanEasing,
    mobileVideoConfig,
    mobileVideoPan,
    mobileVideoLayoutDefaults,
  ]);

  return {
    sectionRef,
    videoRef,
    isScrolled,
    isActive,
    isAtHandoff,
  };
}
