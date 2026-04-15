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
    eyebrow: "Who We Support",
    title: "Designed for those who want to grow\nwith a method!",
    warningTitle: "Not for:",
    warningBody:
      "those looking for one-off services or low-cost solutions without a strategy.",
  },
  cards: [
    {
      stage: "startups",
      title: "Startups",
      body: "To get started well, even with budgets that need careful management.",
      icon: "startup",
    },
    {
      stage: "professionals",
      title: "Professionals",
      body: "For a digital presence aligned with their value.",
      icon: "professional",
    },
    {
      stage: "smes",
      title: "SMEs",
      body: "For a stronger structure, less improvisation, and better support for growth.",
      icon: "sme",
    },
  ],
} satisfies WhoWeSupportSectionConfig;
