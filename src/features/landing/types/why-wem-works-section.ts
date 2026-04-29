import type { HeroSupportCard } from "./hero-section";
import { MobileVideoPan } from "./mobile-frame-types";

export type WhyWemWorksStageKey =
  | "intro"
  | "narrative"
  | "method"
  | "ai"
  | "proof";

export type WhyWemWorksHandoffPhase = "copy" | "card" | "done";

export interface WhyWemWorksStage {
  readonly id: number;
  readonly key: WhyWemWorksStageKey;
  readonly startFrame: number;
  readonly endFrame: number;
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
  readonly titleLines: readonly string[];
  readonly color: string;
  readonly icon: WhyWemWorksProofPointIcon;
}

export interface WhyWemWorksHandoff {
  readonly cardAppearFrame: number;
  readonly endFrame: number;
  readonly eyebrow: string;
  readonly titleLines: readonly string[];
  readonly paragraphs: readonly string[];
  readonly supportCard: HeroSupportCard;
}

export interface WhyWemWorksSectionConfig {
  readonly videoUrl: string;
  readonly fps: number;
  readonly totalFrames: number;
  readonly videoDuration: number;
  readonly handoff: WhyWemWorksHandoff;
  readonly stages: readonly WhyWemWorksStage[];
  readonly introTitle: string;
  readonly title: string;
  readonly leadParagraph: string;
  readonly resultParagraph: string;
  readonly blocks: readonly WhyWemWorksInsightBlock[];
  readonly proofPoints: readonly WhyWemWorksProofPoint[];
  readonly mobileVideoPan?: readonly MobileVideoPan[];
}
