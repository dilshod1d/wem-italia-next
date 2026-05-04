"use client";

import {
  useEffect,
  useMemo,
  type ReactNode,
  type RefObject,
} from "react";
import { ScrollIndicator } from "@/features/landing/components/scroll-indicator";
import { CHAPTER_SCROLL_DISTANCE } from "./useSectionPin";
import { useIOSVideoUnlock } from "@/features/landing/hooks/use-ios-video-unlock";

interface ChapterProps {
  sectionRef: RefObject<HTMLElement | null>;
  sectionId?: string;
  navTheme?: "light" | "dark";
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoSrc?: string;
  nextVideoSrc?: string;
  isActive?: boolean;
  isAtHandoff?: boolean;
  isolateWhenInactive?: boolean;
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
  isActive = true,
  isolateWhenInactive = true,
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
  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
  }, []);

  useIOSVideoUnlock(videoRef, isIOS && isActive);

  useEffect(() => {
    if (isActive) return;

    videoRef?.current?.pause();
  }, [isActive, videoRef]);

  const isPanelVisible = !isolateWhenInactive || isActive;

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      data-nav-theme={navTheme}
      className={cx("relative", sectionClassName)}
      style={{ height: `${CHAPTER_SCROLL_DISTANCE}px` }}
    >
      <div
        aria-hidden={!isPanelVisible}
        className={cx(
          "relative z-20 h-screen w-full overflow-hidden",
          isPanelVisible ? "visible" : "invisible",
        )}
        style={{ height: "var(--landing-viewport-height, 100vh)" }}
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
          hidden={isScrolled}
          label={indicatorLabel}
          theme={navTheme}
          labelClassName={indicatorLabelClassName}
          mouseClassName={indicatorMouseClassName}
          wheelClassName={indicatorWheelClassName}
        />
      </div>
    </section>
  );
}
