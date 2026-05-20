"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { FiArrowRight } from "react-icons/fi";

import { PortfolioCard } from "./portfolio-card";
import { portfolioResultsSectionConfig } from "./portfolio-results-story";
import {
  getPortfolioRowCenterIndex,
  PORTFOLIO_TOUCH_INTENT_THRESHOLD,
  settleNullablePortfolioTrackToNearestItem,
  syncPortfolioTrackGeometry,
  type PortfolioTrackMotionState,
  updatePortfolioPointerPosition,
  updatePortfolioTouchDragPosition,
  updatePortfolioTrackScrollPosition,
  updatePortfolioWheelPosition,
} from "./portfolio-track-motion";
import { ProofMetricCard } from "./proof-metric-card";
import { usePortfolioResultsHybridVideo } from "./use-portfolio-results-hybrid-video";
import {
  BodyCopyText,
  CinematicVideoSection,
  type VideoPreloadStrategy,
} from "../../shared";
import { ensureGsap } from "../../engine";
import cx from "../../utils/cx";

const {
  videoUrl,
  contentItems: {
    header,
    portfolio: { rail, focusItem },
    proof: { section: proofSection, metrics },
  },
} =
  portfolioResultsSectionConfig;
const PORTFOLIO_ROW_CENTER_INDEX = getPortfolioRowCenterIndex(
  rail.items.length,
);

interface PortfolioResultsHybridSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
  onSectionActive?: () => void;
  preloadStrategy?: VideoPreloadStrategy;
}

