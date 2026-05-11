import cx from "../../utils/cx";

interface InsightBlockProps {
  title: string;
  body: string;
  toneClassName: string;
  visible: boolean;
  className?: string;
}

export default function InsightBlock({
  title,
  body,
  toneClassName,
  visible,
  className,
}: InsightBlockProps) {
  return (
    <article
      className={cx(
        `
        w-[65%] text-center sm:w-full sm:text-left
        rounded-[1.25rem] p-4
        sm:rounded-[1.75rem] sm:p-5
        md:rounded-[2.25rem] md:p-10
        2xl:rounded-[2.5rem] 2xl:p-12

        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        transition-all duration-700
        `,
        toneClassName,
        className,
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 sm:translate-y-6 md:translate-y-8 opacity-0",
      )}
    >
      <h3
        className="
          landing-title-md uppercase text-white
        "
      >
        {title}
      </h3>

      <p className="mt-2 mx-auto max-w-[95%] text-body text-white sm:mt-3 sm:mx-0 sm:max-w-[85%] md:mt-4 md:max-w-4xl">
        {body}
      </p>
    </article>
  );
}
