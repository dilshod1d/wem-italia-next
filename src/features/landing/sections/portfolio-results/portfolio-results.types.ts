import type {
  MobileVideoConfig,
  MobileVideoPan,
} from "../../types/mobile-frame-types";
import type { FrameWindow } from "../../utils/frame-window";

export interface PortfolioResultsHeaderItem extends FrameWindow {
  readonly eyebrow: string;
  readonly title: string;
}

export interface PortfolioResultsDescriptionItem extends FrameWindow {
  readonly key: string;
  readonly text: string;
  readonly order: number;
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
  readonly labelTextClassName?: string;
}

export interface PortfolioResultsPortfolioRail extends FrameWindow {
  readonly items: readonly PortfolioResultsItem[];
}

export interface PortfolioResultsFocusItem extends FrameWindow {
  readonly itemId: string;
}

export interface PortfolioResultsProofSection {
  readonly eyebrow: string;
  readonly title: string;
  readonly cta: string;
}

export interface PortfolioResultsContentItems {
  readonly header: PortfolioResultsHeaderItem;
  readonly description: readonly PortfolioResultsDescriptionItem[];
  readonly portfolio: {
    readonly rail: PortfolioResultsPortfolioRail;
    readonly focusItem: PortfolioResultsFocusItem;
  };
  readonly proof: {
    readonly section: PortfolioResultsProofSection;
    readonly metrics: readonly PortfolioResultsMetric[];
  };
}

export interface PortfolioResultsSectionConfig {
  readonly videoUrl: string;
  readonly mobileVideoUrl: string;
  readonly fps: number;
  readonly totalFrames: number;
  readonly videoDuration: number;
  readonly contentItems: PortfolioResultsContentItems;
  readonly mobileVideoConfig?: MobileVideoConfig;
  readonly mobileVideoPan?: readonly MobileVideoPan[];
}
