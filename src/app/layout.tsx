import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AssessmentModalProvider } from "@/components/AssessmentModalContext";
import { AssessmentModal } from "@/components/AssessmentModal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { WhatsAppFloatingButton, AssistanceFloatingButton } from "@/components/WhatsAppButton";
import { Analytics } from "@/components/Analytics";
import { LiquidGlass } from "@/components/LiquidGlass";
import {
  BRAND_NAME,
  EMAIL,
  PHONE_HREF,
  ADDRESS_STREET,
  ADDRESS_LOCALITY,
  ADDRESS_REGION,
  ADDRESS_POSTAL_CODE,
  ADDRESS_COUNTRY,
} from "@/lib/business";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// A single classy serif accent, used sparingly (the hero eyebrow) rather
// than as a second body face — Inter still carries all the reading text.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic"],
  display: "swap",
});

const siteUrl = "https://mgrdigitalstudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MGR Digital Studio | Web Design for Small Business — Ottawa",
    template: "%s | MGR Digital Studio",
  },
  description:
    "A small web design shop in Ottawa. We build websites for small businesses — clear about what you do, quick on a phone, easy to get in touch. Free website review, no obligation.",
  keywords: [
    "website design",
    "web design agency",
    "landing pages",
    "conversion rate optimization",
    "Ottawa web design",
    "business websites",
    "website redesign",
    "website growth",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "MGR Digital Studio",
    title: "MGR Digital Studio | Web Design for Small Business — Ottawa",
    description:
      "A small web design shop in Ottawa, building websites for small businesses that need the phone to ring.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MGR Digital Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MGR Digital Studio",
    description: "Turning visitors into customers.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

/**
 * One graph rather than three loose objects, so the business, the person behind
 * it and the site are explicitly linked by @id. Search engines can infer some of
 * that; answer engines quoting the site do noticeably better when the
 * relationships are stated rather than guessed at.
 *
 * The details that earn citations are the boring specific ones — a real phone
 * number, real hours, what it costs, which languages, which city. Vague
 * marketing prose is exactly what gets skipped over.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#business`,
      name: BRAND_NAME,
      description:
        "A small web design shop in Ottawa building websites and landing pages for small businesses, plus ongoing care and improvement after launch.",
      url: siteUrl,
      telephone: PHONE_HREF.replace("tel:", ""),
      email: EMAIL,
      image: `${siteUrl}/og-image.jpg`,
      logo: `${siteUrl}/logo-mark.png`,
      currenciesAccepted: "CAD",
      knowsLanguage: ["en", "es"],
      knowsAbout: [
        "Websites",
        "Landing Pages",
        "SEO",
        "Google Business Profile Optimization",
        "Conversion Optimization",
        "AI Search Optimization",
        "Marketing",
        "Marketing Automation",
        "Analytics",
        "Paid Advertising",
      ],
      founder: { "@id": `${siteUrl}/#marcos` },
      address: {
        "@type": "PostalAddress",
        streetAddress: ADDRESS_STREET,
        addressLocality: ADDRESS_LOCALITY,
        addressRegion: ADDRESS_REGION,
        postalCode: ADDRESS_POSTAL_CODE,
        addressCountry: ADDRESS_COUNTRY,
      },
      areaServed: [
        { "@type": "City", name: "Ottawa" },
        { "@type": "AdministrativeArea", name: "Ontario" },
        { "@type": "Country", name: "Canada" },
        { "@type": "Country", name: "United States" },
      ],
      // Not office hours — the booking calendar genuinely offers slots around
      // the clock, and this is what tells an answer engine that.
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
      ],
      potentialAction: {
        "@type": "ReserveAction",
        name: "Book a free 20-minute discovery call",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/booking/`,
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
        result: {
          "@type": "Reservation",
          name: "Discovery call",
        },
      },
      slogan: "Turning visitors into customers.",
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#marcos`,
      name: "Marcos Garcia",
      jobTitle: "Web designer",
      description:
        "Licensed gas technician and former maintenance company owner, now building websites for small businesses in Ottawa. Works in English and Spanish.",
      image: `${siteUrl}/marcos.jpg`,
      knowsLanguage: ["en", "es"],
      worksFor: { "@id": `${siteUrl}/#business` },
      homeLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ottawa",
          addressRegion: "ON",
          addressCountry: "CA",
        },
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: BRAND_NAME,
      inLanguage: ["en-CA", "es"],
      publisher: { "@id": `${siteUrl}/#business` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col text-ink-3">
        <LiquidGlass />
        <ScrollProgress />
        <AssessmentModalProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AssessmentModal />
          <WhatsAppFloatingButton />
          <AssistanceFloatingButton />
        </AssessmentModalProvider>
        <div className="grain-overlay" aria-hidden="true" />
        <Analytics />
      </body>
    </html>
  );
}
