"use client";

import { useState } from "react";

import { HeroSection } from "./sections/hero-section";
import { HowItWorksSection } from "./sections/how-it-works-section";
import { CustomCursor } from "./custom-cursor";
import { LandingNavbar } from "./landing-navbar";
import { FooterSection } from "./sections/footer-section";
import { PortfolioResultsSection } from "./sections/portfolio-results-section";
import { SystemFlowSection } from "./sections/system-flow-section";
import { WhoWeSupportSection } from "./sections/who-we-support-section";
import { WhyWemWorksSection } from "./sections/why-wem-works-section";

export function LandingPage() {
  const [logoTheme, setLogoTheme] = useState<"light" | "dark">("light");

  return (
    <>
      <CustomCursor theme={logoTheme} />
      <LandingNavbar logoTheme={logoTheme} />
      <main className="relative bg-background">
        <HeroSection setLogoTheme={setLogoTheme} />
        <WhyWemWorksSection setLogoTheme={setLogoTheme} />
        <SystemFlowSection setLogoTheme={setLogoTheme} />
        <HowItWorksSection setLogoTheme={setLogoTheme} />
        <PortfolioResultsSection setLogoTheme={setLogoTheme} />
        <WhoWeSupportSection setLogoTheme={setLogoTheme} />
        <FooterSection setLogoTheme={setLogoTheme} />
      </main>
    </>
  );
}
