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
        "absolute min-h-[7.93rem] w-[min(81.2vw,34.3rem)] rounded-[2.35rem] px-[1.35rem] py-[1.35rem] text-white shadow-[0_28px_80px_rgba(0,0,0,0.08)] transition-[opacity,transform] duration-700",
        "sm:min-h-[9.5rem] sm:px-[1.8rem] sm:py-[1.58rem]",
        "md:min-h-[11.9rem] md:rounded-[3.85rem] md:px-[2.7rem] md:py-[2.03rem]",
        "lg:min-h-[13.2rem] lg:px-[3.6rem] lg:py-[2.25rem]",
        "2xl:min-h-[14.6rem] 2xl:rounded-[4.25rem] 2xl:px-[4.2rem] 2xl:py-[2.7rem]",
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
      <h3 className="font-sans text-[clamp(1.53rem,3.07vw,3.95rem)] font-semibold leading-[1.02] tracking-tight text-white uppercase">
        {title}
      </h3>

      <p className="mt-[0.45rem] max-w-[40.6rem] font-body text-[clamp(1.08rem,1.9vw,2.22rem)] leading-[1.26] text-white/96 md:mt-[0.675rem] 2xl:max-w-[47rem]">
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
      videoClassName="brightness-[1.02] contrast-[0.98] saturate-[0.92] md:object-[72%_78%]"
      overlay={<div className="absolute inset-0 bg-white/2" />}
    >
      <div className="relative h-full w-full">
        <div className="landing-shell">
          <div
            className={cx(
              "landing-copy-panel-alt text-black",
              isFinal ? "animate-[wem-breathe_5.4s_ease-in-out_infinite]" : "",
            )}
          >
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

            <div className="pointer-events-none relative z-30 mt-4 h-[16.5rem] sm:mt-5 sm:h-[19.75rem] md:mt-6 md:h-[23.5rem] lg:h-[24.75rem] 2xl:h-[29rem]">
              <div className="relative h-full w-full origin-top-left scale-[0.8] transform-gpu 2xl:scale-[0.88]">
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
