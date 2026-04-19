export type SystemFlowStageKey =
  | "intro"
  | "title"
  | "body"
  | "step"
  | "budget"
  | "support";

export interface SystemFlowStage {
  readonly id: number;
  readonly key: SystemFlowStageKey;
  readonly startFrame: number;
  readonly endFrame: number;
}

export interface SystemFlowCard {
  readonly stage: Extract<SystemFlowStageKey, "step" | "budget" | "support">;
  readonly title: string;
  readonly body: string;
  readonly toneClassName: string;
  readonly positionClassName: string;
  readonly zIndexClassName: string;
}

export interface SystemFlowSectionConfig {
  readonly videoUrl: string;
  readonly fps: number;
  readonly totalFrames: number;
  readonly videoDuration: number;
  readonly stages: readonly SystemFlowStage[];
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly cards: readonly SystemFlowCard[];
}
