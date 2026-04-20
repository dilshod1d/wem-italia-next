"use client";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { footerSectionConfig } from "../data/footer-section";
import { BrandMark } from "./brand-mark";
import { IoMdClose } from "react-icons/io";
import MenuIcon from "./icons/MenuIcon";

const socialIcons: Record<
  (typeof footerSectionConfig.socials)[number]["id"],
  IconType
> = {
  facebook: FaFacebookF,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface LandingNavbarProps {
  logoTheme: "light" | "dark";
}

export function LandingNavbar({ logoTheme }: LandingNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="landing-frame flex items-center justify-between">
          <BrandMark theme={logoTheme} />
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-black/6 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/70 sm:h-14 sm:w-14"
          >
            <MenuIcon className="h-10 w-10 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 sm:h-12 sm:w-12 lg:h-16 lg:w-16" />
          </button>
        </div>
      </header>

      <div
        className={cx(
          "fixed inset-0 z-50 bg-black transition-[opacity,visibility] duration-300",
          isOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={cx(
            "flex h-full w-full items-stretch justify-center transition-[opacity,transform] duration-300",
            isOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-4 scale-[0.985] opacity-0",
          )}
        >
          <div
            className="relative flex h-full w-full flex-col overflow-hidden bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="landing-frame flex items-center justify-between">
              <BrandMark theme="light" />

              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setIsOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full text-brand-red transition-colors hover:bg-brand-red/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50 sm:h-14 sm:w-14 lg:h-18 lg:w-18 cursor-pointer"
              >
                <IoMdClose className="h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14" />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-4 text-center sm:px-10 sm:pb-12">
              <nav aria-label="Primary" className="w-full">
                <ul className="space-y-1.5 sm:space-y-2.5 lg:space-y-3">
                  {footerSectionConfig.navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 py-2 font-body text-[1.45rem] font-semibold tracking-tight text-white/82 transition-colors hover:text-white sm:min-h-14 sm:gap-3 sm:text-[2.15rem] lg:text-[3rem]"
                      >
                        <span className="h-px w-0 bg-brand-red transition-all duration-300 group-hover:w-5 sm:group-hover:w-7" />
                        <span>{link.label}</span>
                        <span className="h-px w-0 bg-brand-red transition-all duration-300 group-hover:w-5 sm:group-hover:w-7" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10 sm:gap-3.5 lg:mt-12">
                {footerSectionConfig.socials.map((social) => {
                  const Icon = socialIcons[social.id];

                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/28 text-white/82 transition-colors hover:border-white hover:text-white sm:h-10 sm:w-10"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
