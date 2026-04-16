import type { HeroSegment } from "../types/hero-section";
import { HeroSupportCard } from "./hero-support-card";

interface HeroSlideProps {
  segment: HeroSegment;
  isActive: boolean;
}

export function HeroSlide({ segment, isActive }: HeroSlideProps) {
  const titleLines = segment.titleLines ?? [segment.text];
  const isRaised = segment.layout === "raised";

  return (
    <div
      className={[
        "absolute inset-0 transition-all duration-700",
        "pointer-events-none opacity-0",
        isActive ? "pointer-events-auto opacity-100" : "",
      ].join(" ")}
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        textShadow: "0 8px 30px rgba(0, 0, 0, 0.32)",
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center px-6 md:px-10">
        <div
          className={[
            "w-full max-w-[42rem] bg-red-500 text-left transition-all duration-700",
            isRaised
              ? "-translate-y-16 md:-translate-y-20"
              : "md:-translate-y-6",
          ].join(" ")}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {!segment.isTransition && (
            <>
              {segment.eyebrow ? (
                <p className="mb-4 font-sans text-[0.65rem] uppercase tracking-[0.28em] text-white/60 md:text-[0.72rem]">
                  {segment.eyebrow}
                </p>
              ) : null}

              <h1 className="font-sans text-[clamp(2rem,4vw,3.5rem)]  font-semibold leading-[0.92] tracking-[-0.05em] text-white">
                {titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              {segment.paragraphs?.length ? (
                <div className="mt-5 space-y-1.5 text-sm leading-6 text-white/84  md:text-base">
                  {segment.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="transition-all duration-500"
                      style={{
                        transitionTimingFunction:
                          "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : null}

              {segment.supportCard ? (
                <div className="mt-6">
                  <HeroSupportCard
                    card={segment.supportCard}
                    isActive={isActive}
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
