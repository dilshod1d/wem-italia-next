"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";

import { portfolioResultsSectionConfig } from "../../data/portfolio-results-story";
import { usePortfolioResultsHybridVideo } from "../../hooks/use-portfolio-results-hybrid-video";
import { usePortfolioResultsRail } from "../../hooks/use-portfolio-results-rail";
import type {
  PortfolioResultsItem,
  PortfolioResultsMetric,
} from "../../types/portfolio-results-section";
import { CinematicVideoSection } from "../cinematic-video-section";

const { videoUrl, copy, portfolioItems, metrics, focusItemId } =
  portfolioResultsSectionConfig;
const PORTFOLIO_TRACK_START_FRAME = 72;
const PORTFOLIO_TRACK_CENTER_FRAME = 108;
const PORTFOLIO_POINTER_MAX_PAN = 460;
const PORTFOLIO_START_ITEM_ANCHOR = 0.3;
const PORTFOLIO_SETTLE_DELAY_MS = 180;
const PORTFOLIO_RAIL_SCROLL_PER_PIXEL = 1.35;
const PORTFOLIO_RAIL_MIN_SCROLL_DISTANCE = 1000;
const PORTFOLIO_RAIL_MAX_SCROLL_DISTANCE = 2400;
const PORTFOLIO_RAIL_PROOF_HOLD_DISTANCE = 260;
const METRIC_COUNT_DURATION_MS = 1600;
const metricNumberFormatter = new Intl.NumberFormat("en-US");

interface PortfolioRailGeometry {
  startOffset: number;
  endOffset: number;
  minBound: number;
  maxBound: number;
  scrollDistance: number;
  travelPortion: number;
}

interface PortfolioTrackMotionState {
  scrollOffset: number;
  targetPointerOffset: number;
  currentPointerOffset: number;
  targetWheelOffset: number;
  currentWheelOffset: number;
  frameId: number;
  settleTimer: number | null;
  activeIndex: number;
  isRailOwner: boolean;
  railGeometry: PortfolioRailGeometry | null;
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
  const imageHeightClassName =
    getPortfolioCardImageHeightClass(distanceFromFocus);

  const focusStateClassName = getPortfolioCardFocusStateClass(
    distanceFromFocus,
    focusMode,
  );

