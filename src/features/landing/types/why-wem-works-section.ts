export type WhyWemWorksStageKey =
  | "intro"
  | "narrative"
  | "method"
  | "ai"
  | "proof";

export interface WhyWemWorksStage {
  readonly id: number;
  readonly key: WhyWemWorksStageKey;
  readonly start: number;
  readonly end: number;
}

export interface WhyWemWorksInsightBlock {
  readonly stage: Extract<WhyWemWorksStageKey, "method" | "ai">;
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

export interface WhyWemWorksProofPoint {
  readonly title: string;
  readonly color: string;
  readonly icon: WhyWemWorksProofPointIcon;
}

export interface WhyWemWorksSectionConfig {
  readonly videoUrl: string;
  readonly videoDuration: number;
  readonly stages: readonly WhyWemWorksStage[];
  readonly introTitle: string;
  readonly title: string;
  readonly leadParagraph: string;
  readonly resultParagraph: string;
  readonly blocks: readonly WhyWemWorksInsightBlock[];
  readonly proofPoints: readonly WhyWemWorksProofPoint[];
}
