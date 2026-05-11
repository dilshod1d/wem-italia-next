const PORTFOLIO_TRACK_START_FRAME = 72;
const PORTFOLIO_TRACK_CENTER_FRAME = 108;
const PORTFOLIO_POINTER_MAX_PAN = 460;
const PORTFOLIO_START_ITEM_ANCHOR = 0.9;
const PORTFOLIO_SETTLE_DELAY_MS = 180;
const PORTFOLIO_TOUCH_DRAG_MULTIPLIER = 1.25;

export const PORTFOLIO_TOUCH_INTENT_THRESHOLD = 6;

export interface PortfolioTrackMotionState {
  scrollOffset: number;
  targetPointerOffset: number;
  currentPointerOffset: number;
  targetWheelOffset: number;
  currentWheelOffset: number;
  frameId: number;
  settleTimer: number | null;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

export function getPortfolioRowCenterIndex(itemCount: number) {
  if (itemCount <= 0) return -1;

  return itemCount % 2 === 0 ? itemCount / 2 - 1 : (itemCount - 1) / 2;
}

export function updatePortfolioTrackScrollPosition(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
  currentFrame: number,
) {
  if (!track) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    track.style.transform = "translate3d(calc(-50% + 0px), 0, 0)";
    return;
  }

  const progress = clamp(
    (currentFrame - PORTFOLIO_TRACK_START_FRAME) /
      (PORTFOLIO_TRACK_CENTER_FRAME - PORTFOLIO_TRACK_START_FRAME),
    0,
    1,
  );
  const easedProgress = progress * progress * (3 - 2 * progress);
  const startOffset = getPortfolioItemAnchorOffset(
    track,
    viewport,
    "first",
    PORTFOLIO_START_ITEM_ANCHOR,
  );
  motionState.scrollOffset = startOffset * (1 - easedProgress);

  applyPortfolioTrackTransform(track, viewport, motionState);
}

export function updatePortfolioPointerPosition(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
  clientX: number | null,
) {
  if (!track || !viewport) return;

  if (
    clientX === null ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    motionState.targetPointerOffset = 0;
  } else {
    const rect = viewport.getBoundingClientRect();
    const bounds = getPortfolioMotionBounds(track, viewport);
    const maxPan = Math.min(
      Math.max(Math.abs(bounds.min), Math.abs(bounds.max)),
      PORTFOLIO_POINTER_MAX_PAN,
    );
    const cursorProgress = clamp((clientX - rect.left) / rect.width, 0, 1);
    const direction = (0.5 - cursorProgress) * 2;

    motionState.targetPointerOffset = direction * maxPan;
  }

  animatePortfolioTrackMotion(track, viewport, motionState);
}

export function updatePortfolioWheelPosition(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
  delta: number,
) {
  if (!track || !viewport) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const bounds = getPortfolioMotionBounds(track, viewport);
  const baseOffset =
    motionState.scrollOffset + motionState.currentPointerOffset;

  motionState.targetWheelOffset = clamp(
    motionState.targetWheelOffset - delta * 0.75,
    bounds.min - baseOffset,
    bounds.max - baseOffset,
  );

  if (motionState.settleTimer !== null) {
    window.clearTimeout(motionState.settleTimer);
  }

  motionState.settleTimer = window.setTimeout(() => {
    settlePortfolioTrackToNearestItem(track, viewport, motionState);
  }, PORTFOLIO_SETTLE_DELAY_MS);

  animatePortfolioTrackMotion(track, viewport, motionState);
}

export function updatePortfolioTouchDragPosition(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
  delta: number,
) {
  if (!track || !viewport) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const bounds = getPortfolioMotionBounds(track, viewport);
  const baseOffset =
    motionState.scrollOffset + motionState.currentPointerOffset;
  const nextWheelOffset = clamp(
    motionState.currentWheelOffset - delta * PORTFOLIO_TOUCH_DRAG_MULTIPLIER,
    bounds.min - baseOffset,
    bounds.max - baseOffset,
  );

  if (motionState.settleTimer !== null) {
    window.clearTimeout(motionState.settleTimer);
    motionState.settleTimer = null;
  }

  cancelAnimationFrame(motionState.frameId);
  motionState.targetWheelOffset = nextWheelOffset;
  motionState.currentWheelOffset = nextWheelOffset;
  applyPortfolioTrackTransform(track, viewport, motionState);
}

export function settleNullablePortfolioTrackToNearestItem(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
) {
  if (!track || !viewport) return;

  settlePortfolioTrackToNearestItem(track, viewport, motionState);
}

