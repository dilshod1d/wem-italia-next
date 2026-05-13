"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";

const HAVE_METADATA = 1;
const SEEK_EPSILON_SECONDS = 0.018;
const DEFAULT_FPS = 30;

interface UseScrollVideoScrubberOptions {
  fps?: number;
}

interface SeekProfile {
  epsilonSeconds: number;
  frameStep: number;
  forceSeekThresholdSeconds: number;
  minIntervalMs: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getSeekTime(video: HTMLVideoElement, desiredTime: number) {
  const duration = Number.isFinite(video.duration)
    ? video.duration
    : Number.POSITIVE_INFINITY;

  return clamp(desiredTime, 0, duration);
}

function quantizeTime(time: number, fps: number, frameStep: number) {
  if (frameStep <= 1) return time;

  const quantizedFrame =
    Math.round((time * fps) / frameStep) * frameStep;

  return quantizedFrame / fps;
}

export function useScrollVideoScrubber(
  videoRef: RefObject<HTMLVideoElement | null>,
  { fps = DEFAULT_FPS }: UseScrollVideoScrubberOptions = {},
) {
  const desiredTimeRef = useRef(0);
  const frameIdRef = useRef(0);
  const lastSeekAtRef = useRef(0);
  const flushRef = useRef<(timestamp?: number) => void>(() => {});

  const seekProfile = useMemo<SeekProfile>(() => {
    if (typeof window === "undefined") {
      return {
        epsilonSeconds: SEEK_EPSILON_SECONDS,
        frameStep: 1,
        forceSeekThresholdSeconds: 0.12,
        minIntervalMs: 0,
      };
    }

    const isMobileViewport =
      window.matchMedia?.("(max-width: 767px)").matches ??
      window.innerWidth < 768;
    const userAgent = navigator.userAgent;
    const isIOS =
      /iPhone|iPad|iPod/.test(userAgent) ||
      (/Macintosh/.test(userAgent) && "ontouchend" in window);

    if (isIOS && isMobileViewport) {
      return {
        epsilonSeconds: Math.max(SEEK_EPSILON_SECONDS, 2 / fps),
        frameStep: 2,
        forceSeekThresholdSeconds: Math.max(6 / fps, 0.16),
        minIntervalMs: 48,
      };
    }

    if (isMobileViewport) {
      return {
        epsilonSeconds: Math.max(SEEK_EPSILON_SECONDS, 1.5 / fps),
        frameStep: 2,
        forceSeekThresholdSeconds: Math.max(5 / fps, 0.14),
        minIntervalMs: 32,
      };
    }

    return {
      epsilonSeconds: Math.max(SEEK_EPSILON_SECONDS, 1 / fps),
      frameStep: 1,
      forceSeekThresholdSeconds: Math.max(4 / fps, 0.1),
      minIntervalMs: 0,
    };
  }, [fps]);

  const flush = useCallback((timestamp = performance.now()) => {
    frameIdRef.current = 0;

    const video = videoRef.current;
    if (!video || video.readyState < HAVE_METADATA) return;

    const nextTime = getSeekTime(
      video,
      quantizeTime(desiredTimeRef.current, fps, seekProfile.frameStep),
    );
    const seekDistance = Math.abs(video.currentTime - nextTime);

    if (seekDistance < seekProfile.epsilonSeconds) {
      return;
    }

    if (
      seekProfile.minIntervalMs > 0 &&
      timestamp - lastSeekAtRef.current < seekProfile.minIntervalMs &&
      seekDistance < seekProfile.forceSeekThresholdSeconds
    ) {
      frameIdRef.current = requestAnimationFrame((nextTimestamp) => {
        flushRef.current(nextTimestamp);
      });
      return;
    }

    lastSeekAtRef.current = timestamp;
    video.currentTime = nextTime;
  }, [fps, seekProfile, videoRef]);

  useEffect(() => {
    flushRef.current = flush;
  }, [flush]);

  const scheduleFlush = useCallback(() => {
    if (frameIdRef.current) return;

    frameIdRef.current = requestAnimationFrame(flush);
  }, [flush]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("loadedmetadata", scheduleFlush);
    video.addEventListener("durationchange", scheduleFlush);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = 0;
      }

      lastSeekAtRef.current = 0;

      video.removeEventListener("loadedmetadata", scheduleFlush);
      video.removeEventListener("durationchange", scheduleFlush);
    };
  }, [scheduleFlush, videoRef]);

  return useCallback(
    (time: number) => {
      desiredTimeRef.current = time;
      scheduleFlush();
    },
    [scheduleFlush],
  );
}
