"use client";

import { heroStoryConfig } from "../../data/hero-story";
import { whyWemWorksSectionConfig } from "../../data/why-wem-works-story";
import { useHeroSectionVideo } from "../../hooks/use-hero-section-video";
import { HeroSlide } from "../hero-slide";
import { CinematicVideoSection } from "../cinematic-video-section";

export function HeroSection() {
  const { sectionRef, videoRef, activeSegmentId, isScrolled } =
    useHeroSectionVideo(heroStoryConfig);

  return (
    <CinematicVideoSection
      sectionId="who-we-are"
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={heroStoryConfig.videoUrl}
      nextVideoSrc={whyWemWorksSectionConfig.videoUrl}
      isScrolled={isScrolled}
      navTheme="dark"
      videoClassName="object-[center_78%] grayscale-[20%] contrast-[110%]"
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {heroStoryConfig.segments.map((segment) => (
          <HeroSlide
            key={segment.id}
            segment={segment}
            isActive={activeSegmentId === segment.id}
          />
        ))}
      </div>
    </CinematicVideoSection>
  );
}
