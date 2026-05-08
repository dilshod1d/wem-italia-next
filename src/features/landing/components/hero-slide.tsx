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
import { getRevealAnimationStyle } from "./reveal-motion";

interface HeroSlideProps {
  stage: HeroStage;
  visibleBodyItems: readonly HeroBodyItem[];
  visibleSupportCardItems: readonly HeroSupportCardItem[];
  config: HeroSectionConfig;
  showInitialHeader: boolean;
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
    <div className="body-stack max-w-[92%] text-body text-white">
      {items.map((item, index) => (
        <p
          key={item.key}
          className="hero-slot-in"
          style={getRevealAnimationStyle(index * 80)}
        >
          {item.text}
        </p>
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
  delayMs = 0,
  render,
  value,
}: {
  slotKey?: string;
  className?: string;
  delayMs?: number;
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
      style={getRevealAnimationStyle(delayMs)}
    >
      {render(value)}
    </div>
  );
}

export function HeroSlide({
  stage,
  visibleBodyItems,
  visibleSupportCardItems,
  config,
  showInitialHeader,
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
  const isInitialHeader =
    stage.eyebrowKey === "intro" && stage.titleKey === "intro";
  const shouldShowHeader = !isInitialHeader || showInitialHeader;

  return (
    <div
      className="landing-copy-panel"
      style={{ textShadow: "0 8px 30px rgba(0, 0, 0, 0.32)" }}
    >
      <div className={cx("w-full text-left", placement.copyClassName)}>
        {shouldShowHeader ? (
          <>
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
              delayMs={80}
            />
          </>
        ) : null}
        {visibleBodyItems.length > 0 ? (
          <div className={cx("mt-2 sm:mt-5", placement.bodyClassName)}>
            {renderBodyItems(visibleBodyItems)}
          </div>
        ) : null}
        <KeyedSlot
          slotKey={visibleSupportCard?.key}
          value={card}
          render={renderCard}
          delayMs={120}
          className={cardPlacement.cardWrapClassName ?? "mt-6"}
        />
      </div>
    </div>
  );
}
