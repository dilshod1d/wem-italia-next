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

const {
  videoUrl,
  handoff,
  introTitle,
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

interface WhyWemWorksSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

interface InsightBlockProps {
  stage: "method" | "ai";
  title: string;
  body: string;
  toneClassName: string;
  offsetClassName?: string;
  visible: boolean;
  index: number;
}

function InsightBlock({
  stage,
  title,
  body,
  toneClassName,
  offsetClassName,
  visible,
  index,
}: InsightBlockProps) {
  const isMethodBlock = stage === "method";

  return (
    <article
      className={cx(
        `
        relative flex
        size-[min(78vw,29vh,18rem)]
        min-h-[10rem] min-w-[10rem] flex-none
        flex-col justify-between overflow-hidden
        rounded-[1.55rem] p-4 text-white
        shadow-[0_24px_70px_rgba(0,0,0,0.32)]
        transition-[opacity,transform,filter] duration-700
        will-change-transform

        sm:size-[min(62vw,31vh,20rem)]
        sm:min-h-[12rem] sm:min-w-[12rem] sm:rounded-[1.8rem] sm:p-5
        md:size-[min(46vw,32vh,22rem)]
        md:min-h-[14rem] md:min-w-[14rem] md:rounded-[2.15rem] md:p-6
        lg:size-[min(23vw,40vh)]
        xl:p-7
        2xl:size-[min(22vw,43vh)] 2xl:rounded-[2.35rem] 2xl:p-8

        `,
        toneClassName,
        offsetClassName,
        isMethodBlock
          ? "border border-white/12 bg-gradient-to-br from-white/12 via-white/[0.03] to-black/12"
          : "border border-white/12 bg-gradient-to-br from-white/14 via-white/[0.02] to-black/18",
        visible
          ? "translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100 blur-0"
          : "pointer-events-none translate-x-14 translate-y-5 scale-[0.92] rotate-2 opacity-0 blur-[2px]",
      )}
      style={{
        transitionDelay: visible ? `${index * 120}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        {isMethodBlock ? (
          <>
            <div className="absolute inset-x-5 top-5 h-px bg-white/28 sm:inset-x-6 sm:top-6" />
            <div className="absolute bottom-5 left-5 h-12 w-12 rounded-full border border-white/12 sm:bottom-6 sm:left-6 sm:h-14 sm:w-14 md:h-16 md:w-16" />
            <div className="absolute right-5 top-5 flex items-center gap-2 sm:right-6 sm:top-6">
              <span className="h-2 w-2 rounded-full bg-white/65" />
              <span className="h-px w-8 bg-white/40 sm:w-10" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>
            <div className="absolute bottom-5 right-5 grid grid-cols-3 gap-1 opacity-35 sm:bottom-6 sm:right-6 sm:gap-1.5">
              {Array.from({ length: 6 }).map((_, dotIndex) => (
                <span
                  key={`method-dot-${dotIndex}`}
                  className="h-1.5 w-1.5 rounded-full bg-white/65"
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/18 blur-3xl sm:h-32 sm:w-32 md:h-36 md:w-36" />
            <div className="absolute right-5 top-5 h-px w-14 rotate-[12deg] bg-white/55 sm:right-6 sm:top-6 sm:w-16" />
            <div className="absolute right-7 top-9 h-px w-10 rotate-[12deg] bg-white/30 sm:right-8 sm:top-11 sm:w-12" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2 opacity-40 sm:bottom-6 sm:left-6">
              <span className="h-1.5 w-8 rounded-full bg-white/45 sm:w-10" />
              <span className="h-1.5 w-4 rounded-full bg-white/65 sm:w-5" />
              <span className="h-1.5 w-2 rounded-full bg-white/85" />
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <h3
          className={cx(
            `
            max-w-[11ch] font-sans tracking-[-0.04em] text-white
            text-[1.02rem] font-semibold leading-[0.96]
            sm:text-[1.16rem]
            md:text-[1.36rem]
            xl:text-[1.55rem]
            2xl:text-[1.72rem]
          `,
            isMethodBlock ? "text-white" : "max-w-[10ch] text-white",
          )}
        >
          {title}
        </h3>

        <div
          className={cx(
            "mt-auto rounded-[1rem] border px-3.5 py-3 backdrop-blur-[10px] sm:rounded-[1.15rem] sm:px-4 sm:py-3.5 md:px-5 md:py-4 xl:px-5 xl:py-5",
            isMethodBlock
              ? "border-white/14 bg-black/10"
              : "border-white/10 bg-black/14",
          )}
        >
          <p
            className={cx(
              `
              font-body text-white/90
              text-[0.76rem] leading-[1.34]
              sm:text-[0.86rem]
              md:text-[0.96rem]
              xl:text-[1.03rem]
              2xl:text-[1.12rem]
            `,
              isMethodBlock ? "max-w-[18ch]" : "max-w-[17ch]",
            )}
          >
            {body}
          </p>
        </div>
      </div>
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
        "flex min-h-0 flex-col items-center justify-center rounded-[1.65rem] p-5 text-center text-white shadow-[0_24px_78px_rgba(0,0,0,0.28)] transition-[opacity,transform] duration-700 will-change-transform sm:rounded-[1.9rem] md:rounded-[2rem] md:p-6 2xl:rounded-[2.35rem] 2xl:p-8",
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
      <div className="mb-4 h-12 w-12 text-white sm:h-14 sm:w-14 md:h-[4.5rem] md:w-[4.5rem] 2xl:mb-5 2xl:h-[5.25rem] 2xl:w-[5.25rem]">
        <Icon className="h-full w-full" />
      </div>
      <h3 className="landing-title-md uppercase text-white md:text-[2.05rem] 2xl:text-[2.45rem]">
        {title}
      </h3>
    </article>
  );
}

export function WhyWemWorksSection({ setLogoTheme }: WhyWemWorksSectionProps) {
  const { sectionRef, videoRef, activeStageKey, handoffPhase, isScrolled } =
    useWhyWemWorksVideo(whyWemWorksSectionConfig, {
      onEnter: () => setLogoTheme("light"),
      onEnterBack: () => setLogoTheme("light"),
    });

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
      videoClassName="md:object-[center_58%]"
    >
      {(() => {
        const showHandoff = handoffPhase !== "done";
        const showSectionTitle =
          handoffPhase === "done" && activeStageKey !== "proof";
        const showNarrativeCopy =
          handoffPhase === "done" &&
          activeStageKey !== "intro" &&
          activeStageKey !== "proof";
        const showSecondParagraph =
          handoffPhase === "done" &&
          (activeStageKey === "method" || activeStageKey === "ai");
        const showProofGrid =
          handoffPhase === "done" && activeStageKey === "proof";

        return (
          <div className="relative h-full w-full">
            <div className="landing-shell-tall">
              <div
                className={cx(
                  "landing-copy-panel transition-all duration-700",
                  showHandoff
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-6 opacity-0",
                )}
                style={{ textShadow: "0 8px 30px rgba(0, 0, 0, 0.32)" }}
              >
                <div>
                  <p className="text-eyebrow text-white/60">
                    {handoff.eyebrow}
                  </p>
                  <h2 className="heading-hero text-white">
                    {handoff.titleLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                  <div className="mt-5 body-stack text-body text-white/84">
                    {handoff.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
                <div
                  className={cx(
                    "mt-7 transition-all duration-500 md:mt-8",
                    handoffPhase === "card"
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0",
                  )}
                >
                  <HeroSupportCard
                    card={handoff.supportCard}
                    isActive={handoffPhase === "card"}
                  />
                </div>
              </div>

              <div
                className={cx(
                  "absolute z-10 transition-all duration-1000",
                  showSectionTitle
                    ? "opacity-100"
                    : "pointer-events-none opacity-0",

                  activeStageKey === "intro"
                    ? `
        left-[4%] top-[13%] translate-x-0 w-[92%]
        sm:left-[5%] sm:top-[17%] sm:w-[75%]
        lg:left-[5%] lg:top-landing-copy-lg lg:w-[60%]
        2xl:top-landing-copy-wide
      `
                    : `
        right-[4%] top-[11%] translate-x-0 w-[92%] text-right
        sm:right-[5%] sm:top-[13%] sm:w-[75%]
        lg:right-[5%] lg:top-landing-copy-lg lg:w-[60%]
        2xl:top-landing-copy-wide
      `,
                )}
              >
                <h3 className="heading-hero text-white/75">{introTitle}</h3>
              </div>

              <div
                className={cx(
                  `
    absolute
    right-[4%] top-[19%] w-[92%]
    sm:right-[5%] sm:top-[19%] sm:w-[86%]
    lg:right-[5%] lg:top-landing-copy-body-lg lg:w-[60%]
    2xl:top-landing-copy-body-wide
    transition-all duration-1000
    `,
                  showNarrativeCopy
                    ? "translate-x-0 opacity-100"
                    : "translate-x-12 opacity-0",
                )}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="text-right">
                  <p className="text-body text-white/94">{leadParagraph}</p>

                  <p
                    className={cx(
                      "text-body text-white/90 transition-all duration-700",
                      showSecondParagraph
                        ? "translate-y-0 opacity-100"
                        : "translate-y-5 opacity-0",
                    )}
                    style={{
                      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {resultParagraph}
                  </p>
                </div>

                <div className="mt-4 flex flex-col items-end gap-3 sm:mt-5 sm:gap-4 lg:mt-6 lg:w-full lg:flex-row-reverse lg:items-end lg:justify-start lg:gap-5">
                  {blocks.map((block, index) => (
                    <InsightBlock
                      key={block.stage}
                      stage={block.stage}
                      title={block.title}
                      body={block.body}
                      toneClassName={block.toneClassName}
                      offsetClassName={block.offsetClassName}
                      visible={isStageVisible(activeStageKey, block.stage)}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              <div
                className={cx(
                  "absolute inset-0 flex items-center justify-center px-[4%] pb-20 pt-landing-copy-base transition-opacity duration-500 sm:px-[5%] sm:pb-24 sm:pt-landing-copy-sm lg:justify-end lg:pb-24 lg:pt-landing-copy-lg 2xl:pb-28 2xl:pt-landing-copy-wide",
                  showProofGrid
                    ? "opacity-100"
                    : "pointer-events-none opacity-0",
                )}
              >
                <div className="grid h-full max-h-[22rem] w-full max-w-[22rem] grid-cols-2 grid-rows-2 gap-4 sm:max-h-[27rem] sm:max-w-[27rem] sm:gap-5 md:max-h-[31rem] md:max-w-[31rem] lg:max-h-[34rem] lg:max-w-[34rem] xl:max-h-[37rem] xl:max-w-[37rem] 2xl:max-h-[40rem] 2xl:max-w-[40rem]">
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
