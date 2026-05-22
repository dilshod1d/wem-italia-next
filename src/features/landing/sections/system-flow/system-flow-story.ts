import { landingVideoAssets } from "../../assets/video-assets";
import type { SystemFlowSectionConfig } from "./system-flow.types";

const { desktop: videoUrl, mobile: mobileVideoUrl } =
  landingVideoAssets.systemFlow;

export const systemFlowSectionConfig = {
  videoUrl,
  mobileVideoUrl,
  fps: 30,
  totalFrames: 150,
  videoDuration: 5,
  mobileVideoConfig: {
    objectFit: "cover",
    objectPosition: "center bottom",
    widthPercent: 240,
    heightPercent: 75,
    verticalAnchor: "bottom",
  },
  mobileVideoPan: [
    {
      startFrame: 0,
      endFrame: 30,
      fromX: -10,
      toX: -10,
      fromY: 0,
      toY: 0,
      fromScale: 1,
      toScale: 1,
    },
    {
      startFrame: 30,
      endFrame: 90,
      fromX: -10,
      toX: -58,
      fromY: 0,
      toY: 0,
      fromScale: 1,
      toScale: 1,
      description:
        "More aggressive pan right earlier to keep character in frame.",
    },
    {
      startFrame: 90,
      endFrame: 150,
      fromX: -58,
      toX: -58,
      fromY: 0,
      toY: 0,
      fromScale: 1,
      toScale: 1,
    },
  ],
  contentItems: {
    header: {
      fromFrame: 60,
      toFrame: Number.POSITIVE_INFINITY,
      eyebrow: "Come Funziona",
      title: "Paghi a Step. \nNo Vincoli - No Abbonamenti",
    },
    body: [
      {
        key: "value",
        fromFrame: 75,
        toFrame: Number.POSITIVE_INFINITY,
        text: "La continuità si costruisce con il valore, non con i vincoli.",
        order: 1,
      },
      {
        key: "trust",
        fromFrame: 90,
        toFrame: Number.POSITIVE_INFINITY,
        text: "Lavoriamo per costruire fiducia e risultati passo dopo passo.",
        order: 2,
      },
    ],
    cards: [
      {
        stage: "step",
        fromFrame: 95,
        toFrame: Number.POSITIVE_INFINITY,
        icon: "steps",
        title: "STEP CHIARI",
        body: "Ogni fase viene definita e approvata in anticipo.",
        toneClassName: "bg-brand-green",
        placementClassName:
          "left-0 right-0 top-0 w-full lg:left-0 lg:right-auto lg:top-0  lg:w-[58%]",
        zIndexClassName: "z-10",
      },
      {
        stage: "budget",
        fromFrame: 113,
        toFrame: Number.POSITIVE_INFINITY,
        icon: "budget",
        title: "BUDGET TRASPARENTE",
        body: "La gestione del budget è legata ai risultati e approvata ad ogni step",
        toneClassName: "bg-brand-red",
        placementClassName:
          "left-0 right-0 top-[3.9rem] w-full lg:left-[28%] lg:right-auto lg:top-[28%] lg:w-[75%]",
        zIndexClassName: "z-20",
      },
      {
        stage: "support",
        fromFrame: 131,
        toFrame: Number.POSITIVE_INFINITY,
        icon: "support",
        title: "SUPPORTO WEM",
        body: "Su specialisti e strumenti WEM si investe solo quando servono davvero.",
        toneClassName: "bg-brand-blue",
        placementClassName:
          "left-0 right-0 top-[7.8rem] w-full lg:left-[6%] lg:right-auto lg:top-[58%] lg:w-[75%]",
        zIndexClassName: "z-30",
      },
    ],
  },
} satisfies SystemFlowSectionConfig;
