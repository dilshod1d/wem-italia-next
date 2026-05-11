import type { MetadataRoute } from "next";
import { heroStoryConfig } from "@/features/landing/sections/hero/hero-story";
import { howItWorksSectionConfig } from "@/features/landing/sections/how-it-works/how-it-works-story";
import { portfolioResultsSectionConfig } from "@/features/landing/sections/portfolio-results/portfolio-results-story";
import { systemFlowSectionConfig } from "@/features/landing/sections/system-flow/system-flow-story";
import { whyWemWorksSectionConfig } from "@/features/landing/sections/why-wem-works/why-wem-works-story";
import { absoluteUrl, siteConfig } from "@/features/landing/seo";

const publishedAt = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.siteUrl,
      lastModified: publishedAt,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          it: siteConfig.siteUrl,
        },
      },
      images: [
        absoluteUrl(siteConfig.ogImagePath),
        ...portfolioResultsSectionConfig.portfolioItems.map((item) =>
          absoluteUrl(item.imageSrc),
        ),
      ],
      videos: [
        {
          title: "WEM Italia: AI, SEO e crescita digitale",
          description:
            "Hero video di WEM Italia dedicato a SEO Google, AI per aziende e crescita digitale premium.",
          thumbnail_loc: absoluteUrl(siteConfig.ogImagePath),
          content_loc: heroStoryConfig.videoUrl,
          duration: heroStoryConfig.videoDuration,
          publication_date: publishedAt,
          family_friendly: "yes",
          requires_subscription: "no",
          live: "no",
        },
        {
          title: "Perché WEM Italia funziona",
          description:
            "Video storytelling sul metodo WEM, la consulenza e l'uso dell'AI per risultati più solidi.",
          thumbnail_loc: absoluteUrl(siteConfig.ogImagePath),
          content_loc: whyWemWorksSectionConfig.videoUrl,
          duration: whyWemWorksSectionConfig.videoDuration,
          publication_date: publishedAt,
          family_friendly: "yes",
          requires_subscription: "no",
          live: "no",
        },
        {
          title: "Paghi a step, senza vincoli",
          description:
            "Video dedicato a processo, budget trasparente e supporto WEM per progetti digitali su misura.",
          thumbnail_loc: absoluteUrl(siteConfig.ogImagePath),
          content_loc: systemFlowSectionConfig.videoUrl,
          duration: systemFlowSectionConfig.videoDuration,
          publication_date: publishedAt,
          family_friendly: "yes",
          requires_subscription: "no",
          live: "no",
        },
        {
          title: "Come funziona il percorso WEM",
          description:
            "Video sul processo operativo: analisi, direzione, costruzione ed evoluzione del progetto.",
          thumbnail_loc: absoluteUrl(siteConfig.ogImagePath),
          content_loc: howItWorksSectionConfig.videoUrl,
          duration: howItWorksSectionConfig.videoDuration,
          publication_date: publishedAt,
          family_friendly: "yes",
          requires_subscription: "no",
          live: "no",
        },
        {
          title: "Portfolio e risultati WEM Italia",
          description:
            "Video dedicato ai casi studio, ai settori serviti e alle metriche di crescita ottenute.",
          thumbnail_loc: absoluteUrl(siteConfig.ogImagePath),
          content_loc: portfolioResultsSectionConfig.videoUrl,
          duration: portfolioResultsSectionConfig.videoDuration,
          publication_date: publishedAt,
          family_friendly: "yes",
          requires_subscription: "no",
          live: "no",
        },
      ],
    },
  ];
}