  return (
    <article
      className={cx(
        "group relative shrink-0 transition-[opacity,transform,filter] duration-700 cursor-pointer",
        active ? "z-40" : "z-30",
        visible
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-20 opacity-0",
        focusStateClassName,
      )}
      aria-hidden={!visible}
    >
        <div
          className={cx(
            "relative rounded-xl rounded-bl-none p-2.5 text-white shadow-[0_14px_38px_rgba(0,0,0,0.14)] transition-[width,filter,transform,box-shadow] duration-500 md:rounded-2xl md:rounded-bl-none md:p-4 2xl:p-5 motion-safe:hover:-translate-y-1.5",
            active
              ? "shadow-[0_30px_72px_rgba(0,0,0,0.24)] ring-2 ring-white/65 motion-safe:hover:shadow-[0_36px_82px_rgba(0,0,0,0.28)]"
              : "motion-safe:hover:shadow-[0_24px_58px_rgba(0,0,0,0.2)]",
            sizeClassName,
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
    return "w-[11.1rem] sm:w-[12.6rem] md:w-[15rem] lg:w-[16.8rem] 2xl:w-[19rem]";
  }

  if (distanceFromFocus === 1) {
    return "w-[10.2rem] sm:w-[11.6rem] md:w-[13.8rem] lg:w-[15.5rem] 2xl:w-[17.6rem]";
  }

  if (distanceFromFocus === 2) {
    return "w-[9.5rem] sm:w-[10.8rem] md:w-[12.8rem] lg:w-[14.3rem] 2xl:w-[16.2rem]";
  }

  return "w-[8.7rem] sm:w-[9.9rem] md:w-[11.8rem] lg:w-[13.2rem] 2xl:w-[15rem]";
}

function getPortfolioCardImageHeightClass(distanceFromFocus: number) {
  if (distanceFromFocus === 0) {
    return "h-[16.5rem] sm:h-[18.25rem] md:h-[21.5rem] lg:h-[24rem] 2xl:h-[27.5rem]";
  }

  if (distanceFromFocus === 1) {
    return "h-[16rem] sm:h-[17.5rem] md:h-[20.5rem] lg:h-[23rem] 2xl:h-[26.3rem]";
  }

  if (distanceFromFocus === 2) {
    return "h-[15.25rem] sm:h-[16.75rem] md:h-[19.5rem] lg:h-[22rem] 2xl:h-[25rem]";
  }

  return "h-[14.5rem] sm:h-[16rem] md:h-[18.5rem] lg:h-[20.75rem] 2xl:h-[23.8rem]";
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
      className={cx(
        "group relative flex min-h-[12.5rem] overflow-hidden rounded-[1.7rem] border bg-white/94 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.07)] backdrop-blur-sm transition-[opacity,transform,box-shadow] duration-700 sm:min-h-[13.5rem] sm:p-6 md:min-h-[17rem] md:p-7 2xl:min-h-[19rem] 2xl:p-8 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_28px_72px_rgba(0,0,0,0.11)]",
        metric.borderClassName,
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-12 scale-[0.94] opacity-0",
      )}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
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
  const [showRailProof, setShowRailProof] = useState(false);
  const portfolioInteractionRef = useRef<HTMLDivElement | null>(null);
  const portfolioViewportRef = useRef<HTMLDivElement | null>(null);
  const portfolioTrackRef = useRef<HTMLDivElement | null>(null);
  const railProofVisibleRef = useRef(false);
  const focusIndex = portfolioItems.findIndex((item) => item.id === focusItemId);
  const portfolioMotionRef = useRef<PortfolioTrackMotionState>({
    scrollOffset: 0,
    targetPointerOffset: 0,
    currentPointerOffset: 0,
    targetWheelOffset: 0,
    currentWheelOffset: 0,
    frameId: 0,
    settleTimer: null,
    activeIndex: 0,
    isRailOwner: false,
    railGeometry: null,
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
  const {
    sectionRef: railSectionRef,
    pinnedRef: railPinnedRef,
    isPinned: isRailPinned,
  } = usePortfolioResultsRail({
    onEnter: () => {
      setLogoTheme("dark");
      resetPortfolioRailMotion(portfolioMotionRef.current);
    },
    onEnterBack: () => {
      setLogoTheme("dark");
      resetPortfolioRailMotion(portfolioMotionRef.current);
    },
    onProgress: (progress) => {
      const nextShowRailProof = updatePortfolioTrackRailPosition(
        portfolioTrackRef.current,
        portfolioViewportRef.current,
        portfolioMotionRef.current,
        progress,
        focusIndex,
      );

      if (nextShowRailProof !== railProofVisibleRef.current) {
        railProofVisibleRef.current = nextShowRailProof;
        setShowRailProof(nextShowRailProof);
      }
    },
    getScrollDistance: () =>
      getPortfolioRailScrollDistance(
        portfolioTrackRef.current,
        portfolioViewportRef.current,
        focusIndex,
      ),
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

  const showTitle =
    isVideoActive &&
    (activeStageKey === "headline" ||
      activeStageKey === "narrative" ||
      activeStageKey === "portfolio" ||
      activeStageKey === "focus" ||
      activeStageKey === "proof");
  const showDescription = isVideoActive && activeStageKey === "narrative";
  const showProof = isRailPinned && showRailProof;
  const showRailPortfolioCopy = !showRailProof;
  const showSharedPortfolio =
    (isVideoActive &&
      (activeStageKey === "portfolio" ||
        activeStageKey === "focus" ||
        activeStageKey === "proof")) ||
    (isRailPinned && !showRailProof);
  const isVideoFocusStage =
    isVideoActive &&
    (activeStageKey === "focus" || activeStageKey === "proof");
  const visualFocusIndex =
    isVideoFocusStage && focusIndex !== -1
      ? focusIndex
      : activePortfolioIndex;
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
                  showTitle || showProof
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0",
                )}
              >
                {copy.eyebrow}
              </p>

              <h2
                className={cx(
                  "heading-hero transition-all duration-700",
                  showTitle || showProof
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0",
                )}
              >
                {showProof ? copy.proofTitle : copy.title}
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

            <div
              className={cx(
                "absolute bottom-[6%] left-[4%] right-[4%] transition-[opacity,transform] duration-[900ms] sm:left-[5%] sm:right-[5%]",
                showProof
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none translate-y-16 scale-[0.96] opacity-0",
              )}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                {metrics.map((metric, index) => (
                  <ProofMetricCard
                    key={metric.value}
                    metric={metric}
                    visible={showProof}
                    delayMs={index * 110}
                  />
                ))}
              </div>

              <div className="mt-8 flex justify-center md:mt-10">
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
          </div>
        </div>
      </CinematicVideoSection>

      <section
        ref={railSectionRef}
        data-nav-theme="light"
        className="relative bg-white"
      >
        <div
          ref={railPinnedRef}
          className="relative z-20 h-screen w-full overflow-hidden bg-white"
        >
          <div className="landing-shell">
            <div
              className={cx(
                "landing-copy-panel-alt text-black transition-[opacity,transform] duration-[900ms]",
                showRailPortfolioCopy
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-6 opacity-0",
              )}
            >
              <p className="text-eyebrow text-black/25">{copy.eyebrow}</p>
              <h2 className="heading-hero">{copy.title}</h2>
            </div>

            <div
              className={cx(
                "absolute inset-x-0 top-0 h-full transition-[opacity,transform] duration-[900ms]",
                showRailProof
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-10 opacity-0",
              )}
            >
              <div className="landing-copy-panel-alt text-black">
                <p className="text-eyebrow text-black/25">{copy.eyebrow}</p>
                <h2 className="heading-hero">{copy.proofTitle}</h2>
              </div>

              <div className="absolute bottom-[6%] left-[4%] right-[4%] sm:left-[5%] sm:right-[5%]">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                  {metrics.map((metric, index) => (
                    <ProofMetricCard
                      key={`rail-${metric.value}`}
                      metric={metric}
                      visible={showRailProof}
                      delayMs={index * 110}
                    />
                  ))}
                </div>

                <div className="mt-8 flex justify-center md:mt-10">
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
            </div>
          </div>
        </div>
      </section>

      <div
        ref={portfolioInteractionRef}
        className={cx(
          "fixed inset-x-0 bottom-[2%] z-[32] overscroll-x-contain transition-[opacity,transform] duration-[900ms] md:bottom-[1%]",
          showSharedPortfolio
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-12 scale-[0.98] opacity-0",
        )}
        onPointerMove={handlePortfolioPointerMove}
        onPointerLeave={handlePortfolioPointerLeave}
      >
        <div
          ref={portfolioViewportRef}
          className="overflow-visible pb-16 pt-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%] md:pb-20"
        >
          <div
            ref={portfolioTrackRef}
            className="relative left-1/2 flex w-max items-center justify-center gap-0 will-change-transform"
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
  motionState.isRailOwner = false;
  motionState.railGeometry = null;

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

function updatePortfolioTrackRailPosition(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
  progress: number,
  focusIndex: number,
) {
  if (!track) return false;
  stopPortfolioInteractionAnimation(motionState);
  motionState.isRailOwner = true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    track.style.transform = "translate3d(calc(-50% + 0px), 0, 0)";
    return progress >= 1;
  }

  const railGeometry =
    motionState.railGeometry ??
    measurePortfolioRailGeometry(track, viewport, focusIndex);

  if (!railGeometry) return false;

  motionState.railGeometry = railGeometry;

  const railTravelProgress = clamp(
    progress / railGeometry.travelPortion,
    0,
    1,
  );
  const easedProgress = 1 - Math.pow(1 - railTravelProgress, 3);

  motionState.scrollOffset =
    railGeometry.startOffset +
    (railGeometry.endOffset - railGeometry.startOffset) * easedProgress;
  const reachedTerminal =
    Math.abs(motionState.scrollOffset - railGeometry.endOffset) <= 0.5;

  if (reachedTerminal) {
    motionState.scrollOffset = railGeometry.endOffset;
    motionState.targetPointerOffset = 0;
    motionState.currentPointerOffset = 0;
    motionState.targetWheelOffset = 0;
    motionState.currentWheelOffset = 0;
  }

  applyPortfolioTrackTransform(track, viewport, motionState);
  return reachedTerminal;
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
    const bounds = getPortfolioMotionBounds(track, viewport, motionState);
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

  const bounds = getPortfolioMotionBounds(track, viewport, motionState);
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
  const bounds = getPortfolioMotionBounds(track, viewport, motionState);
  const baseOffset =
    motionState.scrollOffset + motionState.currentPointerOffset;

  motionState.targetWheelOffset = clamp(
    targetX - baseOffset,
    bounds.min - baseOffset,
    bounds.max - baseOffset,
  );

  animatePortfolioTrackMotion(track, viewport, motionState);
}

function stopPortfolioInteractionAnimation(
  motionState: PortfolioTrackMotionState,
) {
  cancelAnimationFrame(motionState.frameId);
  motionState.frameId = 0;

  if (motionState.settleTimer !== null) {
    window.clearTimeout(motionState.settleTimer);
    motionState.settleTimer = null;
  }
}

function resetPortfolioRailMotion(motionState: PortfolioTrackMotionState) {
  stopPortfolioInteractionAnimation(motionState);
  motionState.railGeometry = null;
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
  const bounds = getPortfolioMotionBounds(track, viewport, motionState);
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
  motionState: PortfolioTrackMotionState,
) {
  if (motionState.isRailOwner && motionState.railGeometry) {
    return {
      min: motionState.railGeometry.minBound,
      max: motionState.railGeometry.maxBound,
    };
  }

  return getPortfolioTrackPanBounds(track, viewport);
}

function getPortfolioRailScrollDistance(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  focusIndex: number,
) {
  if (!track) return getPortfolioRailTotalDistance(0);

  const railGeometry = measurePortfolioRailGeometry(track, viewport, focusIndex);

  if (railGeometry) return railGeometry.scrollDistance;

  return getPortfolioRailTotalDistance(getPortfolioTrackOverflow(track, viewport));
}

function measurePortfolioRailGeometry(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
  focusIndex: number,
): PortfolioRailGeometry | null {
  if (!viewport || viewport.clientWidth === 0 || track.children.length === 0) {
    return null;
  }

  const normalizedFocusIndex =
    focusIndex >= 0 ? focusIndex : Math.floor(track.children.length / 2);
  const startOffset = getPortfolioItemCenterOffsetByIndex(
    track,
    normalizedFocusIndex,
  );
  const endOffset = getPortfolioTerminalOffset(track, viewport);
  const overflow = getPortfolioTrackOverflow(track, viewport);
  const railTravel = Math.abs(endOffset - startOffset);
  const travelDistance = getPortfolioRailTravelDistance(railTravel);
  const scrollDistance = travelDistance + PORTFOLIO_RAIL_PROOF_HOLD_DISTANCE;

  return {
    startOffset,
    endOffset,
    minBound: Math.min(-overflow, endOffset),
    maxBound: Math.max(
      overflow,
      getPortfolioItemAnchorOffset(
        track,
        viewport,
        "first",
        PORTFOLIO_START_ITEM_ANCHOR,
      ),
    ),
    scrollDistance,
    travelPortion: travelDistance / scrollDistance,
  };
}

function getPortfolioRailTotalDistance(railTravel: number) {
  return (
    getPortfolioRailTravelDistance(railTravel) +
    PORTFOLIO_RAIL_PROOF_HOLD_DISTANCE
  );
}

function getPortfolioRailTravelDistance(railTravel: number) {
  const maxTravelDistance = Math.max(
    PORTFOLIO_RAIL_MIN_SCROLL_DISTANCE,
    PORTFOLIO_RAIL_MAX_SCROLL_DISTANCE - PORTFOLIO_RAIL_PROOF_HOLD_DISTANCE,
  );

  return clamp(
    Math.round(railTravel * PORTFOLIO_RAIL_SCROLL_PER_PIXEL),
    PORTFOLIO_RAIL_MIN_SCROLL_DISTANCE,
    maxTravelDistance,
  );
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
    min: Math.min(
      -overflow,
      getPortfolioTerminalOffset(track, viewport),
    ),
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

  return getPortfolioItemAnchorOffset(
    track,
    viewport,
    "last",
    terminalAnchor,
  );
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
