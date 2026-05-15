import { landingVideoAssets } from "../../assets/video-assets";
import type { WhyWemWorksSectionConfig } from "./why-wem-works.types";

const { desktop: videoUrl, mobile: mobileVideoUrl } =
  landingVideoAssets.whyWemWorks;

export const whyWemWorksSectionConfig = {
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
      endFrame: 55,
      fromX: -44,
      toX: -44,
      fromY: 0,
      toY: 0,
      fromScale: 1,
      toScale: 1,
      description: "Start fixed on the right-side framing.",
    },
    {
      startFrame: 55,
      endFrame: 150,
      fromX: -44,
      toX: 0,
      fromY: 0,
      toY: 0,
      fromScale: 1,
      toScale: 1,
      description:
        "Follow character gradually moving left by returning toward center.",
    },
  ],
  contentItems: {
    opening: {
      header: {
        fromFrame: 0,
        toFrame: 32,
        eyebrow: "WEM Enterprise",
        titleLines: ["Una sola Guida un ecosistema alle spalle"],
      },
      body: [
        {
          key: "ecosystem-scale",
          fromFrame: 0,
          toFrame: 32,
          text: "A supporto, un ecosistema costruito e validato su scala internazionale.",
          order: 1,
        },
      ],
      card: {
        fromFrame: 5,
        toFrame: 32,
        card: {
          tone: "purple",
          icon: "wem-agency",
          title: "WEM Agency",
          description:
            "Specialisti WEM attivati in base a ciò che serve davvero.",
        },
      },
    },
    sectionTitle: {
      fromFrame: 32,
      toFrame: 105,
      text: "Perché Funziona",
    },
    copy: [
      {
        key: "lead",
        fromFrame: 32,
        toFrame: 105,
        text: "Gestione e Operatività sono semplificati da AI, strumenti evoluti e la rete di professionisti WEM.",
        order: 1,
      },
      {
        key: "result",
        fromFrame: 45,
        toFrame: 105,
        text: "Il risultato è un lavoro più efficiente e budget ottimizzato.",
        order: 2,
      },
    ],
    insightBlocks: [
      {
        stage: "method",
        fromFrame: 55,
        toFrame: 105,
        title: "LA FORZA DI VISIONE E METODO WEM",
        body: "Ogni progetto viene coordinato con il Modello WEM, progettato per integrare persone, strumenti e processi.",
        toneClassName: "bg-brand-blue",
      },
      {
        stage: "ai",
        fromFrame: 80,
        toFrame: 105,
        title: "I SUPER POTERI DELLE AI",
        body: "Le attività tecniche e ripetitive vengono gestite più velocemente grazie a strumenti avanzati e AI.",
        toneClassName: "bg-brand-red",
        offsetClassName: "lg:ml-14",
      },
    ],
    proofPoints: [
      {
        fromFrame: 105,
        toFrame: Number.POSITIVE_INFINITY,
        titleLines: ["PIÙ", "VELOCITÀ"],
        color: "bg-brand-green",
        icon: "speed",
      },
      {
        fromFrame: 105,
        toFrame: Number.POSITIVE_INFINITY,
        titleLines: ["Costi", "Ridotti"],
        color: "bg-brand-red",
        icon: "costs",
      },
      {
        fromFrame: 105,
        toFrame: Number.POSITIVE_INFINITY,
        titleLines: ["Scelte", "Chiare"],
        color: "bg-brand-blue",
        icon: "decisions",
      },
      {
        fromFrame: 105,
        toFrame: Number.POSITIVE_INFINITY,
        titleLines: ["Progetti", "Piu Solidi"],
        color: "bg-brand-purple",
        icon: "projects",
      },
    ],
  },
} satisfies WhyWemWorksSectionConfig;
