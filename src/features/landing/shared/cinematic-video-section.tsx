"use client";

import type { ReactNode, RefObject } from "react";
import { Chapter } from "../engine";
import cx from "../utils/cx";

export type VideoPreloadStrategy = "eager" | "warm" | "none";

interface CinematicVideoSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  videoUrl: string;
  sectionAriaLabel?: string;
  mobileVideoUrl?: string;
  isActive?: boolean;
  isAtHandoff?: boolean;
  isolateWhenInactive?: boolean;
  isScrolled: boolean;
  sectionId?: string;
  navTheme?: "light" | "dark";
  surfaceTheme?: "light" | "dark";
  children: ReactNode;
  indicatorLabel?: string;
  indicatorDelayMs?: number;
  sectionClassName?: string;
  videoClassName?: string;
  preloadStrategy?: VideoPreloadStrategy;
  deferVideoUntilPaint?: boolean;
}

export function CinematicVideoSection({
  sectionRef,
  videoRef,
  videoUrl,
  sectionAriaLabel,
  mobileVideoUrl,
  isActive,
  isAtHandoff,
  isolateWhenInactive,
  isScrolled,
  sectionId,
  navTheme = "dark",
  surfaceTheme,
  children,
  indicatorLabel,
  indicatorDelayMs,
  sectionClassName,
  videoClassName,
  preloadStrategy,
  deferVideoUntilPaint,
}: CinematicVideoSectionProps) {
  return (
    <Chapter
      sectionRef={sectionRef}
      sectionId={sectionId}
      sectionAriaLabel={sectionAriaLabel}
      navTheme={navTheme}
      surfaceTheme={surfaceTheme}
      videoRef={videoRef}
      videoSrc={videoUrl}
      mobileVideoSrc={mobileVideoUrl}
      isActive={isActive}
      isAtHandoff={isAtHandoff}
      isolateWhenInactive={isolateWhenInactive}
      isScrolled={isScrolled}
      indicatorLabel={indicatorLabel}
      indicatorDelayMs={indicatorDelayMs}
      sectionClassName={cx("relative", sectionClassName)}
      videoClassName={videoClassName}
      preloadStrategy={preloadStrategy}
      deferVideoUntilPaint={deferVideoUntilPaint}
    >
      {children}
    </Chapter>
  );
}
