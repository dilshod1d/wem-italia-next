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
import { ScrollIndicator } from "../scroll-indicator";
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
  compact?: boolean;
}

function AudienceCard({
  card,
  visible,
  delayMs,
  compact = false,
}: AudienceCardProps) {
  const Icon = whoWeSupportIcons[card.icon];

  return (
    <article
      className={cx(
        "group rounded-[1.6rem] bg-white text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60 transition-all duration-500",
        "motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]",
        compact
          ? "min-h-[220px] px-5 py-5 md:min-h-[250px]"
          : "min-h-[300px] px-6 py-7 md:min-h-[340px]",
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
      )}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className={cx(
          "mx-auto flex items-center justify-center rounded-[1.2rem] bg-slate-50 text-slate-700 transition group-hover:bg-slate-100",
          compact ? "h-16 w-16" : "h-20 w-20",
        )}
      >
        <Icon />
      </div>

      <h3
        className={cx(
          "font-sans font-semibold tracking-tight text-black",
          compact
            ? "mt-4 text-[1.35rem] md:text-[1.7rem]"
            : "mt-6 text-[1.6rem] md:text-[2rem]",
        )}
      >
        {card.title}
      </h3>

      <p
        className={cx(
          "font-body leading-[1.5] text-black/70",
          compact
            ? "mt-3 text-[1rem] md:text-[1.15rem]"
            : "mt-4 text-[1.2rem] md:text-[1.6rem]",
        )}
      >
        {card.body}
      </p>
    </article>
  );
}

interface WhoWeSupportContentProps {
  activeStageKey: WhoWeSupportStageKey;
  compact?: boolean;
  forceFinal?: boolean;
  warningOnly?: boolean;
  renderWarning?: boolean;
}

function WhoWeSupportContent({
  activeStageKey,
  compact = false,
  forceFinal = false,
  warningOnly = false,
  renderWarning = true,
}: WhoWeSupportContentProps) {
  const showWarning =
    renderWarning &&
    (forceFinal || activeStageKey === "warning" || activeStageKey === "final");

  return (
    <>
      {!warningOnly ? (
        <>
          <div className="max-w-[720px]">
            <p className="text-[1.2rem] font-light tracking-tight text-black/30 md:text-[1.6rem]">
              {copy.eyebrow}
            </p>

            <h2 className="mt-3 font-sans text-[2.4rem] font-semibold leading-[1.05] tracking-tight text-black md:text-[3.2rem]">
              {copy.title}
            </h2>
          </div>

          <div
            className={cx(
              "grid md:grid-cols-2 lg:grid-cols-3",
              compact ? "mt-10 gap-6 lg:gap-8" : "mt-16 gap-10 lg:gap-12",
            )}
          >
            {cards.map((card, index) => (
              <AudienceCard
                key={card.stage}
                card={card}
                compact={compact}
                visible={
                  forceFinal || isAudienceCardVisible(activeStageKey, card.stage)
                }
                delayMs={index * 100}
              />
            ))}
          </div>
        </>
      ) : null}

      <div
        className={cx(
          warningOnly
            ? "mt-0 transition-all duration-700"
            : compact
              ? "mt-8 transition-all duration-700"
              : "mt-14 transition-all duration-700",
          showWarning ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
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
    </>
  );
}

export function WhoWeSupportSection() {
  const { sectionRef, pinnedRef, activeStageKey, isScrolled, isPinned } =
    useWhoWeSupportSection(whoWeSupportSectionConfig);

  return (
    <section
      id="who-we-support"
      ref={sectionRef}
      data-nav-theme="light"
      className="relative bg-white"
    >
      <div ref={pinnedRef} className="relative z-20 h-screen w-full overflow-hidden bg-white">
        <div className="mx-auto h-full max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16">
          <WhoWeSupportContent
            activeStageKey={activeStageKey}
            compact
            renderWarning={false}
          />
        </div>

        <ScrollIndicator
          hidden={isScrolled}
          label="Scroll Down"
          labelClassName="normal-case text-[1rem] font-medium text-sky-200/70"
          mouseClassName="border-sky-200/50"
          wheelClassName="bg-sky-200/70"
        />
      </div>

      <div
        aria-hidden={isPinned}
        className={cx(
          "relative z-10 bg-white pb-40 transition-[opacity,transform] duration-500",
          isPinned
            ? "pointer-events-none -translate-y-2 opacity-0"
            : "-translate-y-10 opacity-100",
        )}
      >
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
          <WhoWeSupportContent
            activeStageKey="final"
            forceFinal
            warningOnly
          />
        </div>
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
