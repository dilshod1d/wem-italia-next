export interface FrameWindow {
  readonly fromFrame: number;
  readonly toFrame: number;
}

export interface FrameRange {
  readonly startFrame: number;
  readonly endFrame: number;
}

export function isFrameWithinWindow(
  currentFrame: number,
  { fromFrame, toFrame }: FrameWindow,
) {
  return currentFrame >= fromFrame && currentFrame < toFrame;
}

export function getActiveFrameRangeItem<T extends FrameRange>(
  currentFrame: number,
  items: readonly T[],
) {
  return items.find(
    (item) =>
      currentFrame >= item.startFrame && currentFrame < item.endFrame,
  );
}

export function filterVisibleFrameItems<T extends FrameWindow>(
  currentFrame: number,
  items: readonly T[],
) {
  return items.filter((item) => isFrameWithinWindow(currentFrame, item));
}

export function getActiveFrameWindowItem<T extends FrameWindow>(
  currentFrame: number,
  items: readonly T[],
) {
  return items.find((item) => isFrameWithinWindow(currentFrame, item));
}

export function getVisibleFrameItemsWithSignature<T extends FrameWindow>(
  currentFrame: number,
  items: readonly T[],
  options: {
    getSignaturePart: (item: T) => string;
    sort?: (a: T, b: T) => number;
  },
) {
  const visibleItems = filterVisibleFrameItems(currentFrame, items);
  const sortedItems = options.sort
    ? [...visibleItems].sort(options.sort)
    : visibleItems;

  return {
    items: sortedItems,
    signature: sortedItems.map(options.getSignaturePart).join("|"),
  };
}

export function getFrameWindowVisibility<T extends Record<string, FrameWindow>>(
  currentFrame: number,
  windows: T,
) {
  const keys = Object.keys(windows) as (keyof T)[];
  const visibility = {} as { [K in keyof T]: boolean };

  for (const key of keys) {
    visibility[key] = isFrameWithinWindow(currentFrame, windows[key]);
  }

  return {
    visibility,
    signature: getFrameVisibilitySignature(keys.map((key) => visibility[key])),
  };
}

export function getFrameVisibilitySignature(flags: readonly boolean[]) {
  return flags.map((flag) => (flag ? "1" : "0")).join("");
}
