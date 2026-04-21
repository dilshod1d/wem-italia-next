import type { SystemFlowSectionConfig } from "../types/system-flow-section";

export const systemFlowSectionConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776166093/v3_kk7e7f.mp4",
  fps: 30,
  totalFrames: 150,
  videoDuration: 5,
  stages: [
    { id: 1, key: "intro", startFrame: 0, endFrame: 90 },
    { id: 2, key: "title", startFrame: 90, endFrame: 95 },
    { id: 3, key: "body", startFrame: 95, endFrame: 104 },
    { id: 4, key: "step", startFrame: 104, endFrame: 122 },
    { id: 5, key: "budget", startFrame: 122, endFrame: 125 },
    {
      id: 6,
      key: "support",
      startFrame: 125,
      endFrame: Number.POSITIVE_INFINITY,
    },
  ],
  eyebrow: "How It Works",
  title: "Pay Per Step.\nNo Constraints - No Subscriptions",
  paragraphs: [
    "Continuity is built on value, not on constraints.",
    "We work to build trust and results step by step.",
  ],
  cards: [
    {
      stage: "step",
      title: "CLEAR STEPS",
      body: "Each phase is defined and approved in advance.",
      toneClassName: "bg-brand-green",
      placementClassName:
        "left-0 top-0 w-[min(92vw,40rem)] sm:w-[min(58vw,54rem)] md:w-[min(58vw,64rem)]",
      zIndexClassName: "z-10",
    },
    {
      stage: "budget",
      title: "TRANSPARENT BUDGET",
      body: "Budget management is tied to results and approved at every step.",
      toneClassName: "bg-brand-red",
      placementClassName:
        "left-[7%] top-[5.25rem] w-[min(92vw,42rem)] sm:left-[18%] sm:top-[6rem] sm:w-[min(60vw,64rem)] md:left-[22%] md:top-[6.5rem] md:w-[min(60vw,70rem)]",
      zIndexClassName: "z-20",
    },
    {
      stage: "support",
      title: "WEM SUPPORT",
      body: "You invest in WEM specialists and tools only when they are truly needed.",
      toneClassName: "bg-brand-blue",
      placementClassName:
        "left-[4%] top-[10rem] w-[min(92vw,44rem)] sm:left-[8%] sm:top-[11.25rem] sm:w-[min(62vw,68rem)] md:left-[8%] md:top-[13rem] md:w-[min(62vw,74rem)]",
      zIndexClassName: "z-30",
    },
  ],
} satisfies SystemFlowSectionConfig;
