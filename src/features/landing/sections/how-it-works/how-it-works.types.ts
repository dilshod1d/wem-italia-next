import type {
  MobileVideoConfig,
  MobileVideoPan,
} from "../../types/mobile-frame-types";
import type { FrameWindow } from "../../utils/frame-window";

export type HowItWorksStepStage =
  | "analysis"
  | "direction"
  | "build"
  | "evolution";

export interface HowItWorksStep extends FrameWindow {
  readonly stage: HowItWorksStepStage;
  readonly title: string;
  readonly body: string;
  readonly toneClassName: string;
  readonly placementClassName: string;
  readonly zIndexClassName: string;
}

export interface HowItWorksHeaderItem extends FrameWindow {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
}

export interface HowItWorksDescriptionItem extends FrameWindow {
  readonly text: string;
}

export interface HowItWorksContentItems {
  readonly header: HowItWorksHeaderItem;
  readonly description: HowItWorksDescriptionItem;
  readonly stepRail: FrameWindow;
  readonly steps: readonly HowItWorksStep[];
}

export interface HowItWorksSectionConfig {
  readonly videoUrl: string;
  readonly mobileVideoUrl?: string;
  readonly fps: number;
  readonly totalFrames: number;
  readonly videoDuration: number;
  readonly contentItems: HowItWorksContentItems;
  readonly mobileVideoConfig?: MobileVideoConfig;
  readonly mobileVideoPan?: readonly MobileVideoPan[];
}
