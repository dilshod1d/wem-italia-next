import { HeroSection } from "./sections/hero-section";
import { HowItWorksSection } from "./sections/how-it-works-section";
import { LandingNavbar } from "./landing-navbar";
import { FooterSection } from "./footer-section";
import { PortfolioResultsSection } from "./sections/portfolio-results-section";
import { SystemFlowSection } from "./sections/system-flow-section";
import { WhoWeSupportSection } from "./sections/who-we-support-section";
import { WhyWemWorksSection } from "./sections/why-wem-works-section";

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
      </main>
      <FooterSection />
    </>
  );
}
