"use client";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaCircleXmark,
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import { footerSectionConfig } from "../data/footer-section";
import { BrandMark } from "./brand-mark";

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

export function LandingNavbar() {
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
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
          <div className="pointer-events-auto rounded-[1.5rem] bg-black/72 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.32)] ring-1 ring-white/12 backdrop-blur-md">
            <BrandMark theme="dark" />
          </div>

          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/90 shadow-[0_18px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-transform hover:scale-105"
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-3">
              <span className="h-1 w-10 rounded-full bg-[#6CCB3C]" />
              <span className="h-1 w-10 rounded-full bg-white" />
              <span className="h-1 w-10 rounded-full bg-[#FF3B30]" />
            </span>
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
            <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
              <BrandMark
                theme="dark"
                className="scale-[0.82] origin-left sm:scale-100"
              />

              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setIsOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#FF3B30]/60 text-[#FF3B30] transition-colors hover:bg-[#FF3B30]/10"
              >
                <FaCircleXmark className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-2 text-center sm:px-10">
              <nav aria-label="Primary" className="w-full max-w-[18rem]">
                <ul className="space-y-2.5 sm:space-y-3">
                  {footerSectionConfig.navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group inline-flex items-center justify-center gap-3 rounded-full px-4 py-2 font-body text-[0.95rem] font-medium text-white/82 transition-colors hover:text-white sm:text-[1rem]"
                      >
                        <span className="h-px w-0 bg-[#FF3B30] transition-all duration-300 group-hover:w-7" />
                        <span>{link.label}</span>
                        <span className="h-px w-0 bg-[#FF3B30] transition-all duration-300 group-hover:w-7" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-10 flex items-center justify-center gap-3 sm:mt-12">
                {footerSectionConfig.socials.map((social) => {
                  const Icon = socialIcons[social.id];

                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/28 text-white/82 transition-colors hover:border-white hover:text-white"
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
