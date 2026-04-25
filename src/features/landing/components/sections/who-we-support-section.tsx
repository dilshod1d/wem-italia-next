"use client";

import type { IconType } from "react-icons";
import { FaTriangleExclamation } from "react-icons/fa6";

import { whoWeSupportSectionConfig } from "../../data/who-we-support-story";
import type {
  WhoWeSupportCard,
  WhoWeSupportCardIcon,
} from "../../types/who-we-support-section";
import OfficeWorkerIcon from "../icons/OfficeWorkerIcon";
import StoreIcon from "../icons/StoreIcon";
import RocketIcon from "../icons/RocketIcon";

const whoWeSupportIcons: Record<WhoWeSupportCardIcon, IconType> = {
  startup: RocketIcon,
  professional: OfficeWorkerIcon,
  sme: StoreIcon,
};

const audienceCardAccents: Record<
  WhoWeSupportCard["stage"],
  {
    readonly glow: string;
    readonly icon: string;
    readonly tag: string;
  }
> = {
  startups: {
    glow: "bg-brand-green/15",
    icon: "bg-brand-green/10 text-brand-green ring-brand-green/20",
    tag: "text-brand-green",
  },
  professionals: {
    glow: "bg-brand-blue/15",
    icon: "bg-brand-blue/10 text-brand-blue ring-brand-blue/20",
    tag: "text-brand-blue",
  },
  smes: {
    glow: "bg-brand-purple/15",
    icon: "bg-brand-purple/10 text-brand-purple ring-brand-purple/20",
    tag: "text-brand-purple",
  },
};

const { copy, cards } = whoWeSupportSectionConfig;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface AudienceCardProps {
  card: WhoWeSupportCard;
  index: number;
  visible: boolean;
  delayMs: number;
  compact?: boolean;
  stackedMobile?: boolean;
}

function AudienceCard({
  card,
  index,
  visible,
  delayMs,
  compact = false,
  stackedMobile = false,
}: AudienceCardProps) {
  const Icon = whoWeSupportIcons[card.icon];
  const accent = audienceCardAccents[card.stage];

  return (
    <article
      className={cx(
        "group relative isolate overflow-hidden rounded-[1.6rem] border border-slate-200/70 bg-white text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 transition-[border-color,box-shadow,opacity,transform] duration-[520ms] will-change-transform",
        "motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.012] motion-safe:hover:border-slate-300/80 motion-safe:hover:shadow-[0_22px_54px_rgba(15,23,42,0.14)]",
        stackedMobile
          ? "min-h-[168px] px-4 py-4.5"
          : compact
            ? "min-h-[232px] px-4.5 py-4.5 sm:min-h-[228px] sm:px-5 sm:py-5 md:min-h-[250px]"
            : "min-h-[280px] px-5 py-6 md:min-h-[340px]",
        visible
          ? cx(
              "translate-y-0 scale-100 opacity-100",
              stackedMobile && getAudienceCardDeckClass(index),
            )
          : "translate-y-8 scale-[0.975] opacity-0",
      )}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
          accent.glow,
        )}
      />

      <div
        className={cx(
          "mx-auto flex items-center justify-center rounded-[1.2rem] ring-1 transition-transform duration-500 group-hover:scale-[1.04]",
          accent.icon,
          stackedMobile
            ? "h-14 w-14"
            : compact
              ? "h-16 w-16 sm:h-16 sm:w-16"
              : "h-20 w-20",
        )}
      >
        <Icon />
      </div>

      <p
        className={cx(
          "mt-3 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.24em]",
          "sm:text-[0.72rem] md:text-[0.78rem]",
          accent.tag,
        )}
      >
        {card.tag}
      </p>

      <h3
        className={cx(
          "font-sans font-semibold tracking-tight text-black",
          stackedMobile
            ? "mt-1.5 text-[1.05rem]"
            : compact
              ? "mt-2 text-[1.18rem] sm:text-[1.35rem] md:text-[1.7rem]"
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
          "relative overflow-hidden border border-brand-yellow/45 bg-white",
          stackedMobile
            ? "rounded-[1.6rem] shadow-[0_14px_38px_rgba(15,23,42,0.12)]"
            : mobile
              ? "rounded-[1.9rem] shadow-[0_24px_64px_rgba(15,23,42,0.22)]"
              : "rounded-[1.6rem] shadow-[0_20px_48px_rgba(234,186,43,0.16)]",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,255,255,0.96)_48%,rgba(234,186,43,0.12)_100%)]" />

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
                ? "flex h-14 w-14 items-center justify-center rounded-[1.1rem] bg-brand-yellow/12 text-brand-yellow ring-1 ring-brand-yellow/30"
                : mobile
                  ? "flex h-28 w-28 items-center justify-center rounded-[1.6rem] bg-brand-yellow/12 text-brand-yellow ring-1 ring-brand-yellow/30"
                  : "flex h-16 w-16 items-center justify-center rounded-[1rem] bg-brand-yellow/10 text-brand-yellow shadow-[0_8px_18px_rgba(234,186,43,0.14)] ring-1 ring-brand-yellow/30",
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

export function WhoWeSupportSection() {
  return (
    <section
      id="who-we-support"
      data-nav-theme="light"
      className="relative bg-white pb-44 pt-3 sm:pb-48 sm:pt-4 lg:pb-52 lg:pt-5 2xl:pb-56 2xl:pt-6"
    >
      <div className="landing-frame">
        <div className="w-full sm:w-[90%] lg:w-[85%]">
          <p className="text-eyebrow text-black/28">{copy.eyebrow}</p>
          <h2 className="heading-hero text-black">{copy.title}</h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {cards.map((card, index) => (
            <AudienceCard
              key={card.stage}
              card={card}
              index={index}
              compact
              visible
              delayMs={index * 70}
            />
          ))}
        </div>

        <div className="mx-auto mt-8 w-full max-w-[760px] sm:mt-10">
          <WarningCard />
        </div>
      </div>
    </section>
  );
}

function getAudienceCardDeckClass(index: number) {
  if (index === 0) return "-rotate-[1.2deg]";
  if (index === 1) return "rotate-[0.9deg] translate-x-1";

  return "-rotate-[0.35deg] -translate-x-0.5";
}
