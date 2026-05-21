import type {
  WhoWeSupportCard,
  WhoWeSupportCardIcon,
} from "./who-we-support.types";
import { OfficeWorkerIcon, RocketIcon, StoreIcon } from "../../shared/icons";
import type { IconType } from "react-icons";
import cx from "../../utils/cx";

function getAudienceCardDeckClass(index: number) {
  if (index === 0) return "-rotate-[1.2deg]";
  if (index === 1) return "rotate-[0.9deg] translate-x-1";

  return "-rotate-[0.35deg] -translate-x-0.5";
}

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

interface AudienceCardProps {
  card: WhoWeSupportCard;
  index: number;
  compact?: boolean;
  stackedMobile?: boolean;
}

export default function AudienceCard({
  card,
  index,
  compact = false,
  stackedMobile = false,
}: AudienceCardProps) {
  const Icon = whoWeSupportIcons[card.icon];
  const accent = audienceCardAccents[card.stage];

  return (
    <article
      data-audience-card
      className={cx(
        "landing-audience-card",
        "group relative isolate overflow-hidden rounded-[1.6rem] border border-slate-200/70 bg-white text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 transition-[border-color,box-shadow,transform] duration-300 will-change-transform",
        "motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.012] motion-safe:hover:border-slate-300/80 motion-safe:hover:shadow-[0_22px_54px_rgba(15,23,42,0.14)]",
        stackedMobile
          ? "min-h-[168px] px-4 py-4.5"
          : compact
            ? "min-h-[232px] px-4.5 py-4.5 sm:min-h-[228px] sm:px-5 sm:py-5 md:min-h-[250px]"
            : "min-h-[280px] px-5 py-6 md:min-h-[340px]",
        stackedMobile && getAudienceCardDeckClass(index),
      )}
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
          "landing-audience-card-icon",
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

      <h3
        className={cx(
          "landing-audience-card-title",
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
          "landing-audience-card-copy",
          "text-body text-black/70",
          stackedMobile ? "mt-2" : compact ? "mt-2.5 sm:mt-3" : "mt-4",
        )}
      >
        {card.body}
      </p>
    </article>
  );
}
