"use client";

import { useLayoutEffect, type RefObject } from "react";

interface UseDynamicViewportHeightOptions {
  propertyName?: string;
  onHeightChange?: () => void;
}

export function useDynamicViewportHeight(
  elementRef?: RefObject<HTMLElement | null>,
  {
    propertyName = "--landing-viewport-height",
    onHeightChange,
  }: UseDynamicViewportHeightOptions = {},
) {
  useLayoutEffect(() => {
    const element = elementRef?.current ?? document.documentElement;

    if (!element) return;

    let frameId = 0;
    let lastHeight = 0;

    const getViewportHeight = () =>
      window.visualViewport?.height ?? window.innerHeight;

    const syncHeight = () => {
      frameId = 0;

      const nextHeight = Math.round(getViewportHeight());

      if (!nextHeight || Math.abs(nextHeight - lastHeight) < 1) return;

      lastHeight = nextHeight;
      element.style.setProperty(propertyName, `${nextHeight}px`);
      onHeightChange?.();
    };

    const scheduleSync = () => {
      if (frameId) return;

      frameId = requestAnimationFrame(syncHeight);
    };

    syncHeight();

    window.addEventListener("resize", scheduleSync);
    window.addEventListener("orientationchange", scheduleSync);
    window.visualViewport?.addEventListener("resize", scheduleSync);
    window.visualViewport?.addEventListener("scroll", scheduleSync);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);

      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("orientationchange", scheduleSync);
      window.visualViewport?.removeEventListener("resize", scheduleSync);
      window.visualViewport?.removeEventListener("scroll", scheduleSync);
      element.style.removeProperty(propertyName);
    };
  }, [elementRef, onHeightChange, propertyName]);
}
