import cx from "../../utils/cx";
import { FaTriangleExclamation } from "react-icons/fa6";
import { whoWeSupportSectionConfig } from "./who-we-support-story";

const { copy } = whoWeSupportSectionConfig;

export default function WarningCard({
  mobile = false,
  stackedMobile = false,
}: {
  mobile?: boolean;
  stackedMobile?: boolean;
}) {
  const warningSentence = `${copy.warningTitle.replace(/:$/, "")} ${copy.warningBody}`;

  return (
    <div className="relative rounded-[1.6rem]">
      <div
        className={cx(
          "relative overflow-hidden border border-brand-yellow/45 bg-white",
          stackedMobile
            ? "rounded-[1.6rem] shadow-[0_14px_38px_rgba(15,23,42,0.12)]"
            : mobile
              ? "rounded-[1.9rem] shadow-[0_24px_64px_rgba(15,23,42,0.22)]"
              : "rounded-[1.6rem] shadow-[0_20px_48px_rgba(234,186,43,0.16)]",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,255,255,0.96)_48%,rgba(234,186,43,0.12)_100%)]" />

        <div
          className={cx(
            "landing-warning-card-content",
            "relative",
            stackedMobile
              ? "flex min-h-[176px] flex-col items-center justify-center gap-4 px-5 py-5 text-center"
              : mobile
                ? "flex flex-col items-center gap-5 px-6 py-7 text-center"
                : "flex flex-col items-center gap-5 px-6 py-6 text-center md:flex-row md:items-center md:px-8 md:py-7 md:text-left",
          )}
        >
          <div
            className={cx(
              "landing-warning-card-icon",
              stackedMobile
                ? "flex h-14 w-14 items-center justify-center rounded-[1.1rem] bg-brand-yellow/12 text-brand-yellow ring-1 ring-brand-yellow/30"
                : mobile
                  ? "flex h-28 w-28 items-center justify-center rounded-[1.6rem] bg-brand-yellow/12 text-brand-yellow ring-1 ring-brand-yellow/30"
                  : "flex h-16 w-16 items-center justify-center rounded-[1rem] bg-brand-yellow/10 text-brand-yellow shadow-[0_8px_18px_rgba(234,186,43,0.14)] ring-1 ring-brand-yellow/30",
            )}
          >
            <FaTriangleExclamation
              className={cx(
                stackedMobile
                  ? "h-12 w-12 drop-shadow-[0_8px_18px_rgba(0,0,0,0.1)]"
                  : mobile
                    ? "h-24 w-24 drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
                    : "h-8 w-8",
              )}
            />
          </div>

          <div
            className={cx(
              "text-black",
              stackedMobile
                ? "mx-auto flex max-w-[15rem] flex-col items-center text-center"
                : mobile
                  ? "mx-auto flex max-w-[18rem] flex-col items-center text-center"
                  : "mx-auto flex max-w-[32rem] flex-col items-center text-center md:mx-0 md:max-w-none md:items-start md:text-left",
            )}
          >
            <p
              className={cx(
                "landing-warning-card-title",
                "font-sans font-semibold tracking-tight text-black/92",
                mobile ? "hidden" : "text-[1.5rem] md:text-[2rem]",
              )}
            >
              {copy.warningTitle}
            </p>
            <p
              className={cx(
                "landing-warning-card-copy",
                stackedMobile
                  ? "mt-2 text-body text-black/68"
                  : mobile
                    ? "mt-2 text-body text-black/68"
                    : "mt-1 text-body text-black/68",
              )}
            >
              {mobile ? warningSentence : copy.warningBody}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
