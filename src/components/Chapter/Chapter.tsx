"use client";

import type { ReactNode, RefObject } from "react";
import { ScrollIndicator } from "@/features/landing/components/scroll-indicator";
import { CHAPTER_SCROLL_DISTANCE } from "./useSectionPin";

interface ChapterProps {
  sectionRef: RefObject<HTMLElement | null>;
  sectionId?: string;
  navTheme?: "light" | "dark";
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoSrc?: string;
  nextVideoSrc?: string;
  isScrolled?: boolean;
  children: ReactNode;
  indicatorLabel?: string;
  indicatorPersistent?: boolean;
  indicatorLabelClassName?: string;
  indicatorMouseClassName?: string;
  indicatorWheelClassName?: string;
  overlay?: ReactNode;
  sectionClassName?: string;
  videoClassName?: string;
  contentClassName?: string;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Chapter({
  sectionRef,
  sectionId,
  navTheme = "dark",
  videoRef,
  videoSrc,
  nextVideoSrc,
  isScrolled = false,
  children,
  indicatorLabel = "Scroll to explore",
  indicatorPersistent = false,
  indicatorLabelClassName,
  indicatorMouseClassName,
  indicatorWheelClassName,
  overlay,
  sectionClassName,
  videoClassName,
  contentClassName,
}: ChapterProps) {
  return (
    <section
      id={sectionId}
      ref={sectionRef}
      data-nav-theme={navTheme}
      className={cx("relative", sectionClassName)}
      style={{ height: `${CHAPTER_SCROLL_DISTANCE}px` }}
    >
      <div
        // className="relative z-20 h-screen w-full overflow-hidden max-md:h-dvh!"
        className="relative z-20 h-[100lvh] w-full overflow-hidden md:h-screen"
      >
        {videoSrc ? (
          <video
            ref={videoRef}
            className={cx(
              "absolute inset-0 h-full w-full object-cover",
              videoClassName,
            )}
            src={videoSrc}
            playsInline
            muted
            preload="auto"
          />
        ) : null}

        {nextVideoSrc ? (
          // Hidden preload lets the next chapter start seeking immediately when
          // the pinned handoff happens.
          <video
            aria-hidden="true"
            className="hidden"
            src={nextVideoSrc}
            muted
            playsInline
            preload="auto"
          />
        ) : null}

        <div className="absolute inset-0 z-[5]">{overlay}</div>

        <div className={cx("relative z-10 h-full w-full", contentClassName)}>
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
