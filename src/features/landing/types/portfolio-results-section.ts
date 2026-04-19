export type PortfolioResultsStageKey =
  | "intro"
  | "headline"
  | "narrative"
  | "portfolio"
  | "focus"
  | "proof";

export interface PortfolioResultsStage {
  readonly id: number;
  readonly key: PortfolioResultsStageKey;
  readonly startFrame: number;
  readonly endFrame: number;
}

export interface PortfolioResultsCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly descriptionLines: readonly string[];
  readonly proofTitle: string;
  readonly proofCta: string;
}

export interface PortfolioResultsItem {
  readonly id: string;
  readonly title: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly footerLabel: string;
  readonly wrapperClassName: string;
  readonly shellClassName: string;
}

export interface PortfolioResultsMetric {
  readonly value: string;
  readonly label: string;
  readonly body: string;
  readonly borderClassName: string;
  readonly bandClassName: string;
}

export interface PortfolioResultsSectionConfig {
  readonly videoUrl: string;
  readonly fps: number;
  readonly totalFrames: number;
  readonly videoDuration: number;
  readonly focusItemId: string;
  readonly stages: readonly PortfolioResultsStage[];
  readonly copy: PortfolioResultsCopy;
  readonly portfolioItems: readonly PortfolioResultsItem[];
  readonly metrics: readonly PortfolioResultsMetric[];
}
