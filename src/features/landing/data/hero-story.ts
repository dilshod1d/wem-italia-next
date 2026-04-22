import type { HeroSectionConfig } from "../types/hero-section";

export const heroStoryConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776096629/output_af6jf5.mp4",
  fps: 30,
  totalFrames: 150,
  videoDuration: 5,
  eyebrows: {
    intro: { text: "Website - SEO - Social - Promo - AI" },
    enterprise: { text: "WEM ENTERPRISE" },
  },
  titles: {
    intro: {
      lines: ["Forget the Stress of Managing the Web"],
    },
    ecosystem: {
      lines: ["One Guide with an ecosystem behind you"],
    },
  },
  bodyItems: [
    {
      key: "intro-growth",
      text: "I handle everything needed to help you grow online.",
      fromFrame: 25,
      toFrame: 55,
      order: 1,
    },
    {
      key: "intro-focus",
      text: "You stay focused on your business.",
      fromFrame: 41,
      toFrame: 55,
      order: 2,
    },
    {
      key: "ecosystem-no-handoffs",
      text: "No constant handoffs between different people.",
      fromFrame: 92,
      toFrame: 120,
      order: 1,
    },
    {
      key: "ecosystem-support-1",
      text: "Supporting that is an ecosystem built and",
      fromFrame: 120,
      toFrame: Number.POSITIVE_INFINITY,
      order: 1,
    },
    {
      key: "ecosystem-support-2",
      text: "validated on an international scale.",
      fromFrame: 120,
      toFrame: Number.POSITIVE_INFINITY,
      order: 2,
    },
  ],
  supportCards: {
    giovanni: {
      tone: "blue",
      icon: "giovanni",
      title: "I'M GIOVANNI COLANGELO",
      description:
        "I coordinate Direction, Priorities, Strategy, and Development.",
    },
    "wem-ai": {
      tone: "orange",
      icon: "wem-ai",
      title: "WEM AI",
      description:
        "The WEM architecture that optimizes, simplifies, and reduces costs.",
    },
    "wem-agency": {
      tone: "purple",
      icon: "wem-agency",
      title: "WEM AGENCY",
      description: "WEM specialists activated based on what is truly needed.",
    },
  },
  placements: {
    introLocked: {
      copyClassName: "max-w-full",
      bodyClassName: "w-full",
    },
    introOpenHand: {
      copyClassName: "w-full",
      bodyClassName: "w-full",
    },
    blank: {
      copyClassName: "w-full",
    },
    ecosystemAnchor: {
      copyClassName: "w-full",
      bodyClassName: "w-full",
    },
    ecosystemRaised: {
      copyClassName: "w-full",
      bodyClassName: "w-full",
      cardWrapClassName: "mt-7 md:mt-8",
    },
    ecosystemCard: {
      copyClassName: "w-full",
      bodyClassName: "w-full",
      cardWrapClassName: "mt-7 md:mt-8",
    },
    ecosystemCardLate: {
      copyClassName: "w-full",
      bodyClassName: "w-full",
      cardWrapClassName: "mt-7 md:mt-8",
    },
  },
  stages: [
    {
      id: 1,
      startFrame: 0,
      endFrame: 25,
      eyebrowKey: "intro",
      titleKey: "intro",
      placementKey: "introLocked",
    },
    {
      id: 2,
      startFrame: 25,
      endFrame: 41,
      eyebrowKey: "intro",
      titleKey: "intro",
      placementKey: "introLocked",
    },
    {
      id: 3,
      startFrame: 41,
      endFrame: 55,
      eyebrowKey: "intro",
      titleKey: "intro",
      placementKey: "introOpenHand",
    },
    {
      id: 4,
      startFrame: 55,
      endFrame: 70,
      placementKey: "blank",
    },
    {
      id: 5,
      startFrame: 70,
      endFrame: 92,
      eyebrowKey: "enterprise",
      titleKey: "ecosystem",
      placementKey: "ecosystemAnchor",
    },
    {
      id: 6,
      startFrame: 92,
      endFrame: 105,
      eyebrowKey: "enterprise",
      titleKey: "ecosystem",
      placementKey: "ecosystemRaised",
    },
    {
      id: 7,
      startFrame: 105,
      endFrame: 120,
      eyebrowKey: "enterprise",
      titleKey: "ecosystem",
      placementKey: "ecosystemRaised",
    },
    {
      id: 8,
      startFrame: 100,
      endFrame: 133,
      eyebrowKey: "enterprise",
      titleKey: "ecosystem",
      supportCardKey: "giovanni",
      placementKey: "ecosystemCard",
    },
    {
      id: 9,
      startFrame: 133,
      endFrame: 144,
      eyebrowKey: "enterprise",
      titleKey: "ecosystem",
      placementKey: "ecosystemCardLate",
    },
    {
      id: 10,
      startFrame: 144,
      endFrame: Number.POSITIVE_INFINITY,
      eyebrowKey: "enterprise",
      titleKey: "ecosystem",
      supportCardKey: "wem-ai",
      placementKey: "ecosystemCardLate",
    },
  ],
} satisfies HeroSectionConfig;
