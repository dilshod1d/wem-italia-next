"use client";

const VIDEO_END_HOLD = 0.92;

export function mapVideoProgress(progress: number) {
  return Math.min(progress / VIDEO_END_HOLD, 1);
}
