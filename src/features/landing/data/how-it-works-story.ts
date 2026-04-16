import type { HowItWorksSectionConfig } from "../types/how-it-works-section";

export const howItWorksSectionConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776167362/v4_cv51vo.mp4",
  // videoDuration: 4.28,
  videoDuration: 5.013,
  stages: [
    { id: 1, key: "intro", start: 0, end: 0 },
    { id: 2, key: "headline", start: 0, end: 1.55 },
    { id: 3, key: "context", start: 1.55, end: 1.95 },
    { id: 4, key: "analysis", start: 1.95, end: 2.95 },
    { id: 5, key: "direction", start: 2.95, end: 3.65 },
    { id: 6, key: "build", start: 3.65, end: 4.3 },
    { id: 7, key: "evolution", start: 4.3, end: Number.POSITIVE_INFINITY },
  ],
  copy: {
    initialHeadline: "A Clear Path",
    expandedHeadline: "A Clear Path, from the Right Starting Point",
    subtitle: "No Standard Solutions",
    description:
      "We start from your real context, define direction and strategy, and build growth.",
  },
  steps: [
    {
      stage: "analysis",
      title: "Step 1: ANALYSIS",
      body: "I understand the starting point, the goals, and the priorities.",
      toneClassName: "bg-[#2F80ED] text-white",
      positionClassName:
        "left-4 right-4 top-0 md:left-8 md:right-8 lg:left-[13rem] lg:right-auto lg:w-[min(78vw,78rem)]",
      zIndexClassName: "z-[1]",
    },
    {
      stage: "direction",
      title: "Step 2: DIRECTION",
      body: "We define where to intervene first and what is needed.",
      toneClassName: "bg-[#72C840] text-white",
      positionClassName:
        "left-6 right-4 top-[6.25rem] md:left-14 md:right-6 lg:left-[21rem] lg:right-auto lg:w-[min(76vw,82rem)]",
      zIndexClassName: "z-[2]",
    },
    {
      stage: "build",
      title: "Step 3: BUILD",
      body: "We build what makes the most sense for the project.",
      toneClassName: "bg-[#FF3131] text-white",
      positionClassName:
        "left-8 right-4 top-[12.5rem] md:left-20 md:right-6 lg:left-[29rem] lg:right-auto lg:w-[min(74vw,82rem)]",
      zIndexClassName: "z-[3]",
    },
    {
      stage: "evolution",
      title: "Step 4: EVOLUTION",
      body: "We optimize and grow what works",
      toneClassName: "bg-[#6F3BEA] text-white",
      positionClassName:
        "left-10 right-4 top-[18.75rem] md:left-24 md:right-6 lg:left-[37rem] lg:right-auto lg:w-[min(72vw,84rem)]",
      zIndexClassName: "z-[4]",
    },
  ],
} satisfies HowItWorksSectionConfig;
