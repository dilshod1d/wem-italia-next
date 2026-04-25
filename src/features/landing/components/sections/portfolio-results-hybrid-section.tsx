"use client";

import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { portfolioResultsSectionConfig } from "../../data/portfolio-results-story";
import { usePortfolioResultsHybridVideo } from "../../hooks/use-portfolio-results-hybrid-video";
import type {
  PortfolioResultsItem,
  PortfolioResultsMetric,
} from "../../types/portfolio-results-section";
import { CinematicVideoSection } from "../cinematic-video-section";

gsap.registerPlugin(ScrollTrigger);

const { videoUrl, copy, portfolioItems, metrics, focusItemId } =
  portfolioResultsSectionConfig;
const PORTFOLIO_TRACK_START_FRAME = 72;
const PORTFOLIO_TRACK_CENTER_FRAME = 108;
const PORTFOLIO_POINTER_MAX_PAN = 460;
const PORTFOLIO_START_ITEM_ANCHOR = 0.9;
const PORTFOLIO_SETTLE_DELAY_MS = 180;
const METRIC_COUNT_DURATION_MS = 1600;
const metricNumberFormatter = new Intl.NumberFormat("en-US");

interface PortfolioTrackMotionState {
  scrollOffset: number;
  targetPointerOffset: number;
  currentPointerOffset: number;
  targetWheelOffset: number;
  currentWheelOffset: number;
  frameId: number;
  settleTimer: number | null;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface PortfolioResultsHybridSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

interface PortfolioCardProps {
  item: PortfolioResultsItem;
  index: number;
  visible: boolean;
  distanceFromFocus: number;
  focusMode: boolean;
  active: boolean;
  delayMs: number;
}

function PortfolioCard({
  item,
  index,
  visible,
  distanceFromFocus,
  focusMode,
  active,
  delayMs,
}: PortfolioCardProps) {
  const sizeClassName = getPortfolioCardSizeClass(distanceFromFocus);
  const imageHeightClassName = getPortfolioCardImageHeightClass();

  const focusStateClassName = getPortfolioCardFocusStateClass(
    distanceFromFocus,
    focusMode,
  );

  return (
    <article
      className={cx(
        "group relative shrink-0 cursor-pointer transition-[opacity,transform,filter,height,width] duration-700",
        active ? "z-40" : "z-30",
        visible
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-20 opacity-0",
        sizeClassName,
        focusStateClassName,
      )}
      aria-hidden={!visible}
    >
      <div
        className={cx(
          "relative h-full w-full rounded-xl rounded-bl-none p-2.5 text-white shadow-[0_14px_38px_rgba(0,0,0,0.14)] transition-[filter,transform,box-shadow] duration-500 md:rounded-2xl md:rounded-bl-none md:p-4 2xl:p-5 motion-safe:hover:-translate-y-1.5",
          active
            ? "shadow-[0_30px_72px_rgba(0,0,0,0.24)] ring-2 ring-white/65 motion-safe:hover:shadow-[0_36px_82px_rgba(0,0,0,0.28)]"
            : "motion-safe:hover:shadow-[0_24px_58px_rgba(0,0,0,0.2)]",
          item.wrapperClassName,
          item.shellClassName,
        )}
        style={{
          transitionDelay: visible ? `${delayMs}ms` : "0ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="z-31 absolute left-0 top-0 flex h-10 w-[82%] items-center justify-center rounded-t-2xl rounded-br-2xl bg-inherit md:h-12 2xl:h-14">
          <h3 className="px-3 text-center font-sans text-[0.82rem] font-semibold tracking-tight sm:text-[0.9rem] md:text-[1.35rem] 2xl:text-[1.55rem]">
            {item.title}
          </h3>
        </div>

        <div
          className={cx(
            "overflow-hidden rounded-[1.45rem] bg-transparent md:rounded-[1.7rem]",
            imageHeightClassName,
          )}
        >
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            width={300}
            height={400}
            priority={index < 3}
            className={cx(
              "h-full w-full object-cover object-top transition-[transform,filter] duration-700",
              active
                ? "brightness-[1.04] contrast-[1.03] motion-safe:group-hover:scale-[1.045] motion-safe:group-hover:-translate-y-1"
                : "motion-safe:group-hover:scale-[1.035] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:brightness-[1.03]",
            )}
          />
        </div>

        <div className="absolute -bottom-12 left-0 flex h-14 w-[82%] items-center justify-center rounded-b-2xl rounded-r-2xl bg-inherit md:-bottom-14 md:h-16 2xl:-bottom-16 2xl:h-[4.5rem]">
          <p className="px-3 text-center font-sans text-[0.82rem] font-semibold tracking-tight sm:text-[0.9rem] md:text-[1.35rem] 2xl:text-[1.55rem]">
            {item.footerLabel}
          </p>
        </div>
      </div>
    </article>
  );
}

function getPortfolioCardSizeClass(distanceFromFocus: number) {
  if (distanceFromFocus === 0) {
    return "aspect-[9/16] h-[93%]";
  }

  if (distanceFromFocus === 1) {
    return "aspect-[9/16] h-[89%]";
  }

  if (distanceFromFocus === 2) {
    return "aspect-[9/16] h-[85%]";
  }

  return "aspect-[9/16] h-[81%]";
}

function getPortfolioCardImageHeightClass() {
  return "h-full";
}

function getPortfolioCardFocusStateClass(
  distanceFromFocus: number,
  focusMode: boolean,
) {
  if (!focusMode) {
    return "opacity-95 blur-0";
  }

  if (distanceFromFocus === 0) {
    return "opacity-100 blur-0";
  }

  if (distanceFromFocus === 1) {
    return "opacity-95 blur-0";
  }

  if (distanceFromFocus === 2) {
    return "opacity-90 blur-0";
  }

  return "opacity-80 blur-0";
}

interface ProofMetricCardProps {
  metric: PortfolioResultsMetric;
  visible: boolean;
  delayMs: number;
}

interface ParsedMetricValue {
  prefix: string;
  target: number;
  suffix: string;
}

function AnimatedMetricValue({
  value,
  visible,
  delayMs,
}: {
  value: string;
  visible: boolean;
  delayMs: number;
}) {
  const [displayValue, setDisplayValue] = useState(() =>
    formatMetricValue(parseMetricValue(value), 0),
  );

  useEffect(() => {
    const parsed = parseMetricValue(value);
    let animationFrame = 0;
    let startTimer = 0;

    if (!visible) {
      startTimer = window.setTimeout(() => {
        setDisplayValue(formatMetricValue(parsed, 0));
      }, 0);

      return () => {
        window.clearTimeout(startTimer);
      };
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      startTimer = window.setTimeout(() => {
        setDisplayValue(value);
      }, delayMs);

      return () => {
        window.clearTimeout(startTimer);
      };
    }

    startTimer = window.setTimeout(() => {
      const startedAt = performance.now();

      const tick = (now: number) => {
        const progress = clamp(
          (now - startedAt) / METRIC_COUNT_DURATION_MS,
          0,
          1,
        );
        // Ease-out: quick confidence up front, then a smooth intentional settle.
        const easedProgress = 1 - Math.pow(1 - progress, 4);

        setDisplayValue(
          formatMetricValue(parsed, parsed.target * easedProgress),
        );

        if (progress < 1) {
          animationFrame = requestAnimationFrame(tick);
          return;
        }

        setDisplayValue(value);
      };

      animationFrame = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(animationFrame);
    };
  }, [delayMs, value, visible]);

  return <span aria-label={value}>{displayValue}</span>;
}

function parseMetricValue(value: string): ParsedMetricValue {
  const match = value.match(/^([^0-9-]*)([\d,]+)(.*)$/);

  if (!match) {
    return { prefix: "", target: 0, suffix: "" };
  }

  return {
    prefix: match[1],
    target: Number(match[2].replaceAll(",", "")),
    suffix: match[3],
  };
}

function formatMetricValue(metric: ParsedMetricValue, value: number) {
  return `${metric.prefix}${metricNumberFormatter.format(Math.round(value))}${
    metric.suffix
  }`;
}

function ProofMetricCard({ metric, visible, delayMs }: ProofMetricCardProps) {
  return (
    <article
      data-metric-card
      className={cx(
        "group relative flex min-h-[12.5rem] overflow-hidden rounded-[1.7rem] border bg-white/94 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.07)] backdrop-blur-sm transition-[box-shadow,transform] duration-300 sm:min-h-[13.5rem] sm:p-6 md:min-h-[17rem] md:p-7 2xl:min-h-[19rem] 2xl:p-8 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_28px_72px_rgba(0,0,0,0.11)]",
        metric.borderClassName,
      )}
    >
      <div
        aria-hidden
        className={cx("absolute inset-x-0 top-0 h-1.5", metric.bandClassName)}
      />
      <div
        aria-hidden
        className={cx(
          "pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-30 md:h-44 md:w-44",
          metric.bandClassName,
        )}
      />

      <div className="relative z-10 flex w-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <span
            className={cx(
              "rounded-full px-3 py-1.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] shadow-[0_10px_24px_rgba(0,0,0,0.08)] sm:text-[0.78rem] md:px-4 md:py-2 md:text-[0.86rem] 2xl:text-[0.98rem]",
              metric.bandClassName,
            )}
          >
            {metric.label}
          </span>

          <span
            aria-hidden
            className="mt-2 flex items-center gap-1.5 opacity-55 transition-opacity duration-500 group-hover:opacity-85"
          >
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className={cx(
                  "block rounded-full",
                  dot === 0 ? "h-2 w-2" : "h-1.5 w-1.5",
                  metric.bandClassName,
                )}
              />
            ))}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center py-6 md:py-8 2xl:py-10">
          <div className="font-sans text-[2.25rem] font-semibold leading-none tracking-tight text-black tabular-nums sm:text-[2.75rem] md:text-[4.4rem] 2xl:text-[5.2rem]">
            <AnimatedMetricValue
              value={metric.value}
              visible={visible}
              delayMs={delayMs + 160}
            />
          </div>
        </div>

        <p className="border-t border-black/8 pt-4 text-center font-body text-[0.98rem] font-medium leading-[1.28] text-black/70 sm:text-[1.05rem] md:pt-5 md:text-[1.42rem] 2xl:text-[1.62rem]">
          {metric.body}
        </p>
      </div>
    </article>
  );
}

export function PortfolioResultsHybridSection({
  setLogoTheme,
}: PortfolioResultsHybridSectionProps) {
  const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);
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
    activeIndex: 0,
    onActiveIndexChange: setActivePortfolioIndex,
  });
  const {
    sectionRef,
    videoRef,
    activeStageKey,
    isScrolled,
    isActive: isVideoActive,
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
        sectionRef={sectionRef}
        videoRef={videoRef}
        videoUrl={videoUrl}
        isScrolled={isScrolled}
        navTheme="light"
        indicatorLabel="Scroll Down"
        indicatorPersistent
        indicatorLabelClassName="normal-case text-[1.05rem] font-medium tracking-normal text-sky-200/75"
        indicatorMouseClassName="border-sky-200/55"
        indicatorWheelClassName="bg-sky-200/80"
        videoClassName="md:object-[center_78%]"
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
                  "heading-hero transition-all duration-700",
                  showTitle
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0",
                )}
              >
                {copy.title}
              </h2>

              <div
                className={cx(
                  "text-body transition-all duration-1000",
                  showDescription
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-6 opacity-0",
                )}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {copy.descriptionLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CinematicVideoSection>

      <section
        ref={flowPortfolioSectionRef}
        data-nav-theme="light"
        className="relative bg-white pb-3 pt-20 sm:pb-4 sm:pt-24 lg:pb-5 lg:pt-28 2xl:pb-6 2xl:pt-32"
      >
        <div className="landing-frame">
          <div className="max-w-[70rem] text-black">
            <p className="text-eyebrow text-black/25">{copy.eyebrow}</p>
            <h2 className="heading-hero">{copy.title}</h2>
          </div>

          <div className="relative mt-8 h-[70vh]">
            <div
              ref={portfolioInteractionRef}
              className={cx(
                "z-[32] overscroll-x-contain transition-[opacity,transform] duration-[900ms]",
                useFixedPortfolio
                  ? "fixed inset-x-0 bottom-0 top-[30%]"
                  : "relative left-1/2 h-full w-screen -translate-x-1/2",
                showSharedPortfolio
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none translate-y-12 scale-[0.98] opacity-0",
              )}
              onPointerMove={handlePortfolioPointerMove}
              onPointerLeave={handlePortfolioPointerLeave}
            >
              <div
                ref={portfolioViewportRef}
                className="h-full overflow-visible pb-8 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%] md:pb-10"
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
                      index={index}
                      visible={showSharedPortfolio}
                      focusMode={showSharedPortfolio}
                      active={index === visualFocusIndex}
                      distanceFromFocus={
                        visualFocusIndex === -1
                          ? 0
                          : Math.abs(index - visualFocusIndex)
                      }
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
        data-nav-theme="light"
        className="relative bg-white py-3 sm:py-4 lg:py-5 2xl:py-6"
      >
        <div className="landing-frame">
          <div ref={metricsHeadingRef} className="text-black">
            <p className="text-eyebrow text-black/25">{copy.eyebrow}</p>
            <h2 className="heading-hero">{copy.proofTitle}</h2>
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
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover/cta:translate-x-1"
              >
                -&gt;
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function updatePortfolioTrackScrollPosition(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
  currentFrame: number,
) {
  if (!track) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    track.style.transform = "translate3d(calc(-50% + 0px), 0, 0)";
    return;
  }

  const progress = clamp(
    (currentFrame - PORTFOLIO_TRACK_START_FRAME) /
      (PORTFOLIO_TRACK_CENTER_FRAME - PORTFOLIO_TRACK_START_FRAME),
    0,
    1,
  );
  const easedProgress = progress * progress * (3 - 2 * progress);
  const startOffset = getPortfolioItemAnchorOffset(
    track,
    viewport,
    "first",
    PORTFOLIO_START_ITEM_ANCHOR,
  );
  motionState.scrollOffset = startOffset * (1 - easedProgress);

  applyPortfolioTrackTransform(track, viewport, motionState);
}

