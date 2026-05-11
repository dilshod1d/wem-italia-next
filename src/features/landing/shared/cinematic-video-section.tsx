"use client";

import type { ReactNode, RefObject } from "react";
import { Chapter } from "../engine";
import cx from "../utils/cx";

interface CinematicVideoSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  videoUrl: string;
  mobileVideoUrl?: string;
  nextVideoSrc?: string;
  nextMobileVideoSrc?: string;
  isActive?: boolean;
  isAtHandoff?: boolean;
  isolateWhenInactive?: boolean;
  isScrolled: boolean;
  sectionId?: string;
  navTheme?: "light" | "dark";
  surfaceTheme?: "light" | "dark";
  children: ReactNode;
  indicatorLabel?: string;
  indicatorPersistent?: boolean;
  indicatorLabelClassName?: string;
  indicatorMouseClassName?: string;
  indicatorWheelClassName?: string;
  sectionClassName?: string;
  videoClassName?: string;
  preloadStrategy?: "eager" | "active";
}

export function CinematicVideoSection({
  sectionRef,
  videoRef,
  videoUrl,
  mobileVideoUrl,
  nextVideoSrc,
  nextMobileVideoSrc,
  isActive,
  isAtHandoff,
  isolateWhenInactive,
  isScrolled,
  sectionId,
  navTheme = "dark",
  surfaceTheme,
  children,
  indicatorLabel = "Scroll to explore",
  indicatorPersistent = false,
  indicatorLabelClassName,
  indicatorMouseClassName,
  indicatorWheelClassName,
  sectionClassName,
  videoClassName,
  preloadStrategy,
}: CinematicVideoSectionProps) {
  return (
    <Chapter
      sectionRef={sectionRef}
      sectionId={sectionId}
      navTheme={navTheme}
      surfaceTheme={surfaceTheme}
      videoRef={videoRef}
      videoSrc={videoUrl}
      mobileVideoSrc={mobileVideoUrl}
      nextVideoSrc={nextVideoSrc}
      nextMobileVideoSrc={nextMobileVideoSrc}
      isActive={isActive}
      isAtHandoff={isAtHandoff}
      isolateWhenInactive={isolateWhenInactive}
      isScrolled={isScrolled}
      indicatorLabel={indicatorLabel}
      indicatorPersistent={indicatorPersistent}
      indicatorLabelClassName={indicatorLabelClassName}
      indicatorMouseClassName={indicatorMouseClassName}
      indicatorWheelClassName={indicatorWheelClassName}
      sectionClassName={cx("relative", sectionClassName)}
      videoClassName={videoClassName}
      preloadStrategy={preloadStrategy}
    >
      {children}
    </Chapter>
  );
}
