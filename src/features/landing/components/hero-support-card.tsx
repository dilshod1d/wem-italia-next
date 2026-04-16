import GiovanniIcon from "./icons/GiovanniIcon";
import WemAI from "./icons/WemAI";
import WemAgencyIcon from "./icons/WemAgencyIcon";
import type {
  HeroSupportCard as HeroSupportCardData,
  HeroSupportCardTone,
} from "../types/hero-section";

interface HeroSupportCardProps {
  card: HeroSupportCardData;
  isActive: boolean;
}

function getToneClasses(tone: HeroSupportCardTone) {
  switch (tone) {
    case "orange":
      return "bg-gradient-to-r from-brand-red-alt via-brand-red-alt to-brand-red";
    case "purple":
      return "bg-gradient-to-r from-brand-purple via-brand-purple to-portfolio-blue";
    case "blue":
    default:
      return "bg-gradient-to-r from-brand-blue via-accent-gradient-start to-brand-cyan";
  }
}

function getIcon(card: HeroSupportCardData) {
  switch (card.icon) {
    case "wem-ai":
      return <WemAI className="h-auto w-40" />;
    case "wem-agency":
      return <WemAgencyIcon className="h-auto w-40" />;
    case "giovanni":
    default:
      return <GiovanniIcon className="h-auto w-40" />;
  }
}

export function HeroSupportCard({ card, isActive }: HeroSupportCardProps) {
  return (
    <div
      className={[
        "max-w-[100%] rounded-[1.75rem] px-5 py-4 text-white shadow-[0_30px_60px_rgba(0,0,0,0.35)]",
        "transition-all duration-700",
        "translate-y-6 opacity-0",
        getToneClasses(card.tone),
        isActive ? "translate-y-0 opacity-100" : "",
      ].join(" ")}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-sans text-[2.4rem] font-semibold uppercase">
            {card.title}
          </p>
          <p className="mt-2 max-w-[15rem] text-sm leading-5 text-white/90">
            {card.description}
          </p>
        </div>
        <div className="shrink-0">{getIcon(card)}</div>
      </div>
    </div>
  );
}
