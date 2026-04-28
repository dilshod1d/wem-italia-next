import type { FooterSectionConfig } from "../types/footer-section";

export const footerSectionConfig = {
  ctaTitle: "Vuoi una base solida per far crescere il tuo progetto?",
  ctaBody:
    "Parliamo del tuo progetto, dei tuoi obiettivi e del budget disponibile.Capirò subito da dove partire e quale percorso può funzionare meglio.",
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
      question: "Ci sono abbonamenti obbligatori o contratti vincolanti?",
      answer:
        "No. Lavoriamo passo dopo passo, con approvazioni chiare e senza vincoli a lungo termine imposti.",
    },
    {
      id: "timing",
      question: "Quanto tempo ci vuole?",
      answer:
        "Dipende dal progetto, ma priorità, tempistiche e milestone vengono definite fin dall’inizio.",
    },
    {
      id: "existing-site",
      question: "E se ho già un sito web?",
      answer:
        "Valutiamo cosa migliorare, cosa mantenere e cosa ricostruire, senza sprecare budget.",
    },
    {
      id: "marketing",
      question: "Vi occupate anche di marketing?",
      answer:
        "Sì. Strategia, sito web, SEO, comunicazione e promozione possono essere inclusi quando servono al progetto.",
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
      label: "WhatsApp",
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
      label: "Dove trovarci",
      value: "Ovunque ci sia un italiano!",
    },
  ],
  navLinks: [
    { label: "Chi Siamo", href: "#who-we-are" },
    { label: "Perché Funziona", href: "#why-it-works" },
    { label: "Come Funziona", href: "#how-it-works" },
    { label: "Risultati", href: "#results" },
    { label: "Chi Supportiamo", href: "#who-we-support" },
  ],
} satisfies FooterSectionConfig;
