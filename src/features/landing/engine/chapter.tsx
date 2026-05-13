"use client";

import {
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { ScrollIndicator } from "@/features/landing/shared/scroll-indicator";
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
  sectionAriaLabel,
  navTheme = "dark",
  surfaceTheme = navTheme,
  videoRef,
  videoSrc,
  mobileVideoSrc,
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
          aria-hidden={!isPanelVisible}
          className={cx(
            "relative w-full overflow-hidden",
            surfaceTheme === "light" ? "bg-white" : "bg-black",
            isPanelVisible ? "visible" : "invisible",
          )}
          style={{ height: "var(--landing-viewport-height, 100vh)" }}
        >
          {videoSrc ? (
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
      </div>
    </section>
  );
}
