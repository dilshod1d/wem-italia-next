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
const STEP_SCROLL_DURATION = 0.72;
const STEP_MIN_LOCK_MS = 760;
const STEP_INPUT_IDLE_MS = 180;

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
  const unlockTimerRef = useRef<number | null>(null);
  const transitionStartAtRef = useRef(0);
  const lastInputAtRef = useRef(0);
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

  const scheduleTransitionUnlock = useCallback(() => {
    if (unlockTimerRef.current !== null) {
      window.clearTimeout(unlockTimerRef.current);
    }

    function queueUnlockCheck() {
      const nextNow = performance.now();
      const minLockRemaining =
        STEP_MIN_LOCK_MS - (nextNow - transitionStartAtRef.current);
      const idleRemaining =
        STEP_INPUT_IDLE_MS - (nextNow - lastInputAtRef.current);
      const delay = Math.max(minLockRemaining, idleRemaining, 0);

      unlockTimerRef.current = window.setTimeout(checkUnlock, delay);
    }

    function checkUnlock() {
      const nextNow = performance.now();
      const hasMetMinLock =
        nextNow - transitionStartAtRef.current >= STEP_MIN_LOCK_MS;
      const hasIdleInput =
        nextNow - lastInputAtRef.current >= STEP_INPUT_IDLE_MS;

      if (!hasMetMinLock || !hasIdleInput) {
        queueUnlockCheck();
        return;
      }

      isTransitioningRef.current = false;
      unlockTimerRef.current = null;
    }

    queueUnlockCheck();
  }, []);

  const startTransitionLock = useCallback(() => {
    const now = performance.now();

    isTransitioningRef.current = true;
    transitionStartAtRef.current = now;
    lastInputAtRef.current = now;
    scheduleTransitionUnlock();
  }, [scheduleTransitionUnlock]);

  const keepTransitionLockedUntilInputIdle = useCallback(() => {
    lastInputAtRef.current = performance.now();
    scheduleTransitionUnlock();
  }, [scheduleTransitionUnlock]);

  const releaseTouchTransitionLock = useCallback(() => {
    if (unlockTimerRef.current !== null) {
      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }

    isTransitioningRef.current = false;
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
      startTransitionLock();
      syncFrame(nextIndex);
      scrollToStep(nextIndex);
    },
    [normalizedStepFrames.length, scrollToStep, startTransitionLock, syncFrame],
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
        keepTransitionLockedUntilInputIdle();
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;

      if (!canMoveInDirection(direction)) return;

      preventTimelineScroll(event);
      moveInDirection(direction);
    };

    const handleTouchStart = (event: TouchEvent) => {
      releaseTouchTransitionLock();
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? touchStartYRef.current;
      const delta = touchStartYRef.current - currentY;

      if (Math.abs(delta) < TOUCH_MOVE_THRESHOLD) return;

      const direction = delta > 0 ? 1 : -1;

      if (isTransitioningRef.current || canMoveInDirection(direction)) {
        preventTimelineScroll(event);

        if (isTransitioningRef.current) {
          keepTransitionLockedUntilInputIdle();
        }
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (isTransitioningRef.current) {
        preventTimelineScroll(event);
        keepTransitionLockedUntilInputIdle();
        return;
      }

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

      if (unlockTimerRef.current !== null) {
        window.clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }

      isTransitioningRef.current = false;
    };
  }, [
    canMoveInDirection,
    isActive,
    keepTransitionLockedUntilInputIdle,
    moveInDirection,
    releaseTouchTransitionLock,
  ]);
}
