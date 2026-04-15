import type { SystemFlowSectionConfig } from "../types/system-flow-section";

export const systemFlowSectionConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776166093/v3_kk7e7f.mp4",
  videoDuration: 4.28,
  stages: [
    { id: 1, key: "intro", start: 0, end: 0.8 },
    { id: 2, key: "title", start: 0.8, end: 1.6 },
    { id: 3, key: "body", start: 1.6, end: 2.4 },
    { id: 4, key: "step", start: 2.4, end: 3.2 },
    { id: 5, key: "budget", start: 3.2, end: 3.9 },
    { id: 6, key: "support", start: 3.9, end: Number.POSITIVE_INFINITY },
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
      toneClassName: "bg-[#70C640]",
      positionClassName:
        "left-6 bottom-[20%] max-w-[720px] md:left-10 lg:left-16 lg:bottom-[15%]",
      zIndexClassName: "z-10",
    },
    {
      stage: "budget",
      title: "TRANSPARENT BUDGET",
      body: "Budget management is tied to results and approved at every step.",
      toneClassName: "bg-[#FF2A33]",
      positionClassName:
        "left-[34%] bottom-[10%] max-w-[860px] lg:left-[31%] lg:bottom-[8%]",
      zIndexClassName: "z-20",
    },
    {
      stage: "support",
      title: "WEM SUPPORT",
      body: "You invest in WEM specialists and tools only when they are truly needed.",
      toneClassName: "bg-[#2F7DEA]",
      positionClassName:
        "left-[10%] bottom-[2%] max-w-[760px] lg:left-[8%] lg:bottom-[1%]",
      zIndexClassName: "z-30",
    },
  ],
} satisfies SystemFlowSectionConfig;