export function PortfolioResultsHybridSection({
  setLogoTheme,
  onSectionActive,
  preloadStrategy = "none",
}: PortfolioResultsHybridSectionProps) {
  const [activePortfolioIndex, setActivePortfolioIndex] = useState(
    PORTFOLIO_ROW_CENTER_INDEX,
  );
  const [isFlowPortfolioActive, setIsFlowPortfolioActive] = useState(false);
  const [isMetricsArmed, setIsMetricsArmed] = useState(false);
  const [areMetricsVisible, setAreMetricsVisible] = useState(false);
  const portfolioInteractionRef = useRef<HTMLDivElement | null>(null);
  const portfolioViewportRef = useRef<HTMLDivElement | null>(null);
  const portfolioTrackRef = useRef<HTMLDivElement | null>(null);
  const flowPortfolioSectionRef = useRef<HTMLElement | null>(null);
  const metricsSectionRef = useRef<HTMLElement | null>(null);
  const metricsHeadingRef = useRef<HTMLDivElement | null>(null);
  const metricsGridRef = useRef<HTMLDivElement | null>(null);
  const metricsCtaRef = useRef<HTMLDivElement | null>(null);
  const focusIndex = rail.items.findIndex(
    (item) => item.id === focusItem.itemId,
  );
  const portfolioMotionRef = useRef<PortfolioTrackMotionState>({
    scrollOffset: 0,
    targetPointerOffset: 0,
    currentPointerOffset: 0,
    targetWheelOffset: 0,
    currentWheelOffset: 0,
    frameId: 0,
    settleTimer: null,
    activeIndex: PORTFOLIO_ROW_CENTER_INDEX,
    onActiveIndexChange: setActivePortfolioIndex,
    geometry: null,
  });
  const {
    sectionRef,
    videoRef,
    activeHeaderItem,
    activePortfolioRail,
    activeFocusItem,
    visibleDescriptionItems,
    isScrolled,
    isActive: isVideoActive,
    isAtHandoff,
  } = usePortfolioResultsHybridVideo(portfolioResultsSectionConfig, {
    onEnter: () => {
      setLogoTheme("dark");
      onSectionActive?.();
    },
    onEnterBack: () => {
      setLogoTheme("dark");
      onSectionActive?.();
    },
    onProgress: ({ currentFrame }) => {
      updatePortfolioTrackScrollPosition(
        portfolioTrackRef.current,
        portfolioViewportRef.current,
        portfolioMotionRef.current,
        currentFrame,
      );
    },
  });

  useEffect(() => {
    const motionState = portfolioMotionRef.current;

    return () => {
      cancelAnimationFrame(motionState.frameId);
      if (motionState.settleTimer !== null) {
        window.clearTimeout(motionState.settleTimer);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!(isVideoActive || isFlowPortfolioActive)) return;

    const track = portfolioTrackRef.current;
    const viewport = portfolioViewportRef.current;

    if (!track || !viewport) return;

    let frameId = 0;
    const syncGeometry = () => {
      frameId = 0;
      syncPortfolioTrackGeometry(track, viewport, portfolioMotionRef.current);
    };
    const scheduleSync = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(syncGeometry);
    };

    scheduleSync();

    const resizeObserver = new ResizeObserver(scheduleSync);
    resizeObserver.observe(track);
    resizeObserver.observe(viewport);
    window.addEventListener("resize", scheduleSync);
    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      void fontsReady.then(scheduleSync);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleSync);
    };
  }, [isFlowPortfolioActive, isVideoActive]);

  useEffect(() => {
    const interaction = portfolioInteractionRef.current;
    if (!interaction) return;

    const handleWheel = (event: WheelEvent) => {
      const isHorizontalIntent =
        Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = isHorizontalIntent
        ? event.deltaX
        : event.shiftKey
          ? event.deltaY
          : 0;

      if (delta === 0) return;

      event.preventDefault();
      updatePortfolioWheelPosition(
        portfolioTrackRef.current,
        portfolioViewportRef.current,
        portfolioMotionRef.current,
        delta,
      );
    };

    interaction.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      interaction.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const section = flowPortfolioSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFlowPortfolioActive(entry.isIntersecting);
      },
      {
        rootMargin: "0px 0px -18% 0px",
        threshold: 0.01,
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const section = metricsSectionRef.current;

    if (!section || isMetricsArmed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsMetricsArmed(true);
        observer.disconnect();
      },
      {
        rootMargin: "100% 0px",
        threshold: 0.01,
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [isMetricsArmed]);

  useLayoutEffect(() => {
    if (!isMetricsArmed) return;

    const section = metricsSectionRef.current;
    const heading = metricsHeadingRef.current;
    const grid = metricsGridRef.current;
    const cta = metricsCtaRef.current;

    if (!section || !heading || !grid || !cta) return;

    let cancelled = false;
    let cleanup = () => {};

    void ensureGsap().then(({ gsap }) => {
      if (cancelled) return;

      const ctx = gsap.context(() => {
        const cards = Array.from(
          grid.querySelectorAll<HTMLElement>("[data-metric-card]"),
        );
        const revealTargets = [heading, cta, ...cards];

        gsap.set(revealTargets, {
          autoAlpha: 0,
          y: 48,
          scale: 0.985,
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              once: true,
            },
          })
          .to(heading, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
          })
          .call(() => setAreMetricsVisible(true), [], "-=0.08")
          .to(
            cards,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.12,
            },
            "-=0.22",
          )
          .to(
            cta,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "power3.out",
            },
            "-=0.28",
          );
      }, section);

      cleanup = () => {
        ctx.revert();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [isMetricsArmed]);

  const showVideoHeader = isVideoActive && Boolean(activeHeaderItem);
  const showUnifiedHeader =
    isScrolled && (showVideoHeader || (!isVideoActive && isFlowPortfolioActive));
  const showVideoPortfolio = isVideoActive && Boolean(activePortfolioRail);
  const showSharedPortfolio =
    showVideoPortfolio || (!isVideoActive && isFlowPortfolioActive);
  const showDescription = isVideoActive && visibleDescriptionItems.length > 0;
  const useFixedPortfolio = isVideoActive;
  const isVideoFocusStage = isVideoActive && Boolean(activeFocusItem);
  const visualFocusIndex =
    isVideoFocusStage && focusIndex !== -1 ? focusIndex : activePortfolioIndex;
  const handlePortfolioPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;

    updatePortfolioPointerPosition(
      portfolioTrackRef.current,
      portfolioViewportRef.current,
      portfolioMotionRef.current,
      event.clientX,
    );
  };
  const touchState = useRef({
    startX: 0,
    lastX: 0,
    startY: 0,
    isHorizontalIntent: null as boolean | null,
    isDragging: false,
  });

  useEffect(() => {
    const el = portfolioInteractionRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchState.current.startX = e.touches[0].clientX;
      touchState.current.lastX = e.touches[0].clientX;
      touchState.current.startY = e.touches[0].clientY;
      touchState.current.isHorizontalIntent = null;
      touchState.current.isDragging = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchState.current.isDragging) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const totalX = currentX - touchState.current.startX;
      const totalY = currentY - touchState.current.startY;

      if (
        touchState.current.isHorizontalIntent === null &&
        (Math.abs(totalX) > PORTFOLIO_TOUCH_INTENT_THRESHOLD ||
          Math.abs(totalY) > PORTFOLIO_TOUCH_INTENT_THRESHOLD)
      ) {
        touchState.current.isHorizontalIntent =
          Math.abs(totalX) > Math.abs(totalY);
      }

      if (!touchState.current.isHorizontalIntent) return;

      if (e.cancelable) {
        e.preventDefault();
      }

      const delta = touchState.current.lastX - currentX;

      touchState.current.lastX = currentX;

      updatePortfolioTouchDragPosition(
        portfolioTrackRef.current,
        portfolioViewportRef.current,
        portfolioMotionRef.current,
        delta,
      );
    };

    const onTouchEnd = () => {
      if (touchState.current.isHorizontalIntent) {
        settleNullablePortfolioTrackToNearestItem(
          portfolioTrackRef.current,
          portfolioViewportRef.current,
          portfolioMotionRef.current,
        );
      }

      touchState.current.isDragging = false;
      touchState.current.isHorizontalIntent = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);
  const handlePortfolioPointerLeave = () => {
    updatePortfolioPointerPosition(
      portfolioTrackRef.current,
      portfolioViewportRef.current,
      portfolioMotionRef.current,
      null,
    );
  };
  return (
    <>
      <CinematicVideoSection
        sectionId="results"
        sectionAriaLabel="Risultati WEM Italia: portfolio, casi studio e metriche di crescita"
        sectionRef={sectionRef}
        videoRef={videoRef}
        videoUrl={videoUrl}
        mobileVideoUrl={portfolioResultsSectionConfig.mobileVideoUrl}
        isActive={isVideoActive}
        isAtHandoff={isAtHandoff}
        isolateWhenInactive={false}
        isScrolled={isScrolled}
        preloadStrategy={preloadStrategy}
        navTheme="light"
        videoClassName="md:object-[center_78%] object-[center_0%]"
      >
        <div className="relative h-full w-full" />
      </CinematicVideoSection>

      <section
        ref={flowPortfolioSectionRef}
        aria-label="Portfolio WEM Italia con casi studio in diversi settori"
        data-nav-theme="light"
        className="relative h-screen"
        style={{ height: "var(--landing-viewport-height, 100vh)" }}
      >
        <div
          className={cx(
            "landing-shell z-10 flex h-full flex-col",
            useFixedPortfolio && "fixed inset-0 z-100",
          )}
        >
          <div className="max-w-[70rem] shrink-0 text-center text-black sm:text-left">
              <p
                className={cx(
                  "text-eyebrow text-black/60 transition-all duration-700",
                  showUnifiedHeader
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0",
              )}
            >
              {header.eyebrow}
            </p>
            <h2
              className={cx(
                "heading transition-all duration-700",
                showUnifiedHeader
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              {header.title}
            </h2>
            {showDescription ? (
              <div
                className="landing-copy-gap translate-y-0 opacity-100 transition-all duration-1000"
                style={{
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <BodyCopyText
                  lines={visibleDescriptionItems.map((item) => item.text)}
                  className="text-black"
                />
              </div>
            ) : null}
          </div>

          <div className="relative flex-1 min-h-0">
            <div
              ref={portfolioInteractionRef}
              className={cx(
                "z-[32] min-h-full h-full overscroll-x-contain [touch-action:pan-y] transition-[opacity,transform]",
                showSharedPortfolio
                  ? "pointer-events-auto visible opacity-100 duration-[900ms]"
                  : "pointer-events-none invisible opacity-0 duration-0",
              )}
              onPointerMove={handlePortfolioPointerMove}
              onPointerLeave={handlePortfolioPointerLeave}
            >
              <div
                ref={portfolioViewportRef}
                className="relative h-full min-h-full w-full overflow-hidden"
              >
                <div
                  ref={portfolioTrackRef}
                  className="relative left-1/2 flex h-full w-max items-center justify-center gap-0 will-change-transform"
                  style={{
                    transform: "translate3d(calc(-50% + 0px), 0, 0)",
                  }}
                >
                  {rail.items.map((item, index) => (
                    <PortfolioCard
                      key={item.id}
                      item={item}
                      visible={showSharedPortfolio}
                      active={index === visualFocusIndex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={metricsSectionRef}
        aria-label="Metriche di risultato e proof points di WEM Italia"
        data-nav-theme="light"
        className="relative bg-white py-6 sm:py-8 lg:py-10 2xl:py-12 pt-12 sm:pt-16 lg:pt-20 2xl:pt-24"
      >
        <div className="landing-frame">
          <div
            ref={metricsHeadingRef}
            className="text-center text-black sm:text-left"
          >
            <p className="text-eyebrow text-black/60">{proofSection.eyebrow}</p>
            <h2 className="heading">{proofSection.title}</h2>
          </div>

          <div
            ref={metricsGridRef}
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
          >
            {metrics.map((metric, index) => (
              <ProofMetricCard
                key={`flow-${metric.value}`}
                metric={metric}
                visible={areMetricsVisible}
                delayMs={index * 110}
              />
            ))}
          </div>

          <div
            ref={metricsCtaRef}
            className="mt-8 flex justify-center md:mt-10"
          >
            <a
              href="#footer"
              className="group/cta inline-flex items-center gap-3 rounded-full border border-black/12 bg-white/82 px-6 py-3 font-body text-[1.05rem] font-medium tracking-tight text-black/86 shadow-[0_16px_40px_rgba(0,0,0,0.07)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-black/22 hover:shadow-[0_22px_54px_rgba(0,0,0,0.1)] md:px-8 md:py-3.5 md:text-[1.35rem]"
            >
              <span>{proofSection.cta.replace(/\s*->$/, "")}</span>
              <FiArrowRight
                aria-hidden
                className="text-[1.2em] transition-transform duration-300 group-hover/cta:translate-x-1"
              />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
