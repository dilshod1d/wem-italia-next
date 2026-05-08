"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { useLenis } from "lenis/react";
import { CHAPTER_SCROLL_DISTANCE } from "@/components/Chapter/useSectionPin";

interface TimelineFrameState {
  progress: number;
  currentFrame: number;
  currentTime: number;
}

interface UseSteppedVideoTimelineOptions {
  sectionRef: RefObject<HTMLElement | null>;
  isActive: boolean;
  fps: number;
  totalFrames: number;
  videoDuration: number;
  stepFrames: readonly number[];
  pinDistance?: number;
  reserveExitScroll?: boolean;
  onFrame: (state: TimelineFrameState) => void;
}

const WHEEL_THRESHOLD = 10;
const TOUCH_MOVE_THRESHOLD = 8;
const TOUCH_STEP_THRESHOLD = 50;
const STEP_LOCK_MS = 1000;
const STEP_SCROLL_DURATION = 0.72;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function easeOutExpo(value: number) {
  return Math.min(1, 1.001 - Math.pow(2, -10 * value));
}

function preventTimelineScroll(event: Event) {
  if (event.cancelable) {
    event.preventDefault();
  }

  event.stopPropagation();
}

export function normalizeTimelineStepFrames(
  frames: readonly number[],
  totalFrames: number,
) {
  const normalizedFrames = frames
    .filter(Number.isFinite)
    .map((frame) => Math.round(clamp(frame, 0, totalFrames)))
    .sort((a, b) => a - b);

  return normalizedFrames.filter(
    (frame, index) => index === 0 || frame !== normalizedFrames[index - 1],
  );
}

export function useSteppedVideoTimeline({
  sectionRef,
  isActive,
  fps,
  totalFrames,
  videoDuration,
  stepFrames,
  pinDistance = CHAPTER_SCROLL_DISTANCE,
  reserveExitScroll = false,
  onFrame,
}: UseSteppedVideoTimelineOptions) {
  const lenis = useLenis();
  const normalizedStepFrames = useMemo(() => {
    const frames = normalizeTimelineStepFrames(stepFrames, totalFrames);

    return frames.length > 0 ? frames : [0];
  }, [stepFrames, totalFrames]);
  const activeStepIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const releaseTimerRef = useRef<number | null>(null);
  const touchStartYRef = useRef(0);
  const onFrameRef = useRef(onFrame);

  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  const getStepScroll = useCallback(
    (index: number) => {
      const section = sectionRef.current;

      if (!section) return null;

      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const maxIndex = Math.max(normalizedStepFrames.length - 1, 1);
      const scrollSlots = reserveExitScroll
        ? Math.max(normalizedStepFrames.length, 1)
        : maxIndex;
      const progress = clamp(index / scrollSlots, 0, 1);
      const scrollDistance =
        !reserveExitScroll && progress >= 1
          ? Math.max(pinDistance - 1, 0)
          : pinDistance * progress;

      return sectionTop + scrollDistance;
    },
    [normalizedStepFrames.length, pinDistance, reserveExitScroll, sectionRef],
  );

  const releaseTransitionLock = useCallback(() => {
    if (releaseTimerRef.current !== null) {
      window.clearTimeout(releaseTimerRef.current);
    }

    releaseTimerRef.current = window.setTimeout(() => {
      isTransitioningRef.current = false;
      releaseTimerRef.current = null;
    }, STEP_LOCK_MS);
  }, []);

  const syncFrame = useCallback(
    (index: number) => {
      const currentFrame = normalizedStepFrames[index] ?? 0;
      const progress =
        totalFrames > 0 ? clamp(currentFrame / totalFrames, 0, 1) : 0;
      const currentTime = clamp(currentFrame / fps, 0, videoDuration);

      onFrameRef.current({
        progress,
        currentFrame,
        currentTime,
      });
    },
    [fps, normalizedStepFrames, totalFrames, videoDuration],
  );

  const scrollToStep = useCallback(
    (index: number) => {
      const targetScroll = getStepScroll(index);

      if (targetScroll === null) return;

      if (lenis) {
        lenis.scrollTo(targetScroll, {
          duration: STEP_SCROLL_DURATION,
          easing: easeOutExpo,
          force: true,
        });
        return;
      }

      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    },
    [getStepScroll, lenis],
  );

  const moveToStep = useCallback(
    (index: number) => {
      const lastIndex = normalizedStepFrames.length - 1;
      const nextIndex = clamp(index, 0, lastIndex);

      activeStepIndexRef.current = nextIndex;
      isTransitioningRef.current = true;
      syncFrame(nextIndex);
      scrollToStep(nextIndex);
      releaseTransitionLock();
    },
    [normalizedStepFrames.length, releaseTransitionLock, scrollToStep, syncFrame],
  );

  const canMoveInDirection = useCallback(
    (direction: number) => {
      const lastIndex = normalizedStepFrames.length - 1;
      const index = activeStepIndexRef.current;

      return direction > 0 ? index < lastIndex : index > 0;
    },
    [normalizedStepFrames.length],
  );

  const moveInDirection = useCallback(
    (direction: number) => {
      if (!canMoveInDirection(direction)) return false;

      moveToStep(activeStepIndexRef.current + direction);
      return true;
    },
    [canMoveInDirection, moveToStep],
  );

  useEffect(() => {
    activeStepIndexRef.current = clamp(
      activeStepIndexRef.current,
      0,
      normalizedStepFrames.length - 1,
    );
    syncFrame(activeStepIndexRef.current);
  }, [normalizedStepFrames, syncFrame]);

  useEffect(() => {
    if (!isActive) return;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.ctrlKey) {
        return;
      }

      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      if (isTransitioningRef.current) {
        preventTimelineScroll(event);
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;

      if (!canMoveInDirection(direction)) return;

      preventTimelineScroll(event);
      moveInDirection(direction);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? touchStartYRef.current;
      const delta = touchStartYRef.current - currentY;

      if (Math.abs(delta) < TOUCH_MOVE_THRESHOLD) return;

      const direction = delta > 0 ? 1 : -1;

      if (isTransitioningRef.current || canMoveInDirection(direction)) {
        preventTimelineScroll(event);
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (isTransitioningRef.current) return;

      const touchEndY =
        event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const delta = touchStartYRef.current - touchEndY;

      if (Math.abs(delta) < TOUCH_STEP_THRESHOLD) return;

      const direction = delta > 0 ? 1 : -1;

      if (!canMoveInDirection(direction)) return;

      preventTimelineScroll(event);
      moveInDirection(direction);
    };

    window.addEventListener("wheel", handleWheel, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchend", handleTouchEnd, {
      capture: true,
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove, {
        capture: true,
      });
      window.removeEventListener("touchend", handleTouchEnd, {
        capture: true,
      });

      if (releaseTimerRef.current !== null) {
        window.clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = null;
      }

      isTransitioningRef.current = false;
    };
  }, [canMoveInDirection, isActive, moveInDirection]);
}
