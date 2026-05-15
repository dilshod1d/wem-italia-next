import type {
  MobileVideoConfig,
  MobileVideoPan,
} from "../../types/mobile-frame-types";
import type { FrameWindow } from "../../utils/frame-window";

export type SystemFlowCardStage = "step" | "budget" | "support";

export interface SystemFlowCard extends FrameWindow {
  readonly stage: SystemFlowCardStage;
  readonly icon: "steps" | "budget" | "support";
  readonly title: string;
  readonly body: string;
  readonly toneClassName: string;
  readonly placementClassName: string;
  readonly zIndexClassName: string;
}

export interface SystemFlowHeaderItem extends FrameWindow {
  readonly eyebrow: string;
  readonly title: string;
}

export interface SystemFlowBodyItem extends FrameWindow {
  readonly paragraphs: readonly string[];
}

export interface SystemFlowContentItems {
  readonly header: SystemFlowHeaderItem;
  readonly body: SystemFlowBodyItem;
  readonly cards: readonly SystemFlowCard[];
}

export interface SystemFlowSectionConfig {
  readonly videoUrl: string;
  readonly mobileVideoUrl?: string;
  readonly fps: number;
  readonly totalFrames: number;
  readonly videoDuration: number;
  readonly contentItems: SystemFlowContentItems;
  readonly mobileVideoConfig?: MobileVideoConfig;
  readonly mobileVideoPan?: readonly MobileVideoPan[];
}
