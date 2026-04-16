"use client";

import type { ReactNode } from "react";
import type {
  HeroBody,
  HeroEyebrow,
  HeroSectionConfig,
  HeroStage,
  HeroSupportCard,
  HeroTitle,
} from "../types/hero-section";
import { HeroSupportCard as HeroSupportCardBlock } from "./hero-support-card";

interface HeroSlideProps {
  stage: HeroStage;
  config: HeroSectionConfig;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function renderEyebrow(eyebrow: HeroEyebrow) {
  return (
    <p className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-white/60 md:text-[0.72rem]">
      {eyebrow.text}
    </p>
  );
}

function renderTitle(title: HeroTitle) {
  return (
    <h1 className="font-sans text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-white">
      {title.lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h1>
  );
}

function renderBody(body: HeroBody) {
  return (
    <div className="space-y-1.5 text-sm leading-6 text-white/84 md:text-base">
      {body.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function renderCard(card: HeroSupportCard) {
  return <HeroSupportCardBlock card={card} isActive />;
}

function KeyedSlot<T>({
  slotKey,
  className,
  render,
  value,
}: {
  slotKey?: string;
  className?: string;
  render: (value: T) => ReactNode;
  value?: T;
}) {
  if (!slotKey || !value) {
    return null;
  }

  return (
    <div
      key={slotKey}
      className={cx("hero-slot-in", className)}
    >
      {render(value)}
    </div>
  );
}

export function HeroSlide({ stage, config }: HeroSlideProps) {
  const placement = config.placements[stage.placementKey];
  const eyebrow = stage.eyebrowKey ? config.eyebrows[stage.eyebrowKey] : undefined;
  const title = stage.titleKey ? config.titles[stage.titleKey] : undefined;
  const body = stage.bodyKey ? config.bodies[stage.bodyKey] : undefined;
  const card = stage.supportCardKey
    ? config.supportCards[stage.supportCardKey]
    : undefined;

  const showCopy = Boolean(
    stage.eyebrowKey || stage.titleKey || stage.bodyKey || stage.supportCardKey,
  );

  return (
    <div
      className="absolute inset-0"
      style={{ textShadow: "0 8px 30px rgba(0, 0, 0, 0.32)" }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center px-6 md:px-10">
        <div
          className={cx(
            "w-full text-left transition-all duration-700",
            showCopy ? "opacity-100" : "opacity-0",
            placement.copyClassName,
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <KeyedSlot
            slotKey={stage.eyebrowKey}
            value={eyebrow}
            render={renderEyebrow}
            className="mb-4 min-h-[1rem]"
          />

          <KeyedSlot slotKey={stage.titleKey} value={title} render={renderTitle} />

          <KeyedSlot
            slotKey={stage.bodyKey}
            value={body}
            render={renderBody}
            className={cx("mt-5", placement.bodyClassName)}
          />

          <KeyedSlot
            slotKey={stage.supportCardKey}
            value={card}
            render={renderCard}
            className={placement.cardWrapClassName ?? "mt-6"}
          />
        </div>
      </div>
    </div>
  );
}
