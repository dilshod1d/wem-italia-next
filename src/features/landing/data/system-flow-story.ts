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
        "left-0 right-4 top-0 sm:right-auto sm:w-[82%] lg:left-0 lg:top-0 lg:h-[42%] lg:w-[48%]",
      zIndexClassName: "z-10",
    },
    {
      stage: "budget",
      title: "TRANSPARENT BUDGET",
      body: "Budget management is tied to results and approved at every step.",
      toneClassName: "bg-brand-red",
      placementClassName:
        "left-[7%] right-4 top-[5.25rem] sm:left-[18%] sm:right-auto sm:top-[6rem] sm:w-[82%] md:top-[6.5rem] lg:left-[28%] lg:top-[28%] lg:h-[43%] lg:w-[64%]",
      zIndexClassName: "z-20",
    },
    {
      stage: "support",
      title: "WEM SUPPORT",
      body: "You invest in WEM specialists and tools only when they are truly needed.",
      toneClassName: "bg-brand-blue",
      placementClassName:
        "left-[4%] right-4 top-[10rem] sm:left-[8%] sm:right-auto sm:top-[11.25rem] sm:w-[82%] md:top-[13rem] lg:left-[6%] lg:top-[58%] lg:h-[42%] lg:w-[66%]",
      zIndexClassName: "z-30",
    },
  ],
} satisfies SystemFlowSectionConfig;
