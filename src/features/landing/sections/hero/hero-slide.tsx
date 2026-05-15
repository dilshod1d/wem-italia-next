"use client";

import type { ReactNode } from "react";
import type {
  HeroBodyItem,
  HeroHeaderItem,
  HeroSupportCardItem,
  HeroSupportCard,
} from "./hero.types";
import { BodyCopyText } from "../../shared";
import { HeroSupportCard as HeroSupportCardBlock } from "./hero-support-card";
import cx from "../../utils/cx";

interface HeroSlideProps {
  headerItem?: HeroHeaderItem;
  visibleBodyItems: readonly HeroBodyItem[];
  visibleSupportCardItems: readonly HeroSupportCardItem[];
  isInitialHeader: boolean;
}

function renderEyebrow(eyebrow: string) {
  return <p className="text-eyebrow">{eyebrow}</p>;
}

function renderTitle(titleLines: readonly string[]) {
  return (
    <h1 className="heading text-white">
      {titleLines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h1>
  );
}

function renderBodyItems(items: readonly HeroBodyItem[]) {
  return (
    <BodyCopyText
      lines={items.map((item) => item.text)}
      className="hero-slot-in mx-auto max-w-full text-white sm:mx-0"
    />
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
  animate = true,
}: {
  slotKey?: string;
  className?: string;
  render: (value: T) => ReactNode;
  value?: T;
  animate?: boolean;
}) {
  if (!slotKey || !value) {
    return null;
  }

  return (
    <div key={slotKey} className={cx(animate && "hero-slot-in", className)}>
      {render(value)}
    </div>
  );
}

export function HeroSlide({
  headerItem,
  visibleBodyItems,
  visibleSupportCardItems,
  isInitialHeader,
}: HeroSlideProps) {
  const eyebrow = headerItem?.eyebrow;
  const titleLines = headerItem?.titleLines;
  const visibleSupportCard = visibleSupportCardItems[0];
  const card = visibleSupportCard?.card;

  return (
    <div
      className="landing-copy-panel"
      style={{ textShadow: "0 8px 30px rgba(0, 0, 0, 0.32)" }}
    >
      <div
        className={cx(
          "w-full text-center sm:text-left",
          headerItem?.copyClassName ?? "w-full",
        )}
      >
        <KeyedSlot
          slotKey={eyebrow}
          value={eyebrow}
          render={renderEyebrow}
          className="min-h-[1rem]"
          animate={!isInitialHeader}
        />
        <KeyedSlot
          slotKey={titleLines?.join("|")}
          value={titleLines}
          render={renderTitle}
          animate={!isInitialHeader}
        />
        {visibleBodyItems.length > 0 ? (
          <div className={cx("mt-2 sm:mt-5", headerItem?.bodyClassName)}>
            {renderBodyItems(visibleBodyItems)}
          </div>
        ) : null}
        <KeyedSlot
          slotKey={visibleSupportCard?.key}
          value={card}
          render={renderCard}
          className={cx(
            "landing-hero-support-slot",
            visibleSupportCard?.cardWrapClassName ?? "mt-6",
          )}
        />
      </div>
    </div>
  );
}
