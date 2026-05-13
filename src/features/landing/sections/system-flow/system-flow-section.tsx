"use client";

import { howItWorksSectionConfig } from "../how-it-works/how-it-works-story";
import type { SystemFlowStageKey } from "./system-flow.types";
import { BodyCopyText, CinematicVideoSection } from "../../shared";
import { systemFlowSectionConfig } from "./system-flow-story";
import { useSystemFlowVideo } from "./use-system-flow-video";
import cx from "../../utils/cx";
import BenefitCard from "./benefit-card";

const { videoUrl, eyebrow, title, paragraphs, cards } = systemFlowSectionConfig;

interface SystemFlowSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

export function SystemFlowSection({ setLogoTheme }: SystemFlowSectionProps) {
  const {
    sectionRef,
    videoRef,
    activeStageKey,
    isScrolled,
    isActive,
    isAtHandoff,
  } = useSystemFlowVideo(systemFlowSectionConfig, {
    onLogoThemeChange: setLogoTheme,
  });

  const showTitle = activeStageKey !== "intro";
  const showEyebrow = showTitle;
  const showParagraphs =
    activeStageKey === "body" ||
    activeStageKey === "step" ||
    activeStageKey === "budget" ||
    activeStageKey === "support";
  const isFinal = activeStageKey === "support";
  const surfaceTheme =
    activeStageKey === "intro" || activeStageKey === "title" ? "dark" : "light";

  return (
    <CinematicVideoSection
      sectionId="how-it-works"
      sectionAriaLabel="Processo trasparente WEM Italia: step chiari, budget trasparente e supporto continuo"
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={videoUrl}
      mobileVideoUrl={systemFlowSectionConfig.mobileVideoUrl}
      nextVideoSrc={howItWorksSectionConfig.videoUrl}
      nextMobileVideoSrc={howItWorksSectionConfig.mobileVideoUrl}
      isActive={isActive}
      isAtHandoff={isAtHandoff}
      isScrolled={isScrolled}
      navTheme="light"
      surfaceTheme={surfaceTheme}
      indicatorLabel="Scroll Down"
      indicatorPersistent
      indicatorLabelClassName="normal-case text-[1.05rem] font-medium tracking-normal text-sky-200/75"
      indicatorMouseClassName="border-sky-200/55"
      indicatorWheelClassName="bg-sky-200/80"
      videoClassName="md:object-[center_58%] object-[center_0%]"
    >
      <div className="relative h-full w-full">
        <div className="landing-frame landing-copy-start relative h-full pb-[5vh] lg:pb-[5.5vh] 2xl:pb-[6vh]">
          <div
            className={cx(
              "landing-copy-panel-alt flex h-full flex-col text-black",
              isFinal ? "animate-[wem-breathe_5.4s_ease-in-out_infinite]" : "",
            )}
          >
            <div className="shrink-0">
              <p
                className={cx(
                  "text-eyebrow text-black/28 transition-all duration-700",
                  showEyebrow
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0",
                )}
              >
                {eyebrow}
              </p>
              <h2
                className={cx(
                  "heading transition-all duration-700",
                  showTitle
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0",
                )}
              >
                {title}
              </h2>
              <div
                className={cx(
                  "landing-copy-gap text-black/85 transition-all duration-1000",
                  showParagraphs
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0",
                )}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <BodyCopyText lines={paragraphs} className="text-black/85" />
              </div>
            </div>

            <div className="landing-benefit-rail pointer-events-none landing-card-gap relative z-30 h-[17rem] w-full sm:mr-auto sm:h-[19rem] sm:w-[92%] md:h-[22rem] md:w-[80%] lg:mr-0 lg:h-auto lg:min-h-0 lg:flex-1 lg:w-[70%] xl:w-[72%] 2xl:w-[74%]">
              <div className="relative h-full w-full">
                {cards.map((card, index) => (
                  <BenefitCard
                    key={card.stage}
                    icon={card.icon}
                    title={card.title}
                    body={card.body}
                    toneClassName={card.toneClassName}
                    placementClassName={card.placementClassName}
                    zIndexClassName={card.zIndexClassName}
                    visible={isCardVisible(activeStageKey, card.stage)}
                    delayMs={index * 140}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CinematicVideoSection>
  );
}

function isCardVisible(
  activeStage: SystemFlowStageKey,
  cardStage: SystemFlowStageKey,
) {
  if (cardStage === "step") {
    return (
      activeStage === "step" ||
      activeStage === "budget" ||
      activeStage === "support"
    );
  }

  if (cardStage === "budget") {
    return activeStage === "budget" || activeStage === "support";
  }

  return activeStage === cardStage;
}
