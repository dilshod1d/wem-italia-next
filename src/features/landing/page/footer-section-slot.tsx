"use client";

import { FooterSection } from "../sections/footer";
import { useLandingRuntime } from "./landing-runtime";

export function FooterSectionSlot() {
  const { setLogoTheme } = useLandingRuntime();

  return <FooterSection setLogoTheme={setLogoTheme} />;
}
