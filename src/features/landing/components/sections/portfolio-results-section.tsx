"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  type PointerEvent,
} from "react";

import { portfolioResultsSectionConfig } from "../../data/portfolio-results-story";
import { usePortfolioResultsVideo } from "../../hooks/use-portfolio-results-video";
import type {
  PortfolioResultsItem,
  PortfolioResultsMetric,
} from "../../types/portfolio-results-section";
import { CinematicVideoSection } from "../cinematic-video-section";

const { videoUrl, copy, portfolioItems, metrics, focusItemId } =
  portfolioResultsSectionConfig;
const PORTFOLIO_TRACK_START_FRAME = 72;
const PORTFOLIO_TRACK_CENTER_FRAME = 90;
const PORTFOLIO_POINTER_MAX_PAN = 460;

interface PortfolioTrackMotionState {
  scrollOffset: number;
  targetPointerOffset: number;
  currentPointerOffset: number;
  targetWheelOffset: number;
  currentWheelOffset: number;
  frameId: number;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface PortfolioResultsSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

interface PortfolioCardProps {
  item: PortfolioResultsItem;
  index: number;
  visible: boolean;
  distanceFromFocus: number;
  focusMode: boolean;
  delayMs: number;
}

function PortfolioCard({
  item,
  index,
  visible,
  distanceFromFocus,
  focusMode,
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
        "group relative shrink-0 transition-[opacity,transform,filter] duration-700 z-30",
        visible
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-20 opacity-0",
        focusStateClassName,
      )}
      aria-hidden={!visible}
    >
      <div
        className={cx(
          "relative rounded-xl rounded-bl-none p-2.5 text-white shadow-[0_14px_38px_rgba(0,0,0,0.14)] transition-[width,filter,transform,box-shadow] duration-500 md:rounded-2xl md:rounded-bl-none md:p-4 motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-[0_24px_58px_rgba(0,0,0,0.2)]",
          sizeClassName,
          item.wrapperClassName,
          item.shellClassName,
        )}
        style={{
          transitionDelay: visible ? `${delayMs}ms` : "0ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="z-31 absolute left-0 top-0 flex h-10 w-[82%] items-center justify-center rounded-t-2xl rounded-br-2xl bg-inherit md:h-12">
          <h3 className="px-3 text-center font-sans text-[0.82rem] font-semibold tracking-tight sm:text-[0.9rem] md:text-[1.35rem]">
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
            className="h-full w-full object-cover object-top transition-[transform,filter] duration-500 motion-safe:group-hover:scale-[1.025] motion-safe:group-hover:brightness-[1.03]"
          />
        </div>

        <div className="absolute -bottom-12 left-0 flex h-14 w-[82%] items-center justify-center rounded-b-2xl rounded-r-2xl bg-inherit md:-bottom-14 md:h-16">
          <p className="px-3 text-center font-sans text-[0.82rem] font-semibold tracking-tight sm:text-[0.9rem] md:text-[1.35rem]">
            {item.footerLabel}
          </p>
        </div>
      </div>
    </article>
  );
}

function getPortfolioCardSizeClass(distanceFromFocus: number) {
  if (distanceFromFocus === 0) {
    return "w-[11.1rem] sm:w-[12.6rem] md:w-[15rem] lg:w-[16.8rem]";
  }

  if (distanceFromFocus === 1) {
    return "w-[10.2rem] sm:w-[11.6rem] md:w-[13.8rem] lg:w-[15.5rem]";
  }

  if (distanceFromFocus === 2) {
    return "w-[9.5rem] sm:w-[10.8rem] md:w-[12.8rem] lg:w-[14.3rem]";
  }

  return "w-[8.7rem] sm:w-[9.9rem] md:w-[11.8rem] lg:w-[13.2rem]";
}

function getPortfolioCardImageHeightClass(distanceFromFocus: number) {
  if (distanceFromFocus === 0) {
    return "h-[16.5rem] sm:h-[18.25rem] md:h-[21.5rem] lg:h-[24rem]";
  }

  if (distanceFromFocus === 1) {
    return "h-[16rem] sm:h-[17.5rem] md:h-[20.5rem] lg:h-[23rem]";
  }

  if (distanceFromFocus === 2) {
    return "h-[15.25rem] sm:h-[16.75rem] md:h-[19.5rem] lg:h-[22rem]";
  }

  return "h-[14.5rem] sm:h-[16rem] md:h-[18.5rem] lg:h-[20.75rem]";
}

function getPortfolioCardFocusStateClass(
  distanceFromFocus: number,
  focusMode: boolean,
) {
  if (!focusMode) {
    return "scale-100 opacity-100 blur-0";
  }

  if (distanceFromFocus === 0) {
    return "scale-100 opacity-100 blur-0";
  }

  if (distanceFromFocus === 1) {
    return "scale-100 opacity-100 blur-0";
  }

  if (distanceFromFocus === 2) {
    return "scale-100 opacity-95 blur-0";
  }

  return "scale-100 opacity-85 blur-0";
}

interface ProofMetricCardProps {
  metric: PortfolioResultsMetric;
  visible: boolean;
  delayMs: number;
}

function ProofMetricCard({ metric, visible, delayMs }: ProofMetricCardProps) {
  return (
    <article
      className={cx(
        "overflow-hidden rounded-[1.7rem] border bg-white shadow-[0_20px_55px_rgba(0,0,0,0.06)] transition-[opacity,transform] duration-700",
        metric.borderClassName,
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-10 scale-[0.9] opacity-0",
      )}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1.15, 0.3, 1)",
      }}
    >
      <div className="px-5 pb-5 pt-6 text-center sm:px-6 md:px-8 md:pb-8 md:pt-8">
        <div className="font-sans text-[2.15rem] font-semibold leading-none tracking-tight text-black sm:text-[2.4rem] md:text-[4rem]">
          {metric.value}
        </div>
      </div>
      <div
        className={cx(
          "px-4 py-2.5 text-center font-sans text-[0.96rem] font-semibold tracking-tight sm:px-5 sm:text-[1.05rem] md:px-6 md:py-3 md:text-[1.65rem]",
          metric.bandClassName,
        )}
      >
        {metric.label}
      </div>
      <div className="px-5 pb-6 pt-5 text-center sm:px-6 md:px-8 md:pb-8 md:pt-6">
        <p className="font-body text-[0.94rem] leading-[1.3] text-black/58 sm:text-[1rem] md:text-[1.55rem]">
          {metric.body}
        </p>
      </div>
    </article>
  );
}

