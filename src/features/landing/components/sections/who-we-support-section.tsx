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
  stackedMobile?: boolean;
}

function AudienceCard({
  card,
  visible,
  delayMs,
  compact = false,
  stackedMobile = false,
}: AudienceCardProps) {
  const Icon = whoWeSupportIcons[card.icon];

  return (
    <article
      className={cx(
        "group rounded-[1.6rem] bg-white text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60 transition-all duration-[420ms] will-change-transform",
        "motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.012] motion-safe:hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]",
        stackedMobile
          ? "min-h-[168px] px-4 py-4.5"
          : compact
            ? "min-h-[232px] px-4.5 py-4.5 sm:min-h-[228px] sm:px-5 sm:py-5 md:min-h-[250px]"
            : "min-h-[280px] px-5 py-6 md:min-h-[340px]",
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
          stackedMobile
            ? "h-14 w-14"
            : compact
              ? "h-16 w-16 sm:h-16 sm:w-16"
              : "h-20 w-20",
        )}
      >
        <Icon />
      </div>

      <h3
        className={cx(
          "font-sans font-semibold tracking-tight text-black",
          stackedMobile
            ? "mt-3 text-[1.05rem]"
            : compact
              ? "mt-3.5 text-[1.18rem] sm:mt-4 sm:text-[1.35rem] md:text-[1.7rem]"
              : "mt-6 text-[1.6rem] md:text-[2rem]",
        )}
      >
        {card.title}
      </h3>

      <p
        className={cx(
          "font-body leading-[1.5] text-black/70",
          stackedMobile
            ? "mt-2 text-[0.94rem]"
            : compact
              ? "mt-2.5 text-[1rem] sm:mt-3 sm:text-[1.18rem] md:text-[1.6rem]"
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

function WarningCard({
  mobile = false,
  stackedMobile = false,
}: {
  mobile?: boolean;
  stackedMobile?: boolean;
}) {
  const warningSentence = `${copy.warningTitle.replace(/:$/, "")} ${copy.warningBody}`;

  return (
    <div className="relative rounded-[1.6rem]">
      <div
        className={cx(
          "pointer-events-none absolute inset-3 rounded-[1.35rem] bg-slate-200/60 blur-2xl opacity-60",
          mobile ? "hidden" : "block",
        )}
      />

      <div
        className={cx(
          "relative overflow-hidden border border-slate-200/80 bg-white",
          stackedMobile
            ? "rounded-[1.6rem] shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
            : mobile
              ? "rounded-[1.9rem] shadow-[0_22px_58px_rgba(15,23,42,0.22)]"
              : "rounded-[1.6rem] shadow-[0_16px_38px_rgba(148,163,184,0.16)]",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(248,250,252,0.9),rgba(255,255,255,0.98)_42%,rgba(255,247,237,0.52)_100%)]" />

        <div
          className={cx(
            "relative",
            stackedMobile
              ? "flex min-h-[176px] flex-col items-center justify-center gap-4 px-5 py-5 text-center"
              : mobile
                ? "flex flex-col items-center gap-5 px-6 py-7 text-center"
                : "flex flex-col items-start gap-5 px-6 py-6 text-left md:flex-row md:items-center md:px-8 md:py-7",
          )}
        >
          <div
            className={cx(
              stackedMobile
                ? "flex h-14 w-14 items-center justify-center text-amber-400"
                : mobile
                  ? "flex h-28 w-28 items-center justify-center text-amber-400"
                  : "flex h-16 w-16 items-center justify-center rounded-[1rem] bg-white text-amber-500 shadow-[0_8px_18px_rgba(234,179,8,0.1)] ring-1 ring-amber-200/80",
            )}
          >
            <FaTriangleExclamation
              className={cx(
                stackedMobile
                  ? "h-12 w-12 drop-shadow-[0_8px_18px_rgba(0,0,0,0.1)]"
                  : mobile
                    ? "h-24 w-24 drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
                    : "h-8 w-8",
              )}
            />
          </div>

          <div className="text-black">
            <p
              className={cx(
                "font-sans font-semibold tracking-tight text-black/92",
                mobile ? "hidden" : "text-[1.5rem] md:text-[2rem]",
              )}
            >
              {copy.warningTitle}
            </p>
            <p
              className={cx(
                stackedMobile
                  ? "text-[1rem] font-semibold leading-[1.35] tracking-tight text-black"
                  : mobile
                    ? "text-[1.55rem] font-semibold leading-[1.28] tracking-tight text-black"
                    : "mt-1 text-[1rem] leading-[1.45] text-black/68 md:text-[1.15rem]",
              )}
            >
              {mobile ? warningSentence : copy.warningBody}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
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
      <div className="w-full sm:w-[90%] lg:w-[85%]">
        <p
          className={cx(
            "text-eyebrow text-black/28 transition-all duration-700",
            showHeading
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0",
          )}
        >
          {copy.eyebrow}
        </p>
        <h2
          className={cx(
            "heading-hero text-black transition-all duration-700",
            showHeading
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0",
          )}
          style={{ transitionDelay: showHeading ? "70ms" : "0ms" }}
        >
          {copy.title}
        </h2>
      </div>
      <div className="mt-6 sm:hidden">
        {cards.map((card, index) => (
          <div
            key={`mobile-${card.stage}`}
            className={cx(
              "relative overflow-hidden transition-[max-height,margin-top,opacity,transform] duration-500",
              forceFinal || isAudienceCardVisible(activeStageKey, card.stage)
                ? cx(
                    index === 0 ? "mt-0" : "-mt-16",
                    "max-h-[220px] translate-y-0 opacity-100",
                  )
                : "pointer-events-none mt-0 max-h-0 translate-y-6 opacity-0",
            )}
            style={{
              zIndex: index + 1,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <AudienceCard
              card={card}
              compact={compact}
              stackedMobile
              visible={
                forceFinal || isAudienceCardVisible(activeStageKey, card.stage)
              }
              delayMs={index * 70}
            />
          </div>
        ))}

        <div
          className={cx(
            "relative overflow-hidden transition-[max-height,margin-top,opacity,transform] duration-520",
            showWarning
              ? "-mt-22 max-h-[220px] -translate-y-2 opacity-100"
              : "pointer-events-none mt-0 max-h-0 translate-y-6 opacity-0",
          )}
          style={{
            zIndex: cards.length + 1,
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <WarningCard mobile stackedMobile />
        </div>
      </div>

      <div
        className={cx(
          "hidden md:grid md:grid-cols-2 lg:grid-cols-3 transition-[opacity,transform] duration-500",
          compact
            ? "mt-6 gap-4 sm:mt-8 sm:gap-5 lg:gap-8"
            : "mt-16 gap-10 lg:gap-12",
          showWarning
            ? "pointer-events-none -translate-y-3 opacity-0 sm:pointer-events-auto sm:translate-y-0 sm:opacity-100"
            : "translate-y-0 opacity-100",
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
          "hidden overflow-hidden transition-[max-height,margin-top,opacity,transform] duration-520 md:block",
          showWarning
            ? "mt-8 max-h-[220px] translate-y-0 opacity-100"
            : "pointer-events-none mt-0 max-h-0 translate-y-6 opacity-0",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div
          className={cx(
            "relative rounded-[1.6rem] transition-transform duration-520",
            showWarning ? "translate-y-0" : "translate-y-6",
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <WarningCard />
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
        <div className="landing-frame h-full pt-[12%] sm:pt-[17%] lg:pt-[8%]">
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
          "relative z-10 bg-white pb-24 transition-[opacity,transform] duration-500 sm:pb-24 lg:pb-32",
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
