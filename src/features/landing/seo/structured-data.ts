import { footerSectionConfig } from "../sections/footer/footer-section.data";
import { portfolioResultsSectionConfig } from "../sections/portfolio-results/portfolio-results-story";
import {
  absoluteUrl,
  localServiceAreas,
  siteConfig,
  siteKeywords,
  siteServiceTopics,
} from "./site-config";

const organizationId = absoluteUrl("/#organization");
const websiteId = absoluteUrl("/#website");
const webpageId = absoluteUrl("/#webpage");
const serviceId = absoluteUrl("/#service");
const faqId = absoluteUrl("/#faq");

export function getHomepageJsonLd() {
  const faqEntities = footerSectionConfig.faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  const serviceCatalog = {
    "@type": "OfferCatalog",
    name: "Servizi WEM Italia",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Consulenza SEO e posizionamento Google",
          description:
            "Audit SEO, SEO on-page, ottimizzazione semantica, SEO local e crescita organica per aziende italiane.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI per aziende e automazione business",
          description:
            "Automazioni AI, workflow intelligenti e sistemi digitali su misura per processi, marketing e operations.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web design premium e sviluppo web",
          description:
            "Siti web ad alte prestazioni, esperienze cinematiche, sviluppo custom e interfacce mobile-first.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Digital marketing e automazione marketing",
          description:
            "Strategie di acquisizione, contenuti, funnel e marketing digitale AI-ready per la crescita del brand.",
        },
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url: siteConfig.siteUrl,
        logo: absoluteUrl(siteConfig.logoPath),
        image: absoluteUrl(siteConfig.ogImagePath),
        description: siteConfig.defaultDescription,
        email: siteConfig.email,
        telephone: siteConfig.telephone,
        knowsAbout: [...siteServiceTopics, ...siteKeywords],
        areaServed: [
          { "@type": "Country", name: "Italia" },
          ...localServiceAreas
            .filter((area) => area !== "Italia")
            .map((area) => ({ "@type": "City", name: area })),
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: siteConfig.email,
            telephone: siteConfig.telephone,
            areaServed: "IT",
            availableLanguage: ["it-IT"],
            url: siteConfig.whatsapp,
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteConfig.siteUrl,
        name: siteConfig.name,
        description: siteConfig.homeDescription,
        inLanguage: "it-IT",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "ProfessionalService",
        "@id": serviceId,
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        image: absoluteUrl(siteConfig.ogImagePath),
        description: siteConfig.homeDescription,
        slogan:
          "SEO, AI e digital experiences premium per la crescita delle aziende italiane.",
        provider: { "@id": organizationId },
        areaServed: [
          { "@type": "Country", name: "Italia" },
          ...localServiceAreas
            .filter((area) => area !== "Italia")
            .map((area) => ({ "@type": "City", name: area })),
        ],
        availableLanguage: ["it-IT"],
        serviceType: [...siteServiceTopics],
        knowsAbout: [...siteKeywords],
        hasOfferCatalog: serviceCatalog,
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: siteConfig.siteUrl,
        name: `${siteConfig.homeTitle} | ${siteConfig.name}`,
        description: siteConfig.homeDescription,
        inLanguage: "it-IT",
        isPartOf: { "@id": websiteId },
        about: { "@id": serviceId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: absoluteUrl(siteConfig.ogImagePath),
        },
        significantLink: [
          absoluteUrl("/#who-we-are"),
          absoluteUrl("/#why-it-works"),
          absoluteUrl("/#how-it-works"),
          absoluteUrl("/#results"),
          absoluteUrl("/#who-we-support"),
          absoluteUrl("/#footer"),
        ],
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        mainEntity: faqEntities,
      },
      {
        "@type": "ItemList",
        "@id": absoluteUrl("/#portfolio"),
        name: "Portfolio WEM Italia",
        itemListElement:
          portfolioResultsSectionConfig.contentItems.portfolio.rail.items.map(
            (item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "CreativeWork",
                name: item.title,
                image: absoluteUrl(item.imageSrc),
                description: item.footerLabel,
              },
            }),
          ),
      },
    ],
  };
}
