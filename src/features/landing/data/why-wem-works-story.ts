import type { WhyWemWorksSectionConfig } from "../types/why-wem-works-section";

export const whyWemWorksSectionConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776161487/v2_ic3fty.mp4",
  fps: 30,
  totalFrames: 150,
  videoDuration: 5,
  handoff: {
    cardAppearFrame: 5,
    endFrame: 32,
    eyebrow: "WEM ENTERPRISE",
    titleLines: ["One Guide with an ecosystem behind you"],
    paragraphs: [
      "Supporting that is an ecosystem built and",
      "validated on an international scale.",
    ],
    supportCard: {
      tone: "purple",
      icon: "wem-agency",
      title: "WEM AGENCY",
      description: "WEM specialists activated based on what is truly needed.",
    },
  },
  stages: [
    { id: 1, key: "intro", startFrame: 0, endFrame: 48 },
    { id: 2, key: "narrative", startFrame: 48, endFrame: 68 },
    { id: 3, key: "method", startFrame: 68, endFrame: 110 },
    { id: 4, key: "ai", startFrame: 110, endFrame: 125 },
    {
      id: 5,
      key: "proof",
      startFrame: 125,
      endFrame: Number.POSITIVE_INFINITY,
    },
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
      toneClassName: "bg-brand-blue",
    },
    {
      stage: "ai",
      title: "The Superpowers of AI",
      body: "Technical and repetitive tasks are handled faster thanks to advanced tools and AI.",
      toneClassName: "bg-brand-red",
      offsetClassName: "lg:ml-14",
    },
  ],
  proofPoints: [
    {
      title: "Greater speed",
      color: "bg-brand-green",
      icon: "speed",
    },
    {
      title: "Reduced costs",
      color: "bg-brand-red",
      icon: "costs",
    },
    {
      title: "Clearer decisions",
      color: "bg-brand-blue",
      icon: "decisions",
    },
    {
      title: "Stronger projects",
      color: "bg-brand-purple",
      icon: "projects",
    },
  ],
} satisfies WhyWemWorksSectionConfig;
