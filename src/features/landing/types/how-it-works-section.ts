export type HowItWorksStageKey =
  | "intro"
  | "headline"
  | "context"
  | "analysis"
  | "direction"
  | "build"
  | "evolution";

export interface HowItWorksStage {
  readonly id: number;
  readonly key: HowItWorksStageKey;
  readonly start: number;
  readonly end: number;
}

export interface HowItWorksStep {
  readonly stage: Extract<
    HowItWorksStageKey,
    "analysis" | "direction" | "build" | "evolution"
  >;
  readonly title: string;
  readonly body: string;
  readonly toneClassName: string;
  readonly positionClassName: string;
  readonly zIndexClassName: string;
}

export interface HowItWorksCopy {
  readonly initialHeadline: string;
  readonly expandedHeadline: string;
  readonly subtitle: string;
  readonly description: string;
}

export interface HowItWorksSectionConfig {
  readonly videoUrl: string;
  readonly videoDuration: number;
  readonly lerpFactor: number;
  readonly scrollThreshold: number;
  readonly stages: readonly HowItWorksStage[];
  readonly copy: HowItWorksCopy;
  readonly steps: readonly HowItWorksStep[];
}
