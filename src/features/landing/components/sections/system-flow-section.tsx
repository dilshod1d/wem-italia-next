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
  positionClassName: string;
  zIndexClassName: string;
  visible: boolean;
  delayMs: number;
}

function BenefitCard({
  title,
  body,
  toneClassName,
  positionClassName,
  zIndexClassName,
  visible,
  delayMs,
}: BenefitCardProps) {
  return (
    <article
      className={cx(
        "absolute w-[calc(100%-2rem)] rounded-[3.2rem] px-6 py-5 text-white shadow-[0_28px_80px_rgba(0,0,0,0.08)] transition-[opacity,transform] duration-700",
        " md:w-[480px] md:px-8 md:py-6",
        toneClassName,
        positionClassName,
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
      <h3 className="font-sans text-[1.3rem] font-semibold uppercase tracking-tight md:text-[1.8rem]">
        {title}
      </h3>

      <p className="mt-4 max-w-3xl font-body text-[1.1rem] leading-[1.4] md:text-[1.4rem]">
        {body}
      </p>
    </article>
  );
}

export function SystemFlowSection({
  setLogoTheme,
}: SystemFlowSectionProps) {
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
      videoClassName="object-[68%_78%] brightness-[1.02] contrast-[0.98] saturate-[0.92] md:object-[72%_78%]"
      overlay={<div className="absolute inset-0 bg-white/2" />}
    >
      <div className="relative h-full w-full">
        <div className="absolute inset-0 mx-auto max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16">
          <div
            className={cx(
              "absolute left-6 top-[19%] max-w-[min(88vw,1250px)] text-black sm:left-10 lg:left-16",
              isFinal ? "animate-[wem-breathe_5.4s_ease-in-out_infinite]" : "",
            )}
          >
            <p
              className={cx(
                "font-body text-[2rem] font-light tracking-tight text-black/28 transition-all duration-700 md:text-[3.2rem]",
                showEyebrow
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0",
              )}
            >
              {eyebrow}
            </p>

            <h2
              className={cx(
                "mt-4 whitespace-pre-line font-sans text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.92] tracking-tight transition-all duration-700",
                showTitle
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
            >
              {title}
            </h2>

            <div
              className={cx(
                "mt-6 max-w-[1200px] space-y-1 font-body text-[2rem] leading-none text-black/85 transition-all duration-700 md:text-[3rem]",
                showParagraphs
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0",
              )}
            >
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 inset-y-0">
            {cards.map((card, index) => (
              <BenefitCard
                key={card.stage}
                title={card.title}
                body={card.body}
                toneClassName={card.toneClassName}
                positionClassName={card.positionClassName}
                zIndexClassName={card.zIndexClassName}
                visible={isCardVisible(activeStageKey, card.stage)}
                delayMs={index * 140}
              />
            ))}
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
