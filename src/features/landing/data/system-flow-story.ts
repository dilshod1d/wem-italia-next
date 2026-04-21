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
    { id: 6, key: "support", startFrame: 125, endFrame: Number.POSITIVE_INFINITY },
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
        "left-6 bottom-[25%] max-w-[720px] md:left-10 lg:left-16 lg:bottom-[20%]",
      zIndexClassName: "z-10",
    },
    {
      stage: "budget",
      title: "TRANSPARENT BUDGET",
      body: "Budget management is tied to results and approved at every step.",
      toneClassName: "bg-brand-red",
      placementClassName:
        "left-[34%] bottom-[15%] max-w-[860px] lg:left-[31%] lg:bottom-[13%]",
      zIndexClassName: "z-20",
    },
    {
      stage: "support",
      title: "WEM SUPPORT",
      body: "You invest in WEM specialists and tools only when they are truly needed.",
      toneClassName: "bg-brand-blue",
      placementClassName:
        "left-[10%] bottom-[7%] max-w-[760px] lg:left-[8%] lg:bottom-[6%]",
      zIndexClassName: "z-30",
    },
  ],
} satisfies SystemFlowSectionConfig;
