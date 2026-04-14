"use client";

import type { ReactNode, RefObject } from "react";
import { ScrollIndicator } from "./scroll-indicator";

interface CinematicVideoSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  videoUrl: string;
  isScrolled: boolean;
  sectionId?: string;
  navTheme?: "light" | "dark";
  children: ReactNode;
  indicatorLabel?: string;
  indicatorPersistent?: boolean;
  indicatorLabelClassName?: string;
  indicatorMouseClassName?: string;
  indicatorWheelClassName?: string;
  overlay?: ReactNode;
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
  isScrolled,
  sectionId,
  navTheme = "dark",
  children,
  indicatorLabel = "Scroll to explore",
  indicatorPersistent = false,
  indicatorLabelClassName,
  indicatorMouseClassName,
  indicatorWheelClassName,
  overlay,
  sectionClassName,
  videoClassName,
}: CinematicVideoSectionProps) {
  return (
    <section
      id={sectionId}
      ref={sectionRef}
      data-nav-theme={navTheme}
      className={cx("relative h-[400vh]", sectionClassName)}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          className={cx(
            "absolute inset-0 h-full w-full object-cover",
            videoClassName,
          )}
          src={videoUrl}
          playsInline
          muted
          preload="auto"
        />

        <div className="absolute inset-0 z-[5]">
          {overlay ?? (
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          )}
        </div>

        <div className="relative z-10 h-full w-full">
          {children}
        </div>

        <ScrollIndicator
          hidden={!indicatorPersistent && isScrolled}
          label={indicatorLabel}
          labelClassName={indicatorLabelClassName}
          mouseClassName={indicatorMouseClassName}
          wheelClassName={indicatorWheelClassName}
        />
      </div>
    </section>
  );
}
