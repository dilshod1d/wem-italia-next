import type { HeroSectionConfig } from "../types/hero-section";

export const heroStoryConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776096629/output_af6jf5.mp4",
  fps: 30,
  totalFrames: 150,
  videoDuration: 5,
  mobileVideoPan: [
    {
      startFrame: 0,
      endFrame: 150,
      fromX: -44,
      toX: -44,
      widthPercent: 180,
      description: "Fixed mobile framing for hero video.",
    },
  ],
  eyebrows: {
    intro: { text: "Sito Web - SEO - Social - Promo - AI" },
    enterprise: { text: "WEM Enterprise" },
  },
  titles: {
    intro: {
      lines: ["Dimentica lo Stress di gestire il Web"],
    },
    ecosystem: {
      lines: ["Una sola Guida un ecosistema alle spalle"],
    },
  },
  bodyItems: [
    {
      key: "intro-growth",
      text: "Mi occupo io di tutto ciò che serve per farti crescere online.",
      fromFrame: 25,
      toFrame: 65,
      order: 1,
    },
    {
      key: "intro-focus",
      text: " Tu resti concentrato sul tuo business.",
      fromFrame: 35,
      toFrame: 65,
      order: 2,
    },
    {
      key: "ecosystem-no-handoffs",
      text: "Niente passaggi continui tra figure diverse.",
      fromFrame: 75,
      toFrame: 110,
      order: 1,
    },
    {
      key: "ecosystem-single-contact",
      text: "Hai un solo referente che tiene insieme Visione, Strategia, Operatività e Crescita.",
      fromFrame: 85,
      toFrame: 110,
      order: 2,
    },
    {
      key: "ecosystem-scale",
      text: "A supporto, un ecosistema costruito e validato su scala internazionale.",
      fromFrame: 120,
      toFrame: Number.POSITIVE_INFINITY,
      order: 1,
    },
  ],
  supportCardItems: [
    {
      key: "giovanni-card",
      supportCardKey: "giovanni",
      fromFrame: 100,
      toFrame: 110,
      order: 1,
      placementKey: "ecosystemCard",
    },
    {
      key: "wem-ai-card",
      supportCardKey: "wem-ai",
      fromFrame: 126,
      toFrame: Number.POSITIVE_INFINITY,
      order: 1,
      placementKey: "ecosystemCardLate",
    },
  ],
  supportCards: {
    giovanni: {
      tone: "blue",
      icon: "giovanni",
      title: "IO, GIOVANNI COLANGELO",
      description: "Coordino Direzione, Priorità, Strategia e Sviluppo.",
    },
    "wem-ai": {
      tone: "orange",
      icon: "wem-ai",
      title: "WEM AI",
      description:
        "L’Architettura WEM che Ottimizza, Semplifica e Riduce i costi.",
    },
    "wem-agency": {
      tone: "purple",
      icon: "wem-agency",
      title: "WEM Agency",
      description: "Specialisti WEM attivati in base a ciò che serve davvero.",
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
      placementKey: "ecosystemCard",
    },
    {
      id: 8,
      startFrame: 126,
      endFrame: Number.POSITIVE_INFINITY,
      eyebrowKey: "enterprise",
      titleKey: "ecosystem",
      placementKey: "ecosystemCardLate",
    },
  ],
} satisfies HeroSectionConfig;
