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
    eyebrow: "Who We Support",
    title: "Designed for those who want to grow\nwith a method!",
    warningTitle: "Not for:",
    warningBody:
      "those looking for one-off services or low-cost solutions without a strategy.",
  },
  cards: [
    {
      stage: "startups",
      tag: "Starting",
      title: "Startups",
      body: "To get started well, even with budgets that need careful management.",
      icon: "startup",
    },
    {
      stage: "professionals",
      tag: "Positioning",
      title: "Professionals",
      body: "For a digital presence aligned with their value.",
      icon: "professional",
    },
    {
      stage: "smes",
      tag: "Scaling",
      title: "SMEs",
      body: "For a stronger structure, less improvisation, and better support for growth.",
      icon: "sme",
    },
  ],
} satisfies WhoWeSupportSectionConfig;
