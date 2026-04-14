import type { FooterSectionConfig } from "../types/footer-section";

export const footerSectionConfig = {
  ctaTitle: "Vuoi una base solida per far crescere il tuo progetto?",
  ctaBody:
    "Parliamo del tuo progetto, dei tuoi obiettivi e del budget disponibile. Capirò subito da dove partire e quale percorso può funzionare meglio.",
  ctaButtons: [
    {
      label: "Chiamami Subito",
      href: "tel:+393493432343",
      tone: "dark",
    },
    {
      label: "Scrivimi su Whatsapp",
      href: "https://wa.me/393493432343",
      tone: "light",
    },
  ],
  faqItems: [
    {
      id: "contracts",
      question: "Are there mandatory subscriptions or binding contracts?",
      answer:
        "No. We work step by step, with clear approvals and no forced long-term constraints.",
    },
    {
      id: "timing",
      question: "How long does it take?",
      answer:
        "It depends on the project, but priorities, timing, and milestones are defined from the start.",
    },
    {
      id: "existing-site",
      question: "What if I already have a website?",
      answer:
        "We assess what should be improved, what can be kept, and what should be rebuilt without wasting budget.",
    },
    {
      id: "marketing",
      question: "Do you also handle marketing?",
      answer:
        "Yes. Strategy, website, SEO, communication, and promotion can all be included when they serve the project.",
    },
  ],
  socials: [
    { id: "facebook", href: "#", label: "Facebook" },
    { id: "x", href: "#", label: "X" },
    { id: "linkedin", href: "#", label: "LinkedIn" },
  ],
  contactItems: [
    {
      id: "whatsapp",
      icon: "whatsapp",
      label: "Whatsapp",
      value: "+39 349 34 323 43",
      href: "https://wa.me/393493432343",
    },
    {
      id: "email",
      icon: "email",
      label: "Email",
      value: "info@wemitalia.it",
      href: "mailto:info@wemitalia.it",
    },
    {
      id: "location",
      icon: "location",
      label: "Dove siamo",
      value: "Ovunque ci sia un telefono",
    },
  ],
  navLinks: [
    { label: "Chi Siamo", href: "#chi-siamo" },
    { label: "Perché Funziona", href: "#perche-funziona" },
    { label: "Come Funziona", href: "#come-funziona" },
    { label: "Risultati", href: "#risultati" },
    { label: "Chi Supportiamo", href: "#chi-supportiamo" },
  ],
  enterpriseItems: [
    {
      id: "ai",
      variant: "ai",
      title: "WEM AI",
      subtitle: "WEM ENTERPRISE",
    },
    {
      id: "giovanni",
      variant: "giovanni",
      title: "Giovanni\nColangelo",
      subtitle: "Strategy Lead",
    },
    {
      id: "agency",
      variant: "agency",
      title: "WEM\nAgency",
      subtitle: "Creative Network",
    },
  ],
} satisfies FooterSectionConfig;
