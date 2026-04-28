export type HeroSupportCardTone = "blue" | "orange" | "purple";

export type HeroSupportCardIcon = "giovanni" | "wem-ai" | "wem-agency";

export interface HeroEyebrow {
  readonly text: string;
}

export interface HeroTitle {
  readonly lines: readonly string[];
}

export interface HeroSupportCard {
  readonly title: string;
  readonly description: string;
  readonly tone: HeroSupportCardTone;
  readonly icon: HeroSupportCardIcon;
}

export interface HeroBodyItem {
  readonly key: string;
  readonly text: string;
  readonly fromFrame: number;
  readonly toFrame: number;
  readonly order: number;
}

export interface HeroSupportCardItem {
  readonly key: string;
  readonly supportCardKey: string;
  readonly fromFrame: number;
  readonly toFrame: number;
  readonly order: number;
  readonly placementKey?: string;
}

export interface HeroStagePlacement {
  readonly copyClassName: string;
  readonly bodyClassName?: string;
  readonly cardWrapClassName?: string;
}

export interface HeroStage {
  readonly id: number;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly eyebrowKey?: string;
  readonly titleKey?: string;
  readonly placementKey: string;
}

export interface HeroSectionConfig {
  readonly videoUrl: string;
  readonly fps: number;
  readonly totalFrames: number;
  readonly videoDuration: number;
  readonly eyebrows: Readonly<Record<string, HeroEyebrow>>;
  readonly titles: Readonly<Record<string, HeroTitle>>;
  readonly bodyItems: readonly HeroBodyItem[];
  readonly supportCardItems: readonly HeroSupportCardItem[];
  readonly supportCards: Readonly<Record<string, HeroSupportCard>>;
  readonly placements: Readonly<Record<string, HeroStagePlacement>>;
  readonly stages: readonly HeroStage[];
}
