import type { HeroSectionConfig } from "../types/hero-section";

export const heroStoryConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776096629/output_af6jf5.mp4",
  videoDuration: 4.2,
  segments: [
    { id: 1, start: 0, end: 1.02, text: "Forget the stress." },
    { id: 2, start: 1.02, end: 2.08, text: "We manage your online presence." },
    { id: 3, start: 2.08, end: 3.2, text: "You focus on your business." },
    {
      id: 4,
      start: 3.2,
      end: Number.POSITIVE_INFINITY,
      text: "Let's build your system.",
      kind: "cta",
      ctaLabel: "Get Started",
    },
  ],
} satisfies HeroSectionConfig;
