"use client";

import type { IconType } from "react-icons";
import {
  FaRocket,
  FaShop,
  FaTriangleExclamation,
  FaUserTie,
} from "react-icons/fa6";

import { whoWeSupportSectionConfig } from "../data/who-we-support-story";
import { useWhoWeSupportSection } from "../hooks/use-who-we-support-section";
import type {
  WhoWeSupportCard,
  WhoWeSupportCardIcon,
  WhoWeSupportStageKey,
} from "../types/who-we-support-section";
import { ScrollIndicator } from "./scroll-indicator";

const whoWeSupportIcons: Record<WhoWeSupportCardIcon, IconType> = {
  startup: FaRocket,
  professional: FaUserTie,
  sme: FaShop,
};

const { sectionHeight, copy, cards } = whoWeSupportSectionConfig;

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
        "rounded-[2rem] bg-white px-8 py-9 text-center shadow-[0_18px_45px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 transition-[opacity,transform] duration-700 md:min-h-[31rem] md:px-8 md:py-10",
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-12 scale-[0.94] opacity-0",
      )}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="mx-auto flex h-28 w-28 items-center justify-center text-slate-800 md:h-32 md:w-32">
        <Icon className="h-full w-full" />
      </div>
      <h3 className="mt-8 font-sans text-[2.5rem] font-semibold tracking-tight text-black md:text-[3.3rem]">
        {card.title}
      </h3>
      <p className="mt-7 font-body text-[1.2rem] leading-[1.32] text-black/88 md:text-[1.95rem]">
        {card.body}
      </p>
    </article>
  );
}

export function WhoWeSupportSection() {
  const { sectionRef, activeStageKey } =
    useWhoWeSupportSection(whoWeSupportSectionConfig);

  const showTitle = true;
  const showWarning =
    activeStageKey === "warning" || activeStageKey === "final";

  return (
    <section
      id="chi-supportiamo"
      ref={sectionRef}
      data-nav-theme="light"
      className="relative bg-white"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        <div className="absolute inset-0 mx-auto max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16">
          <div className="absolute left-6 top-[20%] max-w-[min(94vw,1480px)] text-black sm:left-10 lg:left-16">
            <p
              className={cx(
                "font-body text-[1.55rem] font-light tracking-tight text-black/25 transition-all duration-700 md:text-[3.2rem]",
                showTitle ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
              )}
            >
              {copy.eyebrow}
            </p>

            <h2
              className={cx(
                "mt-8 whitespace-pre-line font-sans text-[clamp(3.5rem,7vw,7rem)] font-semibold leading-[0.92] tracking-tight transition-all duration-700",
                showTitle ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
              )}
            >
              {copy.title}
            </h2>
          </div>

          <div className="absolute inset-x-6 bottom-[20%] sm:inset-x-10 lg:inset-x-16">
            <div className="grid gap-6 lg:grid-cols-3">
              {cards.map((card, index) => (
                <AudienceCard
                  key={card.stage}
                  card={card}
                  visible={isAudienceCardVisible(activeStageKey, card.stage)}
                  delayMs={index * 100}
                />
              ))}
            </div>
          </div>

          <div
            className={cx(
              "absolute bottom-[7%] left-1/2 w-[min(92vw,72rem)] -translate-x-1/2 transition-[opacity,transform] duration-700",
              showWarning
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-10 opacity-0",
            )}
          >
            <div className="flex items-center gap-6 rounded-[2rem] bg-white px-8 py-7 shadow-[0_18px_50px_rgba(15,23,42,0.14)] ring-1 ring-amber-200/80 md:px-10 md:py-8">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.35rem] bg-amber-50 text-amber-500 md:h-24 md:w-24">
                <FaTriangleExclamation className="h-12 w-12 md:h-14 md:w-14" />
              </div>

              <div className="min-w-0 text-black">
                <p className="font-sans text-[2rem] font-semibold tracking-tight md:text-[3rem]">
                  {copy.warningTitle}
                </p>
                <p className="mt-2 font-body text-[1.3rem] leading-[1.24] text-black/88 md:text-[2rem]">
                  {copy.warningBody}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ScrollIndicator
          hidden={false}
          label="Scroll Down"
          labelClassName="normal-case text-[1.05rem] font-medium tracking-normal text-sky-200/75"
          mouseClassName="border-sky-200/55"
          wheelClassName="bg-sky-200/80"
        />
      </div>
    </section>
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