export function PortfolioResultsSection({
  setLogoTheme,
}: PortfolioResultsSectionProps) {
  const portfolioInteractionRef = useRef<HTMLDivElement | null>(null);
  const portfolioViewportRef = useRef<HTMLDivElement | null>(null);
  const portfolioTrackRef = useRef<HTMLDivElement | null>(null);
  const portfolioMotionRef = useRef<PortfolioTrackMotionState>({
    scrollOffset: 0,
    targetPointerOffset: 0,
    currentPointerOffset: 0,
    targetWheelOffset: 0,
    currentWheelOffset: 0,
    frameId: 0,
  });
  const { sectionRef, videoRef, activeStageKey, isScrolled } =
    usePortfolioResultsVideo(portfolioResultsSectionConfig, {
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
    activeStageKey === "headline" ||
    activeStageKey === "narrative" ||
    activeStageKey === "portfolio" ||
    activeStageKey === "focus";
  const showDescription = activeStageKey === "narrative";
  const showPortfolio =
    activeStageKey === "portfolio" || activeStageKey === "focus";
  const showProof = activeStageKey === "proof";
  const focusIndex = portfolioItems.findIndex(
    (item) => item.id === focusItemId,
  );
  const isFocusStage = activeStageKey === "focus";
  const handlePortfolioPointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
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
      videoClassName="brightness-[1.02] contrast-[0.98] saturate-[0.94] md:object-[center_78%]"
      overlay={
        <>
          <div className="absolute inset-0 bg-white/[0.02]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/20 to-transparent" />
        </>
      }
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
            ref={portfolioInteractionRef}
            className={cx(
              "absolute inset-x-0 bottom-[13%] z-10 overscroll-x-contain transition-all duration-700",
              showPortfolio
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-12 opacity-0",
            )}
            onPointerMove={handlePortfolioPointerMove}
            onPointerLeave={handlePortfolioPointerLeave}
          >
            <div ref={portfolioViewportRef} className="overflow-visible">
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
                    visible={showPortfolio}
                    focusMode={isFocusStage}
                    distanceFromFocus={
                      focusIndex === -1 ? 0 : Math.abs(index - focusIndex)
                    }
                    delayMs={index * 85}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className={cx(
              "absolute bottom-[6%] left-[4%] right-[4%] transition-all duration-700 sm:left-[5%] sm:right-[5%]",
              showProof
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-12 opacity-0",
            )}
          >
            <div className="grid gap-5 lg:grid-cols-4">
              {metrics.map((metric, index) => (
                <ProofMetricCard
                  key={metric.value}
                  metric={metric}
                  visible={showProof}
                  delayMs={index * 110}
                />
              ))}
            </div>

            <p className="mt-10 text-center font-body text-[1.2rem] font-medium tracking-tight text-black/88 md:text-[1.9rem]">
              {copy.proofCta}
            </p>
          </div>
        </div>
      </div>
    </CinematicVideoSection>
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
  const easedProgress = 1 - Math.pow(1 - progress, 3);
  const startOffset = clamp(window.innerWidth * 0.22, 130, 330);
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
    const overflow = getPortfolioTrackOverflow(track, viewport);
    const maxPan = Math.min(overflow, PORTFOLIO_POINTER_MAX_PAN);
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

  const overflow = getPortfolioTrackOverflow(track, viewport);
  const baseOffset =
    motionState.scrollOffset + motionState.currentPointerOffset;

  motionState.targetWheelOffset = clamp(
    motionState.targetWheelOffset - delta * 0.75,
    -overflow - baseOffset,
    overflow - baseOffset,
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
  const overflow = getPortfolioTrackOverflow(track, viewport);
  const x = clamp(
    motionState.scrollOffset +
      motionState.currentPointerOffset +
      motionState.currentWheelOffset,
    -overflow,
    overflow,
  );

  track.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), 0, 0)`;
}

function getPortfolioTrackOverflow(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
) {
  if (!viewport) return 0;

  return Math.max((track.offsetWidth - viewport.clientWidth) / 2, 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
