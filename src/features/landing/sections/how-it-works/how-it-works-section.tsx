"use client";

import { howItWorksSectionConfig } from "./how-it-works-story";
import { useHowItWorksVideo } from "./use-how-it-works-video";
import { useIsMobile } from "../../hooks/use-is-mobile";
import {
  BodyCopyText,
  CinematicVideoSection,
  type VideoPreloadStrategy,
} from "../../shared";
import HowItWorksStepCard from "./how-it-works-step-card";
import cx from "../../utils/cx";

const {
  videoUrl,
  contentItems: { header, steps },
} = howItWorksSectionConfig;

interface HowItWorksSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
  onSectionActive?: () => void;
  preloadStrategy?: VideoPreloadStrategy;
}

export function HowItWorksSection({
  setLogoTheme,
  onSectionActive,
  preloadStrategy = "none",
}: HowItWorksSectionProps) {
  const isMobile = useIsMobile();
  const {
    sectionRef,
    videoRef,
    activeHeaderItem,
    isStepRailVisible,
    visibleCopyItems,
    visibleSteps,
    isScrolled,
    isActive,
    isAtHandoff,
  } = useHowItWorksVideo(howItWorksSectionConfig, {
    onEnter: () => {
      setLogoTheme("dark");
      onSectionActive?.();
    },
    onEnterBack: () => {
      setLogoTheme("dark");
      onSectionActive?.();
    },
  });

  const showHeading = Boolean(activeHeaderItem);

  return (
    <CinematicVideoSection
      sectionAriaLabel="Processo operativo WEM Italia: analisi, direzione, costruzione ed evoluzione del progetto"
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={videoUrl}
      mobileVideoUrl={howItWorksSectionConfig.mobileVideoUrl}
      isActive={isActive}
      isAtHandoff={isAtHandoff}
      isScrolled={isScrolled}
      preloadStrategy={preloadStrategy}
      navTheme="light"
      videoClassName="md:object-[center_86%] object-[center_0%]"
    >
      <div className="relative h-full w-full">
        <div className="landing-shell">
          <div className="landing-copy-panel-alt text-black">
            <p
              className={cx(
                "text-eyebrow text-black/25 transition-all duration-700",
                showHeading
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              {header.eyebrow}
            </p>

            <h2
              className={cx(
                "heading transition-all duration-700",
                showHeading
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              {header.title}
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
                lines={visibleCopyItems.map((item) => item.text)}
                className="text-black"
              />
            </div>
          </div>

          {isStepRailVisible ? (
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
                  visible={visibleSteps.some(
                    (visibleStep) => visibleStep.stage === step.stage,
                  )}
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
