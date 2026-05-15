import type { Viewport } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { buildRootMetadata } from "@/features/landing/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "optional",
  preload: true,
  adjustFontFallback: true,
  variable: "--font-poppins",
});

export const metadata = buildRootMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${poppins.className} ${poppins.variable} antialiased`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only absolute left-4 top-4 z-[300] rounded-md bg-black px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-white/80"
        >
          Salta al contenuto principale
        </a>
        {children}
      </body>
    </html>
  );
}
