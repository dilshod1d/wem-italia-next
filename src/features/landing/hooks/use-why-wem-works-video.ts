"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type {
  WhyWemWorksSectionConfig,
  WhyWemWorksStageKey,
} from "../types/why-wem-works-section";

gsap.registerPlugin(ScrollTrigger);

interface WhyWemWorksVideoState {
  targetTime: number;
  isPlayingNormally: boolean;
  lastStageKey: WhyWemWorksStageKey;
}

export function useWhyWemWorksVideo(config: WhyWemWorksSectionConfig) {
  const { stages, videoDuration, scrollThreshold, lerpFactor } = config;
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const durationRef = useRef(videoDuration);
  const stateRef = useRef<WhyWemWorksVideoState>({
    targetTime: 0,
    isPlayingNormally: false,
    lastStageKey: stages[0]?.key ?? "intro",
  });
  const [activeStageKey, setActiveStageKey] = useState<WhyWemWorksStageKey>(
    stages[0]?.key ?? "intro",
  );
  const [isScrolled, setIsScrolled] = useState(false);

  const syncActiveStage = useEffectEvent((currentTime: number) => {
    const { lastStageKey } = stateRef.current;
    const activeStage = stages.find(
      (stage) => currentTime >= stage.start && currentTime < stage.end,
    );

    if (activeStage && activeStage.key !== lastStageKey) {
      stateRef.current.lastStageKey = activeStage.key;
      setActiveStageKey(activeStage.key);
    }
  });

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;

    if (!video || !section) return;

    const syncDuration = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
    };

    syncDuration();
    video.load();
    video.addEventListener("loadedmetadata", syncDuration);
    video.addEventListener("durationchange", syncDuration);

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

      syncActiveStage(currentVideo.currentTime);
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

          const effectiveDuration = durationRef.current || videoDuration;
          stateRef.current.targetTime =
            Math.min(
              effectiveDuration,
              effectiveDuration * (progress / scrollThreshold),
            );
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
      video.removeEventListener("loadedmetadata", syncDuration);
      video.removeEventListener("durationchange", syncDuration);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [lerpFactor, scrollThreshold, stages, videoDuration]);

  return {
    sectionRef,
    videoRef,
    activeStageKey,
    isScrolled,
  };
}
