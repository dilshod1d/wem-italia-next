"use client";

import { heroStoryConfig } from "../../data/hero-story";
import { whyWemWorksSectionConfig } from "../../data/why-wem-works-story";
import { useHeroSectionVideo } from "../../hooks/use-hero-section-video";
import { HeroSlide } from "../hero-slide";
import { CinematicVideoSection } from "../cinematic-video-section";
import VideoProgressIndicator from "../cinematic-indicator";
import { useVideoReady } from "../../hooks/use-video-ready";

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

  const { isVideoReady } = useVideoReady(videoRef);

  return (
    <CinematicVideoSection
      sectionId="who-we-are"
      sectionRef={sectionRef}
      videoRef={videoRef}
      videoUrl={heroStoryConfig.videoUrl}
      nextVideoSrc={whyWemWorksSectionConfig.videoUrl}
      isScrolled={isScrolled}
      navTheme="dark"
      // videoClassName="hero-mobile-pan md:object-[center_58%] object-[center_0%]"
      videoClassName="object-cover object-center translate-y-[25%] md:translate-y-0 md:object-[center_58%]"
    >
      <div className="landing-stage flex items-center justify-center">
        <VideoProgressIndicator isVisible={!isVideoReady} />
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
