"use client";

import type { WhyWemWorksStageKey } from "./why-wem-works.types";
import {
  BodyCopyText,
  CinematicVideoSection,
  type VideoPreloadStrategy,
} from "../../shared";
import { HeroSupportCard } from "../hero";
import { useWhyWemWorksVideo } from "./use-why-wem-works-video";
import { whyWemWorksSectionConfig } from "./why-wem-works-story";
import cx from "../../utils/cx";
import ProofPointCard from "./proof-point-card";
import InsightBlock from "./insight-block";

const {
  videoUrl,
  opening,
  introTitle,
  leadParagraph,
  resultParagraph,
  blocks,
  proofPoints,
} = whyWemWorksSectionConfig;

interface WhyWemWorksSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
  onSectionActive?: () => void;
  preloadStrategy?: VideoPreloadStrategy;
}

export function WhyWemWorksSection({
  setLogoTheme,
  onSectionActive,
  preloadStrategy = "none",
}: WhyWemWorksSectionProps) {
  const {
    sectionRef,
    videoRef,
    activeStageKey,
    openingPhase,
    isScrolled,
    isActive,
    isAtHandoff,
  } = useWhyWemWorksVideo(whyWemWorksSectionConfig, {
    onEnter: () => {
      setLogoTheme("light");
      onSectionActive?.();
    },
    onEnterBack: () => {
      setLogoTheme("light");
      onSectionActive?.();
    },
  });

  return (
    <CinematicVideoSection
      sectionId="why-it-works"
      sectionAriaLabel="Perché WEM Italia funziona: metodo, consulenza e AI per la crescita digitale"
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={videoUrl}
      mobileVideoUrl={whyWemWorksSectionConfig.mobileVideoUrl}
      isActive={isActive}
      isAtHandoff={isAtHandoff}
      isScrolled={isScrolled}
      navTheme="dark"
      preloadStrategy={preloadStrategy}
      indicatorLabel="Scroll Down"
      indicatorPersistent
      indicatorLabelClassName="normal-case text-[1.05rem] font-medium tracking-normal text-white"
      videoClassName="md:object-[center_58%] object-[center_0%]"
    >
      {(() => {
        const showOpening = openingPhase !== "done";

        const showSectionTitle =
          openingPhase === "done" && activeStageKey !== "proof";

        const showNarrativeCopy =
          openingPhase === "done" &&
          activeStageKey !== "intro" &&
          activeStageKey !== "proof";

        const showSecondParagraph =
          openingPhase === "done" &&
          (activeStageKey === "method" || activeStageKey === "ai");

        const showProofGrid =
          openingPhase === "done" && activeStageKey === "proof";

        const showInsightBlocks =
          openingPhase === "done" &&
          activeStageKey !== "intro" &&
          activeStageKey !== "proof";

        return (
          <div className="relative h-full w-full">
            <div className="landing-shell-tall">
              {showOpening ? (
                <div
                  className="landing-copy-panel hero-slot-in"
                  style={{ textShadow: "0 8px 30px rgba(0, 0, 0, 0.32)" }}
                >
                  <div>
                    <p className="text-eyebrow text-dark-gray">
                      {opening.eyebrow}
                    </p>

                    <h2 className="heading text-white">
                      {opening.titleLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </h2>

                    <BodyCopyText
                      lines={opening.paragraphs}
                      className="mx-auto mt-2 max-w-full text-white sm:mx-0 sm:mt-5"
                    />
                  </div>

                  {openingPhase === "card" ? (
                    <div className="landing-hero-support-slot hero-slot-in mt-4 sm:mt-7 md:mt-8">
                      <HeroSupportCard
                        card={opening.supportCard}
                        isActive={openingPhase === "card"}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}

              {!showProofGrid ? (
                <div className="w-full">
                  {showSectionTitle ? (
                    <div
                      className={cx(
                        "hero-slot-in z-10 w-full",
                        activeStageKey === "intro"
                          ? "text-center sm:text-left"
                          : "text-center sm:text-right",
                      )}
                    >
                      <h3 className="heading text-white">{introTitle}</h3>
                    </div>
                  ) : null}

                  {showNarrativeCopy ? (
                    <div
                      className="hero-slot-in landing-copy-gap flex w-full flex-col items-end"
                      style={{
                        transitionTimingFunction:
                          "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <BodyCopyText
                        lines={[
                          leadParagraph,
                          showSecondParagraph ? resultParagraph : null,
                        ]}
                        className="landing-right-rail text-white"
                      />
                    </div>
                  ) : null}

                  {showInsightBlocks ? (
                    <div className="landing-card-gap">
                      <div className="ml-auto flex w-full max-w-[92%] flex-col items-end sm:max-w-[68%] lg:max-w-[60%]">
                        {blocks.map((block, index) => (
                          <InsightBlock
                            key={block.stage}
                            title={block.title}
                            body={block.body}
                            toneClassName={block.toneClassName}
                            visible={isStageVisible(
                              activeStageKey,
                              block.stage,
                            )}
                            className={cx(
                              block.offsetClassName,
                              index !== 0 && "-mt-24 sm:-mt-36 lg:-mt-24",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {showProofGrid ? (
                <div className="flex w-full flex-col items-end justify-end w-full">
                  <div className="landing-proof-grid ml-auto flex w-[50%] max-w-[28rem] flex-col gap-3 sm:mx-0 sm:grid sm:h-full sm:w-full sm:max-h-[27rem] sm:max-w-[27rem] sm:grid-cols-2 sm:grid-rows-2 sm:gap-5 md:max-h-[31rem] md:max-w-[31rem] lg:max-h-[34rem] lg:max-w-[34rem] xl:max-h-[37rem] xl:max-w-[37rem] 2xl:max-h-[40rem] 2xl:max-w-[40rem]">
                    {proofPoints.map((item, index) => (
                      <ProofPointCard
                        key={item.titleLines.join("-")}
                        titleLines={item.titleLines}
                        color={item.color}
                        iconName={item.icon}
                        visible={showProofGrid}
                        delayMs={index * 140}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        );
      })()}
    </CinematicVideoSection>
  );
}

function isStageVisible(
  activeStage: WhyWemWorksStageKey,
  blockStage: WhyWemWorksStageKey,
) {
  if (blockStage === "method") {
    return activeStage === "method" || activeStage === "ai";
  }

  if (blockStage === "ai") {
    return activeStage === "ai";
  }

  return activeStage === blockStage;
}
