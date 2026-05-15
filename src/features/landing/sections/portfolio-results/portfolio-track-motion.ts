const PORTFOLIO_TRACK_START_FRAME = 72;
const PORTFOLIO_TRACK_CENTER_FRAME = 120;
const PORTFOLIO_POINTER_MAX_PAN = 460;
const PORTFOLIO_START_ITEM_ANCHOR = 1.1;
const PORTFOLIO_SETTLE_DELAY_MS = 180;
const PORTFOLIO_TOUCH_DRAG_MULTIPLIER = 1.25;

export const PORTFOLIO_TOUCH_INTENT_THRESHOLD = 6;

interface PortfolioTrackGeometry {
  boundsMin: number;
  boundsMax: number;
  firstAnchorOffset: number;
  itemCenterOffsets: number[];
}

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
  geometry: PortfolioTrackGeometry | null;
}

export function getPortfolioRowCenterIndex(itemCount: number) {
  if (itemCount <= 0) return -1;

  return itemCount % 2 === 0 ? itemCount / 2 - 1 : (itemCount - 1) / 2;
}

export function syncPortfolioTrackGeometry(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
) {
  if (!track || !viewport) {
    motionState.geometry = null;
    return;
  }

  const geometry = createPortfolioTrackGeometry(track, viewport);

  if (!geometry) {
    motionState.geometry = null;
    return;
  }

  motionState.geometry = geometry;

  const baseOffset =
    motionState.scrollOffset + motionState.currentPointerOffset;

  motionState.currentWheelOffset = clamp(
    motionState.currentWheelOffset,
    geometry.boundsMin - baseOffset,
    geometry.boundsMax - baseOffset,
  );
  motionState.targetWheelOffset = clamp(
    motionState.targetWheelOffset,
    geometry.boundsMin - baseOffset,
    geometry.boundsMax - baseOffset,
  );

  applyPortfolioTrackTransform(track, motionState);
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

  const geometry = ensurePortfolioGeometry(track, viewport, motionState);

  if (!geometry) return;

  const progress = clamp(
    (currentFrame - PORTFOLIO_TRACK_START_FRAME) /
      (PORTFOLIO_TRACK_CENTER_FRAME - PORTFOLIO_TRACK_START_FRAME),
    0,
    1,
  );
  const easedProgress =
    progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  motionState.scrollOffset = geometry.firstAnchorOffset * (1 - easedProgress);

  applyPortfolioTrackTransform(track, motionState);
}

export function updatePortfolioPointerPosition(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
  clientX: number | null,
) {
  if (!track || !viewport) return;

  const geometry = ensurePortfolioGeometry(track, viewport, motionState);

  if (!geometry) return;

  if (
    clientX === null ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    motionState.targetPointerOffset = 0;
  } else {
    const rect = viewport.getBoundingClientRect();
    const maxPan = Math.min(
      Math.max(Math.abs(geometry.boundsMin), Math.abs(geometry.boundsMax)),
      PORTFOLIO_POINTER_MAX_PAN,
    );
    const cursorProgress = clamp((clientX - rect.left) / rect.width, 0, 1);
    const direction = (0.5 - cursorProgress) * 2;

    motionState.targetPointerOffset = direction * maxPan;
  }

  animatePortfolioTrackMotion(track, motionState);
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

  const geometry = ensurePortfolioGeometry(track, viewport, motionState);

  if (!geometry) return;

  const baseOffset =
    motionState.scrollOffset + motionState.currentPointerOffset;

  motionState.targetWheelOffset = clamp(
    motionState.targetWheelOffset - delta * 0.75,
    geometry.boundsMin - baseOffset,
    geometry.boundsMax - baseOffset,
  );

  if (motionState.settleTimer !== null) {
    window.clearTimeout(motionState.settleTimer);
  }

  motionState.settleTimer = window.setTimeout(() => {
    settlePortfolioTrackToNearestItem(track, motionState);
  }, PORTFOLIO_SETTLE_DELAY_MS);

  animatePortfolioTrackMotion(track, motionState);
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

  const geometry = ensurePortfolioGeometry(track, viewport, motionState);

  if (!geometry) return;

  const baseOffset =
    motionState.scrollOffset + motionState.currentPointerOffset;
  const nextWheelOffset = clamp(
    motionState.currentWheelOffset - delta * PORTFOLIO_TOUCH_DRAG_MULTIPLIER,
    geometry.boundsMin - baseOffset,
    geometry.boundsMax - baseOffset,
  );

  if (motionState.settleTimer !== null) {
    window.clearTimeout(motionState.settleTimer);
    motionState.settleTimer = null;
  }

  cancelAnimationFrame(motionState.frameId);
  motionState.targetWheelOffset = nextWheelOffset;
  motionState.currentWheelOffset = nextWheelOffset;
  applyPortfolioTrackTransform(track, motionState);
}

