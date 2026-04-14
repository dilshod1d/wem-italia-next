import type { WhoWeSupportSectionConfig } from "../types/who-we-support-section";

export const whoWeSupportSectionConfig = {
  stages: [
    { id: 1, key: "title", start: 0, end: 0.18 },
    { id: 2, key: "startups", start: 0.18, end: 0.38 },
    { id: 3, key: "professionals", start: 0.38, end: 0.56 },
    { id: 4, key: "smes", start: 0.56, end: 0.74 },
    { id: 5, key: "warning", start: 0.74, end: 0.9 },
    { id: 6, key: "final", start: 0.9, end: Number.POSITIVE_INFINITY },
  ],
  copy: {
    eyebrow: "Chi Supportiamo",
    title: "Pensato per chi vuole crescere\ncon Metodo!",
    warningTitle: "Non è per:",
    warningBody:
      "chi cerca singoli servizi o soluzioni economiche senza strategia.",
  },
  cards: [
    {
      stage: "startups",
      title: "Startups",
      body: "Per partire bene, anche con budget da gestire con attenzione.",
      icon: "startup",
    },
    {
      stage: "professionals",
      title: "Professionisti",
      body: "Per una presenza digitale coerente con il proprio valore.",
      icon: "professional",
    },
    {
      stage: "smes",
      title: "PMI",
      body: "Per una struttura più solida, meno improvvisata, più utile alla crescita.",
      icon: "sme",
    },
  ],
} satisfies WhoWeSupportSectionConfig;
