"use client";

import { heroStoryConfig } from "../../data/hero-story";
import { whyWemWorksSectionConfig } from "../../data/why-wem-works-story";
import { useHeroSectionVideo } from "../../hooks/use-hero-section-video";
import { HeroSlide } from "../hero-slide";
import { CinematicVideoSection } from "../cinematic-video-section";

export function HeroSection() {
  const { sectionRef, videoRef, activeStageId, isScrolled } =
    useHeroSectionVideo(heroStoryConfig);
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
      videoClassName="object-[center_58%] grayscale-[20%] contrast-[110%]"
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <HeroSlide stage={activeStage} config={heroStoryConfig} />
      </div>
    </CinematicVideoSection>
  );
}
