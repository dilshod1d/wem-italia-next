import { useEffect, RefObject } from "react";

export function useIOSVideoUnlock(
  videoRef: RefObject<HTMLVideoElement | null> | undefined,
  isIOS: boolean,
) {
  useEffect(() => {
    if (!isIOS) return;
    if (!videoRef?.current) return;

    const video = videoRef.current;

    let cancelled = false;

    const setup = async () => {
      try {
        await video.play();
        if (cancelled) return;

        video.pause();
        video.currentTime = 0;
      } catch (e) {
        console.log("iOS play failed", e);
      }
    };

    if (video.readyState >= 1) {
      setup();
    } else {
      video.addEventListener("loadedmetadata", setup, { once: true });
    }

    return () => {
      cancelled = true;
    };
  }, [videoRef, isIOS]);
}
