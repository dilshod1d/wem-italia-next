import type { HeroSegment } from "../types/hero-section";

interface HeroSlideProps {
  segment: HeroSegment;
  isActive: boolean;
}

export function HeroSlide({ segment, isActive }: HeroSlideProps) {
  return (
    <div
      className={[
        "absolute text-center transition-all duration-1000",
        "pointer-events-none translate-y-8 opacity-0",
        "w-full max-w-6xl px-6",
        segment.kind === "cta" ? "flex flex-col items-center gap-8" : "",
        isActive ? "pointer-events-auto translate-y-0 opacity-100" : "",
      ].join(" ")}
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        textShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
      }}
    >
      {segment.kind === "cta" ? (
        <>
          <h1 className="font-sans text-4xl font-medium tracking-[-0.05em] md:text-6xl lg:text-7xl">
            {segment.text}
          </h1>
          <button
            type="button"
            className="group relative overflow-hidden rounded-full bg-white px-10 py-4 font-semibold text-black transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">
              {segment.ctaLabel ?? "Get Started"}
            </span>
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-y-full bg-neutral-200 transition-transform duration-300 group-hover:translate-y-0"
            />
          </button>
        </>
      ) : (
        <h1 className="font-sans text-5xl font-light tracking-tight md:text-7xl lg:text-8xl">
          {segment.text}
        </h1>
      )}
    </div>
  );
}
