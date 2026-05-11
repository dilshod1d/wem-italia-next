import { FaMinus, FaPlus } from "react-icons/fa6";
import type { FooterFaqItem } from "./footer-section.types";
import cx from "../../utils/cx";

interface FooterFaqRowProps {
  item: FooterFaqItem;
  open: boolean;
  onToggle: () => void;
}

export default function FooterFaqRow({
  item,
  open,
  onToggle,
}: FooterFaqRowProps) {
  return (
    <div className="border-b border-white/14 py-4 sm:py-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left sm:gap-6"
      >
        <span className="font-body text-[0.95rem] font-medium leading-[1.3] text-white sm:text-[1rem] md:text-[1.2rem]">
          {item.question}
        </span>

        <span className="flex items-center gap-3">
          <FaPlus
            className={cx(
              "h-4 w-4 text-faq-plus transition-opacity",
              open ? "opacity-35" : "opacity-100",
            )}
          />
          <FaMinus
            className={cx(
              "h-4 w-4 text-white transition-opacity",
              open ? "opacity-100" : "opacity-35",
            )}
          />
        </span>
      </button>

      <div
        className={cx(
          "grid transition-[grid-template-rows,opacity,margin-top] duration-300",
          open
            ? "mt-4 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="max-w-5xl text-body text-dark-gray">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}
