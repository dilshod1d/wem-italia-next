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
        "absolute w-full max-w-[800px] overflow-hidden rounded-[2.2rem] px-5 py-4 text-left shadow-[0_24px_65px_rgba(0,0,0,0.12)] transition-[opacity,transform,box-shadow] duration-700 sm:px-7 sm:py-5 md:rounded-[6rem] md:px-9 lg:h-[25%] lg:max-w-none lg:px-[3.8%] lg:py-4 xl:px-[4.1%] xl:py-5 2xl:px-[4.5%]",
        "before:pointer-events-none before:absolute before:inset-x-10 before:top-0 before:h-px before:bg-white/42 before:content-['']",
        "after:pointer-events-none after:absolute after:-right-14 after:-top-14 after:size-40 after:rounded-full after:bg-white/10 after:blur-2xl after:content-['']",
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
      <div className="relative z-10 grid h-full min-h-0 grid-cols-[3.8rem_1fr] items-center gap-3 sm:grid-cols-[4.5rem_1fr] sm:gap-4 md:grid-cols-[5.2rem_1fr] md:gap-5 lg:grid-cols-[5.65rem_1fr] lg:gap-5 xl:grid-cols-[6.2rem_1fr]">
        <div className="flex h-full items-center">
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/28 bg-white/15 py-1.5 pl-1.5 pr-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-sm md:gap-2.5 md:py-2 md:pl-2 md:pr-4">
            <span className="grid size-8 place-items-center rounded-full bg-white text-[0.86rem] font-bold leading-none tracking-[-0.04em] text-black/70 sm:size-9 sm:text-[0.95rem] md:size-10 md:text-[1.05rem] lg:size-11 lg:text-[1.12rem] xl:size-12 xl:text-[1.24rem]">
              {step.stepLabel}
            </span>
            <span className="font-sans text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-[0.6rem] md:text-[0.65rem]">
              Step
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="font-sans text-[1.55rem] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-[2rem] md:text-[2.48rem] lg:text-[2.18rem] xl:text-[2.46rem] 2xl:text-[2.82rem]">
            {step.title}
          </h3>

          <p className="mt-1.5 max-w-[94%] font-body text-[0.9rem] leading-[1.2] text-white/90 sm:text-[1rem] md:mt-2 md:text-[1.12rem] lg:mt-1.5 lg:max-w-[86%] lg:text-[1.02rem] lg:leading-[1.16] xl:text-[1.14rem] 2xl:text-[1.34rem]">
            {step.body}
          </p>
        </div>
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
