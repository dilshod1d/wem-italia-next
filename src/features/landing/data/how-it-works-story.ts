import type { HowItWorksSectionConfig } from "../types/how-it-works-section";

export const howItWorksSectionConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776167362/v4_cv51vo.mp4",
  fps: 30,
  totalFrames: 150,
  videoDuration: 5,
  stages: [
    { id: 1, key: "intro", startFrame: 0, endFrame: 0 },
    { id: 2, key: "headline", startFrame: 0, endFrame: 47 },
    { id: 3, key: "context", startFrame: 47, endFrame: 59 },
    { id: 4, key: "analysis", startFrame: 59, endFrame: 89 },
    { id: 5, key: "direction", startFrame: 89, endFrame: 110 },
    { id: 6, key: "build", startFrame: 110, endFrame: 129 },
    { id: 7, key: "evolution", startFrame: 129, endFrame: Number.POSITIVE_INFINITY },
  ],
  copy: {
    eyebrow: "Clear Process",
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
      toneClassName: "bg-brand-blue text-white",
      placementClassName:
        "left-4 right-4 top-0 md:left-8 md:right-8 lg:left-[13rem] lg:right-auto lg:w-[min(78vw,78rem)]",
      zIndexClassName: "z-[1]",
    },
    {
      stage: "direction",
      title: "Step 2: DIRECTION",
      body: "We define where to intervene first and what is needed.",
      toneClassName: "bg-brand-green text-white",
      placementClassName:
        "left-6 right-4 top-[6.25rem] md:left-14 md:right-6 lg:left-[21rem] lg:right-auto lg:w-[min(76vw,82rem)]",
      zIndexClassName: "z-[2]",
    },
    {
      stage: "build",
      title: "Step 3: BUILD",
      body: "We build what makes the most sense for the project.",
      toneClassName: "bg-brand-red text-white",
      placementClassName:
        "left-8 right-4 top-[12.5rem] md:left-20 md:right-6 lg:left-[29rem] lg:right-auto lg:w-[min(74vw,82rem)]",
      zIndexClassName: "z-[3]",
    },
    {
      stage: "evolution",
      title: "Step 4: EVOLUTION",
      body: "We optimize and grow what works",
      toneClassName: "bg-brand-purple text-white",
      placementClassName:
        "left-10 right-4 top-[18.75rem] md:left-24 md:right-6 lg:left-[37rem] lg:right-auto lg:w-[min(72vw,84rem)]",
      zIndexClassName: "z-[4]",
    },
  ],
} satisfies HowItWorksSectionConfig;
