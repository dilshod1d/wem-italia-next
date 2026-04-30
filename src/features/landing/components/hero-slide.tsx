"use client";

import type { ReactNode } from "react";
import type {
  HeroBodyItem,
  HeroEyebrow,
  HeroSectionConfig,
  HeroStage,
  HeroSupportCardItem,
  HeroSupportCard,
  HeroTitle,
} from "../types/hero-section";
import { HeroSupportCard as HeroSupportCardBlock } from "./hero-support-card";

interface HeroSlideProps {
  stage: HeroStage;
  visibleBodyItems: readonly HeroBodyItem[];
  visibleSupportCardItems: readonly HeroSupportCardItem[];
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
    <h1 className="heading text-white">
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
    <div className="hero-slot-in body-stack text-body text-white">
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

export function HeroSlide({
  stage,
  visibleBodyItems,
  visibleSupportCardItems,
  config,
}: HeroSlideProps) {
  const placement = config.placements[stage.placementKey];
  const eyebrow = stage.eyebrowKey
    ? config.eyebrows[stage.eyebrowKey]
    : undefined;
  const title = stage.titleKey ? config.titles[stage.titleKey] : undefined;
  const visibleSupportCard = visibleSupportCardItems[0];
  const card = visibleSupportCard
    ? config.supportCards[visibleSupportCard.supportCardKey]
    : undefined;
  const cardPlacement = visibleSupportCard?.placementKey
    ? config.placements[visibleSupportCard.placementKey]
    : placement;

  const showCopy = Boolean(
    stage.eyebrowKey ||
    stage.titleKey ||
    visibleBodyItems.length > 0 ||
    visibleSupportCard,
  );

  return (
    <div
      className="landing-copy-panel"
      style={{ textShadow: "0 8px 30px rgba(0, 0, 0, 0.32)" }}
    >
      <div className={cx("w-full text-left", placement.copyClassName)}>
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
          slotKey={visibleSupportCard?.key}
          value={card}
          render={renderCard}
          className={cardPlacement.cardWrapClassName ?? "mt-6"}
        />
      </div>
    </div>
  );
}
