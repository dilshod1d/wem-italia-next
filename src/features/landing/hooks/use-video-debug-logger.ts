"use client";

import { useEffect, useRef } from "react";

interface UseVideoDebugLoggerOptions {
  label: string;
  videoSrc: string;
  configuredDuration: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  enabled?: boolean;
}

interface VideoDebugProgressPayload {
  progress: number;
  currentTime: number;
  marker?: string | number | null;
}

const LOG_EVERY_SECONDS = 0.25;
const DURATION_WARNING_THRESHOLD = 0.05;

function round(value: number, digits = 3) {
  return Number(value.toFixed(digits));
}

export function useVideoDebugLogger({
  label,
  videoSrc,
  configuredDuration,
  videoRef,
  enabled = process.env.NODE_ENV !== "production",
}: UseVideoDebugLoggerOptions) {
  const metadataLoggedRef = useRef(false);
  const lastBucketRef = useRef<number>(-1);
  const lastMarkerRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (!Number.isFinite(video.duration) || metadataLoggedRef.current) return;

      metadataLoggedRef.current = true;

      const actualDuration = round(video.duration);
      const configured = round(configuredDuration);
      const delta = round(Math.abs(video.duration - configuredDuration));

      console.info(`[VideoDebug:${label}] metadata`, {
        src: videoSrc,
        configuredDuration: configured,
        actualDuration,
        durationDelta: delta,
      });

      if (delta > DURATION_WARNING_THRESHOLD) {
        console.warn(`[VideoDebug:${label}] duration mismatch`, {
          src: videoSrc,
          configuredDuration: configured,
          actualDuration,
          durationDelta: delta,
        });
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [configuredDuration, enabled, label, videoRef, videoSrc]);

  const logProgress = ({ progress, currentTime, marker }: VideoDebugProgressPayload) => {
    if (!enabled) return;

    const bucket = Math.floor(currentTime / LOG_EVERY_SECONDS);
    const markerChanged = marker !== undefined && marker !== lastMarkerRef.current;
    const shouldLog =
      bucket !== lastBucketRef.current ||
      markerChanged ||
      progress <= 0 ||
      progress >= 1;

    if (!shouldLog) return;

    lastBucketRef.current = bucket;
    lastMarkerRef.current = marker ?? null;

    const actualDuration = videoRef.current?.duration;

    console.info(`[VideoDebug:${label}] progress`, {
      src: videoSrc,
      progress: round(progress),
      currentTime: round(currentTime),
      configuredDuration: round(configuredDuration),
      actualDuration:
        typeof actualDuration === "number" && Number.isFinite(actualDuration)
          ? round(actualDuration)
          : null,
      marker: marker ?? null,
    });
  };

  return {
    logProgress,
  };
}
