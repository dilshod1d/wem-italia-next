export type WhoWeSupportStageKey =
  | "title"
  | "startups"
  | "professionals"
  | "smes"
  | "warning"
  | "final";

export interface WhoWeSupportStage {
  readonly id: number;
  readonly key: WhoWeSupportStageKey;
  readonly start: number;
  readonly end: number;
}

export type WhoWeSupportCardIcon = "startup" | "professional" | "sme";

export interface WhoWeSupportCard {
  readonly stage: Extract<
    WhoWeSupportStageKey,
    "startups" | "professionals" | "smes"
  >;
  readonly title: string;
  readonly body: string;
  readonly icon: WhoWeSupportCardIcon;
}

export interface WhoWeSupportCopy {
  readonly eyebrow: string;
  readonly title: string;
  readonly warningTitle: string;
  readonly warningBody: string;
}

export interface WhoWeSupportSectionConfig {
  readonly stages: readonly WhoWeSupportStage[];
  readonly copy: WhoWeSupportCopy;
  readonly cards: readonly WhoWeSupportCard[];
}
