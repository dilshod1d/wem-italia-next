"use client";

import { useEffect, useState, RefObject } from "react";

export function useVideoReady(videoRef: RefObject<HTMLVideoElement | null>) {
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => setIsVideoReady(true);

    if (video.readyState >= 2) {
      onReady();
    } else {
      video.addEventListener("loadeddata", onReady, { once: true });
    }

    return () => {
      video.removeEventListener("loadeddata", onReady);
    };
  }, [videoRef]);

  useEffect(() => {
    if (isVideoReady) return;

    const lockScroll = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("scroll", lockScroll, { passive: false });

    return () => {
      window.removeEventListener("scroll", lockScroll);
    };
  }, [isVideoReady]);

  return { isVideoReady };
}
