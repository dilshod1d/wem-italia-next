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
  readonly startFrame: number;
  readonly endFrame: number;
}

export interface HowItWorksStep {
  readonly stage: Extract<
    HowItWorksStageKey,
    "analysis" | "direction" | "build" | "evolution"
  >;
  readonly title: string;
  readonly body: string;
  readonly toneClassName: string;
  readonly placementClassName: string;
  readonly zIndexClassName: string;
}

export interface HowItWorksCopy {
  readonly eyebrow: string;
  readonly initialHeadline: string;
  readonly subtitle: string;
  readonly description: string;
}

export interface HowItWorksSectionConfig {
  readonly videoUrl: string;
  readonly fps: number;
  readonly totalFrames: number;
  readonly videoDuration: number;
  readonly stages: readonly HowItWorksStage[];
  readonly copy: HowItWorksCopy;
  readonly steps: readonly HowItWorksStep[];
}
