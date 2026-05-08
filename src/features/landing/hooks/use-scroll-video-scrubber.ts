"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

const HAVE_METADATA = 1;
const SEEK_EPSILON_SECONDS = 0.001;
const SEEK_LERP = 0.1;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getSeekTime(video: HTMLVideoElement, desiredTime: number) {
  const duration = Number.isFinite(video.duration)
    ? video.duration
    : Number.POSITIVE_INFINITY;

  return clamp(desiredTime, 0, duration);
}

export function useScrollVideoScrubber(
  videoRef: RefObject<HTMLVideoElement | null>,
) {
  const desiredTimeRef = useRef(0);
  const frameIdRef = useRef(0);
  const flushRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    flushRef.current = () => {
      const video = videoRef.current;
      if (!video || video.readyState < HAVE_METADATA) {
        frameIdRef.current = 0;
        return;
      }

      const nextTime = getSeekTime(video, desiredTimeRef.current);
      const diff = nextTime - video.currentTime;

      if (Math.abs(diff) < SEEK_EPSILON_SECONDS) {
        video.currentTime = nextTime;
        frameIdRef.current = 0;
        return;
      }

      video.currentTime += diff * SEEK_LERP;
      frameIdRef.current = requestAnimationFrame(() => flushRef.current());
    };
  }, [videoRef]);

  const scheduleFlush = useCallback(() => {
    if (frameIdRef.current) return;

    frameIdRef.current = requestAnimationFrame(() => flushRef.current());
  }, []);

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
