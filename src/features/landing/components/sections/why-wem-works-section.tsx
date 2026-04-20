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
        w-full
        rounded-[1.25rem] p-4
        sm:rounded-[1.75rem] sm:p-5
        md:rounded-[2.25rem] md:p-10

        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        transition-all duration-700
        `,
        toneClassName,
        className,
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 sm:translate-y-6 md:translate-y-8 opacity-0",
      )}
    >
      <h3
        className="
          landing-title-md uppercase text-white
          text-[1.1rem] leading-snug
          sm:text-[1.4rem]
          md:text-[2.2rem]
        "
      >
        {title}
      </h3>

      <p
        className="
          landing-body-sm
          mt-2
          text-white/92

          text-[0.9rem] leading-6
          max-w-[95%]

          sm:mt-3 sm:text-[1rem] sm:max-w-[85%]
          md:mt-4 md:text-[1.15rem] md:max-w-4xl
        "
      >
        {body}
      </p>
    </article>
  );
}

// function InsightBlock({
//   title,
//   body,
//   toneClassName,
//   visible,
//   className,
// }: InsightBlockProps) {
//   return (
//     <article
//       className={cx(
//         "w-full rounded-[1.75rem] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.28)] transition-all duration-700 sm:p-6 md:rounded-[2.25rem] md:p-10",
//         toneClassName,
//         className,
//         visible
//           ? "translate-y-0 opacity-100"
//           : "pointer-events-none translate-y-8 opacity-0",
//       )}
//     >
//       <h3 className="landing-title-md uppercase text-white md:text-[2.2rem]">
//         {title}
//       </h3>
//       <p className="landing-body-sm mt-3 max-w-4xl text-white/92 md:mt-4 md:text-[1.15rem]">
//         {body}
//       </p>
//     </article>
//   );
// }

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
      <h3 className="landing-title-md uppercase text-white md:text-[2.3rem]">
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
      videoClassName="object-center scale-[1.01] brightness-[0.82] contrast-[1.05] saturate-[1.03] md:object-[center_58%]"
      overlay={
        <>
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/55 via-slate-950/5 to-black/45" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute left-[42%] top-[12%] h-48 w-48 rounded-full bg-amber-300/15 blur-3xl" />
          <div className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-blue-300/8 blur-3xl" />
        </>
      }
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
                  "absolute left-[5%] right-[6%] top-[20%] z-20 max-w-[55%] transition-all duration-700",
                  showHandoff
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-6 opacity-0",
                )}
                style={{ textShadow: "0 8px 30px rgba(0, 0, 0, 0.32)" }}
              >
                <div>
                  <p className="text-eyebrow mb-4 text-white/60">
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
        left-3 top-[16%] translate-x-0 max-w-[92%]
        sm:left-6 sm:top-[20%]  sm:max-w-[75%]
        lg:left-16 lg:top-[24%] lg:max-w-[60%]
      `
                    : `
        right-3 top-[14%]  translate-x-0 max-w-[92%]
        sm:right-6 sm:top-[16%]  sm:max-w-[75%]
        lg:right-16 lg:top-[18%] lg:max-w-[60%]
      `,
                )}
              >
                <h3 className="heading-hero text-white/75">{introTitle}</h3>
              </div>

              <div
                className={cx(
                  `
    absolute
    right-3 top-[20%] max-w-[60%]
    sm:right-6 sm:top-[22%] 
    lg:right-16 lg:top-[30%] 
    transition-all duration-1000
    `,
                  showNarrativeCopy
                    ? "translate-x-0 opacity-100"
                    : "translate-x-12 opacity-0",
                )}
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
                  >
                    {resultParagraph}
                  </p>
                </div>
              </div>

              <div className="absolute right-3  bottom-[5%] sm:bottom-[12%] lg:bottom-[7%] sm:right-6 lg:right-16 max-w-[60%]">
                <div className="ml-auto flex w-full flex-col gap-5">
                  {blocks.map((block, index) => (
                    <InsightBlock
                      key={block.stage}
                      title={block.title}
                      body={block.body}
                      toneClassName={block.toneClassName}
                      visible={isStageVisible(activeStageKey, block.stage)}
                      className={cx(
                        block.offsetClassName,
                        index !== 0 &&
                          `
    -mt-6
    sm:-mt-10
    lg:-mt-16
  `,
                      )}
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
