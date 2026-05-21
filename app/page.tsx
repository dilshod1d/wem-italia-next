import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/page";
import { buildHomeMetadata, getHomepageJsonLd } from "@/features/landing/seo";

export function generateMetadata(): Metadata {
  return buildHomeMetadata();
}

export default function HomePage() {
  const structuredData = getHomepageJsonLd();

  return (
    <>
      <LandingPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
