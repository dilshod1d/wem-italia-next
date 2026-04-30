"use client";

import type { IconType } from "react-icons";
import { FiCheckCircle, FiCreditCard, FiUsers } from "react-icons/fi";

import { howItWorksSectionConfig } from "../../data/how-it-works-story";
import { systemFlowSectionConfig } from "../../data/system-flow-story";
import { useSystemFlowVideo } from "../../hooks/use-system-flow-video";
import type {
  SystemFlowCard,
  SystemFlowStageKey,
} from "../../types/system-flow-section";
import { CinematicVideoSection } from "../cinematic-video-section";

const { videoUrl, eyebrow, title, paragraphs, cards } = systemFlowSectionConfig;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const benefitCardIcons: Record<SystemFlowCard["icon"], IconType> = {
  steps: FiCheckCircle,
  budget: FiCreditCard,
  support: FiUsers,
};

interface SystemFlowSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

interface BenefitCardProps {
  icon: SystemFlowCard["icon"];
  title: string;
  body: string;
  toneClassName: string;
  placementClassName: string;
  zIndexClassName: string;
  visible: boolean;
  delayMs: number;
}

function BenefitCard({
  icon,
  title,
  body,
  toneClassName,
  placementClassName,
  zIndexClassName,
  visible,
  delayMs,
}: BenefitCardProps) {
  const Icon = benefitCardIcons[icon];

  return (
    <article
      // className={cx(
      //   "group absolute flex min-h-[7.93rem] flex-col overflow-hidden rounded-[2.35rem] px-[1.35rem] py-[1.55rem] text-white shadow-[0_28px_80px_rgba(0,0,0,0.08)] transition-[opacity,transform] duration-700",
      //   "before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-white/45 before:content-['']",
      //   "after:pointer-events-none after:absolute after:-right-10 after:-top-10 after:size-28 after:rounded-full after:bg-white/10 after:blur-2xl after:content-['']",
      //   "sm:min-h-[9.5rem] sm:px-[1.8rem] sm:py-[1.85rem]",
      //   "md:min-h-[11.9rem] md:rounded-[3.85rem] md:px-[2.7rem] md:py-[2.3rem]",
      //   "lg:min-h-0 lg:justify-center lg:rounded-[2.75rem] lg:px-8 lg:py-6",
      //   "xl:min-h-0 xl:rounded-[3.1rem] xl:px-10 xl:py-7",
      //   "2xl:min-h-0 2xl:rounded-[3.45rem] 2xl:px-12 2xl:py-8",
      //   toneClassName,
      //   placementClassName,
      //   zIndexClassName,
      //   visible
      //     ? "translate-y-0 scale-100 opacity-100"
      //     : "pointer-events-none translate-y-10 scale-[0.94] opacity-0",
      // )}
      className={cx(
        "group absolute flex min-h-[4.9rem] flex-col overflow-hidden rounded-[1.25rem] px-3.5 py-3 text-white shadow-[0_18px_44px_rgba(0,0,0,0.12)] transition-[opacity,transform] duration-700",
        "before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-white/35 before:content-['']",
        "after:pointer-events-none after:absolute after:-right-10 after:-top-10 after:size-24 after:rounded-full after:bg-white/10 after:blur-2xl after:content-['']",
        "sm:min-h-[6rem] sm:rounded-[1.55rem] sm:px-5 sm:py-4",
        "md:min-h-[8rem] md:rounded-[2.2rem] md:px-7 md:py-5",
        "lg:min-h-0 lg:justify-center lg:rounded-[2.75rem] lg:px-8 lg:py-6",
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
      <span
        aria-hidden="true"
        className="absolute right-[1.15rem] top-[1.15rem] grid size-11 place-items-center rounded-full bg-white/16 text-white ring-1 ring-white/28 backdrop-blur-md transition-transform duration-500 group-hover:scale-110 sm:right-[1.55rem] sm:top-[1.55rem] sm:size-12 md:size-14 lg:right-6 lg:top-6 lg:size-12 xl:size-14"
      >
        <Icon className="size-[1.35rem] sm:size-[1.5rem] md:size-[1.75rem] lg:size-[1.45rem] xl:size-[1.65rem]" />
      </span>

      <Icon
        aria-hidden="true"
        className="absolute -bottom-8 -right-8 size-32 text-white/10 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110 sm:size-40 md:size-48 lg:size-36 xl:size-44"
      />

      <div className="relative z-10 max-w-[84%] md:max-w-[82%] lg:max-w-[88%]">
        <h3 className="font-sans text-[1.45rem] font-semibold uppercase leading-[0.98] tracking-tight text-white sm:text-[1.9rem] md:text-[2.45rem] lg:text-[1.9rem] xl:text-[2.12rem] 2xl:text-[2.34rem]">
          {title}
        </h3>

        <p className="mt-[0.6rem] max-w-[40.6rem] font-body text-[1.04rem] leading-[1.25] text-white sm:text-[1.2rem] md:mt-[0.78rem] md:text-[1.62rem] lg:mt-2 lg:max-w-[92%] lg:text-[1rem] lg:leading-[1.22] xl:text-[1.08rem] 2xl:text-[1.22rem]">
          {body}
        </p>
      </div>
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
      videoClassName="md:object-[72%_78%] object-[center_0%]"
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

            {/* <div className="pointer-events-none relative z-30 mt-4 h-[16.5rem] sm:mt-5 sm:h-[19.75rem] md:mt-6 md:h-[23.5rem] lg:mt-[2vh] lg:h-auto lg:min-h-0 lg:flex-1 lg:w-[70%] xl:mt-[2.4vh] xl:w-[72%] 2xl:w-[74%]"> */}
            <div className="pointer-events-none relative z-30 mt-4 h-[17rem] w-full sm:mt-5 sm:h-[19rem] md:mt-6 md:h-[22rem] lg:mt-[2vh] lg:h-auto lg:min-h-0 lg:flex-1 lg:w-[70%] xl:mt-[2.4vh] xl:w-[72%] 2xl:w-[74%]">
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
