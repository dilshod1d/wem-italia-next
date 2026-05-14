"use client";

import {
  CinematicVideoSection,
  type VideoPreloadStrategy,
} from "../../shared";
import { heroStoryConfig } from "./hero-story";
import { HeroSlide } from "./hero-slide";
import { useHeroSectionVideo } from "./use-hero-section-video";

interface HeroSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
  onSectionActive?: () => void;
  preloadStrategy?: VideoPreloadStrategy;
}

export function HeroSection({
  setLogoTheme,
  onSectionActive,
  preloadStrategy = "eager",
}: HeroSectionProps) {
  const {
    sectionRef,
    videoRef,
    activeStageId,
    visibleBodyItems,
    visibleSupportCardItems,
    isScrolled,
    isActive,
    isAtHandoff,
  } = useHeroSectionVideo(heroStoryConfig, {
    onEnter: () => {
      setLogoTheme("light");
      onSectionActive?.();
    },
    onEnterBack: () => {
      setLogoTheme("light");
      onSectionActive?.();
    },
  });
  const activeStage =
    heroStoryConfig.stages.find((stage) => stage.id === activeStageId) ??
    heroStoryConfig.stages[0];

  return (
    <CinematicVideoSection
      sectionId="who-we-are"
      sectionAriaLabel="WEM Italia: agenzia AI, SEO, web design e automazione per aziende italiane"
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={heroStoryConfig.videoUrl}
      mobileVideoUrl={heroStoryConfig.mobileVideoUrl}
      isActive={isActive}
      isAtHandoff={isAtHandoff}
      isScrolled={isScrolled}
      navTheme="dark"
      preloadStrategy={preloadStrategy}
      videoClassName="hero-mobile-pan md:object-[center_58%] object-[center_0%]"
    >
      <div className="landing-stage flex items-center justify-center">
        <HeroSlide
          stage={activeStage}
          visibleBodyItems={visibleBodyItems}
          visibleSupportCardItems={visibleSupportCardItems}
          config={heroStoryConfig}
        />
      </div>
    </CinematicVideoSection>
  );
}
