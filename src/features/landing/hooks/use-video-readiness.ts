"use client";

import { useEffect, useState, type RefObject } from "react";

const HAVE_CURRENT_DATA = 2;

function getVideoReadyState(video: HTMLVideoElement | null | undefined) {
  return Boolean(video && video.readyState >= HAVE_CURRENT_DATA);
}

export function useVideoReadiness(
  videoRef: RefObject<HTMLVideoElement | null> | undefined,
  enabled = true,
) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const video = videoRef?.current;

    if (!video) return;

    let frameId = 0;

    const syncReadyState = () => {
      if (frameId) cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        frameId = 0;
        setIsReady(getVideoReadyState(video));
      });
    };

    syncReadyState();

    const events = [
      "loadedmetadata",
      "loadeddata",
      "canplay",
      "canplaythrough",
      "progress",
      "seeking",
      "seeked",
      "waiting",
      "stalled",
      "emptied",
      "abort",
      "error",
    ];

    events.forEach((eventName) => {
      video.addEventListener(eventName, syncReadyState);
    });

    return () => {
      if (frameId) cancelAnimationFrame(frameId);

      events.forEach((eventName) => {
        video.removeEventListener(eventName, syncReadyState);
      });
    };
  }, [enabled, videoRef]);

  return Boolean(enabled && isReady);
}
