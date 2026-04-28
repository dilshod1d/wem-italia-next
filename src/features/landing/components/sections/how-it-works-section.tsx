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

export type Step = {
  stage: string;
  title: string;
  body: string;
  toneClassName?: string;
};

export type HowItWorksStepCardProps = {
  step: Step;
  visible: boolean;
  delayMs: number;
  highlighted?: boolean;
  index: number;
};

export default function HowItWorksStepCard({
  step,
  visible,
  delayMs,
  highlighted,
  index,
}: HowItWorksStepCardProps) {
  const OVERLAP = 5;
  const SCALE_STEP = 0.035;
  const X_OFFSET = 8;
  const WIDTH_STEP = 4;

  return (
    <article
      className={cx(
        "max-w-[88%] sm:max-w-[84%] md:max-w-[740px] lg:max-w-[800px] xl:max-w-[880px] 2xl:max-w-[960px]",
        "relative overflow-hidden rounded-[2.2rem]",
        "px-5 py-4 text-left sm:px-7 sm:py-5 md:rounded-[6rem] md:px-9",
        "lg:max-w-none lg:px-[3.8%] lg:py-4",
        "xl:px-[4.1%] xl:py-5 2xl:px-[4.5%]",

        "shadow-[0_24px_65px_rgba(0,0,0,0.12)]",
        "transition-[opacity,transform,box-shadow,width] duration-700 will-change-transform",

        "before:pointer-events-none before:absolute before:inset-x-10 before:top-0 before:h-px before:bg-white/42 before:content-['']",
        "after:pointer-events-none after:absolute after:-right-14 after:-top-14 after:size-40 after:rounded-full after:bg-white/10 after:blur-2xl after:content-['']",

        step.toneClassName,

        highlighted &&
          "shadow-[0_22px_70px_rgba(0,0,0,0.16),0_0_0_1px_rgba(255,255,255,0.08)]",

        visible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      style={{
        width: `${100 - index * WIDTH_STEP}%`,
        transform: visible
          ? `translateX(${index * X_OFFSET}%)
             translateY(index * -OVERLAP)
             scale(${1 - index * SCALE_STEP})`
          : `translateX(${index * X_OFFSET + 5}%)
             translateY(${index * -OVERLAP + 20}px)
             scale(0.96)`,

        zIndex: 20 - index,
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="min-w-0">
        <h3 className="font-sans text-[1.55rem] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-[2rem] md:text-[2.48rem] lg:text-[2.18rem] xl:text-[2.46rem] 2xl:text-[2.82rem]">
          {step.title}
        </h3>

        <p className="mt-1.5 max-w-[94%] font-body text-[0.9rem] leading-[1.2] text-white/90 sm:text-[1rem] md:mt-2 md:text-[1.12rem] lg:mt-1.5 lg:max-w-[86%] lg:text-[1.02rem] lg:leading-[1.16] xl:text-[1.14rem] 2xl:text-[1.34rem]">
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
                "heading transition-all duration-700",
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

          <div className="relative flex flex-col overflow-hidden ml-[15%]">
            {steps.map((step, index) => (
              <HowItWorksStepCard
                key={step.stage}
                step={step}
                visible={isStepVisible(activeStageKey, step.stage)}
                delayMs={index * 120}
                highlighted={false}
                index={index}
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
