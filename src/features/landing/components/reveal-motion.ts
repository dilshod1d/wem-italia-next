import type { CSSProperties } from "react";

export const REVEAL_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

export const REVEAL_TRANSITION_STYLE = {
  transitionTimingFunction: REVEAL_EASING,
} as const satisfies CSSProperties;

export const REVEAL_VISIBLE_CLASS = "translate-y-0 opacity-100";

export const REVEAL_HIDDEN_CLASS =
  "pointer-events-none translate-y-4 opacity-0 sm:translate-y-6 md:translate-y-8";

export function getRevealTransitionStyle(delayMs?: number): CSSProperties {
  return {
    transitionTimingFunction: REVEAL_EASING,
    ...(delayMs === undefined
      ? {}
      : { transitionDelay: delayMs > 0 ? `${delayMs}ms` : "0ms" }),
  };
}

export function getRevealAnimationStyle(delayMs = 0): CSSProperties {
  return delayMs > 0 ? { animationDelay: `${delayMs}ms` } : {};
}
