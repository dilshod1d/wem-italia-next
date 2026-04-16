"use client";

import type { IconType } from "react-icons";
import { FaTriangleExclamation } from "react-icons/fa6";

import { whoWeSupportSectionConfig } from "../../data/who-we-support-story";
import { useWhoWeSupportSection } from "../../hooks/use-who-we-support-section";
import type {
  WhoWeSupportCard,
  WhoWeSupportCardIcon,
  WhoWeSupportStageKey,
} from "../../types/who-we-support-section";
import { Chapter } from "@/components/Chapter/Chapter";
import OfficeWorkerIcon from "../icons/OfficeWorkerIcon";
import StoreIcon from "../icons/StoreIcon";
import RocketIcon from "../icons/RocketIcon";

const whoWeSupportIcons: Record<WhoWeSupportCardIcon, IconType> = {
  startup: RocketIcon,
  professional: OfficeWorkerIcon,
  sme: StoreIcon,
};

const { copy, cards } = whoWeSupportSectionConfig;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface AudienceCardProps {
  card: WhoWeSupportCard;
  visible: boolean;
  delayMs: number;
}

function AudienceCard({ card, visible, delayMs }: AudienceCardProps) {
  const Icon = whoWeSupportIcons[card.icon];

  return (
    <article
      className={cx(
        "group rounded-[1.6rem] bg-white px-6 py-7 text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60 transition-all duration-500",
        "hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]",
        "min-h-[300px] md:min-h-[340px]",
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
      )}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.2rem] bg-slate-50 text-slate-700 transition group-hover:bg-slate-100">
        <Icon />
      </div>

      <h3 className="mt-6 font-sans text-[1.6rem] font-semibold tracking-tight text-black md:text-[2rem]">
        {card.title}
      </h3>

      <p className="mt-4 font-body text-[1.2rem] leading-[1.5] text-black/70 md:text-[1.6rem]">
        {card.body}
      </p>
    </article>
  );
}

export function WhoWeSupportSection() {
  const { sectionRef, activeStageKey, isScrolled } = useWhoWeSupportSection(
    whoWeSupportSectionConfig,
  );

  const showWarning =
    activeStageKey === "warning" || activeStageKey === "final";

  return (
    <Chapter
      sectionRef={sectionRef}
      sectionId="who-we-support"
      navTheme="light"
      isScrolled={isScrolled}
      indicatorLabel="Scroll Down"
      indicatorLabelClassName="normal-case text-[1rem] font-medium text-sky-200/70"
      indicatorMouseClassName="border-sky-200/50"
      indicatorWheelClassName="bg-sky-200/70"
      sectionClassName="bg-white"
    >
      <div className="mx-auto px-6 py-28 sm:px-10 lg:px-16">
        <div className="max-w-[720px]">
          <p className="text-[1.2rem] font-light tracking-tight text-black/30 md:text-[1.6rem]">
            {copy.eyebrow}
          </p>

          <h2 className="mt-3 font-sans text-[2.4rem] font-semibold leading-[1.05] tracking-tight text-black md:text-[3.2rem]">
            {copy.title}
          </h2>
        </div>

        <div className="mt-16 grid gap-20 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <AudienceCard
              key={card.stage}
              card={card}
              visible={isAudienceCardVisible(activeStageKey, card.stage)}
              delayMs={index * 100}
            />
          ))}
        </div>

        <div
          className={cx(
            "mt-20 transition-all duration-700",
            showWarning
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0",
          )}
        >
          <div className="flex flex-col items-start gap-5 rounded-[1.6rem] bg-white px-6 py-6 shadow-[0_12px_35px_rgba(15,23,42,0.1)] ring-1 ring-amber-200/70 md:flex-row md:items-center md:px-8 md:py-7">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1rem] bg-amber-50 text-amber-500">
              <FaTriangleExclamation className="h-8 w-8" />
            </div>

            <div className="text-black">
              <p className="font-sans text-[1.5rem] font-semibold tracking-tight md:text-[2rem]">
                {copy.warningTitle}
              </p>
              <p className="mt-1 text-[1rem] text-black/70 md:text-[1.15rem]">
                {copy.warningBody}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

function isAudienceCardVisible(
  activeStage: WhoWeSupportStageKey,
  cardStage: WhoWeSupportStageKey,
) {
  if (cardStage === "startups") {
    return (
      activeStage === "startups" ||
      activeStage === "professionals" ||
      activeStage === "smes" ||
      activeStage === "warning" ||
      activeStage === "final"
    );
  }

  if (cardStage === "professionals") {
    return (
      activeStage === "professionals" ||
      activeStage === "smes" ||
      activeStage === "warning" ||
      activeStage === "final"
    );
  }

  return (
    activeStage === "smes" ||
    activeStage === "warning" ||
    activeStage === "final"
  );
}
