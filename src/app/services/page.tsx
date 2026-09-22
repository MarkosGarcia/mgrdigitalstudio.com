import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { services } from "@/lib/content";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Landing pages, business websites, website care and ongoing improvement work. Fixed quotes, starting at $950.",
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

      <CTASection />
    </>
  );
}
