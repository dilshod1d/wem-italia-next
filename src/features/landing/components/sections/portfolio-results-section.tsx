"use client";

import Image from "next/image";

import { portfolioResultsSectionConfig } from "../../data/portfolio-results-story";
import { usePortfolioResultsVideo } from "../../hooks/use-portfolio-results-video";
import type {
  PortfolioResultsItem,
  PortfolioResultsMetric,
} from "../../types/portfolio-results-section";
import { CinematicVideoSection } from "../cinematic-video-section";

const { videoUrl, copy, portfolioItems, metrics, focusItemId } =
  portfolioResultsSectionConfig;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface PortfolioCardProps {
  item: PortfolioResultsItem;
  index: number;
  visible: boolean;
  focused: boolean;
  dimmed: boolean;
  delayMs: number;
}

function PortfolioCard({
  item,
  index,
  visible,
  focused,
  dimmed,
  delayMs,
}: PortfolioCardProps) {
  return (
    <article
      className={cx(
        "shrink-0 transition-[opacity,transform,filter] duration-700",
        visible
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-20 opacity-0",
        focused ? "z-20" : "z-10",
        dimmed ? "blur-[2.5px]" : "",
      )}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className={cx(
          "w-[8.4rem] rounded-xl rounded-bl-0 p-2.5  text-white",
          "sm:w-[9.6rem]",
          "md:w-[11.2rem] md:rounded-2xl md:rounded-bl-0 md:p-4",
          "lg:w-[12.4rem]",
          item.wrapperClassName,
          item.shellClassName,
          focused
            ? "scale-[1.04] md:-translate-y-5"
            : dimmed
              ? "scale-[0.88] opacity-70"
              : "scale-[0.95]",
        )}
      >
        <div className="absolute top-0 left-0 w-[80%] h-10 bg-inherit rounded-t-2xl rounded-br-2xl flex items-center justify-center">
          <h3 className="font-sans text-[1.1rem] font-semibold tracking-tight md:text-[1.35rem] text-center">
            {item.title}
          </h3>
        </div>

        <div className="overflow-hidden rounded-[1.45rem] bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] md:rounded-[1.7rem]">
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            width={300}
            height={400}
            priority={index < 3}
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="absolute -bottom-12 h-16 left-0 w-[80%] bg-inherit rounded-bl-2xl rounded-br-2xl flex items-center justify-center">
          <p className="font-sans text-[1.05rem] font-semibold tracking-tight md:text-[1.35rem] text-center">
            {item.footerLabel}
          </p>
        </div>
      </div>
    </article>
  );
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
      <div className="px-6 pb-6 pt-7 text-center md:px-8 md:pb-8 md:pt-8">
        <div className="font-sans text-[2.7rem] font-semibold leading-none tracking-tight text-black md:text-[4rem]">
          {metric.value}
        </div>
      </div>
      <div
        className={cx(
          "px-5 py-3 text-center font-sans text-[1.2rem] font-semibold tracking-tight md:px-6 md:text-[1.65rem]",
          metric.bandClassName,
        )}
      >
        {metric.label}
      </div>
      <div className="px-6 pb-7 pt-6 text-center md:px-8 md:pb-8">
        <p className="font-body text-[1.05rem] leading-[1.28] text-black/58 md:text-[1.55rem]">
          {metric.body}
        </p>
      </div>
    </article>
  );
}

export function PortfolioResultsSection() {
  const { sectionRef, videoRef, activeStageKey, isScrolled } =
    usePortfolioResultsVideo(portfolioResultsSectionConfig);

  const showTitle =
    activeStageKey === "headline" ||
    activeStageKey === "narrative" ||
    activeStageKey === "portfolio" ||
    activeStageKey === "focus";
  const showDescription =
    activeStageKey === "narrative" ||
    activeStageKey === "portfolio" ||
    activeStageKey === "focus";
  const showPortfolio =
    activeStageKey === "portfolio" || activeStageKey === "focus";
  const showProof = activeStageKey === "proof";
  const focusIndex = portfolioItems.findIndex(
    (item) => item.id === focusItemId,
  );
  const isFocusStage = activeStageKey === "focus";

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
      videoClassName="object-[center_78%] brightness-[1.02] contrast-[0.98] saturate-[0.94]"
      overlay={
        <>
          <div className="absolute inset-0 bg-white/[0.02]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/20 to-transparent" />
        </>
      }
    >
      <div className="relative h-full w-full">
        <div className="absolute inset-0 mx-auto max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16">
          <div
            className={cx(
              "absolute left-6 max-w-[min(94vw,1480px)] text-black transition-all duration-700 sm:left-10 lg:left-16",
              showProof
                ? "top-[14%]"
                : showDescription
                  ? "top-[14%]"
                  : showTitle
                    ? "top-[22%]"
                    : "top-[27%]",
            )}
          >
            <p
              className={cx(
                "font-body text-[1.55rem] font-light tracking-tight text-black/25 transition-all duration-700 md:text-[3.2rem]",
                showTitle || showProof
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              {copy.eyebrow}
            </p>

            <h2
              className={cx(
                "mt-1 font-sans text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[0.92] tracking-tight transition-all duration-700",
                showTitle || showProof
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              {showProof ? copy.proofTitle : copy.title}
            </h2>

            <div
              className={cx(
                "mt-4 max-w-[1300px] space-y-3 font-body text-[1.25rem] leading-[0.8] text-black/88 transition-all duration-700 md:text-[1.9rem]",
                showDescription
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-6 opacity-0",
              )}
            >
              {copy.descriptionLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div
            className={cx(
              "absolute inset-x-0 bottom-[5%] transition-all duration-700",
              showPortfolio
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-12 opacity-0",
            )}
          >
            <div
              className={cx(
                "mx-auto flex w-max min-w-full items-end justify-center gap-3 px-8 transition-transform duration-700 sm:gap-4 md:gap-5 md:px-10",
                isFocusStage ? "translate-x-0" : "translate-x-10",
              )}
            >
              {portfolioItems.map((item, index) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  index={index}
                  visible={showPortfolio}
                  focused={isFocusStage && index === focusIndex}
                  dimmed={isFocusStage && index !== focusIndex}
                  delayMs={index * 85}
                />
              ))}
            </div>
          </div>

          <div
            className={cx(
              "absolute inset-x-0 bottom-[2%] transition-all duration-700",
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
