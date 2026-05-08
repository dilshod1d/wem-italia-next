"use client";

import type { IconType } from "react-icons";
import {
  FaBriefcase,
  FaCoins,
  FaGaugeHigh,
  FaPeopleGroup,
} from "react-icons/fa6";

import { systemFlowSectionConfig } from "../../data/system-flow-story";
import { whyWemWorksSectionConfig } from "../../data/why-wem-works-story";
import { useWhyWemWorksVideo } from "../../hooks/use-why-wem-works-video";
import type {
  WhyWemWorksProofPointIcon,
  WhyWemWorksStageKey,
} from "../../types/why-wem-works-section";
import { CinematicVideoSection } from "../cinematic-video-section";
import { HeroSupportCard } from "../hero-support-card";
import {
  getRevealAnimationStyle,
  getRevealTransitionStyle,
  REVEAL_HIDDEN_CLASS,
  REVEAL_TRANSITION_STYLE,
  REVEAL_VISIBLE_CLASS,
} from "../reveal-motion";

const {
  videoUrl,
  opening,
  introTitle,
  leadParagraph,
  resultParagraph,
  resultParagraphFrame,
  blocks,
  proofPoints,
} = whyWemWorksSectionConfig;

const proofPointIcons: Record<WhyWemWorksProofPointIcon, IconType> = {
  speed: FaGaugeHigh,
  costs: FaCoins,
  decisions: FaPeopleGroup,
  projects: FaBriefcase,
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface WhyWemWorksSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

interface InsightBlockProps {
  title: string;
  body: string;
  toneClassName: string;
  visible: boolean;
  className?: string;
}

function InsightBlock({
  title,
  body,
  toneClassName,
  visible,
  className,
}: InsightBlockProps) {
  return (
    <article
      className={cx(
        `
        w-[58%] text-left sm:w-full
        rounded-[1.25rem] p-4
        sm:rounded-[1.75rem] sm:p-5
        md:rounded-[2.25rem] md:p-10
        2xl:rounded-[2.5rem] 2xl:p-12

        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        transition-[opacity,transform] duration-700 will-change-transform
        `,
        toneClassName,
        className,
        visible ? cx(REVEAL_VISIBLE_CLASS, "hero-slot-in") : REVEAL_HIDDEN_CLASS,
      )}
      style={REVEAL_TRANSITION_STYLE}
    >
      <h3
        className="
          landing-title-md uppercase text-white
          text-[1.1rem] leading-snug
          sm:text-[1.4rem]
          md:text-[2.2rem]
          2xl:text-[2.75rem]
        "
      >
        {title}
      </h3>

      <p
        className="
          landing-body-sm
          mt-2
          text-white

          text-[0.9rem] leading-6
          max-w-[95%]

          sm:mt-3 sm:text-[1rem] sm:max-w-[85%]
          md:mt-4 md:text-[1.15rem] md:max-w-4xl
          2xl:text-[1.35rem]
        "
      >
        {body}
      </p>
    </article>
  );
}

interface ProofPointCardProps {
  titleLines: readonly string[];
  color: string;
  iconName: WhyWemWorksProofPointIcon;
  visible: boolean;
  delayMs: number;
}

function ProofPointCard({
  titleLines,
  color,
  iconName,
  visible,
  delayMs,
}: ProofPointCardProps) {
  const Icon = proofPointIcons[iconName];

  return (
    <article
      className={cx(
        "flex min-h-0 flex-col items-center justify-center rounded-[1.65rem] p-5 text-center text-white shadow-[0_24px_78px_rgba(0,0,0,0.28)] transition-[opacity,transform] duration-700 will-change-transform sm:rounded-[1.9rem] md:rounded-[2rem] md:p-6 2xl:rounded-[2.35rem] 2xl:p-8",
        color,
        visible ? cx(REVEAL_VISIBLE_CLASS, "hero-slot-in") : REVEAL_HIDDEN_CLASS,
      )}
      style={{
        ...getRevealTransitionStyle(visible ? delayMs : 0),
        ...getRevealAnimationStyle(visible ? delayMs : 0),
      }}
    >
      <div className="mb-4 h-12 w-12 text-white sm:h-14 sm:w-14 md:h-[4.5rem] md:w-[4.5rem] 2xl:mb-5 2xl:h-[5.25rem] 2xl:w-[5.25rem]">
        <Icon className="h-full w-full" />
      </div>
      <h3 className="landing-title-md uppercase text-white md:text-[2.05rem] 2xl:text-[2.45rem]">
        {titleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h3>
    </article>
  );
}

export function WhyWemWorksSection({ setLogoTheme }: WhyWemWorksSectionProps) {
  const {
    sectionRef,
    videoRef,
    activeStageKey,
    openingPhase,
    currentFrame,
    isScrolled,
    isActive,
    isAtHandoff,
  } = useWhyWemWorksVideo(whyWemWorksSectionConfig, {
    onEnter: () => setLogoTheme("light"),
    onEnterBack: () => setLogoTheme("light"),
  });

  return (
    <CinematicVideoSection
      sectionId="why-it-works"
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={videoUrl}
      mobileVideoUrl={whyWemWorksSectionConfig.mobileVideoUrl}
      nextVideoSrc={systemFlowSectionConfig.videoUrl}
      nextMobileVideoSrc={systemFlowSectionConfig.mobileVideoUrl}
      isActive={isActive}
      isAtHandoff={isAtHandoff}
      isScrolled={isScrolled}
      navTheme="dark"
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
          currentFrame >= resultParagraphFrame &&
          activeStageKey !== "intro" &&
          activeStageKey !== "proof";

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
                  className="landing-copy-panel"
                  style={{ textShadow: "0 8px 30px rgba(0, 0, 0, 0.32)" }}
                >
                  <div>
                    <p
                      className="hero-slot-in text-eyebrow text-dark-gray"
                      style={getRevealAnimationStyle()}
                    >
                      {opening.eyebrow}
                    </p>

                    <h2
                      className="hero-slot-in heading text-white"
                      style={getRevealAnimationStyle(80)}
                    >
                      {opening.titleLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </h2>

                    <div className="body-stack mt-2 max-w-[92%] text-body text-white sm:mt-5">
                      {opening.paragraphs.map((paragraph, index) => (
                        <p
                          key={paragraph}
                          className="hero-slot-in"
                          style={getRevealAnimationStyle(160 + index * 80)}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {openingPhase === "card" ? (
                    <div
                      className="hero-slot-in mt-4 sm:mt-7 md:mt-8"
                      style={getRevealAnimationStyle(120)}
                    >
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
                        activeStageKey === "intro" ? "text-left" : "text-right",
                      )}
                      style={getRevealAnimationStyle()}
                    >
                      <h3 className="heading text-white">{introTitle}</h3>
                    </div>
                  ) : null}

                  {showNarrativeCopy ? (
                    <div className="landing-copy-gap flex w-full flex-col items-end">
                      <div className="landing-right-rail landing-paragraph-stack text-body landing-body-copy text-white">
                        <p
                          className="hero-slot-in"
                          style={getRevealAnimationStyle()}
                        >
                          {leadParagraph}
                        </p>

                        {showSecondParagraph ? (
                          <p
                            className="hero-slot-in"
                            style={getRevealAnimationStyle(80)}
                          >
                            {resultParagraph}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {showInsightBlocks ? (
                    <div className="landing-card-gap">
                      <div className="landing-right-rail flex flex-col items-end">
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
                              index !== 0 && "-mt-6 sm:-mt-10 lg:-mt-16",
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
                  <div className="ml-auto flex w-[50%] max-w-[28rem] flex-col gap-3 sm:mx-0 sm:grid sm:h-full sm:w-full sm:max-h-[27rem] sm:max-w-[27rem] sm:grid-cols-2 sm:grid-rows-2 sm:gap-5 md:max-h-[31rem] md:max-w-[31rem] lg:max-h-[34rem] lg:max-w-[34rem] xl:max-h-[37rem] xl:max-w-[37rem] 2xl:max-h-[40rem] 2xl:max-w-[40rem]">
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
