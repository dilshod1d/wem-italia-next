"use client";

import { useRef, useState } from "react";
import { useSectionPin } from "@/components/Chapter/useSectionPin";

import type { HeroSectionConfig } from "../types/hero-section";

interface HeroVideoState {
  lastSegmentId: number;
}

export function useHeroSectionVideo(config: HeroSectionConfig) {
  const { segments, videoDuration } = config;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stateRef = useRef<HeroVideoState>({
    lastSegmentId: segments[0]?.id ?? 0,
  });
  const [activeSegmentId, setActiveSegmentId] = useState<number>(
    segments[0]?.id ?? 0,
  );

  const { sectionRef, isScrolled } = useSectionPin({
    onUpdate: (progress) => {
      const video = videoRef.current;
      const currentTime = videoDuration * progress;

      if (video && video.readyState >= 1) {
        video.currentTime = currentTime;
      }

      const { lastSegmentId } = stateRef.current;
      const activeSegment = segments.find(
        (segment) => currentTime >= segment.start && currentTime < segment.end,
      );

      if (activeSegment && activeSegment.id !== lastSegmentId) {
        stateRef.current.lastSegmentId = activeSegment.id;
        setActiveSegmentId(activeSegment.id);
      }
    },
  });

  return {
    sectionRef,
    videoRef,
    activeSegmentId,
    isScrolled,
  };
}
