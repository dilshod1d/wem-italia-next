import cx from "../../utils/cx";
import styles from "../below-the-fold.module.css";

export type Step = {
  stage: string;
  title: string;
  body: string;
  toneClassName?: string;
};

export type HowItWorksStepCardProps = {
  step: Step;
  visible: boolean;
  delayMs: number;
  highlighted?: boolean;
  index: number;
  isMobile: boolean;
};

export default function HowItWorksStepCard({
  step,
  visible,
  delayMs,
  highlighted,
  index,
  isMobile,
}: HowItWorksStepCardProps) {
  const X_OFFSET = isMobile ? 0 : 8;
  const WIDTH_STEP = isMobile ? 0 : 4;

  return (
    <article
      className={cx(
        styles.stepCard,
        // mobile
        "relative w-full overflow-hidden rounded-[1.3rem]",
        "px-3 py-3 text-center sm:text-left",

        // overlap control per screen
        "[--step-overlap:60%]",
        "xs:[--step-overlap:50%]",
        "sm:[--step-overlap:45%]",
        "md:[--step-overlap:26%]",
        "lg:[--step-overlap:16%]",
        "xl:[--step-overlap:14%]",
        "2xl:[--step-overlap:12%]",

        // tablet / desktop
        "sm:max-w-[84%] sm:rounded-[2.2rem] sm:px-7 sm:py-5",
        "md:max-w-[740px] md:rounded-[6rem] md:px-9",
        "lg:max-w-none lg:px-[2.4%] lg:py-3",
        "xl:max-w-[880px] xl:px-[2.8%] xl:py-3.5",
        "2xl:max-w-[960px] 2xl:px-[3%] 2xl:py-4",

        "text-white shadow-[0_24px_65px_rgba(0,0,0,0.12)]",
        "transition-[opacity,transform,box-shadow] duration-700 will-change-transform",

        "before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-white/35 before:content-['']",
        "sm:before:inset-x-10 sm:before:bg-white/42",

        "after:pointer-events-none after:absolute after:-right-14 after:-top-14 after:size-32 after:rounded-full after:bg-white/10 after:blur-2xl after:content-['']",
        "sm:after:size-40",

        step.toneClassName,

        highlighted &&
          "shadow-[0_22px_70px_rgba(0,0,0,0.16),0_0_0_1px_rgba(255,255,255,0.08)]",

        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      style={{
        width: `${100 - index * WIDTH_STEP}%`,
        transform: visible
          ? `translateX(${index * X_OFFSET}%)
             translateY(calc(${index} * -1 * var(--step-overlap)))`
          : `translateX(${index * X_OFFSET + (isMobile ? 0 : 5)}%)
             translateY(calc(${index} * -1 * var(--step-overlap) + 8%))
             scale(${isMobile ? 0.985 : 0.96})`,

        zIndex: index + 1,
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="min-w-0">
        <h3
          className={cx(
            styles.stepCardTitle,
            "font-sans text-[1.12rem] font-bold uppercase leading-[0.98] tracking-[-0.015em] text-white sm:text-[2rem] md:text-[2.48rem] lg:text-[2.18rem] xl:text-[2.46rem] 2xl:text-[2.82rem]",
          )}
        >
          {step.title}
        </h3>

        <p className={cx(styles.stepCardCopy, "min-w-full text-body text-white")}>
          {step.body}
        </p>
      </div>
    </article>
  );
}