function updatePortfolioPointerPosition(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
  clientX: number | null,
) {
  if (!track || !viewport) return;

  if (
    clientX === null ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    motionState.targetPointerOffset = 0;
  } else {
    const rect = viewport.getBoundingClientRect();
    const bounds = getPortfolioMotionBounds(track, viewport);
    const maxPan = Math.min(
      Math.max(Math.abs(bounds.min), Math.abs(bounds.max)),
      PORTFOLIO_POINTER_MAX_PAN,
    );
    const cursorProgress = clamp((clientX - rect.left) / rect.width, 0, 1);
    const direction = (0.5 - cursorProgress) * 2;

    motionState.targetPointerOffset = direction * maxPan;
  }

  animatePortfolioTrackMotion(track, viewport, motionState);
}

function updatePortfolioWheelPosition(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
  delta: number,
) {
  if (!track || !viewport) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const bounds = getPortfolioMotionBounds(track, viewport);
  const baseOffset =
    motionState.scrollOffset + motionState.currentPointerOffset;

  motionState.targetWheelOffset = clamp(
    motionState.targetWheelOffset - delta * 0.75,
    bounds.min - baseOffset,
    bounds.max - baseOffset,
  );

  if (motionState.settleTimer !== null) {
    window.clearTimeout(motionState.settleTimer);
  }

  motionState.settleTimer = window.setTimeout(() => {
    settlePortfolioTrackToNearestItem(track, viewport, motionState);
  }, PORTFOLIO_SETTLE_DELAY_MS);

  animatePortfolioTrackMotion(track, viewport, motionState);
}

