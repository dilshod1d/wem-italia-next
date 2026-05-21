import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaBriefcase,
  FaCoins,
  FaGaugeHigh,
  FaPeopleGroup,
} from "react-icons/fa6";
import type { WhyWemWorksProofPointIcon } from "./why-wem-works.types";
import cx from "../../utils/cx";

interface ProofPointCardProps {
  titleLines: readonly string[];
  color: string;
  iconName: WhyWemWorksProofPointIcon;
  visible: boolean;
  delayMs: number;
}

const proofPointIcons: Record<WhyWemWorksProofPointIcon, IconType> = {
  speed: FaGaugeHigh,
  costs: FaCoins,
  decisions: FaPeopleGroup,
  projects: FaBriefcase,
};

export default function ProofPointCard({
  titleLines,
  color,
  iconName,
  visible,
  delayMs,
}: ProofPointCardProps) {
  const [isEntered, setIsEntered] = useState(false);
  const Icon = proofPointIcons[iconName];

  useEffect(() => {
    if (!visible) return;

    const frameId = requestAnimationFrame(() => {
      setIsEntered(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, [visible]);

  return (
    <article
      className={cx(
        "landing-proof-card",
        "flex min-h-0 flex-col items-center justify-center rounded-[1.65rem] p-5 text-center text-white shadow-[0_24px_78px_rgba(0,0,0,0.28)] transition-[opacity,transform] duration-700 will-change-transform sm:rounded-[1.9rem] md:rounded-[2rem] md:p-6 2xl:rounded-[2.35rem] 2xl:p-8",
        color,
        isEntered
          ? "translate-y-0 scale-100 rotate-0 opacity-100"
          : "pointer-events-none translate-y-14 scale-[0.78] opacity-0",
      )}
      style={{
        transitionDelay: isEntered ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1.2, 0.3, 1)",
      }}
    >
      <div className="landing-proof-card-icon mb-4 h-12 w-12 text-white sm:h-14 sm:w-14 md:h-[4.5rem] md:w-[4.5rem] 2xl:mb-5 2xl:h-[5.25rem] 2xl:w-[5.25rem]">
        <Icon className="h-full w-full" />
      </div>
      <h3 className="landing-proof-card-title landing-title-md uppercase text-white md:text-[2.05rem] 2xl:text-[2.45rem]">
        {titleLines.map((line) => (
          <span key={line} className="block">
            {line} 
          </span>
        ))}
      </h3>
    </article>
  );
}
