"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

const HAVE_METADATA = 1;
const BUFFER_MARGIN_SECONDS = 0.08;
const SEEK_EPSILON_SECONDS = 0.018;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getBufferedSeekTime(
  video: HTMLVideoElement,
  desiredTime: number,
): number | null {
  const duration = Number.isFinite(video.duration)
    ? video.duration
    : Number.POSITIVE_INFINITY;
  const targetTime = clamp(desiredTime, 0, duration);
  const buffered = video.buffered;

  if (targetTime <= SEEK_EPSILON_SECONDS) {
    return 0;
  }

  if (buffered.length === 0) {
    return null;
  }

  let latestBufferedTime = 0;

  for (let index = 0; index < buffered.length; index += 1) {
    const start = buffered.start(index);
    const end = buffered.end(index);
    const safeEnd =
      Number.isFinite(duration) && end >= duration - BUFFER_MARGIN_SECONDS
        ? end
        : Math.max(start, end - BUFFER_MARGIN_SECONDS);

    if (targetTime >= start && targetTime <= safeEnd) {
      return targetTime;
    }

    if (safeEnd < targetTime) {
      latestBufferedTime = Math.max(latestBufferedTime, safeEnd);
    }
  }

  return latestBufferedTime > 0 ? latestBufferedTime : null;
}

export function useBufferedScrollVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
) {
  const desiredTimeRef = useRef(0);
  const frameIdRef = useRef(0);
  const lastAppliedTimeRef = useRef(-1);

  const flush = useCallback(() => {
    frameIdRef.current = 0;

    const video = videoRef.current;
    if (!video || video.readyState < HAVE_METADATA) return;

    const safeTime = getBufferedSeekTime(video, desiredTimeRef.current);
    if (safeTime === null) return;

    const isScrubbingForward = desiredTimeRef.current > video.currentTime;
    if (
      isScrubbingForward &&
      safeTime < video.currentTime - SEEK_EPSILON_SECONDS
    ) {
      return;
    }

    if (Math.abs(video.currentTime - safeTime) < SEEK_EPSILON_SECONDS) {
      return;
    }

    if (Math.abs(lastAppliedTimeRef.current - safeTime) < SEEK_EPSILON_SECONDS) {
      return;
    }

    lastAppliedTimeRef.current = safeTime;
    video.currentTime = safeTime;
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
