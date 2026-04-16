import type { HeroSectionConfig } from "../types/hero-section";

function fromFrameCode(seconds: number, frames: number) {
  return seconds + frames / 50;
}

const DEFAULT_EYEBROW = "Sito Web - SEO - Social - Promo - AI";

export const heroStoryConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776096629/output_af6jf5.mp4",
  videoDuration: 5.013,
  segments: [
    {
      id: 1,
      start: 0,
      end: fromFrameCode(0, 25),
      text: "Dimentica lo Stress di gestire il Web",
      eyebrow: DEFAULT_EYEBROW,
      titleLines: ["Dimentica lo Stress", "di gestire il Web"],
    },
    {
      id: 2,
      start: fromFrameCode(0, 25),
      end: fromFrameCode(1, 11),
      text: "Dimentica lo Stress di gestire il Web",
      eyebrow: DEFAULT_EYEBROW,
      titleLines: ["Dimentica lo Stress", "di gestire il Web"],
      paragraphs: [
        "Mi occupo io di tutto cio che serve per farti crescere online.",
      ],
    },
    {
      id: 3,
      start: fromFrameCode(1, 11),
      end: fromFrameCode(1, 25),
      text: "Dimentica lo Stress di gestire il Web",
      eyebrow: DEFAULT_EYEBROW,
      titleLines: ["Dimentica lo Stress", "di gestire il Web"],
      paragraphs: [
        "Mi occupo io di tutto cio che serve per farti crescere online.",
        "Tu resti concentrato sul tuo business.",
      ],
    },
    {
      id: 4,
      start: fromFrameCode(1, 25),
      end: fromFrameCode(2, 10),
      text: "Transition",
      isTransition: true,
    },
    {
      id: 5,
      start: fromFrameCode(2, 10),
      end: fromFrameCode(3, 2),
      text: "Una sola Guida un ecosistema alle spalle",
      eyebrow: "WEM ENTERPRISE",
      titleLines: ["Una sola Guida", "un ecosistema alle spalle"],
    },
    {
      id: 6,
      start: fromFrameCode(3, 2),
      end: fromFrameCode(3, 15),
      text: "Una sola Guida un ecosistema alle spalle",
      titleLines: ["Una sola Guida", "un ecosistema alle spalle"],
      paragraphs: ["Niente passaggi continui tra figure diverse."],
      layout: "raised",
    },
    {
      id: 7,
      start: fromFrameCode(3, 15),
      end: fromFrameCode(4, 0),
      text: "Una sola Guida un ecosistema alle spalle",
      titleLines: ["Una sola Guida", "un ecosistema alle spalle"],
      paragraphs: [
        "Niente passaggi continui tra figure diverse.",
        "Hai un solo referente che tiene insieme Visione,",
        "Strategia, Operativita e Creativita.",
      ],
      layout: "raised",
    },
    {
      id: 8,
      start: fromFrameCode(4, 0),
      end: fromFrameCode(4, 13),
      text: "Una sola Guida un ecosistema alle spalle",
      titleLines: ["Una sola Guida", "un ecosistema alle spalle"],
      paragraphs: [
        "Niente passaggi continui tra figure diverse.",
        "Hai un solo referente che tiene insieme Visione,",
        "Strategia, Operativita e Creativita.",
      ],
      layout: "raised",
      supportCard: {
        tone: "blue",
        icon: "giovanni",
        title: "IO, GIOVANNI COLANGELO",
        description: "Coordino Direzione, Priorita, Strategia e Sviluppo.",
      },
    },
    {
      id: 9,
      start: fromFrameCode(4, 13),
      end: fromFrameCode(4, 24),
      text: "Una sola Guida un ecosistema alle spalle",
      titleLines: ["Una sola Guida", "un ecosistema alle spalle"],
      paragraphs: [
        "A supporto, un ecosistema costruito e",
        "validato su scala internazionale.",
      ],
      layout: "raised",
    },
    {
      id: 10,
      start: fromFrameCode(4, 24),
      end: 4.7,
      text: "Una sola Guida un ecosistema alle spalle",
      titleLines: ["Una sola Guida", "un ecosistema alle spalle"],
      paragraphs: [
        "A supporto, un ecosistema costruito e",
        "validato su scala internazionale.",
      ],
      layout: "raised",
      supportCard: {
        tone: "orange",
        icon: "wem-ai",
        title: "WEM AI",
        description: "L'Architettura WEM che Ottimizza, Semplifica e Riduce i costi.",
      },
    },
    {
      id: 11,
      start: 4.7,
      end: Number.POSITIVE_INFINITY,
      text: "Una sola Guida un ecosistema alle spalle",
      titleLines: ["Una sola Guida", "un ecosistema alle spalle"],
      paragraphs: [
        "A supporto, un ecosistema costruito e",
        "validato su scala internazionale.",
      ],
      layout: "raised",
      supportCard: {
        tone: "purple",
        icon: "wem-agency",
        title: "WEM AGENCY",
        description: "Specialisti WEM attivati in base a cio che serve davvero.",
      },
    },
  ],
} satisfies HeroSectionConfig;
