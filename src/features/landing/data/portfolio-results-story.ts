import type { PortfolioResultsSectionConfig } from "../types/portfolio-results-section";

export const portfolioResultsSectionConfig = {
  videoUrl:
    "https://res.cloudinary.com/dcderdzpp/video/upload/v1776169273/v5_wlotyd.mp4",
  fps: 30,
  totalFrames: 150,
  videoDuration: 5,
  focusItemId: "architecture",
  stages: [
    { id: 1, key: "intro", startFrame: 0, endFrame: 24 },
    { id: 2, key: "headline", startFrame: 24, endFrame: 48 },
    { id: 3, key: "narrative", startFrame: 48, endFrame: 72 },
    { id: 4, key: "portfolio", startFrame: 72, endFrame: 90 },
    { id: 5, key: "focus", startFrame: 90, endFrame: 108 },
    { id: 6, key: "proof", startFrame: 108, endFrame: Number.POSITIVE_INFINITY },
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
      wrapperClassName: "bg-brand-red",
      shellClassName:
        "shadow-[0_28px_70px_rgba(237,45,50,0.26)] ring-1 ring-brand-red/20",
    },
    {
      id: "legal-bridge",
      title: "Legal Bridge",
      imageSrc: "/portfolio/legal.png",
      imageAlt: "Portfolio legal services website preview",
      footerLabel: "Website & SEO",
      wrapperClassName: "bg-portfolio-blue",
      shellClassName:
        "shadow-[0_28px_70px_rgba(49,121,246,0.24)] ring-1 ring-portfolio-blue/18",
    },
    {
      id: "training",
      title: "Training",
      imageSrc: "/portfolio/formazion.png",
      imageAlt: "Portfolio training website preview",
      footerLabel: "Website & SEO",
      wrapperClassName: "bg-brand-purple",
      shellClassName:
        "shadow-[0_28px_70px_rgba(109,60,219,0.26)] ring-1 ring-brand-purple/20",
    },
    {
      id: "architecture",
      title: "Architecture",
      imageSrc: "/portfolio/architechture.png",
      imageAlt: "Portfolio architecture website preview",
      footerLabel: "Website & SEO",
      wrapperClassName: "bg-brand-yellow",
      shellClassName:
        "shadow-[0_28px_70px_rgba(234,186,43,0.28)] ring-1 ring-brand-yellow/20",
    },
    {
      id: "consulting",
      title: "Consulting",
      imageSrc: "/portfolio/consult.png",
      imageAlt: "Portfolio consultancy website preview",
      footerLabel: "Website & SEO",
      wrapperClassName: "bg-brand-red-alt",
      shellClassName:
        "shadow-[0_28px_70px_rgba(225,62,70,0.25)] ring-1 ring-brand-red-alt/18",
    },
    {
      id: "creative-satire",
      title: "Creative Satire",
      imageSrc: "/portfolio/creative.png",
      imageAlt: "Portfolio creative satire website preview",
      footerLabel: "Social Media",
      wrapperClassName: "bg-portfolio-blue",
      shellClassName:
        "shadow-[0_28px_70px_rgba(49,121,246,0.24)] ring-1 ring-portfolio-blue/18",
    },
    {
      id: "beauty",
      title: "Beauty",
      imageSrc: "/portfolio/beauty.png",
      imageAlt: "Portfolio beauty website preview",
      footerLabel: "Branding",
      wrapperClassName: "bg-brand-purple",
      shellClassName:
        "shadow-[0_28px_70px_rgba(109,60,219,0.24)] ring-1 ring-brand-purple/18",
    },
  ],
  metrics: [
    {
      value: "+1,284%",
      label: "Social Media",
      body: "New leads in 5 weeks",
      borderClassName: "border-brand-yellow/85",
      bandClassName: "bg-brand-yellow text-white",
    },
    {
      value: "+289%",
      label: "Website & SEO",
      body: "Organic visibility in 3 months",
      borderClassName: "border-brand-red/85",
      bandClassName: "bg-brand-red text-white",
    },
    {
      value: "+800%",
      label: "Marketing 360°",
      body: "Conversions with the same budget",
      borderClassName: "border-brand-blue/85",
      bandClassName: "bg-brand-blue text-white",
    },
    {
      value: "5,000",
      label: "Website & SEO",
      body: "Organic visitors per year",
      borderClassName: "border-brand-purple/85",
      bandClassName: "bg-brand-purple text-white",
    },
  ],
} satisfies PortfolioResultsSectionConfig;
