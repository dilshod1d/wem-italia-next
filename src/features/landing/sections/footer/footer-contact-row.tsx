import type {
  FooterContactIcon,
  FooterContactItem,
} from "./footer-section.types";
import { FaEnvelope, FaLocationDot, FaWhatsapp } from "react-icons/fa6";
import type { IconType } from "react-icons";

const contactIcons: Record<FooterContactIcon, IconType> = {
  whatsapp: FaWhatsapp,
  email: FaEnvelope,
  location: FaLocationDot,
};

export default function FooterContactRow({
  item,
}: {
  item: FooterContactItem;
}) {
  const Icon = contactIcons[item.icon];
  const content = (
    <div className="flex items-center gap-3.5 rounded-[1rem] bg-footer-surface px-3.5 py-3.5 ring-1 ring-white/8 sm:gap-4 sm:px-4 sm:py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-white sm:h-10 sm:w-10">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="font-body text-[0.72rem] leading-none text-dark-gray sm:text-[0.76rem]">
          {item.label}
        </p>
        <p className="mt-1 break-words font-body text-[0.88rem] leading-[1.25] text-white sm:text-[0.95rem]">
          {item.value}
        </p>
      </div>
    </div>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        className="block transition-transform hover:scale-[1.01]"
      >
        {content}
      </a>
    );
  }

  return content;
}
