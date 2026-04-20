"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    <div className="border-b border-white/14 py-4 sm:py-5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left sm:gap-6"
      >
        <span className="font-body text-[0.95rem] font-medium leading-[1.3] text-white/94 sm:text-[1rem] md:text-[1.2rem]">
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
    <div className="flex items-center gap-3.5 rounded-[1rem] bg-footer-surface px-3.5 py-3.5 ring-1 ring-white/8 sm:gap-4 sm:px-4 sm:py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-white/90 sm:h-10 sm:w-10">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="font-body text-[0.72rem] leading-none text-white/45 sm:text-[0.76rem]">
          {item.label}
        </p>
        <p className="mt-1 break-words font-body text-[0.88rem] leading-[1.25] text-white/92 sm:text-[0.95rem]">
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

interface FooterSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

export function FooterSection({ setLogoTheme }: FooterSectionProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const footer = footerRef.current;

    if (!footer) return;

    const trigger = ScrollTrigger.create({
      trigger: footer,
      start: "top top",
      end: "bottom bottom",
      onEnter: () => {
        setLogoTheme("light");
      },
      onEnterBack: () => {
        setLogoTheme("light");
      },
      onLeaveBack: () => {
        setLogoTheme("dark");
      },
    });

    return () => {
      trigger.kill();
    };
  }, [setLogoTheme]);

  return (
    <footer
      ref={footerRef}
      id="footer"
      data-nav-theme="dark"
      className="relative z-30 overflow-visible bg-footer-bg pb-10 pt-44 text-white sm:pt-48 md:pt-52 lg:pt-44"
    >
      <div className="landing-frame">
        <div className="absolute -top-28 left-[4%] right-[4%] rounded-[1rem] bg-gradient-to-r from-footer-cta-start to-brand-cyan px-5 py-6 text-center shadow-[0_26px_70px_rgba(26,119,254,0.26)] ring-1 ring-white/18 sm:-top-32 sm:left-[5%] sm:right-[5%] sm:px-6 sm:py-7 md:-top-36 md:px-10 md:py-8 lg:-top-40 lg:rounded-[1.1rem] lg:px-12">
          <h2 className="mx-auto max-w-4xl font-sans text-[1.55rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]">
            {ctaTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-4xl font-body text-[0.95rem] leading-[1.55] text-white/88 sm:mt-4 sm:text-[1rem] md:text-[1.08rem] lg:text-[1.18rem]">
            {ctaBody}
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:mt-6 sm:flex-row sm:gap-4">
            {ctaButtons.map((button) => (
              <a
                key={button.label}
                href={button.href}
                className={cx(
                  "w-full rounded-[0.45rem] px-6 py-3 text-center font-body text-[0.95rem] font-medium transition-transform hover:scale-[1.02] sm:min-w-[12rem] sm:w-auto sm:text-[0.96rem]",
                  button.tone === "dark"
                    ? "bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.26)]"
                    : "bg-white text-footer-bg shadow-[0_10px_30px_rgba(255,255,255,0.18)]",
                )}
              >
                {button.label}
              </a>
            ))}
          </div>
        </div>

        <div className="w-full">
          <div className="text-center">
            <h3 className="font-sans text-[2rem] font-semibold tracking-tight text-white sm:text-[2.3rem] md:text-[3rem] lg:text-[4rem]">
              FAQ
            </h3>
          </div>

          <div className="mt-6 sm:mt-8">
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

          <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.45fr)] lg:items-start">
            <div className="text-center lg:text-left">
              <div className="leading-none">
                <span className="block font-sans text-[2.8rem] font-semibold tracking-tight text-white sm:text-[3.4rem] md:text-[4.25rem] lg:text-[5rem]">
                  LET&apos;S
                </span>
                <span className="block bg-gradient-to-r from-accent-gradient-start to-brand-cyan bg-clip-text font-sans text-[2.8rem] font-semibold tracking-tight text-transparent sm:text-[3.4rem] md:text-[4.25rem] lg:text-[5rem]">
                  TALK
                </span>
              </div>

              <div className="mt-5 flex items-center justify-center gap-3 lg:mt-6 lg:justify-start">
                {socials.map((social) => {
                  const Icon = socialIcons[social.id];

                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/18 text-white/88 transition-colors hover:border-brand-cyan hover:text-brand-cyan"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="rounded-[0.75rem] border border-brand-cyan/55 bg-footer-surface p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:p-3"
            >
              <div className="grid gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  className="h-12 rounded-[0.22rem] border border-white/18 bg-footer-surface-alt px-4 font-body text-[0.95rem] text-white placeholder:text-white/35 outline-none transition-colors focus:border-brand-cyan"
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    type="email"
                    placeholder="Email"
                    className="h-12 rounded-[0.22rem] border border-white/18 bg-footer-surface-alt px-4 font-body text-[0.95rem] text-white placeholder:text-white/35 outline-none transition-colors focus:border-brand-cyan"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="h-12 rounded-[0.22rem] border border-white/18 bg-footer-surface-alt px-4 font-body text-[0.95rem] text-white placeholder:text-white/35 outline-none transition-colors focus:border-brand-cyan"
                  />
                </div>
                <textarea
                  placeholder="Write your message"
                  rows={5}
                  className="rounded-[0.22rem] border border-white/18 bg-footer-surface-alt px-4 py-3 font-body text-[0.95rem] text-white placeholder:text-white/35 outline-none transition-colors focus:border-brand-cyan"
                />
                <button
                  type="submit"
                  className="rounded-[0.22rem] bg-gradient-to-r from-accent-gradient-start to-brand-cyan px-6 py-3 font-sans text-[0.92rem] font-semibold tracking-[0.35em] text-white transition-transform hover:scale-[1.01]"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>

          <div className="mt-12 rounded-[0.9rem] bg-footer-surface-alt px-4 py-5 ring-1 ring-white/8 sm:px-5 sm:py-6 md:px-8 md:py-8 lg:mt-14">
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,0.9fr)]">
              <div className="space-y-3 md:col-span-2 xl:col-span-1">
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
                      className="block font-body text-[0.95rem] text-white/84 transition-colors hover:text-brand-cyan"
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
