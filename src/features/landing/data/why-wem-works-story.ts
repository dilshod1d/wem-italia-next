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
    eyebrow: "WEM Enterprise",
    titleLines: ["Una sola Guida un ecosistema alle spalle"],
    paragraphs: [
      "A supporto, un ecosistema costruito e validato su scala internazionale.",
    ],
    supportCard: {
      tone: "purple",
      icon: "wem-agency",
      title: "WEM Agency",
      description: "Specialisti WEM attivati in base a ciò che serve davvero.",
    },
  },
  stages: [
    { id: 1, key: "intro", startFrame: 0, endFrame: 30 },
    { id: 2, key: "narrative", startFrame: 30, endFrame: 55 },
    { id: 3, key: "method", startFrame: 55, endFrame: 80 },
    { id: 4, key: "ai", startFrame: 80, endFrame: 105 },
    {
      id: 5,
      key: "proof",
      startFrame: 105,
      endFrame: Number.POSITIVE_INFINITY,
    },
  ],
  introTitle: "Perché Funziona",
  title: "Perché Funziona",
  leadParagraph:
    "Gestione e Operatività sono semplificati da AI, strumenti evoluti e la rete di professionisti WEM.",
  resultParagraph:
    "Il risultato è un lavoro più efficiente e budget ottimizzato.",
  blocks: [
    {
      stage: "method",
      title: "LA FORZA DI VISIONE E METODO WEM",
      body: "Ogni progetto viene coordinato con il Modello WEM, progettato per integrare persone, strumenti e processi.",
      toneClassName: "bg-brand-blue",
    },
    {
      stage: "ai",
      title: "I SUPER POTERI DELLE AI",
      body: "Le attività tecniche e ripetitive vengono gestite più velocemente grazie a strumenti avanzati e AI.",
      toneClassName: "bg-brand-red",
      offsetClassName: "lg:ml-14",
    },
  ],
  proofPoints: [
    {
      titleLines: ["PIÙ", "VELOCITÀ"],
      color: "bg-brand-green",
      icon: "speed",
    },
    {
      titleLines: ["Costi", "Ridotti"],
      color: "bg-brand-red",
      icon: "costs",
    },
    {
      titleLines: ["Scelte", "Chiare"],
      color: "bg-brand-blue",
      icon: "decisions",
    },
    {
      titleLines: ["Progetti", "Piu Solidi"],
      color: "bg-brand-purple",
      icon: "projects",
    },
  ],
} satisfies WhyWemWorksSectionConfig;
