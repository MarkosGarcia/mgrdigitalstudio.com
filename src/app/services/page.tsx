import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { services, capabilities } from "@/lib/content";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Landing pages, business websites, website care and ongoing improvement work, plus SEO, Google Business Profile optimization, conversion optimization, AI search optimization, marketing, marketing automation, analytics and paid advertising. Fixed quotes, starting at $950.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 bg-transparent">
        <ParallaxBackground variant="cool" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/90 mb-6">
              Services
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight leading-[1.1] mb-7">
              Two ways to build it. Two ways to keep it working.
            </h1>
            <p className="text-lg text-ink-3 leading-relaxed">
              Prices below are where each one starts. You get a fixed quote
              before anything begins, so there&apos;s no hourly meter running.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-transparent">
        <div className="max-w-3xl mx-auto px-6 border-t border-hair">
          {services.map((service, i) => (
            <Reveal key={service.slug} delayMs={i * 80}>
              <div className="py-10 border-b border-hair">
                <div className="flex items-baseline justify-between gap-4 mb-4">
                  <h2 className="text-xl font-semibold text-ink">{service.name}</h2>
                  <span className="text-sm text-ink-4 shrink-0">
                    {service.startingPrice}
                  </span>
                </div>
                <p className="text-sm text-ink-3 leading-relaxed mb-6">
                  {service.longDescription}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:gap-2.5 transition-colors"
                >
                  What&apos;s included
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-transparent">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/90 mb-4">
              Also part of the toolkit
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight leading-tight mb-4">
              SEO, marketing, and everything that gets you found.
            </h2>
            <p className="text-sm text-ink-3 leading-relaxed mb-10 max-w-xl">
              These get scoped on a call rather than quoted sight-unseen —
              most often bundled into a Business Website or a Website Growth
              plan, not sold on their own.
            </p>
          </Reveal>

          <Reveal delayMs={80} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {capabilities.map((c) => (
              <div key={c.name}>
                <h3 className="text-sm font-semibold text-ink mb-1">{c.name}</h3>
                <p className="text-sm text-ink-3 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
