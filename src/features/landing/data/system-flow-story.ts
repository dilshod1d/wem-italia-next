import type { SystemFlowSectionConfig } from "../types/system-flow-section";

export const systemFlowSectionConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776166093/v3_kk7e7f.mp4",
  fps: 30,
  totalFrames: 150,
  videoDuration: 5,
  mobileVideoPan: [
    {
      startFrame: 0,
      endFrame: 30,
      fromX: 0,
      toX: 0,
      widthPercent: 180,
    },
    {
      startFrame: 30,
      endFrame: 90,
      fromX: 0,
      toX: -58,
      widthPercent: 240,
      description:
        "More aggressive pan right earlier to keep character in frame.",
    },
    {
      startFrame: 90,
      endFrame: 150,
      fromX: -58,
      toX: -58,
      widthPercent: 240,
    },
  ],
  stages: [
    { id: 1, key: "intro", startFrame: 0, endFrame: 60 }, // 2s
    { id: 2, key: "title", startFrame: 60, endFrame: 75 }, // 0.5s
    { id: 3, key: "body", startFrame: 75, endFrame: 95 }, // ~0.7s

    { id: 4, key: "step", startFrame: 95, endFrame: 113 }, // ~0.6s
    { id: 5, key: "budget", startFrame: 113, endFrame: 131 }, // ~0.6s
    {
      id: 6,
      key: "support",
      startFrame: 131,
      endFrame: 150,
    },
  ],
  eyebrow: "Come Funziona",
  title: "Paghi a Step. \nNo Vincoli - No Abbonamenti",
  paragraphs: [
    "La continuità si costruisce con il valore, non con i vincoli.",
    "Lavoriamo per costruire fiducia e risultati passo dopo passo.",
  ],
  cards: [
    {
      stage: "step",
      icon: "steps",
      title: "STEP CHIARI",
      body: "Ogni fase viene definita e approvata in anticipo.",
      toneClassName: "bg-brand-green",
      placementClassName:
        "left-0 right-0 top-0 w-full lg:left-0 lg:right-auto lg:top-0 lg:h-[42%] lg:w-[48%]",
      zIndexClassName: "z-10",
    },
    {
      stage: "budget",
      icon: "budget",
      title: "BUDGET TRASPARENTE",
      body: "La gestione del budget è legata ai risultati e approvata ad ogni step",
      toneClassName: "bg-brand-red",
      placementClassName:
        "left-0 right-0 top-[3.9rem] w-full lg:left-[28%] lg:right-auto lg:top-[28%] lg:h-[43%] lg:w-[64%]",
      zIndexClassName: "z-20",
    },
    {
      stage: "support",
      icon: "support",
      title: "SUPPORTO WEM",
      body: "Su specialisti e strumenti WEM si investe solo quando servono davvero.",
      toneClassName: "bg-brand-blue",
      placementClassName:
        "left-0 right-0 top-[7.8rem] w-full lg:left-[6%] lg:right-auto lg:top-[58%] lg:h-[42%] lg:w-[66%]",
      zIndexClassName: "z-30",
    },
  ],
} satisfies SystemFlowSectionConfig;
