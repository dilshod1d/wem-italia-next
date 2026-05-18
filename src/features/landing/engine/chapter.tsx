"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
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
  deferVideoUntilPaint?: boolean;
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
  deferVideoUntilPaint = false,
}: ChapterProps) {
  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
  }, []);
  const fallbackVideoSrc = videoSrc ?? mobileVideoSrc;
  // Keep one concrete asset attached per device class. Safari can still
  // inspect or preload fallback <source> entries even when media matches.
  const [resolvedVideoSrc, setResolvedVideoSrc] = useState<string | undefined>(
    undefined,
  );
  const [isVideoMountReady, setIsVideoMountReady] = useState(
    !deferVideoUntilPaint,
  );

  useIOSVideoUnlock(videoRef, isIOS && isActive, resolvedVideoSrc);

  const syncResolvedVideoSrc = useCallback(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const nextVideoSrc =
      mediaQuery.matches && mobileVideoSrc ? mobileVideoSrc : fallbackVideoSrc;

    setResolvedVideoSrc((currentVideoSrc) =>
      currentVideoSrc === nextVideoSrc ? currentVideoSrc : nextVideoSrc,
    );
  }, [fallbackVideoSrc, mobileVideoSrc]);

  useLayoutEffect(() => {
    if (deferVideoUntilPaint) return;
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    let frameId = requestAnimationFrame(() => {
      frameId = 0;
      syncResolvedVideoSrc();
    });

    const handleChange = () => {
      syncResolvedVideoSrc();
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    mediaQuery.addListener(handleChange);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      mediaQuery.removeListener(handleChange);
    };
  }, [deferVideoUntilPaint, syncResolvedVideoSrc]);

  useEffect(() => {
    if (!deferVideoUntilPaint) return;

    let frameId = requestAnimationFrame(() => {
      frameId = 0;
      setIsVideoMountReady(true);
      syncResolvedVideoSrc();
    });

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => {
      syncResolvedVideoSrc();
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [deferVideoUntilPaint, syncResolvedVideoSrc]);

  useEffect(() => {
    if (isActive) return;

    videoRef?.current?.pause();
  }, [isActive, videoRef]);

  const shouldAttachVideo =
    isVideoMountReady &&
    Boolean(resolvedVideoSrc) &&
    (preloadStrategy !== "none" || isActive);

  const isPanelVisible = !isolateWhenInactive || isActive;
  const shouldAutoPreload = preloadStrategy === "eager" || isActive;

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
                src={resolvedVideoSrc}
              />
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
