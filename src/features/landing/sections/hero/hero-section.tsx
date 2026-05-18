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
  pinEnabled?: boolean;
}

export function HeroSection({
  setLogoTheme,
  onSectionActive,
  preloadStrategy = "eager",
  pinEnabled = true,
}: HeroSectionProps) {
  const {
    sectionRef,
    videoRef,
    activeHeaderItem,
    visibleBodyItems,
    visibleSupportCardItems,
    isScrolled,
    isActive,
    isAtHandoff,
  } = useHeroSectionVideo(heroStoryConfig, {
    pinEnabled,
    onEnter: () => {
      setLogoTheme("light");
      onSectionActive?.();
    },
    onEnterBack: () => {
      setLogoTheme("light");
      onSectionActive?.();
    },
  });

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
      isolateWhenInactive={isScrolled || isActive}
      isScrolled={isScrolled}
      navTheme="dark"
      preloadStrategy={preloadStrategy}
      deferVideoUntilPaint
      indicatorLabel="Scroll to explore"
      indicatorDelayMs={1800}
      videoClassName="hero-mobile-pan md:object-[center_58%] object-[center_0%]"
    >
      <div className="landing-stage flex items-center justify-center">
        <HeroSlide
          headerItem={activeHeaderItem}
          visibleBodyItems={visibleBodyItems}
          visibleSupportCardItems={visibleSupportCardItems}
          isInitialHeader={
            activeHeaderItem?.key === heroStoryConfig.contentItems.headers[0]?.key
          }
        />
      </div>
    </CinematicVideoSection>
  );
}
