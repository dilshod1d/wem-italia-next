function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface BrandMarkProps {
  className?: string;
  theme?: "light" | "dark";
}

export function BrandMark({ className, theme = "dark" }: BrandMarkProps) {
  const isLight = theme === "light";

  return (
    <div
      className={cx(
        "flex items-center gap-3",
        isLight ? "text-black" : "text-white",
        className,
      )}
    >
      <svg
        viewBox="0 0 90 60"
        aria-hidden="true"
        className={cx(
          "h-11 w-16 shrink-0 sm:h-14 sm:w-20",
          isLight
            ? "drop-shadow-[0_0_8px_rgba(0,0,0,0.08)]"
            : "drop-shadow-[0_0_12px_rgba(0,0,0,0.45)]",
        )}
      >
        <g
          fill="none"
          stroke="#0A0A0A"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
          opacity={isLight ? 1 : 0.8}
        >
          <path d="M7 11 24 48 41 11" />
          <path d="M21 11 38 48 55 11" />
          <path d="M35 11 52 48 69 11" />
          <path d="M41 11 58 48 75 11" />
        </g>
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        >
          <path d="M7 11 24 48 41 11" stroke="#6CCB3C" />
          <path d="M21 11 38 48 55 11" stroke="#FFFFFF" />
          <path d="M35 11 52 48 69 11" stroke="#FF3B30" />
          <path d="M41 11 58 48 75 11" stroke="#FFFFFF" />
        </g>
      </svg>

      <div className="flex items-end gap-2 leading-none">
        <span className="font-sans text-3xl font-semibold tracking-tight sm:text-4xl">
          WEM
        </span>
        <span
          className={cx(
            "pb-0.5 font-body text-2xl font-light sm:text-[2rem]",
            isLight ? "text-black/80" : "text-white/90",
          )}
        >
          Italia
        </span>
      </div>
    </div>
  );
}
