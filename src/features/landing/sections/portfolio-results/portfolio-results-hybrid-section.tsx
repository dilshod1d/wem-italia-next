"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { FiArrowRight } from "react-icons/fi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { PortfolioCard } from "./portfolio-card";
import { portfolioResultsSectionConfig } from "./portfolio-results-story";
import {
  getPortfolioRowCenterIndex,
  PORTFOLIO_TOUCH_INTENT_THRESHOLD,
  settleNullablePortfolioTrackToNearestItem,
  type PortfolioTrackMotionState,
  updatePortfolioPointerPosition,
  updatePortfolioTouchDragPosition,
  updatePortfolioTrackScrollPosition,
  updatePortfolioWheelPosition,
} from "./portfolio-track-motion";
import { ProofMetricCard } from "./proof-metric-card";
import { usePortfolioResultsHybridVideo } from "./use-portfolio-results-hybrid-video";
import { BodyCopyText, CinematicVideoSection } from "../../shared";
import cx from "../../utils/cx";

gsap.registerPlugin(ScrollTrigger);

const { videoUrl, copy, portfolioItems, metrics, focusItemId } =
  portfolioResultsSectionConfig;
const PORTFOLIO_ROW_CENTER_INDEX = getPortfolioRowCenterIndex(
  portfolioItems.length,
);

interface PortfolioResultsHybridSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

export function PortfolioResultsHybridSection({
  setLogoTheme,
}: PortfolioResultsHybridSectionProps) {
  const [activePortfolioIndex, setActivePortfolioIndex] = useState(
    PORTFOLIO_ROW_CENTER_INDEX,
  );
  const [isFlowPortfolioActive, setIsFlowPortfolioActive] = useState(false);
  const [areMetricsVisible, setAreMetricsVisible] = useState(false);
  const portfolioInteractionRef = useRef<HTMLDivElement | null>(null);
  const portfolioViewportRef = useRef<HTMLDivElement | null>(null);
  const portfolioTrackRef = useRef<HTMLDivElement | null>(null);
  const flowPortfolioSectionRef = useRef<HTMLElement | null>(null);
  const metricsSectionRef = useRef<HTMLElement | null>(null);
  const metricsHeadingRef = useRef<HTMLDivElement | null>(null);
  const metricsGridRef = useRef<HTMLDivElement | null>(null);
  const metricsCtaRef = useRef<HTMLDivElement | null>(null);
  const focusIndex = portfolioItems.findIndex(
    (item) => item.id === focusItemId,
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
  });
  const {
    sectionRef,
    videoRef,
    activeStageKey,
    isScrolled,
    isActive: isVideoActive,
    isAtHandoff,
  } = usePortfolioResultsHybridVideo(portfolioResultsSectionConfig, {
    onEnter: () => setLogoTheme("dark"),
    onEnterBack: () => setLogoTheme("dark"),
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

  useLayoutEffect(() => {
    const section = metricsSectionRef.current;
    const heading = metricsHeadingRef.current;
    const grid = metricsGridRef.current;
    const cta = metricsCtaRef.current;

    if (!section || !heading || !grid || !cta) return;

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

    return () => {
      ctx.revert();
    };
  }, []);

  const showTitle =
    isVideoActive &&
    (activeStageKey === "headline" ||
      activeStageKey === "narrative" ||
      activeStageKey === "portfolio" ||
      activeStageKey === "focus" ||
      activeStageKey === "proof");
  const showDescription = isVideoActive && activeStageKey === "narrative";
  const showVideoPortfolio =
    isVideoActive &&
    (activeStageKey === "portfolio" ||
      activeStageKey === "focus" ||
      activeStageKey === "proof");
  const showSharedPortfolio = showVideoPortfolio || isFlowPortfolioActive;
  const useFixedPortfolio = showVideoPortfolio;
  const isVideoFocusStage =
    isVideoActive && (activeStageKey === "focus" || activeStageKey === "proof");
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
        navTheme="light"
        indicatorLabel="Scroll Down"
        indicatorPersistent
        indicatorLabelClassName="normal-case text-[1.05rem] font-medium tracking-normal text-sky-200/75"
        indicatorMouseClassName="border-sky-200/55"
        indicatorWheelClassName="bg-sky-200/80"
        videoClassName="md:object-[center_78%] object-[center_0%]"
      >
        <div className="relative h-full w-full">
          <div className="landing-shell">
            <div className={cx("landing-copy-panel-alt text-black")}>
              <p
                className={cx(
                  "text-eyebrow text-black/25 transition-all duration-700 ",
                  showTitle
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0",
                )}
              >
                {copy.eyebrow}
              </p>

              <h2
                className={cx(
                  "heading transition-all duration-700",
                  showTitle
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0",
                )}
              >
                {copy.title}
              </h2>

              <div
                className={cx(
                  "landing-copy-gap transition-all duration-1000",
                  showDescription
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-6 opacity-0",
                )}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <BodyCopyText
                  lines={copy.descriptionLines}
                  className="text-black"
                />
              </div>
            </div>
          </div>
        </div>
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
          <div
            className={cx(
              "max-w-[70rem] shrink-0 text-center text-black sm:text-left",
              showSharedPortfolio
                ? "opacity-100"
                : "pointer-events-none opacity-0",
            )}
          >
            <p className="text-eyebrow text-black/25">{copy.eyebrow}</p>
            <h2 className="heading">{copy.title}</h2>
          </div>

          <div className="relative flex-1 min-h-0">
            <div
              ref={portfolioInteractionRef}
              className={cx(
                "z-[32] min-h-full h-full overscroll-x-contain [touch-action:pan-y] transition-[opacity,transform] duration-[900ms]",
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
                  {portfolioItems.map((item, index) => (
                    <PortfolioCard
                      key={item.id}
                      item={item}
                      visible={showSharedPortfolio}
                      active={index === visualFocusIndex}
                      delayMs={index * 85}
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
            <p className="text-eyebrow text-black/25">{copy.eyebrow}</p>
            <h2 className="heading">{copy.proofTitle}</h2>
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
              <span>{copy.proofCta.replace(/\s*->$/, "")}</span>
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
