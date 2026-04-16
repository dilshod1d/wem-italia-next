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
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
          <BrandMark />
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setIsOpen(true)}
            className="cursor-pointer"
          >
            <MenuIcon className="w-16 h-16 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95" />
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
              <BrandMark className="scale-[0.82] origin-left sm:scale-100" />

              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setIsOpen(false)}
                className="flex h-18 w-18 items-center justify-center rounded-full text-[#FF3B30] transition-colors hover:bg-[#FF3B30]/10 cursor-pointer"
              >
                <IoMdClose className="h-14 w-14" />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-2 text-center sm:px-10">
              <nav aria-label="Primary" className="w-full">
                <ul className="space-y-2.5 sm:space-y-3">
                  {footerSectionConfig.navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group inline-flex items-center justify-center gap-3 rounded-full px-4 py-2 font-body text-[2.2rem] text-white/82 transition-colors hover:text-white sm:text-[3rem] font-semibold tracking-tight"
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
