"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
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
function getResolvedVideoSrc(
  videoSrc: string | undefined,
  mobileVideoSrc: string | undefined,
) {
  if (typeof window === "undefined") return videoSrc;

  const isMobileViewport =
    window.matchMedia?.("(max-width: 767px)").matches ??
    window.innerWidth < 768;

  return isMobileViewport && mobileVideoSrc ? mobileVideoSrc : videoSrc;
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
  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
  }, []);
  const [isNearViewport, setIsNearViewport] = useState(
    preloadStrategy === "eager",
  );
  const [resolvedVideoSrc, setResolvedVideoSrc] = useState<string | undefined>(
    () =>
      preloadStrategy === "eager"
        ? getResolvedVideoSrc(videoSrc, mobileVideoSrc)
        : undefined,
  );

  useIOSVideoUnlock(videoRef, isIOS && isActive);

  useEffect(() => {
    if (isActive) return;

    videoRef?.current?.pause();
  }, [isActive, videoRef]);

  useEffect(() => {
    if (preloadStrategy === "eager") return;

    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const nextIsNearViewport = entries.some((entry) => entry.isIntersecting);

        if (nextIsNearViewport) {
          setIsNearViewport(true);
        }
      },
      {
        rootMargin: "150% 0px 150% 0px",
        threshold: 0,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [preloadStrategy, sectionRef]);

  useLayoutEffect(() => {
    if (!videoSrc) return;

    if (!isNearViewport && !isActive && preloadStrategy !== "eager") {
      return;
    }

    const syncResolvedSrc = () => {
      setResolvedVideoSrc(getResolvedVideoSrc(videoSrc, mobileVideoSrc));
    };

    syncResolvedSrc();

    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => syncResolvedSrc();

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isActive, isNearViewport, mobileVideoSrc, preloadStrategy, videoSrc]);

  const isPanelVisible = !isolateWhenInactive || isActive;
  const shouldAttachVideo =
    Boolean(videoSrc) &&
    (preloadStrategy === "eager" || isNearViewport || isActive);
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
            {shouldAttachVideo && resolvedVideoSrc ? (
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
      </div>
    </section>
  );
}
