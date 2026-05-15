import type {
  MobileVideoConfig,
  MobileVideoPan,
} from "../../types/mobile-frame-types";
import type { FrameWindow } from "../../utils/frame-window";

export type HeroSupportCardTone = "blue" | "orange" | "purple";

export type HeroSupportCardIcon = "giovanni" | "wem-ai" | "wem-agency";

export interface HeroSupportCard {
  readonly title: string;
  readonly description: string;
  readonly tone: HeroSupportCardTone;
  readonly icon: HeroSupportCardIcon;
}

export interface HeroBodyItem extends FrameWindow {
  readonly key: string;
  readonly text: string;
  readonly order: number;
}

export interface HeroSupportCardItem extends FrameWindow {
  readonly key: string;
  readonly card: HeroSupportCard;
  readonly order: number;
  readonly cardWrapClassName?: string;
}

export interface HeroHeaderItem extends FrameWindow {
  readonly key: string;
  readonly eyebrow?: string;
  readonly titleLines?: readonly string[];
  readonly copyClassName: string;
  readonly bodyClassName?: string;
}

export interface HeroContentItems {
  readonly headers: readonly HeroHeaderItem[];
  readonly body: readonly HeroBodyItem[];
  readonly supportCards: readonly HeroSupportCardItem[];
}

export interface HeroSectionConfig {
  readonly videoUrl: string;
  readonly mobileVideoUrl?: string;
  readonly fps: number;
  readonly totalFrames: number;
  readonly videoDuration: number;
  readonly contentItems: HeroContentItems;
  readonly mobileVideoConfig?: MobileVideoConfig;
  readonly mobileVideoPan?: readonly MobileVideoPan[];
}
