import type { HeroSectionConfig } from "../types/hero-section";

function fromFrameCode(seconds: number, frames: number) {
  return seconds + frames / 50;
}

export const heroStoryConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776096629/output_af6jf5.mp4",
  videoDuration: 5.013,
  eyebrows: {
    intro: { text: "Website - SEO - Social - Promo - AI" },
    enterprise: { text: "WEM ENTERPRISE" },
  },
  titles: {
    intro: {
      lines: ["Forget the Stress", "of Managing the Web"],
    },
    ecosystem: {
      lines: ["One Guide", "with an ecosystem behind you"],
    },
  },
  bodies: {
    introLead: {
      paragraphs: ["I handle everything needed to help you grow online."],
    },
    introFull: {
      paragraphs: [
        "I handle everything needed to help you grow online.",
        "You stay focused on your business.",
      ],
    },
    ecosystemLead: {
      paragraphs: ["No constant handoffs between different people."],
    },
    ecosystemFull: {
      paragraphs: [
        "No constant handoffs between different people.",
        "You have one point of contact who keeps Vision,",
        "Strategy, Operations, and Creativity together.",
      ],
    },
    ecosystemSupport: {
      paragraphs: [
        "Supporting that is an ecosystem built and",
        "validated on an international scale.",
      ],
    },
  },
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
      copyClassName:
        "max-w-[34rem] -translate-y-8 md:-translate-y-10 lg:-translate-y-12",
      bodyClassName: "max-w-[22rem]",
    },
    introOpenHand: {
      copyClassName:
        "max-w-[34rem] -translate-y-10 md:-translate-y-12 lg:-translate-y-10",
      bodyClassName: "max-w-[22rem]",
    },
    blank: {
      copyClassName: "max-w-[34rem] -translate-y-8 md:-translate-y-10",
    },
    ecosystemAnchor: {
      copyClassName:
        "max-w-[35rem] -translate-y-10 md:-translate-y-12 lg:-translate-y-10",
      bodyClassName: "max-w-[24rem]",
    },
    ecosystemRaised: {
      copyClassName:
        "max-w-[37rem] -translate-y-20 md:-translate-y-24 lg:-translate-y-24",
      bodyClassName: "max-w-[28rem]",
      cardWrapClassName: "mt-7 md:mt-8",
    },
    ecosystemCard: {
      copyClassName:
        "max-w-[37rem] -translate-y-14 md:-translate-y-16 lg:-translate-y-14",
      bodyClassName: "max-w-[28rem]",
      cardWrapClassName: "mt-7 md:mt-8",
    },
    ecosystemCardLate: {
      copyClassName:
        "max-w-[37rem] -translate-y-12 md:-translate-y-14 lg:-translate-y-12",
      bodyClassName: "max-w-[28rem]",
      cardWrapClassName: "mt-7 md:mt-8",
    },
  },
  stages: [
    {
      id: 1,
      start: 0,
      end: fromFrameCode(0, 25),
      eyebrowKey: "intro",
      titleKey: "intro",
      placementKey: "introLocked",
    },
    {
      id: 2,
      start: fromFrameCode(0, 25),
      end: fromFrameCode(1, 11),
      eyebrowKey: "intro",
      titleKey: "intro",
      bodyKey: "introLead",
      placementKey: "introLocked",
    },
    {
      id: 3,
      start: fromFrameCode(1, 11),
      end: fromFrameCode(1, 25),
      eyebrowKey: "intro",
      titleKey: "intro",
      bodyKey: "introFull",
      placementKey: "introOpenHand",
    },
    {
      id: 4,
      start: fromFrameCode(1, 25),
      end: fromFrameCode(2, 10),
      placementKey: "blank",
    },
    {
      id: 5,
      start: fromFrameCode(2, 10),
      end: fromFrameCode(3, 2),
      eyebrowKey: "enterprise",
      titleKey: "ecosystem",
      placementKey: "ecosystemAnchor",
    },
    {
      id: 6,
      start: fromFrameCode(3, 2),
      end: fromFrameCode(3, 15),
      titleKey: "ecosystem",
      bodyKey: "ecosystemLead",
      placementKey: "ecosystemRaised",
    },
    {
      id: 7,
      start: fromFrameCode(3, 15),
      end: fromFrameCode(4, 0),
      titleKey: "ecosystem",
      bodyKey: "ecosystemFull",
      placementKey: "ecosystemRaised",
    },
    {
      id: 8,
      start: fromFrameCode(4, 0),
      end: fromFrameCode(4, 13),
      titleKey: "ecosystem",
      bodyKey: "ecosystemFull",
      supportCardKey: "giovanni",
      placementKey: "ecosystemCard",
    },
    {
      id: 9,
      start: fromFrameCode(4, 13),
      end: fromFrameCode(4, 24),
      titleKey: "ecosystem",
      bodyKey: "ecosystemSupport",
      placementKey: "ecosystemRaised",
    },
    {
      id: 10,
      start: fromFrameCode(4, 24),
      end: 4.7,
      titleKey: "ecosystem",
      bodyKey: "ecosystemSupport",
      supportCardKey: "wem-ai",
      placementKey: "ecosystemCard",
    },
    {
      id: 11,
      start: 4.7,
      end: Number.POSITIVE_INFINITY,
      titleKey: "ecosystem",
      bodyKey: "ecosystemSupport",
      supportCardKey: "wem-agency",
      placementKey: "ecosystemCardLate",
    },
  ],
} satisfies HeroSectionConfig;
