"use client";

import type { ReactNode, RefObject } from "react";
import { Chapter } from "@/components/Chapter/Chapter";

interface CinematicVideoSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  videoUrl: string;
  nextVideoSrc?: string;
  isScrolled: boolean;
  sectionId?: string;
  navTheme?: "light" | "dark";
  children: ReactNode;
  indicatorLabel?: string;
  indicatorPersistent?: boolean;
  indicatorLabelClassName?: string;
  indicatorMouseClassName?: string;
  indicatorWheelClassName?: string;
  sectionClassName?: string;
  videoClassName?: string;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CinematicVideoSection({
  sectionRef,
  videoRef,
  videoUrl,
  nextVideoSrc,
  isScrolled,
  sectionId,
  navTheme = "dark",
  children,
  indicatorLabel = "Scroll to explore",
  indicatorPersistent = false,
  indicatorLabelClassName,
  indicatorMouseClassName,
  indicatorWheelClassName,
  sectionClassName,
  videoClassName,
}: CinematicVideoSectionProps) {
  return (
    <Chapter
      sectionRef={sectionRef}
      sectionId={sectionId}
      navTheme={navTheme}
      videoRef={videoRef}
      videoSrc={videoUrl}
      nextVideoSrc={nextVideoSrc}
      isScrolled={isScrolled}
      indicatorLabel={indicatorLabel}
      indicatorPersistent={indicatorPersistent}
      indicatorLabelClassName={indicatorLabelClassName}
      indicatorMouseClassName={indicatorMouseClassName}
      indicatorWheelClassName={indicatorWheelClassName}
      sectionClassName={cx("relative", sectionClassName)}
      videoClassName={videoClassName}
    >
      {children}
    </Chapter>
  );
}
