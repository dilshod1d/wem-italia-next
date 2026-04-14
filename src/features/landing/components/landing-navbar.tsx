"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "./brand-mark";

type LandingNavTheme = "light" | "dark";

export function LandingNavbar() {
  const [theme, setTheme] = useState<LandingNavTheme>("dark");

  useEffect(() => {
    const getTheme = (): LandingNavTheme => {
      const probeLine = window.innerHeight * 0.35;
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-nav-theme]"),
      );

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= probeLine && rect.bottom >= probeLine) {
          return section.dataset.navTheme === "light" ? "light" : "dark";
        }
      }

      return "dark";
    };

    let frameId = 0;

    const updateTheme = () => {
      frameId = 0;
      setTheme(getTheme());
    };

    const requestUpdate = () => {
      if (frameId !== 0) return;

      frameId = window.requestAnimationFrame(updateTheme);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <BrandMark className="pointer-events-auto" theme={theme} />

        <button
          type="button"
          aria-label="Open navigation"
          className={cx(
            "pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/90 transition-transform hover:scale-105",
            theme === "light"
              ? "shadow-[0_18px_40px_rgba(0,0,0,0.18)] ring-1 ring-black/6"
              : "shadow-[0_18px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10",
          )}
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
  );
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
