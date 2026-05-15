import type { HeroSupportCard } from "../hero/hero.types";
import type {
  MobileVideoConfig,
  MobileVideoPan,
} from "../../types/mobile-frame-types";
import type { FrameWindow } from "../../utils/frame-window";

export type WhyWemWorksInsightStage = "method" | "ai";

export interface WhyWemWorksInsightBlock extends FrameWindow {
  readonly stage: WhyWemWorksInsightStage;
  readonly title: string;
  readonly body: string;
  readonly toneClassName: string;
  readonly offsetClassName?: string;
}

export type WhyWemWorksProofPointIcon =
  | "speed"
  | "costs"
  | "decisions"
  | "projects";

export interface WhyWemWorksProofPoint extends FrameWindow {
  readonly titleLines: readonly string[];
  readonly color: string;
  readonly icon: WhyWemWorksProofPointIcon;
}

export interface WhyWemWorksOpeningCopyItem extends FrameWindow {
  readonly eyebrow: string;
  readonly titleLines: readonly string[];
}

export interface WhyWemWorksOpeningCardItem extends FrameWindow {
  readonly card: HeroSupportCard;
}

export interface WhyWemWorksOpeningBodyItem extends FrameWindow {
  readonly key: string;
  readonly text: string;
  readonly order: number;
}

export interface WhyWemWorksSectionTitleItem extends FrameWindow {
  readonly text: string;
}

export interface WhyWemWorksCopyItem extends FrameWindow {
  readonly key: string;
  readonly text: string;
  readonly order: number;
}

export interface WhyWemWorksContentItems {
  readonly opening: {
    readonly header: WhyWemWorksOpeningCopyItem;
    readonly body: readonly WhyWemWorksOpeningBodyItem[];
    readonly card: WhyWemWorksOpeningCardItem;
  };
  readonly sectionTitle: WhyWemWorksSectionTitleItem;
  readonly copy: readonly WhyWemWorksCopyItem[];
  readonly insightBlocks: readonly WhyWemWorksInsightBlock[];
  readonly proofPoints: readonly WhyWemWorksProofPoint[];
}

export interface WhyWemWorksSectionConfig {
  readonly videoUrl: string;
  readonly mobileVideoUrl: string;
  readonly fps: number;
  readonly totalFrames: number;
  readonly videoDuration: number;
  readonly contentItems: WhyWemWorksContentItems;
  readonly mobileVideoConfig?: MobileVideoConfig;
  readonly mobileVideoPan?: readonly MobileVideoPan[];
}
