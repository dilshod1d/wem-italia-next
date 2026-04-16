"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FaEnvelope,
  FaFacebookF,
  FaLinkedinIn,
  FaLocationDot,
  FaMinus,
  FaPlus,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";

import { footerSectionConfig } from "../../data/footer-section";
import type {
  FooterContactIcon,
  FooterContactItem,
  FooterFaqItem,
  FooterSocialPlatform,
} from "../../types/footer-section";
import WemAI from "../icons/WemAI";
import GiovanniIcon from "../icons/GiovanniIcon";
import WemAgencyIcon from "../icons/WemAgencyIcon";

const socialIcons: Record<FooterSocialPlatform, IconType> = {
  facebook: FaFacebookF,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
};

const contactIcons: Record<FooterContactIcon, IconType> = {
  whatsapp: FaWhatsapp,
  email: FaEnvelope,
  location: FaLocationDot,
};

const {
  ctaTitle,
  ctaBody,
  ctaButtons,
  faqItems,
  socials,
  contactItems,
  navLinks,
} = footerSectionConfig;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface FooterFaqRowProps {
  item: FooterFaqItem;
  open: boolean;
  onToggle: () => void;
}

function FooterFaqRow({ item, open, onToggle }: FooterFaqRowProps) {
  return (
    <div className="border-b border-white/14 py-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 text-left"
      >
        <span className="font-body text-[1rem] font-medium leading-[1.25] text-white/94 md:text-[1.2rem]">
          {item.question}
        </span>

        <span className="flex items-center gap-3">
          <FaPlus
            className={cx(
              "h-4 w-4 text-cyan-400 transition-opacity",
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
          <p className="max-w-5xl font-body text-[0.96rem] leading-[1.5] text-white/68 md:text-[1.05rem]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function FooterContactRow({ item }: { item: FooterContactItem }) {
  const Icon = contactIcons[item.icon];
  const content = (
    <div className="flex items-center gap-4 rounded-[1rem] bg-white/5 px-4 py-4 ring-1 ring-white/8">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/8 text-white/90">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="font-body text-[0.76rem] leading-none text-white/45">
          {item.label}
        </p>
        <p className="mt-1 font-body text-[0.95rem] leading-[1.2] text-white/92">
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

export function FooterSection() {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  return (
    <footer
      id="footer"
      data-nav-theme="dark"
      className="relative z-30 bg-[#272B67] px-6 pt-12 pb-10 text-white sm:px-10 lg:px-16 overflow-visible"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="absolute -top-40 left-0 right-0  mx-auto max-w-[1400px] rounded-[1.1rem] bg-gradient-to-r from-[#2F80ED] to-[#52E5FF] px-8 py-8 text-center shadow-[0_26px_70px_rgba(26,129,255,0.26)] ring-1 ring-white/18 md:px-12">
          <h2 className="mx-auto max-w-4xl font-sans text-[2rem] font-semibold leading-[1.05] tracking-tight text-white md:text-[3rem]">
            {ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-4xl font-body text-[1rem] leading-[1.55] text-white/88 md:text-[1.18rem]">
            {ctaBody}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {ctaButtons.map((button) => (
              <a
                key={button.label}
                href={button.href}
                className={cx(
                  "min-w-[12rem] rounded-[0.45rem] px-6 py-3 text-center font-body text-[0.96rem] font-medium transition-transform hover:scale-[1.02]",
                  button.tone === "dark"
                    ? "bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.26)]"
                    : "bg-white text-[#1F2257] shadow-[0_10px_30px_rgba(255,255,255,0.18)]",
                )}
              >
                {button.label}
              </a>
            ))}
          </div>
        </div>

        <div className="w-full">
          <div className="text-center">
            <h3 className="font-sans text-[2.3rem] font-semibold tracking-tight text-white md:text-[4rem]">
              FAQ
            </h3>
          </div>

          <div className="mt-8">
            {faqItems.map((item) => (
              <FooterFaqRow
                key={item.id}
                item={item}
                open={openFaqId === item.id}
                onToggle={() =>
                  setOpenFaqId((current) =>
                    current === item.id ? null : item.id,
                  )
                }
              />
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.45fr)] lg:items-start">
            <div>
              <div className="leading-none">
                <span className="block font-sans text-[3.4rem] font-semibold tracking-tight text-white md:text-[5rem]">
                  LET&apos;S
                </span>
                <span className="block font-sans text-[3.4rem] font-semibold tracking-tight text-[#46C4FF] md:text-[5rem]">
                  TALK
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                {socials.map((social) => {
                  const Icon = socialIcons[social.id];

                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/18 text-white/88 transition-colors hover:border-cyan-300 hover:text-cyan-300"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="rounded-[0.5rem] border border-cyan-400/55 bg-[#23265B] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
            >
              <div className="grid gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  className="h-12 rounded-[0.22rem] border border-white/18 bg-[#2B2E65] px-4 font-body text-[0.95rem] text-white placeholder:text-white/35 outline-none transition-colors focus:border-cyan-300"
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    type="email"
                    placeholder="Email"
                    className="h-12 rounded-[0.22rem] border border-white/18 bg-[#2B2E65] px-4 font-body text-[0.95rem] text-white placeholder:text-white/35 outline-none transition-colors focus:border-cyan-300"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="h-12 rounded-[0.22rem] border border-white/18 bg-[#2B2E65] px-4 font-body text-[0.95rem] text-white placeholder:text-white/35 outline-none transition-colors focus:border-cyan-300"
                  />
                </div>
                <textarea
                  placeholder="Write your message"
                  rows={5}
                  className="rounded-[0.22rem] border border-white/18 bg-[#2B2E65] px-4 py-3 font-body text-[0.95rem] text-white placeholder:text-white/35 outline-none transition-colors focus:border-cyan-300"
                />
                <button
                  type="submit"
                  className="rounded-[0.22rem] bg-gradient-to-r from-[#2F80ED] to-[#52E5FF] px-6 py-3 font-sans text-[0.92rem] font-semibold tracking-[0.35em] text-white transition-transform hover:scale-[1.01]"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>

          <div className="mt-14 rounded-[0.9rem] bg-[#23265B] px-5 py-6 ring-1 ring-white/8 md:px-8 md:py-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,0.9fr)]">
              <div className="space-y-3">
                {contactItems.map((item) => (
                  <FooterContactRow key={item.id} item={item} />
                ))}
              </div>

              <div>
                <p className="font-sans text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-white">
                  Navigation
                </p>
                <nav className="mt-4 space-y-3">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block font-body text-[0.95rem] text-white/84 transition-colors hover:text-cyan-300"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div>
                <p className="font-sans text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-white">
                  WEM Enterprise
                </p>
                <div className="mt-4 space-y-4">
                  <WemAI />
                  <GiovanniIcon />
                  <WemAgencyIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
