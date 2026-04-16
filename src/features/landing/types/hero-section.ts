export type HeroSupportCardTone = "blue" | "orange" | "purple";

export type HeroSupportCardIcon = "giovanni" | "wem-ai" | "wem-agency";

export interface HeroEyebrow {
  readonly text: string;
}

export interface HeroTitle {
  readonly lines: readonly string[];
}

export interface HeroBody {
  readonly paragraphs: readonly string[];
}

export interface HeroSupportCard {
  readonly title: string;
  readonly description: string;
  readonly tone: HeroSupportCardTone;
  readonly icon: HeroSupportCardIcon;
}

export interface HeroStagePlacement {
  readonly copyClassName: string;
  readonly bodyClassName?: string;
  readonly cardWrapClassName?: string;
}

export interface HeroStage {
  readonly id: number;
  readonly start: number;
  readonly end: number;
  readonly eyebrowKey?: string;
  readonly titleKey?: string;
  readonly bodyKey?: string;
  readonly supportCardKey?: string;
  readonly placementKey: string;
}

export interface HeroSectionConfig {
  readonly videoUrl: string;
  readonly videoDuration: number;
  readonly eyebrows: Readonly<Record<string, HeroEyebrow>>;
  readonly titles: Readonly<Record<string, HeroTitle>>;
  readonly bodies: Readonly<Record<string, HeroBody>>;
  readonly supportCards: Readonly<Record<string, HeroSupportCard>>;
  readonly placements: Readonly<Record<string, HeroStagePlacement>>;
  readonly stages: readonly HeroStage[];
}
