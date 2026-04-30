"use client";

import { heroStoryConfig } from "../../data/hero-story";
import { whyWemWorksSectionConfig } from "../../data/why-wem-works-story";
import { useHeroSectionVideo } from "../../hooks/use-hero-section-video";
import { HeroSlide } from "../hero-slide";
import { CinematicVideoSection } from "../cinematic-video-section";

interface HeroSectionProps {
  setLogoTheme: (theme: "light" | "dark") => void;
}

export function HeroSection({ setLogoTheme }: HeroSectionProps) {
  const {
    sectionRef,
    videoRef,
    activeStageId,
    visibleBodyItems,
    visibleSupportCardItems,
    isScrolled,
  } = useHeroSectionVideo(heroStoryConfig, {
    onEnter: () => setLogoTheme("light"),
    onEnterBack: () => setLogoTheme("light"),
  });
  const activeStage =
    heroStoryConfig.stages.find((stage) => stage.id === activeStageId) ??
    heroStoryConfig.stages[0];

  return (
    <CinematicVideoSection
      sectionId="who-we-are"
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={heroStoryConfig.videoUrl}
      nextVideoSrc={whyWemWorksSectionConfig.videoUrl}
      isScrolled={isScrolled}
      navTheme="dark"
      // videoClassName="md:object-[center_58%]"
      videoClassName="
    md:object-[center_58%]
    max-md:!w-[180%]
    max-md:!max-w-none
    max-md:!left-0
    max-md:!right-auto
    max-md:!translate-x-[-44%]
    max-md:!object-cover
  "
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
