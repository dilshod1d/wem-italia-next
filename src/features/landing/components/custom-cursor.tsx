"use client";

import { useEffect, useRef, useState } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select, label, summary";

interface CustomCursorProps {
  theme: "light" | "dark";
}

export function CustomCursor({ theme }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">(
    "down",
  );

  useEffect(() => {
    const canUseCursor = window.matchMedia("(hover: hover) and (pointer: fine)");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const updateEnabled = () => {
      const shouldEnable = canUseCursor.matches && !prefersReducedMotion.matches;

      setIsEnabled(shouldEnable);
      document.documentElement.classList.toggle(
        "has-cinematic-cursor",
        shouldEnable,
      );
    };

    updateEnabled();
    canUseCursor.addEventListener("change", updateEnabled);
    prefersReducedMotion.addEventListener("change", updateEnabled);

    return () => {
      canUseCursor.removeEventListener("change", updateEnabled);
      prefersReducedMotion.removeEventListener("change", updateEnabled);
      document.documentElement.classList.remove("has-cinematic-cursor");
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = () => {
      const current = currentRef.current;
      const target = targetRef.current;

      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;

      cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate3d(-50%, -50%, 0)`;
      frameRef.current = requestAnimationFrame(moveCursor);
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };

      if (!isVisible) {
        currentRef.current = { x: event.clientX, y: event.clientY };
        setIsVisible(true);
      }

      const target = event.target;
      const interactive =
        target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));
      setIsInteractive(interactive);
    };

    const handlePointerLeave = () => setIsVisible(false);
    const handlePointerDown = () => setIsPressed(true);
    const handlePointerUp = () => setIsPressed(false);
    const handleScrollIntent = (event: Event) => {
      if (event instanceof WheelEvent && event.deltaY !== 0) {
        setScrollDirection(event.deltaY > 0 ? "down" : "up");
      }

      setIsScrolling(true);

      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }

      scrollTimerRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 180);
    };

    frameRef.current = requestAnimationFrame(moveCursor);
    window.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("wheel", handleScrollIntent, { passive: true });
    window.addEventListener("scroll", handleScrollIntent, { passive: true });

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }

      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("wheel", handleScrollIntent);
      window.removeEventListener("scroll", handleScrollIntent);
    };
  }, [isEnabled, isVisible]);

  if (!isEnabled) return null;

  const usesDarkCursor = theme === "dark";
  const outerBaseClassName = usesDarkCursor
    ? "border-black/45 bg-black/[0.035] shadow-[0_18px_60px_rgba(0,0,0,0.14),0_0_0_1px_rgba(0,0,0,0.08),0_0_34px_rgba(0,0,0,0.10)]"
    : "border-white/55 bg-white/[0.035] shadow-[0_18px_60px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.08),0_0_34px_rgba(255,255,255,0.14)]";
  const outerActiveClassName = usesDarkCursor
    ? "border-black/70 bg-black/[0.055]"
    : "border-white/75 bg-white/[0.055]";
  const outerIdleClassName = usesDarkCursor
    ? "border-black/42"
    : "border-white/45";
  const trailClassName = usesDarkCursor ? "via-black/55" : "via-white/70";
  const lensHighlightClassName = usesDarkCursor
    ? "bg-black/[0.045]"
    : "bg-white/[0.055]";
  const dotClassName = usesDarkCursor
    ? "bg-black/88 shadow-[0_0_18px_rgba(0,0,0,0.24)]"
    : "bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.55)]";

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={cx(
        "pointer-events-none fixed left-0 top-0 z-[80] flex h-18 w-18 items-center justify-center rounded-full transition-[opacity,width,height,filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isVisible ? "opacity-100" : "opacity-0",
        isScrolling
          ? "h-28 w-18 saturate-125"
          : isInteractive
            ? "h-24 w-24 saturate-125"
            : "h-18 w-18 saturate-110",
        isPressed ? "scale-90" : "scale-100",
      )}
    >
      <span
        className={cx(
          "absolute inset-0 rounded-full border backdrop-blur-[2px] transition-[opacity,transform,border-color,background-color,box-shadow] duration-300",
          outerBaseClassName,
          isScrolling || isInteractive
            ? cx("scale-100", outerActiveClassName)
            : cx("scale-95", outerIdleClassName),
        )}
      />
      <span
        className={cx(
          "absolute inset-[0.22rem] rounded-full opacity-0 transition-[opacity,background-color] duration-300",
          lensHighlightClassName,
          (isScrolling || isInteractive) && "opacity-100",
        )}
      />
      <span
        className={cx(
          "absolute inset-[0.65rem] rounded-full border transition-[border-color,transform] duration-300",
          isScrolling || isInteractive
            ? "border-brand-green/75"
            : "border-brand-green/42",
          isScrolling && "scale-x-[0.76] scale-y-100",
        )}
      />
      <span
        className={cx(
          "absolute inset-[1.15rem] rounded-full border transition-[border-color,transform] duration-300",
          isScrolling || isInteractive
            ? "border-brand-red/75"
            : "border-brand-red/42",
          isScrolling && "scale-x-[0.72] scale-y-95",
        )}
      />
      <span
        className={cx(
          "absolute h-14 w-px bg-gradient-to-b from-transparent to-transparent transition-[opacity,transform] duration-300",
          trailClassName,
          isScrolling
            ? cx(
                "scale-y-100 opacity-100",
                scrollDirection === "down" ? "translate-y-2" : "-translate-y-2",
              )
            : "scale-y-40 translate-y-0 opacity-0",
        )}
      />
      <span
        className={cx(
          "absolute h-2 w-2 rounded-full transition-[opacity,transform,background-color,box-shadow] duration-300",
          dotClassName,
          isScrolling
            ? cx(
                "scale-125 opacity-100",
                scrollDirection === "down"
                  ? "translate-y-3"
                  : "-translate-y-3",
              )
            : isInteractive
              ? "scale-150 opacity-100"
              : "scale-100 opacity-90",
        )}
      />
    </div>
  );
}
