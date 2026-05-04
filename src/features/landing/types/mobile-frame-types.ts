type MobileVideoPanDirection = "left" | "right";
type MobileVideoPanObjectFit = "cover" | "contain";
type MobileVideoPanObjectPosition =
  | "center center"
  | "center top"
  | "center bottom";
type MobileVideoPanVerticalAnchor = "top" | "center" | "bottom";

export interface MobileVideoPan {
  startFrame: number;
  endFrame: number;
  fromX: number;
  toX: number;
  fromY?: number;
  toY?: number;
  fromScale?: number;
  toScale?: number;
  objectFit?: MobileVideoPanObjectFit;
  objectPosition?: MobileVideoPanObjectPosition;
  widthPercent?: number;
  heightPercent?: number;
  verticalAnchor?: MobileVideoPanVerticalAnchor;
  description?: string;
  direction?: MobileVideoPanDirection;
}
