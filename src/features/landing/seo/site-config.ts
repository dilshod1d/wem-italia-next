const fallbackSiteUrl = "https://www.wemitalia.it";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackSiteUrl;

export const siteKeywords = [
  "agenzia ai",
  "ai per aziende",
  "consulente ai",
  "automazione ai",
  "automazione business",
  "marketing digitale ai",
  "ai marketing",
  "seo google",
  "google seo",
  "seo local",
  "local seo",
  "google local seo",
  "consulenza seo",
  "audit seo",
  "ottimizzazione seo",
  "seo sito web",
  "servizi seo",
  "consulenza seo e web marketing",
  "web design italia",
  "agenzia web design",
  "seo web design",
  "web development agency",
  "web development services",
  "web application development",
  "ai automation agency",
] as const;

export const siteServiceTopics = [
  "SEO Google",
  "Local SEO",
  "AI per aziende",
  "Automazione AI",
  "Automazione marketing",
  "Web design premium",
  "Sviluppo web",
  "Digital marketing",
  "Consulenza SEO",
  "Esperienze digitali premium",
] as const;

export const localServiceAreas = [
  "Italia",
  "Milano",
  "Firenze",
  "Roma",
  "Bologna",
] as const;

export const siteConfig = {
  name: "WEM Italia",
  legalName: "WEM Italia",
  siteUrl: rawSiteUrl.replace(/\/+$/, ""),
  locale: "it_IT",
  language: "it",
  titleTemplate: "%s | WEM Italia",
  defaultTitle: "WEM Italia",
  homeTitle: "Agenzia AI, SEO e Web Design in Italia",
  defaultDescription:
    "WEM Italia unisce SEO Google, AI per aziende, web design premium, sviluppo web e automazione marketing per aiutare professionisti, PMI e brand a crescere in Italia.",
  homeDescription:
    "WEM Italia è un'agenzia AI e SEO che progetta web design premium, sviluppo web, automazione business e posizionamento Google per aziende a Milano, Firenze, Roma, Bologna e in tutta Italia.",
  socialDescription:
    "SEO, AI, web design e automazione per aziende italiane che vogliono crescere con un'esperienza digitale premium.",
  email: "info@wemitalia.it",
  telephone: "+39 349 34 323 43",
  telephoneHref: "tel:+393493432343",
  whatsapp: "https://wa.me/393493432343",
  logoPath: "/logo.png",
  iconPath: "/icon.png",
  ogImagePath: "/opengraph-image",
  twitterImagePath: "/twitter-image",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.siteUrl}/`).toString();
}
