import type { Metadata } from "next";
import { absoluteUrl, siteConfig, siteKeywords } from "./site-config";

const socialImage = {
  url: siteConfig.ogImagePath,
  width: 1200,
  height: 630,
  alt: "WEM Italia: agenzia AI, SEO e web design in Italia",
} as const;

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
      default: siteConfig.defaultTitle,
      template: siteConfig.titleTemplate,
    },
    description: siteConfig.defaultDescription,
    applicationName: siteConfig.name,
    referrer: "origin-when-cross-origin",
    keywords: [...siteKeywords],
    authors: [{ name: siteConfig.name, url: siteConfig.siteUrl }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "technology",
    alternates: {
      canonical: "/",
      languages: {
        it: "/",
      },
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: siteConfig.siteUrl,
      siteName: siteConfig.name,
      title: `${siteConfig.homeTitle} | ${siteConfig.name}`,
      description: siteConfig.socialDescription,
      countryName: "Italy",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.homeTitle} | ${siteConfig.name}`,
      description: siteConfig.socialDescription,
      images: [siteConfig.twitterImagePath],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [{ url: siteConfig.iconPath, type: "image/png" }],
      shortcut: [{ url: siteConfig.iconPath, type: "image/png" }],
      apple: [{ url: siteConfig.iconPath, type: "image/png" }],
    },
    appleWebApp: {
      capable: true,
      title: siteConfig.name,
      statusBarStyle: "default",
    },
    other: {
      "geo.region": "IT",
      "geo.placename": "Italia",
      "og:logo": absoluteUrl(siteConfig.logoPath),
    },
  };
}

export function buildHomeMetadata(): Metadata {
  const title = siteConfig.homeTitle;
  const description = siteConfig.homeDescription;

  return {
    title,
    description,
    alternates: {
      canonical: "/",
      languages: {
        it: "/",
      },
    },
    openGraph: {
      url: siteConfig.siteUrl,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [socialImage],
    },
    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.twitterImagePath],
    },
  };
}
