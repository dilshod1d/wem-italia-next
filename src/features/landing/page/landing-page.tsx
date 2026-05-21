import dynamic from "next/dynamic";

import { LandingRuntimeProvider } from "./landing-runtime";
import { LandingNavbarSlot } from "./landing-navbar-slot";
import { HeroSectionSlot } from "./hero-section-slot";

const WhyWemWorksSectionSlot = dynamic(
  () =>
    import("./why-wem-works-section-slot").then(
      (mod) => mod.WhyWemWorksSectionSlot,
    ),
  {
    loading: () => (
      <section
        aria-hidden="true"
        className="relative bg-black"
        style={{ height: "1800px" }}
      />
    ),
  },
);

const SystemFlowSectionSlot = dynamic(
  () =>
    import("./system-flow-section-slot").then(
      (mod) => mod.SystemFlowSectionSlot,
    ),
  {
    loading: () => (
      <section
        aria-hidden="true"
        className="relative bg-white"
        style={{ height: "1800px" }}
      />
    ),
  },
);

const HowItWorksSectionSlot = dynamic(
  () =>
    import("./how-it-works-section-slot").then(
      (mod) => mod.HowItWorksSectionSlot,
    ),
  {
    loading: () => (
      <section
        aria-hidden="true"
        className="relative bg-white"
        style={{ height: "1800px" }}
      />
    ),
  },
);

const PortfolioResultsSectionSlot = dynamic(
  () =>
    import("./portfolio-results-section-slot").then(
      (mod) => mod.PortfolioResultsSectionSlot,
    ),
  {
    loading: () => (
      <section
        aria-hidden="true"
        className="relative bg-black"
        style={{ height: "2600px" }}
      />
    ),
  },
);

const WhoWeSupportSection = dynamic(
  () =>
    import("../sections/who-we-support").then(
      (mod) => mod.WhoWeSupportSection,
    ),
  {
    loading: () => (
      <section
        aria-hidden="true"
        className="relative bg-white"
        style={{ minHeight: "1100px" }}
      />
    ),
  },
);

const FooterSectionSlot = dynamic(
  () => import("./footer-section-slot").then((mod) => mod.FooterSectionSlot),
  {
    loading: () => (
      <footer
        aria-hidden="true"
        className="relative bg-footer-bg"
        style={{ minHeight: "960px" }}
      />
    ),
  },
);

export function LandingPage() {
  return (
    <LandingRuntimeProvider>
      <LandingNavbarSlot />
      <main id="main-content" className="relative bg-background">
        <HeroSectionSlot />
        <WhyWemWorksSectionSlot />
        <SystemFlowSectionSlot />
        <HowItWorksSectionSlot />
        <PortfolioResultsSectionSlot />
        <WhoWeSupportSection />
        <FooterSectionSlot />
      </main>
    </LandingRuntimeProvider>
  );
}
