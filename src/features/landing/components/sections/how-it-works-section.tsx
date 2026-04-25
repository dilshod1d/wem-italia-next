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
        "absolute w-full max-w-[800px] rounded-[2.2rem] px-5 py-5 text-left shadow-[0_24px_65px_rgba(0,0,0,0.12)] transition-[opacity,transform,box-shadow] duration-700 sm:px-8 sm:py-6 md:rounded-[6rem] md:px-10 lg:flex lg:h-[25%] lg:max-w-none lg:flex-col lg:justify-center lg:px-[4.5%] lg:py-5 xl:px-[4.75%] xl:py-6 2xl:px-[5%] 2xl:py-7",
        step.toneClassName,
        step.placementClassName,
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
      <span className="absolute right-6 top-5 font-sans text-[1.05rem] font-bold leading-none tracking-[0.1em] text-white/48 sm:right-8 sm:top-6 sm:text-[1.2rem] md:right-10 md:top-7 md:text-[1.38rem] lg:right-[5%] lg:top-1/2 lg:-translate-y-1/2 lg:text-[1.55rem] xl:text-[1.75rem] 2xl:text-[2rem]">
        {step.stepLabel}
      </span>
      <div className="flex flex-col gap-2 pr-10 sm:gap-2.5 sm:pr-12 lg:gap-2.5 lg:pr-[7%] 2xl:gap-3">
        <h3 className="font-sans text-[1.7rem] font-bold leading-[0.95] tracking-[-0.02em] text-white sm:text-[2.2rem] md:text-[2.8rem] lg:text-[3.05rem] xl:text-[3.4rem] 2xl:text-[3.9rem]">
          {step.title}
        </h3>
        <p className="max-w-[92%] font-body text-[0.92rem] leading-[1.22] text-white/90 sm:text-[1.02rem] md:text-[1.22rem] lg:max-w-[90%] lg:text-[1.34rem] lg:leading-[1.16] xl:text-[1.46rem] 2xl:text-[1.68rem]">
          {step.body}
        </p>
      </div>
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
      videoClassName="md:object-[center_86%]"
    >
      <div className="relative h-full w-full">
        <div className="landing-shell">
          <div className="landing-copy-panel-alt text-black">
            <p
              className={cx(
                "text-eyebrow text-black/28 transition-all duration-700",
                showHeading
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              {copy.eyebrow}
            </p>

            <h2
              className={cx(
                "heading-hero transition-all duration-700",
                showHeading
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              {copy.initialHeadline}
            </h2>

            <div
              className={cx(
                "text-body text-black transition-all duration-1000",
                showHeading
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0",
              )}
              style={{
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <p>{copy.subtitle}</p>
              <p
                className={cx(
                  "transition-all duration-700",
                  showDescription
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0",
                )}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {copy.description}
              </p>
            </div>
          </div>

          <div
            className={cx(
              "pointer-events-none absolute bottom-[4%] left-[4%] right-[4%] z-30 h-[24rem] overflow-visible sm:h-[28rem] lg:left-auto lg:right-0 lg:top-[41%] lg:bottom-[7%] lg:h-auto lg:w-[86%] xl:top-[40%] 2xl:top-[39%] 2xl:w-[88%]",
              isFinal ? "animate-[wem-breathe_5.2s_ease-in-out_infinite]" : "",
            )}
          >
            <div className="relative h-full w-full">
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
