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

interface WhoWeSupportSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
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
        "group rounded-[1.6rem] bg-white text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60 transition-all duration-[420ms] will-change-transform",
        "motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.012] motion-safe:hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]",
        compact
          ? "min-h-[220px] px-5 py-5 md:min-h-[250px]"
          : "min-h-[300px] px-6 py-7 md:min-h-[340px]",
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-8 scale-[0.975] opacity-0",
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
            ? "mt-3 text-[1.4rem] md:text-[1.6rem]"
            : "mt-4 text-[1.6rem] md:text-[2rem]",
        )}
      >
        {card.body}
      </p>
    </article>
  );
}

interface WhoWeSupportContentProps {
  activeStageKey: WhoWeSupportStageKey;
  showHeading: boolean;
  compact?: boolean;
  forceFinal?: boolean;
  renderWarning?: boolean;
}

function WhoWeSupportContent({
  activeStageKey,
  showHeading,
  compact = false,
  forceFinal = false,
  renderWarning = true,
}: WhoWeSupportContentProps) {
  const showWarning =
    renderWarning &&
    (forceFinal || activeStageKey === "warning" || activeStageKey === "final");

  return (
    <>
      <div className="max-w-[85%]">
        <p
          className={cx(
            "text-eyebrow text-black/28 transition-all duration-700",
            showHeading ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          {copy.eyebrow}
        </p>
        <h2
          className={cx(
            "heading-hero text-black transition-all duration-700",
            showHeading ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
          style={{ transitionDelay: showHeading ? "70ms" : "0ms" }}
        >
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
            delayMs={index * 70}
          />
        ))}
      </div>

      <div
        className={cx(
          "absolute left-[5%] right-[5%] bottom-[10%] overflow-hidden transition-[opacity,transform] duration-520",
          showWarning ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="relative rounded-[1.6rem]">
          <div className="pointer-events-none absolute inset-3 rounded-[1.35rem] bg-slate-200/60 blur-2xl opacity-60" />

          <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white shadow-[0_16px_38px_rgba(148,163,184,0.16)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(248,250,252,0.9),rgba(255,255,255,0.98)_42%,rgba(255,247,237,0.52)_100%)]" />

            <div className="relative flex flex-col items-start gap-5 px-6 py-6 md:flex-row md:items-center md:px-8 md:py-7">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1rem] bg-white text-amber-500 shadow-[0_8px_18px_rgba(234,179,8,0.1)] ring-1 ring-amber-200/80">
                <FaTriangleExclamation className="h-8 w-8" />
              </div>

              <div className="text-black">
                <p className="font-sans text-[1.5rem] font-semibold tracking-tight text-black/92 md:text-[2rem]">
                  {copy.warningTitle}
                </p>
                <p className="mt-1 text-[1rem] leading-[1.45] text-black/68 md:text-[1.15rem]">
                  {copy.warningBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function WhoWeSupportSection({
  setLogoTheme,
}: WhoWeSupportSectionProps) {
  const { sectionRef, pinnedRef, activeStageKey, isScrolled, isPinned } =
    useWhoWeSupportSection(whoWeSupportSectionConfig, {
      onEnter: () => setLogoTheme("dark"),
      onEnterBack: () => setLogoTheme("dark"),
    });

  return (
    <section
      id="who-we-support"
      ref={sectionRef}
      data-nav-theme="light"
      className="relative bg-white"
    >
      <div
        ref={pinnedRef}
        className="relative z-20 h-screen w-full overflow-hidden bg-white"
      >
        <div className="mx-auto mt-[10%] h-full px-6 sm:px-10 lg:px-16">
          <WhoWeSupportContent
            activeStageKey={activeStageKey}
            showHeading={isPinned}
            compact
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
      ></div>
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
