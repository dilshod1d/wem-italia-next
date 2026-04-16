export type HeroSupportCardTone = "blue" | "orange" | "purple";

export type HeroSupportCardIcon = "giovanni" | "wem-ai" | "wem-agency";

export type HeroSegmentLayout = "default" | "raised";

export interface HeroSupportCard {
  readonly title: string;
  readonly description: string;
  readonly tone: HeroSupportCardTone;
  readonly icon: HeroSupportCardIcon;
}

export interface HeroSegment {
  readonly id: number;
  readonly start: number;
  readonly end: number;
  readonly text: string;
  readonly eyebrow?: string;
  readonly titleLines?: readonly string[];
  readonly paragraphs?: readonly string[];
  readonly layout?: HeroSegmentLayout;
  readonly supportCard?: HeroSupportCard;
  readonly isTransition?: boolean;
}

export interface HeroSectionConfig {
  readonly videoUrl: string;
  readonly videoDuration: number;
  readonly segments: readonly HeroSegment[];
}
