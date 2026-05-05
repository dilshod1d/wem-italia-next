"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

const HAVE_METADATA = 1;
const SEEK_EPSILON_SECONDS = 0.018;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getSeekTime(video: HTMLVideoElement, desiredTime: number) {
  const duration = Number.isFinite(video.duration)
    ? video.duration
    : Number.POSITIVE_INFINITY;

  return clamp(desiredTime, 0, duration);
}

export function useBufferedScrollVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
) {
  const desiredTimeRef = useRef(0);
  const frameIdRef = useRef(0);

  const flush = useCallback(() => {
    frameIdRef.current = 0;

    const video = videoRef.current;
    if (!video || video.readyState < HAVE_METADATA) return;

    const nextTime = getSeekTime(video, desiredTimeRef.current);
    if (Math.abs(video.currentTime - nextTime) < SEEK_EPSILON_SECONDS) {
      return;
    }

    video.currentTime = nextTime;
  }, [videoRef]);

  const scheduleFlush = useCallback(() => {
    if (frameIdRef.current) return;

    frameIdRef.current = requestAnimationFrame(flush);
  }, [flush]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncEvents = [
      "loadedmetadata",
      "loadeddata",
      "canplay",
      "progress",
      "seeked",
    ];

    syncEvents.forEach((eventName) => {
      video.addEventListener(eventName, scheduleFlush);
    });

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = 0;
      }

      syncEvents.forEach((eventName) => {
        video.removeEventListener(eventName, scheduleFlush);
      });
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
