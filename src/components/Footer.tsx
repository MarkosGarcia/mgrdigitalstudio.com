import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  EMAIL,
  EMAIL_HREF,
  BRAND_NAME,
  HOURS,
} from "@/lib/business";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Services",
    links: [
      { href: "/services/local-seo", label: "Local SEO & Google Maps" },
      { href: "/services/ai-search-optimization", label: "AI Search Optimization" },
      { href: "/services/business-websites", label: "Websites That Convert" },
      { href: "/services/review-growth", label: "Review Growth" },
      { href: "/services/landing-pages", label: "Landing Pages" },
      { href: "/quote-calculator", label: "Request a Quote" },
    ],
  },
  {
    title: "Who we help",
    links: [
      { href: "/ottawa-trades", label: "Ottawa Trades" },
      { href: "/launch-kit", label: "New Business Launch Kit" },
      { href: "/es", label: "Sitios web en español" },
      { href: "/work", label: "Our Work" },
      { href: "/reviews", label: "Reviews" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/lead-magnet", label: "Free Guide" },
      { href: "/blog", label: "Blog" },
      { href: "/booking", label: "Book a Call" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="band border-t border-hair">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-ink-3 max-w-xs leading-relaxed">
              Local SEO, AI search optimization and websites that get local
              businesses picked first. Based in Ottawa, Ontario.
            </p>

            <div className="mt-5 space-y-2 text-sm">
              <a
                href={PHONE_HREF}
                className="link-underline block font-semibold text-ink hover:text-gold transition-colors"
              >
                {PHONE_DISPLAY}
              </a>
              <a
                href={EMAIL_HREF}
                className="link-underline block text-ink-3 hover:text-gold transition-colors"
              >
                {EMAIL}
              </a>
              <p className="text-ink-4 text-xs pt-1">{HOURS}</p>
              <p className="text-ink-3 text-xs">
                Hablamos español —{" "}
                <Link href="/es" className="text-gold hover:underline">
                  ver sitio en español
                </Link>
              </p>
            </div>

            <WhatsAppButton className="mt-5" />
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-ink mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-underline text-sm text-ink-3 hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-hair flex flex-col sm:flex-row items-center justify-between gap-4 sm:pr-20">
          <p className="text-xs text-ink-4">
            &copy; {year} {BRAND_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-ink-4 sm:text-right sm:max-w-xs">
            Ottawa, Ontario, Canada &middot; Serving Canada, the U.S. &amp; Internationally in English and Spanish
          </p>
        </div>
      </div>
    </footer>
  );
};
