export interface FooterCtaButton {
  readonly label: string;
  readonly href: string;
  readonly tone: "dark" | "light";
}

export interface FooterFaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export type FooterSocialPlatform = "facebook" | "x" | "linkedin";

export interface FooterSocialLink {
  readonly id: FooterSocialPlatform;
  readonly href: string;
  readonly label: string;
}

export type FooterContactIcon = "whatsapp" | "email" | "location";

export interface FooterContactItem {
  readonly id: string;
  readonly icon: FooterContactIcon;
  readonly label: string;
  readonly value: string;
  readonly href?: string;
}

export interface FooterNavLink {
  readonly label: string;
  readonly href: string;
}


export interface FooterSectionConfig {
  readonly ctaTitle: string;
  readonly ctaBody: string;
  readonly ctaButtons: readonly FooterCtaButton[];
  readonly faqItems: readonly FooterFaqItem[];
  readonly socials: readonly FooterSocialLink[];
  readonly contactItems: readonly FooterContactItem[];
  readonly navLinks: readonly FooterNavLink[];
}
