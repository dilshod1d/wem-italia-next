import GiovanniIcon from "./icons/GiovanniIcon";
import WemAgencyIcon from "./icons/WemAgencyIcon";
import type {
  HeroSupportCard as HeroSupportCardData,
  HeroSupportCardTone,
} from "../types/hero-section";
import WemAIIcon from "./icons/WemAIIcon";

interface HeroSupportCardProps {
  card: HeroSupportCardData;
  isActive: boolean;
}

function getToneClasses(tone: HeroSupportCardTone) {
  switch (tone) {
    case "orange":
      return "bg-gradient-to-l from-wemai-red via-brand-red-alt to-brand-red";
    case "purple":
      return "bg-gradient-to-l from-brand-purple via-brand-purple to-portfolio-blue";
    case "blue":
    default:
      return "bg-gradient-to-r from-brand-blue via-accent-gradient-start to-brand-cyan";
  }
}

function getIcon(card: HeroSupportCardData) {
  switch (card.icon) {
    case "wem-ai":
      return <WemAIIcon className="h-auto w-28 sm:w-34 md:w-40 2xl:w-48" />;
    case "wem-agency":
      return <WemAgencyIcon className="h-auto w-28 sm:w-34 md:w-40 2xl:w-48" />;
    case "giovanni":
    default:
      return <GiovanniIcon className="h-auto w-28 sm:w-34 md:w-40 2xl:w-48" />;
  }
}

export function HeroSupportCard({ card, isActive }: HeroSupportCardProps) {
  return (
    <div
      className={[
        "w-1/2 self-start",
        "sm:w-auto sm:self-auto",
        "rounded-[1.5rem] px-4 py-4 text-white shadow-[0_30px_60px_rgba(0,0,0,0.35)] sm:rounded-[1.75rem] sm:px-5 2xl:rounded-[2rem] 2xl:px-7 2xl:py-6",
        "transition-all duration-500",
        getToneClasses(card.tone),
        isActive
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-5 scale-[0.965] opacity-0",
      ].join(" ")}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-left">
        <div className="min-w-0">
          <p className="font-sans text-[1.7rem] font-semibold uppercase sm:text-[2rem] md:text-[2.4rem] 2xl:text-[2.9rem]">
            {card.title}
          </p>
          <p className="mt-1.5 font-body text-[0.95rem] leading-[1.35] text-white sm:mt-2 sm:text-[1.15rem] md:text-2xl 2xl:text-[1.6rem]">
            {card.description}
          </p>
        </div>
        <div className="shrink-0 sm:self-auto">{getIcon(card)}</div>
      </div>
    </div>
  );
}
