"use client";

import { howItWorksSectionConfig } from "./how-it-works-story";
import { portfolioResultsSectionConfig } from "../portfolio-results/portfolio-results-story";
import { useHowItWorksVideo } from "./use-how-it-works-video";
import { useIsMobile } from "../../hooks/use-is-mobile";
import type { HowItWorksStageKey } from "./how-it-works.types";
import { BodyCopyText, CinematicVideoSection } from "../../shared";
import HowItWorksStepCard from "./how-it-works-step-card";
import cx from "../../utils/cx";

const { videoUrl, copy, steps } = howItWorksSectionConfig;

interface HowItWorksSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

export function HowItWorksSection({ setLogoTheme }: HowItWorksSectionProps) {
  const isMobile = useIsMobile();
  const {
    sectionRef,
    videoRef,
    activeStageKey,
    isScrolled,
    isActive,
    isAtHandoff,
  } = useHowItWorksVideo(howItWorksSectionConfig, {
    onEnter: () => setLogoTheme("dark"),
    onEnterBack: () => setLogoTheme("dark"),
  });

  const showHeading = activeStageKey !== "intro" && activeStageKey !== "blank";
  const showDescription =
    activeStageKey === "context" ||
    activeStageKey === "analysis" ||
    activeStageKey === "direction" ||
    activeStageKey === "build" ||
    activeStageKey === "evolution";
  const showStepCards = activeStageKey !== "blank";

  return (
    <CinematicVideoSection
      sectionAriaLabel="Processo operativo WEM Italia: analisi, direzione, costruzione ed evoluzione del progetto"
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={videoUrl}
      mobileVideoUrl={howItWorksSectionConfig.mobileVideoUrl}
      nextVideoSrc={portfolioResultsSectionConfig.videoUrl}
      nextMobileVideoSrc={portfolioResultsSectionConfig.mobileVideoUrl}
      isActive={isActive}
      isAtHandoff={isAtHandoff}
      isScrolled={isScrolled}
      navTheme="light"
      indicatorLabel="Scroll Down"
      indicatorPersistent
      indicatorLabelClassName="normal-case text-[1.05rem] font-medium tracking-normal text-sky-200/75"
      indicatorMouseClassName="border-sky-200/55"
      indicatorWheelClassName="bg-sky-200/80"
      videoClassName="md:object-[center_86%] object-[center_0%]"
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
                "landing-copy-gap text-black transition-all duration-1000",
                showHeading
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0",
              )}
              style={{
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <BodyCopyText
                lines={[
                  copy.subtitle,
                  showDescription ? copy.description : null,
                ]}
                className="text-black"
              />
            </div>
          </div>

          {showStepCards ? (
            <div
              className="
                landing-step-rail landing-card-gap relative flex w-full flex-col overflow-visible
                lg:ml-auto lg:w-[82%]
                min-[1200px]:w-[86%]
                min-[1400px]:w-full min-[1400px]:max-w-[68rem]
                2xl:max-w-[72rem]
              "
            >
              {steps.map((step, index) => (
                <HowItWorksStepCard
                  key={step.stage}
                  step={step}
                  visible={isStepVisible(activeStageKey, step.stage)}
                  delayMs={index * 120}
                  highlighted={false}
                  index={index}
                  isMobile={isMobile}
                />
              ))}
            </div>
          ) : null}
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
