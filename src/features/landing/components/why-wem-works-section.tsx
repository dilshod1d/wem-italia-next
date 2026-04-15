"use client";

import type { IconType } from "react-icons";
import {
  FaBriefcase,
  FaCoins,
  FaGaugeHigh,
  FaPeopleGroup,
} from "react-icons/fa6";

import { systemFlowSectionConfig } from "../data/system-flow-story";
import { whyWemWorksSectionConfig } from "../data/why-wem-works-story";
import { useWhyWemWorksVideo } from "../hooks/use-why-wem-works-video";
import type {
  WhyWemWorksProofPointIcon,
  WhyWemWorksStageKey,
} from "../types/why-wem-works-section";
import { CinematicVideoSection } from "./cinematic-video-section";

const {
  videoUrl,
  introTitle,
  title,
  leadParagraph,
  resultParagraph,
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
        "w-full rounded-[2.25rem] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.28)] transition-all duration-700 md:p-10",
        toneClassName,
        className,
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0",
      )}
    >
      <h3 className="font-sans text-2xl font-semibold uppercase tracking-tight text-white md:text-[2.2rem]">
        {title}
      </h3>
      <p className="mt-4 max-w-4xl font-body text-lg leading-[1.45] text-white/92 md:text-[1.15rem]">
        {body}
      </p>
    </article>
  );
}

interface ProofPointCardProps {
  title: string;
  color: string;
  iconName: WhyWemWorksProofPointIcon;
  visible: boolean;
  delayMs: number;
}

function ProofPointCard({
  title,
  color,
  iconName,
  visible,
  delayMs,
}: ProofPointCardProps) {
  const Icon = proofPointIcons[iconName];

  return (
    <article
      className={cx(
        "flex aspect-square flex-col items-center justify-center rounded-[2rem] p-6 text-center text-white shadow-[0_28px_90px_rgba(0,0,0,0.3)] transition-[opacity,transform] duration-700 will-change-transform",
        color,
        visible
          ? "translate-y-0 scale-100 rotate-0 opacity-100"
          : "pointer-events-none translate-y-14 scale-[0.78] opacity-0",
      )}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1.2, 0.3, 1)",
      }}
    >
      <div className="mb-5 h-16 w-16 text-white md:h-20 md:w-20">
        <Icon className="h-full w-full" />
      </div>
      <h3 className="font-sans text-2xl font-semibold uppercase leading-[1.08] tracking-tight md:text-[2.3rem]">
        {title}
      </h3>
    </article>
  );
}

export function WhyWemWorksSection() {
  const { sectionRef, videoRef, activeStageKey, isScrolled } =
    useWhyWemWorksVideo(whyWemWorksSectionConfig);

  return (
    <CinematicVideoSection
      sectionId="why-it-works"
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={videoUrl}
      nextVideoSrc={systemFlowSectionConfig.videoUrl}
      isScrolled={isScrolled}
      navTheme="dark"
      indicatorLabel="Scroll Down"
      indicatorPersistent
      indicatorLabelClassName="normal-case text-[1.05rem] font-medium tracking-normal text-white/95"
      videoClassName="scale-[1.01] brightness-[0.82] contrast-[1.05] saturate-[1.03]"
      overlay={
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-slate-950/5 to-black/45" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute left-[42%] top-[12%] h-48 w-48 rounded-full bg-amber-300/15 blur-3xl" />
          <div className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-blue-300/8 blur-3xl" />
        </>
      }
    >
      {(() => {
        const showIntro = activeStageKey === "intro";
        const showNarrative =
          activeStageKey !== "intro" && activeStageKey !== "proof";
        const showSecondParagraph =
          activeStageKey === "method" || activeStageKey === "ai";
        const showProofGrid = activeStageKey === "proof";

        return (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 mx-auto max-w-[1600px] px-6 pb-24 pt-28 sm:px-10 lg:px-16">
              <div
                className={cx(
                  "absolute left-6 top-[24%] max-w-lg transition-all duration-1000 sm:left-10 lg:left-16",
                  showIntro ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0",
                )}
              >
                <h3 className="font-sans text-3xl font-medium tracking-tight text-white/75 md:text-5xl">
                  {introTitle}
                </h3>
              </div>

              <div
                className={cx(
                  "absolute left-6 right-6 top-[18%] grid gap-8 transition-all duration-1000 sm:left-10 sm:right-10 lg:left-16 lg:right-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]",
                  showNarrative
                    ? "translate-x-0 opacity-100"
                    : "translate-x-12 opacity-0",
                )}
              >
                <div className="flex items-start">
                  <h2 className="max-w-2xl font-sans text-5xl font-semibold tracking-tight text-white md:text-7xl lg:text-[5.5rem]">
                    {title}
                  </h2>
                </div>

                <div className="max-w-4xl justify-self-end pt-2 text-left lg:pt-6">
                  <p className="font-body text-2xl leading-[1.28] text-white/94 md:text-[2rem]">
                    {leadParagraph}
                  </p>
                  <p
                    className={cx(
                      "mt-4 font-body text-xl leading-[1.32] text-white/90 transition-all duration-700 md:text-[1.9rem]",
                      showSecondParagraph
                        ? "translate-y-0 opacity-100"
                        : "translate-y-5 opacity-0",
                    )}
                  >
                    {resultParagraph}
                  </p>
                </div>
              </div>

              <div className="absolute inset-x-6 bottom-[18%] sm:inset-x-10 lg:inset-x-16">
                <div className="ml-auto flex w-full max-w-[880px] flex-col gap-5">
                  {blocks.map((block) => (
                    <InsightBlock
                      key={block.stage}
                      title={block.title}
                      body={block.body}
                      toneClassName={block.toneClassName}
                      visible={isStageVisible(activeStageKey, block.stage)}
                      className={block.offsetClassName}
                    />
                  ))}
                </div>
              </div>

              <div
                className={cx(
                  "absolute inset-x-6 inset-y-0 flex items-center justify-center py-28 transition-opacity duration-500 sm:inset-x-10 lg:inset-x-16 lg:justify-end",
                  showProofGrid
                    ? "opacity-100"
                    : "pointer-events-none opacity-0",
                )}
              >
                <div className="grid w-full max-w-[640px] grid-cols-2 gap-5 md:gap-8">
                  {proofPoints.map((item, index) => (
                    <ProofPointCard
                      key={item.title}
                      title={item.title}
                      color={item.color}
                      iconName={item.icon}
                      visible={showProofGrid}
                      delayMs={index * 140}
                    />
                  ))}
                </div>
              </div>
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
