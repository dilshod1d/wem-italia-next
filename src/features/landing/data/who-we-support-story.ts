import type { WhoWeSupportSectionConfig } from "../types/who-we-support-section";

export const whoWeSupportSectionConfig = {
  stages: [
    { id: 1, key: "title", start: 0, end: 0.08 },
    { id: 2, key: "startups", start: 0.08, end: 0.2 },
    { id: 3, key: "professionals", start: 0.2, end: 0.32 },
    { id: 4, key: "smes", start: 0.32, end: 0.46 },
    { id: 5, key: "warning", start: 0.46, end: 0.66 },
    { id: 6, key: "final", start: 0.66, end: Number.POSITIVE_INFINITY },
  ],
  copy: {
    eyebrow: "Chi Supportiamo",
    title: "Pensato per chi vuole crescere con Metodo!",
    warningTitle: "Non è per:",
    warningBody:
      "chi cerca singoli servizi o soluzioni economiche senza strategia.",
  },
  cards: [
    {
      stage: "startups",
      tag: "Di partenza",
      title: "Startups",
      body: "Per partire bene, anche con budget da gestire con attenzione.",
      icon: "startup",
    },
    {
      stage: "professionals",
      tag: "Posizionamento",
      title: "Professionisti",
      body: "Per una presenza digitale coerente con il proprio valore.",
      icon: "professional",
    },
    {
      stage: "smes",
      tag: "Scalatura",
      title: "PMI",
      body: "Per una struttura più solida, meno improvvisata, più utile alla crescita.",
      icon: "sme",
    },
  ],
} satisfies WhoWeSupportSectionConfig;
