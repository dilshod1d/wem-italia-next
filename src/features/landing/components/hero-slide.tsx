"use client";

import type { ReactNode } from "react";
import type {
  HeroBodyItem,
  HeroEyebrow,
  HeroSectionConfig,
  HeroStage,
  HeroSupportCard,
  HeroTitle,
} from "../types/hero-section";
import { HeroSupportCard as HeroSupportCardBlock } from "./hero-support-card";

interface HeroSlideProps {
  stage: HeroStage;
  visibleBodyItems: readonly HeroBodyItem[];
  config: HeroSectionConfig;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function renderEyebrow(eyebrow: HeroEyebrow) {
  return <p className="text-eyebrow">{eyebrow.text}</p>;
}

function renderTitle(title: HeroTitle) {
  return (
    <h1 className="heading-hero text-white">
      {title.lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h1>
  );
}

function renderBodyItems(items: readonly HeroBodyItem[]) {
  return (
    <div className="hero-slot-in body-stack text-body text-white/85">
      {items.map((item) => (
        <p key={item.key}>{item.text}</p>
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
    <div key={slotKey} className={cx("hero-slot-in", className)}>
      {render(value)}
    </div>
  );
}

export function HeroSlide({ stage, visibleBodyItems, config }: HeroSlideProps) {
  const placement = config.placements[stage.placementKey];
  const eyebrow = stage.eyebrowKey
    ? config.eyebrows[stage.eyebrowKey]
    : undefined;
  const title = stage.titleKey ? config.titles[stage.titleKey] : undefined;
  const card = stage.supportCardKey
    ? config.supportCards[stage.supportCardKey]
    : undefined;

  const showCopy = Boolean(
    stage.eyebrowKey ||
    stage.titleKey ||
    visibleBodyItems.length > 0 ||
    stage.supportCardKey,
  );

  return (
    <div
      className="landing-copy-panel"
      style={{ textShadow: "0 8px 30px rgba(0, 0, 0, 0.32)" }}
    >
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
          className="min-h-[1rem]"
        />
        <KeyedSlot
          slotKey={stage.titleKey}
          value={title}
          render={renderTitle}
        />
        {visibleBodyItems.length > 0 ? (
          <div className={cx("mt-5", placement.bodyClassName)}>
            {renderBodyItems(visibleBodyItems)}
          </div>
        ) : null}
        <KeyedSlot
          slotKey={stage.supportCardKey}
          value={card}
          render={renderCard}
          className={placement.cardWrapClassName ?? "mt-6"}
        />
      </div>
    </div>
  );
}
