"use client";

import type {
  MobileVideoConfig,
  MobileVideoPan,
} from "../types/mobile-frame-types";

export interface ResolvedMobileVideoLayout {
  objectFit: "cover" | "contain";
  objectPosition: "center center" | "center top" | "center bottom";
  widthPercent: number;
  heightPercent: number;
  verticalAnchor: "top" | "center" | "bottom";
}

export interface ResolvedMobileVideoTransform {
  x: number;
  y: number;
  scale: number;
}

interface MobileVideoLayoutDefaults {
  objectFit?: ResolvedMobileVideoLayout["objectFit"];
  objectPosition?: ResolvedMobileVideoLayout["objectPosition"];
  widthPercent?: number;
  heightPercent?: number;
  verticalAnchor?: ResolvedMobileVideoLayout["verticalAnchor"];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getResolvedMobileVideoLayout(
  mobileVideoConfig?: MobileVideoConfig,
  defaults: MobileVideoLayoutDefaults = {},
): ResolvedMobileVideoLayout {
  return {
    objectFit: mobileVideoConfig?.objectFit ?? defaults.objectFit ?? "cover",
    objectPosition:
      mobileVideoConfig?.objectPosition ??
      defaults.objectPosition ??
      "center center",
    widthPercent: mobileVideoConfig?.widthPercent ?? defaults.widthPercent ?? 180,
    heightPercent:
      mobileVideoConfig?.heightPercent ?? defaults.heightPercent ?? 100,
    verticalAnchor:
      mobileVideoConfig?.verticalAnchor ?? defaults.verticalAnchor ?? "top",
  };
}

export function resolveMobileVideoPanTransform(
  currentFrame: number,
  pans: readonly MobileVideoPan[] | undefined,
  easing: (progress: number) => number = (progress) => progress,
): ResolvedMobileVideoTransform | null {
  const activePan = pans?.find(
    (pan) => currentFrame >= pan.startFrame && currentFrame <= pan.endFrame,
  );

  if (!activePan) return null;

  const progress =
    activePan.endFrame === activePan.startFrame
      ? 1
      : clamp(
          (currentFrame - activePan.startFrame) /
            (activePan.endFrame - activePan.startFrame),
          0,
          1,
        );
  const easedProgress = easing(progress);
  const fromY = activePan.fromY ?? 0;
  const toY = activePan.toY ?? fromY;
  const fromScale = activePan.fromScale ?? 1;
  const toScale = activePan.toScale ?? fromScale;

  return {
    x: activePan.fromX + (activePan.toX - activePan.fromX) * easedProgress,
    y: fromY + (toY - fromY) * easedProgress,
    scale: fromScale + (toScale - fromScale) * easedProgress,
  };
}

export function applyMobileVideoLayout(
  video: HTMLVideoElement | null,
  layout: ResolvedMobileVideoLayout,
  isMobile: boolean,
) {
  if (!video) return;

  if (!isMobile) {
    video.style.width = "";
    video.style.height = "";
    video.style.maxWidth = "";
    video.style.left = "";
    video.style.right = "";
    video.style.top = "";
    video.style.bottom = "";
    video.style.objectFit = "";
    video.style.objectPosition = "";
    return;
  }

  video.style.width = `${layout.widthPercent}%`;
  video.style.height = `${layout.heightPercent}%`;
  video.style.maxWidth = "none";
  video.style.left = "0";
  video.style.right = "auto";
  video.style.top =
    layout.verticalAnchor === "center"
      ? `${(100 - layout.heightPercent) / 2}%`
      : layout.verticalAnchor === "bottom"
        ? "auto"
        : "0";
  video.style.bottom = layout.verticalAnchor === "bottom" ? "0" : "auto";
  video.style.objectFit = layout.objectFit;
  video.style.objectPosition = layout.objectPosition;
}

export function applyMobileVideoTransform(
  video: HTMLVideoElement | null,
  transform: ResolvedMobileVideoTransform | null,
  isMobile: boolean,
) {
  if (!video) return;

  if (!transform || !isMobile) {
    video.style.transformOrigin = "";
    video.style.transform = "";
    return;
  }

  video.style.transformOrigin = "center center";
  video.style.transform = `translate3d(${transform.x}%, ${transform.y}%, 0) scale(${transform.scale})`;
}
