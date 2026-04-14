import type { SystemFlowSectionConfig } from "../types/system-flow-section";

export const systemFlowSectionConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776166093/v3_kk7e7f.mp4",
  videoDuration: 4.28,
  lerpFactor: 0.08,
  scrollThreshold: 0.8,
  stages: [
    { id: 1, key: "intro", start: 0, end: 0.8 },
    { id: 2, key: "title", start: 0.8, end: 1.6 },
    { id: 3, key: "body", start: 1.6, end: 2.4 },
    { id: 4, key: "step", start: 2.4, end: 3.2 },
    { id: 5, key: "budget", start: 3.2, end: 3.9 },
    { id: 6, key: "support", start: 3.9, end: Number.POSITIVE_INFINITY },
  ],
  eyebrow: "Come Funziona",
  title: "Paghi a Step.\nNo Vincoli – No Abbonamenti",
  paragraphs: [
    "La continuità si costruisce con il valore, non con i vincoli.",
    "Lavoriamo per costruire fiducia e risultati passo dopo passo.",
  ],
  cards: [
    {
      stage: "step",
      title: "STEP CHIARI",
      body: "Ogni fase viene definita e approvata in anticipo.",
      toneClassName: "bg-[#70C640]",
      positionClassName:
        "left-6 bottom-[20%] max-w-[720px] md:left-10 lg:left-16 lg:bottom-[15%]",
      zIndexClassName: "z-10",
    },
    {
      stage: "budget",
      title: "BUDGET TRASPARENTE",
      body: "La gestione del budget è legata ai risultati e approvata ad ogni step.",
      toneClassName: "bg-[#FF2A33]",
      positionClassName:
        "left-[34%] bottom-[10%] max-w-[860px] lg:left-[31%] lg:bottom-[8%]",
      zIndexClassName: "z-20",
    },
    {
      stage: "support",
      title: "SUPPORTO WEM",
      body: "Su specialisti e strumenti WEM si investe solo quando servono davvero.",
      toneClassName: "bg-[#2F7DEA]",
      positionClassName:
        "left-[10%] bottom-[2%] max-w-[760px] lg:left-[8%] lg:bottom-[1%]",
      zIndexClassName: "z-30",
    },
  ],
} satisfies SystemFlowSectionConfig;
