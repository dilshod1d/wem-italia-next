"use client";

import {
  useEffect,
  useMemo,
  useSyncExternalStore,
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
  surfaceTheme?: "light" | "dark";
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoSrc?: string;
  mobileVideoSrc?: string;
  nextVideoSrc?: string;
  nextMobileVideoSrc?: string;
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
  preloadStrategy?: "eager" | "active";
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function subscribeToHydration(onStoreChange: () => void) {
  const timeoutId = window.setTimeout(onStoreChange, 0);

  return () => window.clearTimeout(timeoutId);
}

function getHydratedSnapshot() {
  return true;
}

function getServerHydratedSnapshot() {
  return false;
}

export function Chapter({
  sectionRef,
  sectionId,
  navTheme = "dark",
  surfaceTheme = navTheme,
  videoRef,
  videoSrc,
  mobileVideoSrc,
  nextVideoSrc,
  nextMobileVideoSrc,
  isActive = true,
  isolateWhenInactive = true,
  isScrolled = false,
  children,
  indicatorLabel = "Scroll to explore",
  indicatorLabelClassName,
  indicatorMouseClassName,
  indicatorWheelClassName,
  overlay,
  sectionClassName,
  videoClassName,
  contentClassName,
  preloadStrategy = "active",
}: ChapterProps) {
  const hasMounted = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );
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
  const shouldAutoPreload =
    preloadStrategy === "eager" || (hasMounted && isActive);
  const shouldPreloadNext = Boolean(hasMounted && isActive && nextVideoSrc);

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
          surfaceTheme === "light" ? "bg-white" : "bg-black",
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
            playsInline
            muted
            preload={shouldAutoPreload ? "auto" : "metadata"}
          >
            {mobileVideoSrc ? (
              <source
                src={mobileVideoSrc}
                media="(max-width: 767px)"
                type="video/mp4"
              />
            ) : null}
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : null}

        {shouldPreloadNext && nextVideoSrc ? (
          // Hidden preload lets the next chapter start seeking immediately when
          // the pinned handoff happens.
          <video
            aria-hidden="true"
            className="hidden"
            muted
            playsInline
            preload="auto"
          >
            {nextMobileVideoSrc ? (
              <source
                src={nextMobileVideoSrc}
                media="(max-width: 767px)"
                type="video/mp4"
              />
            ) : null}
            <source src={nextVideoSrc} type="video/mp4" />
          </video>
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
