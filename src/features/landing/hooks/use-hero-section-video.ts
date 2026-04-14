"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { HeroSectionConfig } from "../types/hero-section";

gsap.registerPlugin(ScrollTrigger);

interface HeroVideoState {
  targetTime: number;
  isPlayingNormally: boolean;
  lastSegmentId: number;
}

export function useHeroSectionVideo(config: HeroSectionConfig) {
  const { segments, videoDuration, scrollThreshold, lerpFactor } = config;
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const stateRef = useRef<HeroVideoState>({
    targetTime: 0,
    isPlayingNormally: false,
    lastSegmentId: segments[0]?.id ?? 0,
  });
  const [activeSegmentId, setActiveSegmentId] = useState<number>(
    segments[0]?.id ?? 0,
  );
  const [isScrolled, setIsScrolled] = useState(false);

  const syncActiveSegment = useEffectEvent((currentTime: number) => {
    const { lastSegmentId } = stateRef.current;
    const activeSegment = segments.find(
      (segment) => currentTime >= segment.start && currentTime < segment.end,
    );

    if (activeSegment && activeSegment.id !== lastSegmentId) {
      stateRef.current.lastSegmentId = activeSegment.id;
      setActiveSegmentId(activeSegment.id);
    }
  });

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;

    if (!video || !section) return;

    video.load();

    const updateFrame = () => {
      const currentVideo = videoRef.current;
      if (!currentVideo) return;

      const { targetTime, isPlayingNormally } = stateRef.current;

      if (!isPlayingNormally) {
        const difference = targetTime - currentVideo.currentTime;

        if (Math.abs(difference) > 0.001) {
          currentVideo.currentTime += difference * lerpFactor;
        }
      }

      syncActiveSegment(currentVideo.currentTime);
      frameRef.current = window.requestAnimationFrame(updateFrame);
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: ({ progress }) => {
        setIsScrolled(progress > 0.05);

        if (progress <= scrollThreshold) {
          stateRef.current.isPlayingNormally = false;

          if (!video.paused) {
            video.pause();
          }

          stateRef.current.targetTime =
            videoDuration * (progress / scrollThreshold);
          return;
        }

        if (!stateRef.current.isPlayingNormally) {
          stateRef.current.isPlayingNormally = true;
          void video.play().catch(() => undefined);
        }
      },
    });

    frameRef.current = window.requestAnimationFrame(updateFrame);

    return () => {
      scrollTrigger.kill();

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [lerpFactor, scrollThreshold, segments, videoDuration]);

  return {
    sectionRef,
    videoRef,
    activeSegmentId,
    isScrolled,
  };
}