export function settleNullablePortfolioTrackToNearestItem(
  track: HTMLDivElement | null,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
) {
  if (!track || !viewport) return;

  settlePortfolioTrackToNearestItem(track, motionState);
}

function createPortfolioTrackGeometry(
  track: HTMLDivElement,
  viewport: HTMLDivElement,
): PortfolioTrackGeometry | null {
  const viewportWidth = viewport.clientWidth;

  if (viewportWidth === 0) return null;

  const trackWidth = track.offsetWidth;
  const overflow = Math.max((trackWidth - viewportWidth) / 2, 0);
  const safeInset = viewportWidth >= 768 ? 24 : 16;
  const terminalAnchor = 1 - safeInset / viewportWidth;
  const itemCenterOffsets = Array.from(track.children).map((item) => {
    if (!(item instanceof HTMLElement)) return 0;

    const itemCenter = item.offsetLeft + item.offsetWidth / 2;

    return trackWidth / 2 - itemCenter;
  });
  const firstItem = track.firstElementChild;
  const lastItem = track.lastElementChild;
  const firstAnchorOffset =
    firstItem instanceof HTMLElement
      ? trackWidth / 2 -
        firstItem.offsetLeft +
        (PORTFOLIO_START_ITEM_ANCHOR - 0.5) * viewportWidth
      : 0;
  const terminalOffset =
    lastItem instanceof HTMLElement
      ? trackWidth / 2 -
        (lastItem.offsetLeft + lastItem.offsetWidth) +
        (terminalAnchor - 0.5) * viewportWidth
      : 0;

  return {
    boundsMin: Math.min(-overflow, terminalOffset),
    boundsMax: Math.max(overflow, firstAnchorOffset),
    firstAnchorOffset,
    itemCenterOffsets,
  };
}

function ensurePortfolioGeometry(
  track: HTMLDivElement,
  viewport: HTMLDivElement | null,
  motionState: PortfolioTrackMotionState,
) {
  if (motionState.geometry) return motionState.geometry;
  if (!viewport) return null;

  const geometry = createPortfolioTrackGeometry(track, viewport);

  motionState.geometry = geometry;

  return geometry;
}

function settlePortfolioTrackToNearestItem(
  track: HTMLDivElement,
  motionState: PortfolioTrackMotionState,
) {
  const geometry = motionState.geometry;

  if (!geometry) return;

  const targetX = getNearestPortfolioItemOffset(
    geometry.itemCenterOffsets,
    motionState.scrollOffset +
      motionState.currentPointerOffset +
      motionState.currentWheelOffset,
  );
  const baseOffset =
    motionState.scrollOffset + motionState.currentPointerOffset;

  motionState.targetWheelOffset = clamp(
    targetX - baseOffset,
    geometry.boundsMin - baseOffset,
    geometry.boundsMax - baseOffset,
  );

  animatePortfolioTrackMotion(track, motionState);
}

function animatePortfolioTrackMotion(
  track: HTMLDivElement,
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
    applyPortfolioTrackTransform(track, motionState);

    if (Math.abs(pointerDelta) > 0.35 || Math.abs(wheelDelta) > 0.35) {
      motionState.frameId = requestAnimationFrame(tick);
      return;
    }

    motionState.currentPointerOffset = motionState.targetPointerOffset;
    motionState.currentWheelOffset = motionState.targetWheelOffset;
    applyPortfolioTrackTransform(track, motionState);
  };

  motionState.frameId = requestAnimationFrame(tick);
}

function applyPortfolioTrackTransform(
  track: HTMLDivElement,
  motionState: PortfolioTrackMotionState,
) {
  const geometry = motionState.geometry;

  if (!geometry) return;

  const x = clamp(
    motionState.scrollOffset +
      motionState.currentPointerOffset +
      motionState.currentWheelOffset,
    geometry.boundsMin,
    geometry.boundsMax,
  );

  track.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), 0, 0)`;
  updatePortfolioActiveIndex(geometry.itemCenterOffsets, motionState, x);
}

function getNearestPortfolioItemOffset(
  itemCenterOffsets: readonly number[],
  currentOffset: number,
) {
  let nearestOffset = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  itemCenterOffsets.forEach((itemOffset) => {
    const distance = Math.abs(itemOffset - currentOffset);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestOffset = itemOffset;
    }
  });

  return nearestOffset;
}

function updatePortfolioActiveIndex(
  itemCenterOffsets: readonly number[],
  motionState: PortfolioTrackMotionState,
  currentOffset: number,
) {
  let nearestIndex = motionState.activeIndex;
  let nearestDistance = Number.POSITIVE_INFINITY;

  itemCenterOffsets.forEach((itemOffset, index) => {
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
