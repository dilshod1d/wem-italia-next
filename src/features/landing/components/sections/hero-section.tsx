"use client";

import { useEffect, useState } from "react";

import { heroStoryConfig } from "../../data/hero-story";
import { whyWemWorksSectionConfig } from "../../data/why-wem-works-story";
import { useHeroSectionVideo } from "../../hooks/use-hero-section-video";
import { HeroSlide } from "../hero-slide";
import { CinematicVideoSection } from "../cinematic-video-section";

interface HeroSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

export function HeroSection({ setLogoTheme }: HeroSectionProps) {
  const [showInitialHeader, setShowInitialHeader] = useState(false);
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
    onEnter: () => setLogoTheme("light"),
    onEnterBack: () => setLogoTheme("light"),
  });
  const activeStage =
    heroStoryConfig.stages.find((stage) => stage.id === activeStageId) ??
    heroStoryConfig.stages[0];

  useEffect(() => {
    const showHeader = () => setShowInitialHeader(true);

    if (document.readyState === "complete") {
      showHeader();
      return;
    }

    window.addEventListener("load", showHeader, { once: true });

    return () => window.removeEventListener("load", showHeader);
  }, []);

  return (
    <CinematicVideoSection
      sectionId="who-we-are"
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={heroStoryConfig.videoUrl}
      mobileVideoUrl={heroStoryConfig.mobileVideoUrl}
      nextVideoSrc={whyWemWorksSectionConfig.videoUrl}
      nextMobileVideoSrc={whyWemWorksSectionConfig.mobileVideoUrl}
      isActive={isActive}
      isAtHandoff={isAtHandoff}
      isScrolled={isScrolled}
      navTheme="dark"
      preloadStrategy="eager"
      videoClassName="hero-mobile-pan md:object-[center_58%] object-[center_0%]"
    >
      <div className="landing-stage flex items-center justify-center">
        <HeroSlide
          stage={activeStage}
          visibleBodyItems={visibleBodyItems}
          visibleSupportCardItems={visibleSupportCardItems}
          config={heroStoryConfig}
          showInitialHeader={showInitialHeader}
        />
      </div>
    </CinematicVideoSection>
  );
}
