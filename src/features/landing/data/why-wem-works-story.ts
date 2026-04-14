import type { WhyWemWorksSectionConfig } from "../types/why-wem-works-section";

export const whyWemWorksSectionConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776161487/v2_ic3fty.mp4",
  videoDuration: 5.013,
  lerpFactor: 0.08,
  scrollThreshold: 0.8,
  stages: [
    { id: 1, key: "intro", start: 0, end: 1.02 },
    { id: 2, key: "narrative", start: 1.02, end: 2.08 },
    { id: 3, key: "method", start: 2.08, end: 3.2 },
    { id: 4, key: "ai", start: 3.2, end: 4.05 },
    { id: 5, key: "proof", start: 4.05, end: Number.POSITIVE_INFINITY },
  ],
  introTitle: "Why WEM Works",
  title: "Why WEM Works",
  leadParagraph:
    "Management and execution are streamlined through AI, advanced tools, and the WEM professional network.",
  resultParagraph: "The result is more efficient work and reduced costs.",
  blocks: [
    {
      stage: "method",
      title: "The Strength of WEM Vision and Method",
      body: "Every project is coordinated using the WEM Model, designed to integrate people, tools, and processes.",
      toneClassName: "bg-[#2E7DEA]",
    },
    {
      stage: "ai",
      title: "The Superpowers of AI",
      body: "Technical and repetitive tasks are handled faster thanks to advanced tools and AI.",
      toneClassName: "bg-[#FF2A33]",
      offsetClassName: "lg:ml-14",
    },
  ],
  proofPoints: [
    {
      title: "Greater speed",
      color: "bg-[#6DC441]",
      icon: "speed",
    },
    {
      title: "Reduced costs",
      color: "bg-[#FF2A33]",
      icon: "costs",
    },
    {
      title: "Clearer decisions",
      color: "bg-[#2E7DEA]",
      icon: "decisions",
    },
    {
      title: "Stronger projects",
      color: "bg-[#7442E8]",
      icon: "projects",
    },
  ],
} satisfies WhyWemWorksSectionConfig;