function settlePortfolioTrackToNearestItem(
  track: HTMLDivElement,
  viewport: HTMLDivElement,
  motionState: PortfolioTrackMotionState,
) {
  const targetX = getNearestPortfolioItemOffset(
    track,
    motionState.scrollOffset +
      motionState.currentPointerOffset +
      motionState.currentWheelOffset,
  );
  const bounds = getPortfolioMotionBounds(track, viewport);
  const baseOffset =
    motionState.scrollOffset + motionState.currentPointerOffset;

  motionState.targetWheelOffset = clamp(
    targetX - baseOffset,
    bounds.min - baseOffset,
    bounds.max - baseOffset,
  );

  animatePortfolioTrackMotion(track, viewport, motionState);
}

function animatePortfolioTrackMotion(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
) {
  cancelAnimationFrame(motionState.frameId);

  const tick = () => {
    const pointerDelta =
      motionState.targetPointerOffset - motionState.currentPointerOffset;
    const wheelDelta =
      motionState.targetWheelOffset - motionState.currentWheelOffset;

    motionState.currentPointerOffset += pointerDelta * 0.12;
    motionState.currentWheelOffset += wheelDelta * 0.18;
    applyPortfolioTrackTransform(track, viewport, motionState);

    if (Math.abs(pointerDelta) > 0.35 || Math.abs(wheelDelta) > 0.35) {
      motionState.frameId = requestAnimationFrame(tick);
      return;
    }

    motionState.currentPointerOffset = motionState.targetPointerOffset;
    motionState.currentWheelOffset = motionState.targetWheelOffset;
    applyPortfolioTrackTransform(track, viewport, motionState);
  };

  motionState.frameId = requestAnimationFrame(tick);
}

function applyPortfolioTrackTransform(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
) {
  const bounds = getPortfolioMotionBounds(track, viewport);
  const x = clamp(
    motionState.scrollOffset +
      motionState.currentPointerOffset +
      motionState.currentWheelOffset,
    bounds.min,
    bounds.max,
  );

  track.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), 0, 0)`;
  updatePortfolioActiveIndex(track, viewport, motionState, x);
}

function getPortfolioMotionBounds(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
) {
  return getPortfolioTrackPanBounds(track, viewport);
}

function getPortfolioTrackOverflow(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
) {
  if (!viewport) return 0;

  return Math.max((track.offsetWidth - viewport.clientWidth) / 2, 0);
}

function getPortfolioTrackPanBounds(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
) {
  const overflow = getPortfolioTrackOverflow(track, viewport);

  return {
    min: Math.min(-overflow, getPortfolioTerminalOffset(track, viewport)),
    max: Math.max(
      overflow,
      getPortfolioItemAnchorOffset(
        track,
        viewport,
        "first",
        PORTFOLIO_START_ITEM_ANCHOR,
      ),
    ),
  };
}

function getPortfolioTerminalOffset(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
) {
  if (!viewport || viewport.clientWidth === 0) return 0;

  const safeInset = viewport.clientWidth >= 768 ? 24 : 16;
  const terminalAnchor = 1 - safeInset / viewport.clientWidth;

  return getPortfolioItemAnchorOffset(track, viewport, "last", terminalAnchor);
}

function getPortfolioItemAnchorOffset(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
  position: "first" | "last",
  anchor: number,
) {
  const item =
    position === "first" ? track.firstElementChild : track.lastElementChild;

  if (!(item instanceof HTMLElement) || !viewport) return 0;

  const itemAnchor =
    position === "first" ? item.offsetLeft : item.offsetLeft + item.offsetWidth;
  const viewportAnchorOffset = (anchor - 0.5) * viewport.clientWidth;

  return track.offsetWidth / 2 - itemAnchor + viewportAnchorOffset;
}

function getPortfolioItemCenterOffsetByIndex(
  track: HTMLDivElement,
  index: number,
) {
  const item = track.children.item(index);

  if (!(item instanceof HTMLElement)) return 0;

  const itemCenter = item.offsetLeft + item.offsetWidth / 2;

  return track.offsetWidth / 2 - itemCenter;
}

function getNearestPortfolioItemOffset(
  track: HTMLDivElement,
  currentOffset: number,
) {
  let nearestOffset = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  Array.from(track.children).forEach((item, index) => {
    if (!(item instanceof HTMLElement)) return;

    const itemOffset = getPortfolioItemCenterOffsetByIndex(track, index);
    const distance = Math.abs(itemOffset - currentOffset);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestOffset = itemOffset;
    }
  });

  return nearestOffset;
}

function updatePortfolioActiveIndex(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
  currentOffset: number,
) {
  if (!viewport) return;

  let nearestIndex = motionState.activeIndex;
  let nearestDistance = Number.POSITIVE_INFINITY;

  Array.from(track.children).forEach((item, index) => {
    if (!(item instanceof HTMLElement)) return;

    const itemOffset = getPortfolioItemCenterOffsetByIndex(track, index);
    const distance = Math.abs(itemOffset - currentOffset);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  if (nearestIndex !== motionState.activeIndex) {
    motionState.activeIndex = nearestIndex;
    motionState.onActiveIndexChange(nearestIndex);
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
