"use client";

import { howItWorksSectionConfig } from "../../data/how-it-works-story";
import { portfolioResultsSectionConfig } from "../../data/portfolio-results-story";
import { useHowItWorksVideo } from "../../hooks/use-how-it-works-video";
import type {
  HowItWorksStageKey,
  HowItWorksStep,
} from "../../types/how-it-works-section";
import { CinematicVideoSection } from "../cinematic-video-section";

const { videoUrl, copy, steps } = howItWorksSectionConfig;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface HowItWorksSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
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
        "absolute w-full max-w-[800px] rounded-[3rem] px-6 py-3 text-left shadow-[0_24px_65px_rgba(0,0,0,0.12)] transition-[opacity,transform,box-shadow] duration-700 sm:px-8 md:rounded-[7rem] md:px-16 md:py-3.5",
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
      <h3 className="landing-title-lg text-white md:text-[3.45rem]">
        {step.title}
      </h3>
      <p className="mt-2 font-body text-[0.82rem] leading-[1.2] text-white/96 sm:text-[0.92rem] md:text-[1.4rem] md:leading-none">
        {step.body}
      </p>
    </article>
  );
}

export function HowItWorksSection({ setLogoTheme }: HowItWorksSectionProps) {
  const { sectionRef, videoRef, activeStageKey, isScrolled } =
    useHowItWorksVideo(howItWorksSectionConfig, {
      onEnter: () => setLogoTheme("dark"),
      onEnterBack: () => setLogoTheme("dark"),
    });

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
      videoClassName="brightness-[1.02] contrast-[0.98] saturate-[0.96] md:object-[center_86%]"
      overlay={<div className="absolute inset-0 bg-white/[0.02]" />}
    >
      <div className="relative h-full w-full">
        <div className="landing-shell">
          <div className="landing-copy-panel text-black">
            <h2
              className={cx(
                "heading-hero transition-all duration-700",
                showHeading
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              {headline}
            </h2>

            <div
              className={cx(
                "text-body transition-all duration-700 text-black",
                showHeading
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0",
              )}
            >
              <p>{copy.subtitle} now moved here</p>
              <p
                className={cx(
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
              "absolute left-[4%] right-[4%] bottom-[-13%] h-[27rem] overflow-hidden sm:left-[5%] sm:right-[5%] sm:h-[31rem] lg:h-[34rem]",
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
