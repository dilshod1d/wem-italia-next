"use client";

type GsapModule = typeof import("gsap");
type ScrollTriggerModule = typeof import("gsap/ScrollTrigger");

let gsapPromise:
  | Promise<{
      gsap: GsapModule["gsap"];
      ScrollTrigger: ScrollTriggerModule["ScrollTrigger"];
    }>
  | null = null;
let isScrollTriggerRegistered = false;

export function ensureGsap() {
  if (!gsapPromise) {
    gsapPromise = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, scrollTriggerModule]) => {
        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

        if (!isScrollTriggerRegistered) {
          gsap.registerPlugin(ScrollTrigger);
          isScrollTriggerRegistered = true;
        }

        return { gsap, ScrollTrigger };
      },
    );
  }

  return gsapPromise;
}
