import type { PortfolioResultsSectionConfig } from "../types/portfolio-results-section";

export const portfolioResultsSectionConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776169273/v5_wlotyd.mp4",
  videoDuration: 4.28,
  focusItemId: "architecture",
  stages: [
    { id: 1, key: "intro", start: 0, end: 0.8 },
    { id: 2, key: "headline", start: 0.8, end: 1.6 },
    { id: 3, key: "narrative", start: 1.6, end: 2.4 },
    { id: 4, key: "portfolio", start: 2.4, end: 3.0 },
    { id: 5, key: "focus", start: 3.0, end: 3.6 },
    { id: 6, key: "proof", start: 3.6, end: Number.POSITIVE_INFINITY },
  ],
  copy: {
    eyebrow: "Real Results",
    title: "Different Industries. Same Method!",
    descriptionLines: [
      "The method adapts to different contexts, but keeps the same direction:",
      "vision, clarity, structure, and growth.",
    ],
    proofTitle: "No Promises. Real Data!",
    proofCta: "Click and read the case studies ->",
  },
  portfolioItems: [
    {
      id: "wellness",
      title: "Wellness",
      imageSrc: "/portfolio/health.png",
      imageAlt: "Portfolio health clinic website preview",
      footerLabel: "Marketing 360°",
      wrapperClassName: "bg-[#FF4040]",
      shellClassName:
        "shadow-[0_28px_70px_rgba(255,64,64,0.26)] ring-1 ring-[#FF4040]/20",
    },
    {
      id: "legal-bridge",
      title: "Legal Bridge",
      imageSrc: "/portfolio/legal.png",
      imageAlt: "Portfolio legal services website preview",
      footerLabel: "Website & SEO",
      wrapperClassName: "bg-[#3778F6]",
      shellClassName:
        "shadow-[0_28px_70px_rgba(55,120,246,0.24)] ring-1 ring-[#3778F6]/18",
    },
    {
      id: "training",
      title: "Training",
      imageSrc: "/portfolio/formazion.png",
      imageAlt: "Portfolio training website preview",
      footerLabel: "Website & SEO",
      wrapperClassName: "bg-[#6E3FEA]",
      shellClassName:
        "shadow-[0_28px_70px_rgba(110,63,234,0.26)] ring-1 ring-[#6E3FEA]/20",
    },
    {
      id: "architecture",
      title: "Architecture",
      imageSrc: "/portfolio/architechture.png",
      imageAlt: "Portfolio architecture website preview",
      footerLabel: "Website & SEO",
      wrapperClassName: "bg-[#F6C421]",
      shellClassName:
        "shadow-[0_28px_70px_rgba(246,196,33,0.28)] ring-1 ring-[#F6C421]/20",
    },
    {
      id: "consulting",
      title: "Consulting",
      imageSrc: "/portfolio/consult.png",
      imageAlt: "Portfolio consultancy website preview",
      footerLabel: "Website & SEO",
      wrapperClassName: "bg-[#E84047]",
      shellClassName:
        "shadow-[0_28px_70px_rgba(232,64,71,0.25)] ring-1 ring-[#E84047]/18",
    },
    {
      id: "creative-satire",
      title: "Creative Satire",
      imageSrc: "/portfolio/creative.png",
      imageAlt: "Portfolio creative satire website preview",
      footerLabel: "Social Media",
      wrapperClassName: "bg-[#3778F6]",
      shellClassName:
        "shadow-[0_28px_70px_rgba(55,120,246,0.24)] ring-1 ring-[#3778F6]/18",
    },
    {
      id: "beauty",
      title: "Beauty",
      imageSrc: "/portfolio/beauty.png",
      imageAlt: "Portfolio beauty website preview",
      footerLabel: "Branding",
      wrapperClassName: "bg-[#7A47F4]",
      shellClassName:
        "shadow-[0_28px_70px_rgba(122,71,244,0.24)] ring-1 ring-[#7A47F4]/18",
    },
  ],
  metrics: [
    {
      value: "+1,284%",
      label: "Social Media",
      body: "New leads in 5 weeks",
      borderClassName: "border-[#F6C421]/85",
      bandClassName: "bg-[#F6C421] text-white",
    },
    {
      value: "+289%",
      label: "Website & SEO",
      body: "Organic visibility in 3 months",
      borderClassName: "border-[#D9343F]/85",
      bandClassName: "bg-[#D9343F] text-white",
    },
    {
      value: "+800%",
      label: "Marketing 360°",
      body: "Conversions with the same budget",
      borderClassName: "border-[#2B5FC3]/85",
      bandClassName: "bg-[#2B5FC3] text-white",
    },
    {
      value: "5,000",
      label: "Website & SEO",
      body: "Organic visitors per year",
      borderClassName: "border-[#5A39B4]/85",
      bandClassName: "bg-[#5A39B4] text-white",
    },
  ],
} satisfies PortfolioResultsSectionConfig;
