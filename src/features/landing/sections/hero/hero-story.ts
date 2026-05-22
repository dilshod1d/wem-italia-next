import { landingVideoAssets } from "../../assets/video-assets";
import type { HeroSectionConfig } from "./hero.types";

const { desktop: videoUrl, mobile: mobileVideoUrl } = landingVideoAssets.hero;

export const heroStoryConfig = {
  videoUrl,
  mobileVideoUrl,
  fps: 30,
  totalFrames: 150,
  videoDuration: 5,
  mobileVideoConfig: {
    objectFit: "cover",
    objectPosition: "center bottom",
    widthPercent: 180,
    heightPercent: 75,
    verticalAnchor: "bottom",
  },
  mobileVideoPan: [
    {
      startFrame: 0,
      endFrame: 150,
      fromX: -44,
      toX: -44,
      fromY: 0,
      toY: 0,
      fromScale: 1,
      toScale: 1,
      description: "Fixed mobile framing for hero video.",
    },
  ],
  contentItems: {
    headers: [
      {
        key: "web-intro",
        fromFrame: 0,
        toFrame: 65,
        eyebrow: "Sito Web - SEO - Social - Promo - AI",
        titleLines: ["Dimentica lo Stress di gestire il Web"],
        copyClassName: "w-full",
        bodyClassName: "w-full",
      },
      {
        key: "enterprise",
        fromFrame: 70,
        toFrame: 149,
        eyebrow: "WEM Enterprise",
        titleLines: ["Una sola Guida un ecosistema alle spalle"],
        copyClassName: "w-full",
        bodyClassName: "w-full",
      },
    ],
    body: [
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
        toFrame: 125,
        order: 1,
      },
      {
        key: "ecosystem-single-contact",
        text: "Hai un solo referente che tiene insieme Visione, Strategia, Operatività e Crescita.",
        fromFrame: 85,
        toFrame: 125,
        order: 2,
      },
      {
        key: "ecosystem-scale",
        text: "A supporto, un ecosistema costruito e validato su scala internazionale.",
        fromFrame: 126,
        toFrame: 149,
        order: 1,
      },
    ],
    supportCards: [
      {
        key: "giovanni-card",
        card: {
          tone: "blue",
          icon: "giovanni",
          title: "IO, GIOVANNI COLANGELO",
          description: "Coordino Direzione, Priorità, Strategia e Sviluppo.",
        },
        fromFrame: 100,
        toFrame: 125,
        order: 1,
        cardWrapClassName: "mt-7 md:mt-8",
      },
      {
        key: "wem-ai-card",
        card: {
          tone: "orange",
          icon: "wem-ai",
          title: "WEM AI",
          description:
            "L’Architettura WEM che Ottimizza, Semplifica e Riduce i costi.",
        },
        fromFrame: 130,
        toFrame: 149,
        order: 1,
        cardWrapClassName: "mt-7 md:mt-8",
      },
    ],
  },
} satisfies HeroSectionConfig;
