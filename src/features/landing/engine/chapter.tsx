"use client";

import {
  useEffect,
  useMemo,
  type ReactNode,
  type RefObject,
} from "react";
import { ScrollIndicator } from "@/features/landing/shared/scroll-indicator";
import type { VideoPreloadStrategy } from "@/features/landing/shared/cinematic-video-section";
import { CHAPTER_SCROLL_DISTANCE } from "./use-section-pin";
import { useIOSVideoUnlock } from "./use-ios-video-unlock";
import cx from "../utils/cx";

interface ChapterProps {
  sectionRef: RefObject<HTMLElement | null>;
  sectionId?: string;
  sectionAriaLabel?: string;
  navTheme?: "light" | "dark";
  surfaceTheme?: "light" | "dark";
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoSrc?: string;
  mobileVideoSrc?: string;
  isActive?: boolean;
  isAtHandoff?: boolean;
  isolateWhenInactive?: boolean;
  isScrolled?: boolean;
  children: ReactNode;
  indicatorLabel?: string;
  indicatorDelayMs?: number;
  overlay?: ReactNode;
  sectionClassName?: string;
  videoClassName?: string;
  contentClassName?: string;
  preloadStrategy?: VideoPreloadStrategy;
}

export function Chapter({
  sectionRef,
  sectionId,
  sectionAriaLabel,
  navTheme = "dark",
  surfaceTheme = navTheme,
  videoRef,
  videoSrc,
  mobileVideoSrc,
  isActive = false,
  isolateWhenInactive = true,
  isScrolled = false,
  children,
  indicatorLabel,
  indicatorDelayMs,
  overlay,
  sectionClassName,
  videoClassName,
  contentClassName,
  preloadStrategy = "none",
}: ChapterProps) {
  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
  }, []);
  const fallbackVideoSrc = videoSrc ?? mobileVideoSrc;

  useIOSVideoUnlock(videoRef, isIOS && isActive);

  useEffect(() => {
    if (isActive) return;

    videoRef?.current?.pause();
  }, [isActive, videoRef]);

  const shouldAttachVideo =
    Boolean(fallbackVideoSrc) && (preloadStrategy !== "none" || isActive);

  const isPanelVisible = !isolateWhenInactive || isActive;
  const shouldAutoPreload = preloadStrategy === "eager" || isActive;
  const shouldRenderMobileSource = Boolean(mobileVideoSrc && videoSrc);
  const shouldRenderFallbackSource = Boolean(fallbackVideoSrc);

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      aria-label={sectionAriaLabel}
      data-nav-theme={navTheme}
      className={cx("relative", sectionClassName)}
      style={{ height: `${CHAPTER_SCROLL_DISTANCE}px` }}
    >
      <div className="relative z-20 h-screen w-full overflow-visible">
        <div
          className={cx(
            "relative w-full overflow-hidden",
            surfaceTheme === "light" ? "bg-white" : "bg-black",
          )}
          style={{ height: "var(--landing-viewport-height, 100vh)" }}
        >
          <div
            aria-hidden={!isPanelVisible}
            className={cx(
              "relative h-full w-full",
              isPanelVisible ? "visible" : "invisible",
            )}
          >
            {shouldAttachVideo ? (
              <video
                ref={videoRef}
                aria-hidden="true"
                tabIndex={-1}
                className={cx(
                  "absolute inset-0 h-full w-full object-cover",
                  videoClassName,
                )}
                playsInline
                muted
                preload={shouldAutoPreload ? "auto" : "metadata"}
              >
                {shouldRenderMobileSource ? (
                  <source
                    media="(max-width: 767px)"
                    src={mobileVideoSrc}
                    type="video/mp4"
                  />
                ) : null}
                {shouldRenderFallbackSource ? (
                  <source src={fallbackVideoSrc} type="video/mp4" />
                ) : null}
              </video>
            ) : null}

            <div className="absolute inset-0 z-[5]">{overlay}</div>

            <div className={cx("relative z-10 h-full w-full", contentClassName)}>
              {children}
            </div>

            {indicatorLabel ? (
              <ScrollIndicator
                hidden={isScrolled}
                label={indicatorLabel}
                theme={navTheme}
                delayMs={indicatorDelayMs}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
