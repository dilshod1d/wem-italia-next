"use client";

import {
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { ScrollIndicator } from "@/features/landing/components/scroll-indicator";
import { CHAPTER_SCROLL_DISTANCE } from "./useSectionPin";
import { useIOSVideoUnlock } from "@/features/landing/hooks/use-ios-video-unlock";
import CinematicIndicator from "@/features/landing/components/cinematic-indicator";
import { useVideoReadiness } from "@/features/landing/hooks/use-video-readiness";

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
  isAtHandoff = false,
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
  const nextVideoRef = useRef<HTMLVideoElement | null>(null);
  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
  }, []);
  const isCurrentVideoReady = useVideoReadiness(
    videoRef,
    Boolean(videoSrc && isActive),
  );
  const isNextVideoReady = useVideoReadiness(
    nextVideoRef,
    Boolean(nextVideoSrc && isActive),
  );
  const shouldWaitForCurrentVideo = Boolean(
    isActive && videoSrc && !isCurrentVideoReady,
  );
  const shouldWaitForNextVideo = Boolean(
    isActive && isAtHandoff && nextVideoSrc && !isNextVideoReady,
  );
  const shouldBlockScroll =
    shouldWaitForCurrentVideo || shouldWaitForNextVideo;

  useIOSVideoUnlock(videoRef, isIOS && isActive);

  useEffect(() => {
    if (isActive) return;

    videoRef?.current?.pause();
  }, [isActive, videoRef]);

  const isPanelVisible = !isolateWhenInactive || isActive;

  useEffect(() => {
    if (!shouldBlockScroll) return;

    const lockY = window.scrollY;
    let touchStartY = 0;

    const shouldPreventForwardOnly = shouldWaitForNextVideo;
    const lockScroll = () => {
      const shouldLock = shouldWaitForCurrentVideo || window.scrollY > lockY;

      if (!shouldLock || Math.abs(window.scrollY - lockY) < 1) return;

      window.scrollTo(0, lockY);
    };
    const preventScroll = (event: Event) => {
      event.preventDefault();
      lockScroll();
    };
    const handleWheel = (event: WheelEvent) => {
      if (shouldPreventForwardOnly && event.deltaY <= 0) return;

      preventScroll(event);
    };
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const isForwardScroll = touchStartY - currentY > 0;

      if (shouldPreventForwardOnly && !isForwardScroll) return;

      preventScroll(event);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      const forwardKeys = new Set([" ", "ArrowDown", "PageDown", "End"]);
      const scrollKeys = new Set([
        ...forwardKeys,
        "ArrowUp",
        "PageUp",
        "Home",
      ]);
      const keysToBlock = shouldPreventForwardOnly ? forwardKeys : scrollKeys;

      if (!keysToBlock.has(event.key)) return;

      preventScroll(event);
    };

    window.addEventListener("wheel", handleWheel, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchstart", handleTouchStart, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchmove", handleTouchMove, {
      capture: true,
      passive: false,
    });
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("scroll", lockScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart, {
        capture: true,
      });
      window.removeEventListener("touchmove", handleTouchMove, {
        capture: true,
      });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("scroll", lockScroll);
    };
  }, [shouldBlockScroll, shouldWaitForCurrentVideo, shouldWaitForNextVideo]);

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
            ref={nextVideoRef}
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

        <CinematicIndicator isVisible={shouldBlockScroll} />

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
