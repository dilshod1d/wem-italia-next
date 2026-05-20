"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

import { footerSectionConfig } from "./footer-section.data";
import type { FooterSocialPlatform } from "./footer-section.types";
import { GiovanniLogo, WemAILogo, WemAgencyLogo } from "../../shared/icons";
import { ensureGsap } from "../../engine";
import cx from "../../utils/cx";
import FooterFaqRow from "./footer-faq-row";
import FooterContactRow from "./footer-contact-row";

const socialIcons: Record<FooterSocialPlatform, IconType> = {
  facebook: FaFacebookF,
  x: FaXTwitter,
  linkedin: FaLinkedinIn,
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

interface FooterSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

export function FooterSection({ setLogoTheme }: FooterSectionProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const footerFrameRef = useRef<HTMLDivElement | null>(null);
  const footerCtaRef = useRef<HTMLDivElement | null>(null);
  const footerContentRef = useRef<HTMLDivElement | null>(null);
  const footerFaqHeadingRef = useRef<HTMLDivElement | null>(null);
  const footerFaqListRef = useRef<HTMLDivElement | null>(null);
  const footerTalkRef = useRef<HTMLDivElement | null>(null);
  const footerPanelRef = useRef<HTMLDivElement | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const frame = footerFrameRef.current;
    const cta = footerCtaRef.current;
    const content = footerContentRef.current;

    if (!frame || !cta || !content) return;

    let frameId = 0;

    const getFooterContentGap = () => {
      if (window.matchMedia("(min-width: 1280px)").matches) return 32;
      if (window.matchMedia("(min-width: 768px)").matches) return 28;
      return 24;
    };

    const syncContentOffset = () => {
      frameId = 0;

      if (getComputedStyle(cta).position !== "absolute") {
        content.style.paddingTop = "";
        return;
      }

      const frameRect = frame.getBoundingClientRect();
      const ctaRect = cta.getBoundingClientRect();
      const overlap = Math.max(0, ctaRect.bottom - frameRect.top);

      content.style.paddingTop = `${Math.round(overlap + getFooterContentGap())}px`;
    };

    const scheduleSync = () => {
      if (frameId) return;

      frameId = requestAnimationFrame(syncContentOffset);
    };

    scheduleSync();

    const resizeObserver = new ResizeObserver(scheduleSync);

    resizeObserver.observe(frame);
    resizeObserver.observe(cta);
    window.addEventListener("resize", scheduleSync);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);

      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleSync);
      content.style.paddingTop = "";
    };
  }, []);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    const cta = footerCtaRef.current;
    const faqHeading = footerFaqHeadingRef.current;
    const faqList = footerFaqListRef.current;
    const talk = footerTalkRef.current;
    const panel = footerPanelRef.current;

    if (!footer || !cta || !faqHeading || !faqList || !talk || !panel) return;

    let cancelled = false;
    let cleanup = () => {};

    void ensureGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

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

      const ctx = gsap.context(() => {
        gsap.set([cta, faqHeading, faqList, talk, panel], {
          autoAlpha: 0,
          y: 50,
          scale: 0.985,
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: footer,
              start: "top 82%",
              once: true,
            },
          })
          .to(cta, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: "power3.out",
          })
          .to(
            faqHeading,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.58,
              ease: "power3.out",
            },
            "-=0.2",
          )
          .to(
            faqList,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.62,
              ease: "power3.out",
            },
            "-=0.22",
          )
          .to(
            talk,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.62,
              ease: "power3.out",
            },
            "-=0.18",
          )
          .to(
            panel,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.62,
              ease: "power3.out",
            },
            "-=0.2",
          );
      }, footer);

      cleanup = () => {
        ctx.revert();
        trigger.kill();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [setLogoTheme]);

  return (
    <footer
      ref={footerRef}
      id="footer"
      data-nav-theme="dark"
      className="relative z-30 overflow-visible bg-footer-bg pb-10 pt-44 text-white sm:pt-48 md:pt-52 lg:pt-44"
    >
      <div ref={footerFrameRef} className="landing-frame relative">
        <div
          ref={footerCtaRef}
          className="relative z-20 -mt-[18rem] mb-12 rounded-[1rem] bg-gradient-to-r from-footer-cta-start to-brand-cyan px-5 py-6 text-center shadow-[0_26px_70px_rgba(26,119,254,0.26)] ring-1 ring-white/18 sm:absolute sm:-top-[20rem] sm:left-[5%] sm:right-[5%] sm:mt-0 sm:mb-0 sm:px-6 sm:py-7 md:-top-[22rem] md:px-10 md:py-8 lg:-top-[21rem] lg:rounded-[1.1rem] lg:px-12"
        >
          <h2 className="mx-auto max-w-4xl font-sans text-[1.55rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]">
            {ctaTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-4xl text-body text-light-gray sm:mt-4">
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

        <div ref={footerContentRef} className="w-full">
          <div ref={footerFaqHeadingRef} className="text-center">
            <h3 className="font-sans text-[2rem] font-semibold tracking-tight text-white sm:text-[2.3rem] md:text-[3rem] lg:text-[4rem]">
              FAQ
            </h3>
          </div>

          <div ref={footerFaqListRef} className="mt-6 sm:mt-8">
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

          <div
            ref={footerTalkRef}
            className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.45fr)] lg:items-start"
          >
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
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/18 text-light-gray transition-colors hover:border-brand-cyan hover:text-brand-cyan"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="rounded-xl border border-brand-cyan/55 bg-footer-surface p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:p-3"
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

          <div
            ref={footerPanelRef}
            className="mt-12 rounded-[0.9rem] bg-footer-surface-alt px-4 py-5 ring-1 ring-white/8 sm:px-5 sm:py-6 md:px-8 md:py-8 lg:mt-14"
          >
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,0.9fr)]">
              <div className="space-y-3 md:col-span-2 xl:col-span-1">
                {contactItems.map((item) => (
                  <FooterContactRow key={item.id} item={item} />
                ))}
              </div>

              <div>
                <p className="font-sans text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-white">
                  NAVIGAZIONE
                </p>
                <nav className="mt-4 space-y-3">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block font-body text-[0.95rem] text-light-gray transition-colors hover:text-brand-cyan"
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
                  <WemAILogo />
                  <GiovanniLogo />
                  <WemAgencyLogo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
