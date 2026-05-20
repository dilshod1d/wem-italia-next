"use client";

import { useEffect, type RefObject } from "react";

interface UseDynamicViewportHeightOptions {
  propertyName?: string;
  onHeightChange?: () => void;
  notifyOnMount?: boolean;
}

export function useDynamicViewportHeight(
  elementRef?: RefObject<HTMLElement | null>,
  {
    propertyName = "--landing-viewport-height",
    onHeightChange,
    notifyOnMount = false,
  }: UseDynamicViewportHeightOptions = {},
) {
  useEffect(() => {
    const element = elementRef?.current ?? document.documentElement;

    if (!element) return;

    let frameId = 0;
    let lastHeight = 0;
    let shouldNotifyOnFrame = false;

    const getViewportHeight = () =>
      window.visualViewport?.height ?? window.innerHeight;

    const syncHeight = (notifyHeightChange: boolean) => {
      frameId = 0;

      const nextHeight = Math.round(getViewportHeight());

      if (!nextHeight || Math.abs(nextHeight - lastHeight) < 1) return;

      lastHeight = nextHeight;
      element.style.setProperty(propertyName, `${nextHeight}px`);

      if (notifyHeightChange) {
        onHeightChange?.();
      }
    };

    const scheduleSync = (notifyHeightChange: boolean) => {
      shouldNotifyOnFrame ||= notifyHeightChange;

      if (frameId) return;

      frameId = requestAnimationFrame(() => {
        const notify = shouldNotifyOnFrame;

        shouldNotifyOnFrame = false;
        syncHeight(notify);
      });
    };

    const scheduleLayoutSync = () => scheduleSync(true);
    const scheduleViewportSync = () => scheduleSync(false);

    // Let the first paint use the 100vh fallback, then sync the precise
    // viewport height on the next frame to avoid a mount-time forced reflow.
    scheduleSync(notifyOnMount);

    window.addEventListener("resize", scheduleLayoutSync);
    window.addEventListener("orientationchange", scheduleLayoutSync);
    window.visualViewport?.addEventListener("resize", scheduleViewportSync);
    window.visualViewport?.addEventListener("scroll", scheduleViewportSync);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);

      window.removeEventListener("resize", scheduleLayoutSync);
      window.removeEventListener("orientationchange", scheduleLayoutSync);
      window.visualViewport?.removeEventListener("resize", scheduleViewportSync);
      window.visualViewport?.removeEventListener("scroll", scheduleViewportSync);
      element.style.removeProperty(propertyName);
    };
  }, [elementRef, notifyOnMount, onHeightChange, propertyName]);
}
