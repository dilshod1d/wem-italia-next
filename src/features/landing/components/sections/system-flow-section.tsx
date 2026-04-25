"use client";

import { howItWorksSectionConfig } from "../../data/how-it-works-story";
import { systemFlowSectionConfig } from "../../data/system-flow-story";
import { useSystemFlowVideo } from "../../hooks/use-system-flow-video";
import type { SystemFlowStageKey } from "../../types/system-flow-section";
import { CinematicVideoSection } from "../cinematic-video-section";

const { videoUrl, eyebrow, title, paragraphs, cards } = systemFlowSectionConfig;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface SystemFlowSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

interface BenefitCardProps {
  title: string;
  body: string;
  toneClassName: string;
  placementClassName: string;
  zIndexClassName: string;
  visible: boolean;
  delayMs: number;
}

function BenefitCard({
  title,
  body,
  toneClassName,
  placementClassName,
  zIndexClassName,
  visible,
  delayMs,
}: BenefitCardProps) {
  return (
    <article
      className={cx(
        "absolute flex min-h-[7.93rem] flex-col rounded-[2.35rem] px-[1.35rem] py-[1.55rem] text-white shadow-[0_28px_80px_rgba(0,0,0,0.08)] transition-[opacity,transform] duration-700",
        "sm:min-h-[9.5rem] sm:px-[1.8rem] sm:py-[1.85rem]",
        "md:min-h-[11.9rem] md:rounded-[3.85rem] md:px-[2.7rem] md:py-[2.3rem]",
        "lg:min-h-0 lg:justify-center lg:overflow-hidden lg:rounded-[2.75rem] lg:px-8 lg:py-6",
        "xl:min-h-0 xl:rounded-[3.1rem] xl:px-10 xl:py-7",
        "2xl:min-h-0 2xl:rounded-[3.45rem] 2xl:px-12 2xl:py-8",
        toneClassName,
        placementClassName,
        zIndexClassName,
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-10 scale-[0.94] opacity-0",
      )}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <h3 className="font-sans text-[1.53rem] font-semibold uppercase leading-[1.02] tracking-tight text-white sm:text-[2rem] md:text-[2.7rem] lg:whitespace-nowrap lg:text-[2.05rem] xl:text-[2.3rem] 2xl:text-[2.55rem]">
        {title}
      </h3>

      <p className="mt-[0.45rem] max-w-[40.6rem] font-body text-[1.08rem] leading-[1.26] text-white/96 sm:text-[1.25rem] md:mt-[0.675rem] md:text-[1.8rem] lg:mt-2 lg:max-w-[94%] lg:text-[1rem] lg:leading-[1.2] xl:text-[1.12rem] 2xl:text-[1.26rem]">
        {body}
      </p>
    </article>
  );
}

export function SystemFlowSection({ setLogoTheme }: SystemFlowSectionProps) {
  const { sectionRef, videoRef, activeStageKey, isScrolled } =
    useSystemFlowVideo(systemFlowSectionConfig, {
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

  return (
    <CinematicVideoSection
      sectionId="how-it-works"
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={videoUrl}
      nextVideoSrc={howItWorksSectionConfig.videoUrl}
      isScrolled={isScrolled}
      navTheme="light"
      indicatorLabel="Scroll Down"
      indicatorPersistent
      indicatorLabelClassName="normal-case text-[1.05rem] font-medium tracking-normal text-sky-200/75"
      indicatorMouseClassName="border-sky-200/55"
      indicatorWheelClassName="bg-sky-200/80"
      videoClassName="md:object-[72%_78%]"
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
                  "heading-hero transition-all duration-700",
                  showTitle
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0",
                )}
              >
                {title}
              </h2>
              <div
                className={cx(
                  "body-stack text-body mt-6 text-black/85 transition-all duration-1000",
                  showParagraphs
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0",
                )}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            <div className="pointer-events-none relative z-30 mt-4 h-[16.5rem] sm:mt-5 sm:h-[19.75rem] md:mt-6 md:h-[23.5rem] lg:mt-[2vh] lg:h-auto lg:min-h-0 lg:flex-1 lg:w-[70%] xl:mt-[2.4vh] xl:w-[72%] 2xl:w-[74%]">
              <div className="relative h-full w-full">
                {cards.map((card, index) => (
                  <BenefitCard
                    key={card.stage}
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
