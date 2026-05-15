import type { HowItWorksSectionConfig } from "./how-it-works.types";
import { getMobileOptimizedVideoUrl } from "../../utils/video-url";

const videoUrl =
  "https://res.cloudinary.com/dcderdzpp/video/upload/v1778653607/video4v2_qtbu47.mp4";

export const howItWorksSectionConfig = {
  videoUrl,
  mobileVideoUrl: getMobileOptimizedVideoUrl(videoUrl),
  fps: 30,
  totalFrames: 150,
  videoDuration: 5,

  mobileVideoConfig: {
    objectFit: "cover",
    objectPosition: "center bottom",
    widthPercent: 240,
    heightPercent: 75,
    verticalAnchor: "bottom",
  },
  mobileVideoPan: [
    {
      startFrame: 0,
      endFrame: 95,
      fromX: -58,
      toX: 0,
      fromY: 0,
      toY: 0,
      fromScale: 1,
      toScale: 1,
      description:
        "Fast mobile camera pan from right-side framing to left-side framing before the character reaches the left edge.",
    },
    {
      startFrame: 95,
      endFrame: 150,
      fromX: 0,
      toX: 0,
      fromY: 0,
      toY: 0,
      fromScale: 1,
      toScale: 1,
      description: "Hold left-side framing after the fast pan.",
    },
  ],
  contentItems: {
    header: {
      fromFrame: 0,
      toFrame: 146,
      eyebrow: "Processo trasparente",
      title: "Un Percorso Chiaro, dal punto Giusto",
      subtitle: "Nessuna Soluzione Standard",
    },
    description: {
      fromFrame: 47,
      toFrame: 146,
      text:
        "Si parte dal tuo contesto reale, si definisce direzione e strategia, si costruisce la crescita.",
    },
    stepRail: {
      fromFrame: 0,
      toFrame: 146,
    },
    steps: [
      {
        stage: "analysis",
        fromFrame: 59,
        toFrame: 146,
        title: "Step 1: ANALISI",
        body: "Capisco il punto di partenza, gli obiettivi e le priorità.",
        toneClassName: "bg-brand-blue text-white",
        placementClassName:
          "left-4 right-4 top-0 md:left-8 md:right-8 lg:left-0 lg:right-auto lg:top-0 lg:w-[76%]",
        zIndexClassName: "z-[1]",
      },
      {
        stage: "direction",
        fromFrame: 84,
        toFrame: 146,
        title: "Step 2: DIREZIONE",
        body: "Definiamo dove intervenire prima e cosa serve davvero.",
        toneClassName: "bg-brand-green text-white",
        placementClassName:
          "left-6 right-4 top-[6.25rem] md:left-14 md:right-6 lg:left-[8%] lg:right-auto lg:top-[25%] lg:w-[76%]",
        zIndexClassName: "z-[2]",
      },
      {
        stage: "build",
        fromFrame: 104,
        toFrame: 146,
        title: "Step 3: COSTRUZIONE",
        body: "Realizziamo ciò che ha più senso per il progetto.",
        toneClassName: "bg-brand-red text-white",
        placementClassName:
          "left-8 right-4 top-[12.5rem] md:left-20 md:right-6 lg:left-[16%] lg:right-auto lg:top-[50%] lg:w-[76%]",
        zIndexClassName: "z-[3]",
      },
      {
        stage: "evolution",
        fromFrame: 120,
        toFrame: 146,
        title: "Step 4: EVOLUZIONE",
        body: "Ottimizziamo e facciamo crescere ciò che funziona.",
        toneClassName: "bg-brand-purple text-white",
        placementClassName:
          "left-10 right-4 top-[18.75rem] md:left-24 md:right-6 lg:left-[24%] lg:right-auto lg:top-[75%] lg:w-[76%]",
        zIndexClassName: "z-[4]",
      },
    ],
  },
} satisfies HowItWorksSectionConfig;
