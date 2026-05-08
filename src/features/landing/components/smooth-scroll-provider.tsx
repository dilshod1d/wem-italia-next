"use client";

import type { ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (progress) =>
          Math.min(1, 1.001 - Math.pow(2, -10 * progress)),
      }}
    >
      <LenisScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
