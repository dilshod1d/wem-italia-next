import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { LandingNavbar } from "./landing-navbar";
import { FooterSection } from "./footer-section";
import { PortfolioResultsSection } from "./portfolio-results-section";
import { SystemFlowSection } from "./system-flow-section";
import { WhoWeSupportSection } from "./who-we-support-section";
import { WhyWemWorksSection } from "./why-wem-works-section";

export function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main className="relative bg-background">
        <HeroSection />
        <WhyWemWorksSection />
        <SystemFlowSection />
        <HowItWorksSection />
        <PortfolioResultsSection />
        <WhoWeSupportSection />
        <FooterSection />
      </main>
    </>
  );
}
