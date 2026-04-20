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
  const { sectionRef, videoRef, activeStageId, isScrolled } =
    useHeroSectionVideo(heroStoryConfig, {
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
      videoClassName="grayscale-[20%] contrast-[110%] md:object-[center_58%]"
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <HeroSlide stage={activeStage} config={heroStoryConfig} />
      </div>
    </CinematicVideoSection>
  );
}
