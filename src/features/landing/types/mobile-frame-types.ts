type MobileVideoPanDirection = "left" | "right";

export interface MobileVideoPan {
  startFrame: number;
  endFrame: number;
  fromX: number;
  toX: number;
  widthPercent?: number;
  description?: string;
  direction?: MobileVideoPanDirection;
}


