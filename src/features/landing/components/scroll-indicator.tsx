interface ScrollIndicatorProps {
  hidden: boolean;
  label?: string;
  labelClassName?: string;
  mouseClassName?: string;
  wheelClassName?: string;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ScrollIndicator({
  hidden,
  label = "Scroll to explore",
  labelClassName,
  mouseClassName,
  wheelClassName,
}: ScrollIndicatorProps) {
  return (
    <div
      className={cx(
        "absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 transition-opacity duration-500",
        hidden ? "pointer-events-none opacity-0" : "opacity-60",
      )}
    >
      <div
        className={cx(
          "relative h-10 w-6 rounded-full border-2 border-white/30",
          mouseClassName,
        )}
      >
        <div
          className={cx(
            "absolute top-2 left-1/2 h-2 w-1 -translate-x-1/2 animate-bounce rounded-full bg-white",
            wheelClassName,
          )}
        />
      </div>
      <span
        className={cx(
          "text-[10px] font-medium uppercase tracking-[0.3em] text-white/50",
          labelClassName,
        )}
      >
        {label}
      </span>
    </div>
  );
}
