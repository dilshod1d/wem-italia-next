"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { whoWeSupportSectionConfig } from "./who-we-support-story";
import AudienceCard from "./audience-card";
import WarningCard from "./warning-card";
import { ensureGsap } from "../../engine";

const { copy, cards } = whoWeSupportSectionConfig;

export function WhoWeSupportSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const cardsGridRef = useRef<HTMLDivElement | null>(null);
  const warningRef = useRef<HTMLDivElement | null>(null);
  const [isRevealArmed, setIsRevealArmed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || isRevealArmed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsRevealArmed(true);
        observer.disconnect();
      },
      {
        rootMargin: "100% 0px",
        threshold: 0.01,
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [isRevealArmed]);

  useLayoutEffect(() => {
    if (!isRevealArmed) return;

    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = cardsGridRef.current;
    const warning = warningRef.current;

    if (!section || !heading || !grid || !warning) return;

    let cancelled = false;
    let cleanup = () => {};

    void ensureGsap().then(({ gsap }) => {
      if (cancelled) return;

      const ctx = gsap.context(() => {
        const cards = Array.from(
          grid.querySelectorAll<HTMLElement>("[data-audience-card]"),
        );
        const revealTargets = [heading, warning, ...cards];

        gsap.set(revealTargets, {
          autoAlpha: 0,
          y: 46,
          scale: 0.985,
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 74%",
              once: true,
            },
          })
          .to(heading, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
          })
          .to(
            cards,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.12,
            },
            "-=0.22",
          )
          .to(
            warning,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              ease: "power3.out",
            },
            "-=0.18",
          );
      }, section);

      cleanup = () => {
        ctx.revert();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [isRevealArmed]);

  return (
    <section
      id="who-we-support"
      ref={sectionRef}
      aria-label="Chi supportiamo: startup, professionisti e PMI"
      data-nav-theme="light"
      className="relative bg-white pb-44 pt-12 sm:pb-48 sm:pt-16 lg:pb-52 lg:pt-20 2xl:pb-56 2xl:pt-24"
    >
      <div className="landing-frame">
        <div
          ref={headingRef}
          className="w-full text-center sm:w-[90%] sm:text-left lg:w-[85%]"
        >
          <p className="text-eyebrow text-black/60">{copy.eyebrow}</p>
          <h2 className="heading text-black">{copy.title}</h2>
        </div>

        <div
          ref={cardsGridRef}
          className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {cards.map((card, index) => (
            <AudienceCard key={card.stage} card={card} index={index} compact />
          ))}
        </div>

        <div
          ref={warningRef}
          className="mx-auto mt-8 w-full max-w-[760px] sm:mt-10"
        >
          <WarningCard />
        </div>
      </div>
    </section>
  );
}
