type MobileVideoPanDirection = "left" | "right";
export type MobileVideoObjectFit = "cover" | "contain";
export type MobileVideoObjectPosition =
  | "center center"
  | "center top"
  | "center bottom";
export type MobileVideoVerticalAnchor = "top" | "center" | "bottom";

export interface MobileVideoConfig {
  objectFit?: MobileVideoObjectFit;
  objectPosition?: MobileVideoObjectPosition;
  widthPercent?: number;
  heightPercent?: number;
  verticalAnchor?: MobileVideoVerticalAnchor;
}

export interface MobileVideoPan {
  startFrame: number;
  endFrame: number;
  fromX: number;
  toX: number;
  fromY?: number;
  toY?: number;
  fromScale?: number;
  toScale?: number;
  description?: string;
  direction?: MobileVideoPanDirection;
}
