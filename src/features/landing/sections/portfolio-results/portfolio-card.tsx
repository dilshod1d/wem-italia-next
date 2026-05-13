"use client";

import Image from "next/image";

import type { PortfolioResultsItem } from "./portfolio-results.types";
import cx from "../../utils/cx";

interface PortfolioCardProps {
  item: PortfolioResultsItem;
  visible: boolean;
  active: boolean;
  delayMs: number;
}



function getPortfolioCardSizeClass() {
  return "aspect-[9/16] h-[calc(100%-5rem)]";
}

function getPortfolioCardImageHeightClass() {
  return "h-full";
}

function getPortfolioCardFocusStateClass(active: boolean) {
  return active
    ? "scale-[1.03] opacity-100 blur-0"
    : "scale-100 opacity-100 blur-0";
}

export function PortfolioCard({
  item,
  visible,
  active,
  delayMs,
}: PortfolioCardProps) {
  const sizeClassName = getPortfolioCardSizeClass();
  const imageHeightClassName = getPortfolioCardImageHeightClass();
  const focusStateClassName = getPortfolioCardFocusStateClass(active);

  return (
    <article
      className={cx(
        "group relative shrink-0 cursor-pointer transition-[opacity,transform,filter,height,width] duration-700",
        "motion-safe:hover:scale-[1.03]",
        active ? "z-40" : "z-30",
        visible
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-20 opacity-0",
        sizeClassName,
        focusStateClassName,
      )}
      aria-hidden={!visible}
    >
      <div
        className={cx(
          "relative h-full w-full rounded-xl rounded-bl-none p-2.5 text-white shadow-[0_14px_38px_rgba(0,0,0,0.14)] transition-[filter,transform,box-shadow] duration-500 md:rounded-2xl md:rounded-bl-none md:p-4 2xl:p-5 motion-safe:hover:-translate-y-1.5",
          active
            ? "shadow-[0_30px_72px_rgba(0,0,0,0.24)] ring-2 ring-white/65 motion-safe:hover:shadow-[0_36px_82px_rgba(0,0,0,0.28)]"
            : "motion-safe:hover:shadow-[0_24px_58px_rgba(0,0,0,0.2)]",
          item.wrapperClassName,
          item.shellClassName,
        )}
        style={{
          transitionDelay: visible ? `${delayMs}ms` : "0ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="z-31 absolute left-0 top-0 flex h-10 w-[82%] items-center justify-center rounded-t-2xl rounded-br-2xl bg-inherit md:h-12 2xl:h-14">
          <h3 className="px-3 text-center font-sans text-[0.72rem] font-semibold tracking-tight sm:text-[0.78rem] md:text-[1rem] 2xl:text-[1.2rem]">
            {item.title}
          </h3>
        </div>

        <div
          className={cx(
            "overflow-hidden rounded-[1.45rem] bg-transparent md:rounded-[1.7rem]",
            imageHeightClassName,
          )}
        >
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            width={300}
            height={400}
            sizes="(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 20vw"
            className={cx(
              "h-full w-full object-cover object-top transition-[transform,filter] duration-700",
              active
                ? "brightness-[1.04] contrast-[1.03] motion-safe:group-hover:scale-[1.045] motion-safe:group-hover:-translate-y-1"
                : "motion-safe:group-hover:scale-[1.035] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:brightness-[1.03]",
            )}
          />
        </div>

        <div className="absolute -bottom-8 left-0 flex h-[2.5rem] w-[82%] items-center justify-center rounded-b-2xl bg-inherit md:-bottom-8 md:h-[3rem] 2xl:-bottom-16 2xl:h-[4rem]">
          <p className="px-3 text-center font-sans text-[0.72rem] font-semibold tracking-tight sm:text-[0.78rem] md:text-[1rem] 2xl:text-[1.2rem]">
            {item.footerLabel}
          </p>
        </div>
      </div>
    </article>
  );
}