function settlePortfolioTrackToNearestItem(
  track: HTMLDivElement,
  viewport: HTMLDivElement,
  motionState: PortfolioTrackMotionState,
) {
  const targetX = getNearestPortfolioItemOffset(
    track,
    motionState.scrollOffset +
      motionState.currentPointerOffset +
      motionState.currentWheelOffset,
  );
  const bounds = getPortfolioMotionBounds(track, viewport);
  const baseOffset =
    motionState.scrollOffset + motionState.currentPointerOffset;

  motionState.targetWheelOffset = clamp(
    targetX - baseOffset,
    bounds.min - baseOffset,
    bounds.max - baseOffset,
  );

  animatePortfolioTrackMotion(track, viewport, motionState);
}

function animatePortfolioTrackMotion(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
) {
  cancelAnimationFrame(motionState.frameId);

  const tick = () => {
    const pointerDelta =
      motionState.targetPointerOffset - motionState.currentPointerOffset;
    const wheelDelta =
      motionState.targetWheelOffset - motionState.currentWheelOffset;

    motionState.currentPointerOffset += pointerDelta * 0.12;
    motionState.currentWheelOffset += wheelDelta * 0.18;
    applyPortfolioTrackTransform(track, viewport, motionState);

    if (Math.abs(pointerDelta) > 0.35 || Math.abs(wheelDelta) > 0.35) {
      motionState.frameId = requestAnimationFrame(tick);
      return;
    }

    motionState.currentPointerOffset = motionState.targetPointerOffset;
    motionState.currentWheelOffset = motionState.targetWheelOffset;
    applyPortfolioTrackTransform(track, viewport, motionState);
  };

  motionState.frameId = requestAnimationFrame(tick);
}

