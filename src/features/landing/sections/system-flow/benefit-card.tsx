import { SystemFlowCard } from "./system-flow.types";

import type { IconType } from "react-icons";
import { FiCheckCircle, FiCreditCard, FiUsers } from "react-icons/fi";
import cx from "../../utils/cx";

const benefitCardIcons: Record<SystemFlowCard["icon"], IconType> = {
  steps: FiCheckCircle,
  budget: FiCreditCard,
  support: FiUsers,
};

interface BenefitCardProps {
  icon: SystemFlowCard["icon"];
  title: string;
  body: string;
  toneClassName: string;
  placementClassName: string;
  zIndexClassName: string;
  visible: boolean;
  delayMs: number;
}

export default function BenefitCard({
  icon,
  title,
  body,
  toneClassName,
  placementClassName,
  zIndexClassName,
  visible,
  delayMs,
}: BenefitCardProps) {
  const Icon = benefitCardIcons[icon];

  return (
    <article
      className={cx(
        "group absolute flex min-h-[6.1rem] flex-col overflow-hidden rounded-[1.45rem] px-4 py-4 text-white shadow-[0_18px_44px_rgba(0,0,0,0.12)] transition-[opacity,transform] duration-700",
        "before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-white/35 before:content-['']",
        "after:pointer-events-none after:absolute after:-right-10 after:-top-10 after:size-24 after:rounded-full after:bg-white/10 after:blur-2xl after:content-['']",
        "sm:rounded-[1.55rem] sm:px-5 sm:py-4",
        "md:rounded-[2.2rem] md:px-7 md:py-5",
        " lg:justify-center lg:rounded-[2.75rem] lg:px-8 lg:py-6",
        "xl:rounded-[3.1rem] xl:px-10 xl:py-7",
        "2xl:rounded-[3.45rem] 2xl:px-12 2xl:py-8",
        toneClassName,
        placementClassName,
        zIndexClassName,
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-10 scale-[0.94] opacity-0",
      )}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute right-[1.15rem] top-[1.15rem] grid size-11 place-items-center rounded-full bg-white/16 text-white ring-1 ring-white/28 backdrop-blur-md transition-transform duration-500 group-hover:scale-110 sm:right-[1.55rem] sm:top-[1.55rem] sm:size-12 md:size-14 lg:right-6 lg:top-6 lg:size-12 xl:size-14"
      >
        <Icon className="size-[1.35rem] sm:size-[1.5rem] md:size-[1.75rem] lg:size-[1.45rem] xl:size-[1.65rem]" />
      </span>

      <Icon
        aria-hidden="true"
        className="absolute -bottom-8 -right-8 size-32 text-white/10 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110 sm:size-40 md:size-48 lg:size-36 xl:size-44"
      />

      <div className="relative z-10 max-w-full pr-[4.75rem] sm:pr-0 md:max-w-[82%] lg:max-w-[95%]">
        <h3 className="font-sans text-[1.4rem] font-semibold uppercase leading-[0.98] tracking-tight text-white sm:text-[1.9rem] md:text-[2.45rem] lg:text-[1.9rem] xl:text-[2.12rem] 2xl:text-[2.34rem]">
          {title}
        </h3>

        <p className="mt-2 max-w-[40.6rem] text-body text-white md:mt-3 lg:mt-2 lg:max-w-[92%]">
          {body}
        </p>
      </div>
    </article>
  );
}
