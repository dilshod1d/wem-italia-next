import type { HeroSectionConfig } from "../types/hero-section";

export const heroStoryConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776096629/output_af6jf5.mp4",
  fps: 30,
  totalFrames: 150,
  videoDuration: 5,
  eyebrows: {
    intro: { text: "Website - SEO - Social - Promo - AI" },
    enterprise: { text: "WEM Enterprise" },
  },
  titles: {
    intro: {
      lines: ["Forget the Stress of Managing Your Online Presence."],
    },
    ecosystem: {
      lines: ["One Guide. An Entire Ecosystem Behind You."],
    },
  },
  bodyItems: [
    {
      key: "intro-growth",
      text: "I take care of everything you need to grow online.",
      fromFrame: 25,
      toFrame: 65,
      order: 1,
    },
    {
      key: "intro-focus",
      text: "You stay focused on your business.",
      fromFrame: 35,
      toFrame: 65,
      order: 2,
    },
    {
      key: "ecosystem-no-handoffs",
      text: "No more constant handoffs between different roles.",
      fromFrame: 92,
      toFrame: 126,
      order: 1,
    },
    {
      key: "ecosystem-single-contact",
      text: "You have a single point of contact managing Vision, Strategy, Execution, and Growth.",
      fromFrame: 105,
      toFrame: 126,
      order: 2,
    },
    {
      key: "ecosystem-scale",
      text: "Supporting this, an ecosystem built and validated at an international scale.",
      fromFrame: 126,
      toFrame: Number.POSITIVE_INFINITY,
      order: 1,
    },
  ],
  supportCards: {
    giovanni: {
      tone: "blue",
      icon: "giovanni",
      title: "ME, GIOVANNI COLANGELO",
      description:
        "I coordinate Direction, Priorities, Strategy, and Development.",
    },
    "wem-ai": {
      tone: "orange",
      icon: "wem-ai",
      title: "WEM AI",
      description:
        "The WEM Architecture that Optimizes, Simplifies, and Reduces costs.",
    },
    "wem-agency": {
      tone: "purple",
      icon: "wem-agency",
      title: "WEM Agency",
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
      endFrame: 35,
      eyebrowKey: "intro",
      titleKey: "intro",
      placementKey: "introLocked",
    },
    {
      id: 3,
      startFrame: 35,
      endFrame: 65,
      eyebrowKey: "intro",
      titleKey: "intro",
      placementKey: "introOpenHand",
    },
    {
      id: 4,
      startFrame: 65,
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
      endFrame: 100,
      eyebrowKey: "enterprise",
      titleKey: "ecosystem",
      placementKey: "ecosystemRaised",
    },
    {
      id: 7,
      startFrame: 100,
      endFrame: 126,
      eyebrowKey: "enterprise",
      titleKey: "ecosystem",
      supportCardKey: "giovanni",
      placementKey: "ecosystemCard",
    },
    {
      id: 8,
      startFrame: 126,
      endFrame: Number.POSITIVE_INFINITY,
      eyebrowKey: "enterprise",
      titleKey: "ecosystem",
      supportCardKey: "wem-ai",
      placementKey: "ecosystemCardLate",
    },
  ],
} satisfies HeroSectionConfig;