function applyPortfolioTrackTransform(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
) {
  const bounds = getPortfolioMotionBounds(track, viewport);
  const x = clamp(
    motionState.scrollOffset +
      motionState.currentPointerOffset +
      motionState.currentWheelOffset,
    bounds.min,
    bounds.max,
  );

  track.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), 0, 0)`;
  updatePortfolioActiveIndex(track, viewport, motionState, x);
}

function getPortfolioMotionBounds(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
) {
  return getPortfolioTrackPanBounds(track, viewport);
}

function getPortfolioTrackOverflow(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
) {
  if (!viewport) return 0;

  return Math.max((track.offsetWidth - viewport.clientWidth) / 2, 0);
}

function getPortfolioTrackPanBounds(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
) {
  const overflow = getPortfolioTrackOverflow(track, viewport);

  return {
    min: Math.min(-overflow, getPortfolioTerminalOffset(track, viewport)),
    max: Math.max(
      overflow,
      getPortfolioItemAnchorOffset(
        track,
        viewport,
        "first",
        PORTFOLIO_START_ITEM_ANCHOR,
      ),
    ),
  };
}

function getPortfolioTerminalOffset(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
) {
  if (!viewport || viewport.clientWidth === 0) return 0;

  const safeInset = viewport.clientWidth >= 768 ? 24 : 16;
  const terminalAnchor = 1 - safeInset / viewport.clientWidth;

  return getPortfolioItemAnchorOffset(track, viewport, "last", terminalAnchor);
}

function getPortfolioItemAnchorOffset(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
  position: "first" | "last",
  anchor: number,
) {
  const item =
    position === "first" ? track.firstElementChild : track.lastElementChild;

  if (!(item instanceof HTMLElement) || !viewport) return 0;

  const itemAnchor =
    position === "first" ? item.offsetLeft : item.offsetLeft + item.offsetWidth;
  const viewportAnchorOffset = (anchor - 0.5) * viewport.clientWidth;

  return track.offsetWidth / 2 - itemAnchor + viewportAnchorOffset;
}

function getPortfolioItemCenterOffsetByIndex(
  track: HTMLDivElement,
  index: number,
) {
  const item = track.children.item(index);

  if (!(item instanceof HTMLElement)) return 0;

  const itemCenter = item.offsetLeft + item.offsetWidth / 2;

  return track.offsetWidth / 2 - itemCenter;
}

function getNearestPortfolioItemOffset(
  track: HTMLDivElement,
  currentOffset: number,
) {
  let nearestOffset = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  Array.from(track.children).forEach((item, index) => {
    if (!(item instanceof HTMLElement)) return;

    const itemOffset = getPortfolioItemCenterOffsetByIndex(track, index);
    const distance = Math.abs(itemOffset - currentOffset);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestOffset = itemOffset;
    }
  });

  return nearestOffset;
}

function updatePortfolioActiveIndex(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
  currentOffset: number,
) {
  if (!viewport) return;

  let nearestIndex = motionState.activeIndex;
  let nearestDistance = Number.POSITIVE_INFINITY;

  Array.from(track.children).forEach((item, index) => {
    if (!(item instanceof HTMLElement)) return;

    const itemOffset = getPortfolioItemCenterOffsetByIndex(track, index);
    const distance = Math.abs(itemOffset - currentOffset);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  if (nearestIndex !== motionState.activeIndex) {
    motionState.activeIndex = nearestIndex;
    motionState.onActiveIndexChange(nearestIndex);
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
