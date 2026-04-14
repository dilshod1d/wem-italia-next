"use client";

import { howItWorksSectionConfig } from "../data/how-it-works-story";
import { portfolioResultsSectionConfig } from "../data/portfolio-results-story";
import { useHowItWorksVideo } from "../hooks/use-how-it-works-video";
import type {
  HowItWorksStageKey,
  HowItWorksStep,
} from "../types/how-it-works-section";
import { CinematicVideoSection } from "./cinematic-video-section";

const { videoUrl, copy, steps } = howItWorksSectionConfig;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface HowItWorksStepCardProps {
  step: HowItWorksStep;
  visible: boolean;
  delayMs: number;
  highlighted: boolean;
}

function HowItWorksStepCard({
  step,
  visible,
  delayMs,
  highlighted,
}: HowItWorksStepCardProps) {
  return (
    <article
      className={cx(
        "absolute rounded-[2.4rem] px-6 py-5 text-left shadow-[0_24px_65px_rgba(0,0,0,0.12)] transition-[opacity,transform,box-shadow] duration-700 md:px-10 md:py-7",
        step.toneClassName,
        step.positionClassName,
        step.zIndexClassName,
        highlighted
          ? "shadow-[0_22px_70px_rgba(0,0,0,0.16),0_0_0_1px_rgba(255,255,255,0.08)]"
          : "",
        visible
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-x-16 translate-y-6 scale-[0.97] opacity-0",
      )}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <h3 className="font-sans text-[1.95rem] font-semibold tracking-tight text-white md:text-[3.45rem]">
        {step.title}
      </h3>
      <p className="mt-2 max-w-5xl font-body text-[1.2rem] leading-[1.25] text-white/96 md:text-[2rem]">
        {step.body}
      </p>
    </article>
  );
}

export function HowItWorksSection() {
  const { sectionRef, videoRef, activeStageKey, isScrolled } =
    useHowItWorksVideo(howItWorksSectionConfig);

  const showHeading = activeStageKey !== "intro";
  const showDescription =
    activeStageKey === "context" ||
    activeStageKey === "analysis" ||
    activeStageKey === "direction" ||
    activeStageKey === "build" ||
    activeStageKey === "evolution";
  const isFinal = activeStageKey === "evolution";
  const headline =
    activeStageKey === "headline"
      ? copy.initialHeadline
      : copy.expandedHeadline;

  return (
    <CinematicVideoSection
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={videoUrl}
      nextVideoSrc={portfolioResultsSectionConfig.videoUrl}
      isScrolled={isScrolled}
      navTheme="light"
      indicatorLabel="Scroll Down"
      indicatorPersistent
      indicatorLabelClassName="normal-case text-[1.05rem] font-medium tracking-normal text-sky-200/75"
      indicatorMouseClassName="border-sky-200/55"
      indicatorWheelClassName="bg-sky-200/80"
      videoClassName="object-center brightness-[1.02] contrast-[0.98] saturate-[0.96]"
      overlay={<div className="absolute inset-0 bg-white/[0.02]" />}
    >
      <div className="relative h-full w-full">
        <div className="absolute inset-0 mx-auto max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16">
          <div className="absolute left-6 top-[20%] max-w-[min(94vw,1520px)] text-black sm:left-10 lg:left-16">
            <h2
              className={cx(
                "font-sans text-[clamp(3.2rem,6.2vw,6.25rem)] font-semibold leading-[0.92] tracking-tight transition-all duration-700",
                showHeading
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              {headline}
            </h2>

            <div
              className={cx(
                "mt-10 max-w-[1400px] transition-all duration-700",
                showHeading
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0",
              )}
            >
              <p className="font-body text-[1.35rem] font-medium tracking-tight text-black/90 md:text-[2rem]">
                {copy.subtitle}
              </p>
              <p
                className={cx(
                  "mt-3 max-w-[1450px] font-body text-[1.2rem] leading-[1.25] text-black/85 transition-all duration-700 md:text-[1.95rem]",
                  showDescription
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0",
                )}
              >
                {copy.description}
              </p>
            </div>
          </div>

          <div
            className={cx(
              "absolute inset-x-0 bottom-[9%] h-[27rem] sm:h-[31rem] lg:h-[34rem]",
              isFinal ? "animate-[wem-breathe_5.2s_ease-in-out_infinite]" : "",
            )}
          >
            {steps.map((step, index) => (
              <HowItWorksStepCard
                key={step.stage}
                step={step}
                visible={isStepVisible(activeStageKey, step.stage)}
                delayMs={index * 120}
                highlighted={isFinal}
              />
            ))}
          </div>
        </div>
      </div>
    </CinematicVideoSection>
  );
}

function isStepVisible(
  activeStage: HowItWorksStageKey,
  stepStage: HowItWorksStageKey,
) {
  if (stepStage === "analysis") {
    return (
      activeStage === "analysis" ||
      activeStage === "direction" ||
      activeStage === "build" ||
      activeStage === "evolution"
    );
  }

  if (stepStage === "direction") {
    return (
      activeStage === "direction" ||
      activeStage === "build" ||
      activeStage === "evolution"
    );
  }

  if (stepStage === "build") {
    return activeStage === "build" || activeStage === "evolution";
  }

  return activeStage === stepStage;
}
