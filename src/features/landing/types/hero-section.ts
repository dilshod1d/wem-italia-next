export type HeroSegmentKind = "message" | "cta";

export interface HeroSegment {
  readonly id: number;
  readonly start: number;
  readonly end: number;
  readonly text: string;
  readonly kind?: HeroSegmentKind;
  readonly ctaLabel?: string;
}

export interface HeroSectionConfig {
  readonly videoUrl: string;
  readonly videoDuration: number;
  readonly lerpFactor: number;
  readonly scrollThreshold: number;
  readonly segments: readonly HeroSegment[];
}
