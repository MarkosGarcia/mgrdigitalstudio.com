import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { services, capabilities } from "@/lib/content";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Local SEO and Google Maps, AI search optimization, websites that convert and review growth for local businesses in Ottawa and beyond — plus landing pages, website care, conversion optimization, marketing automation, analytics and paid advertising. Start with a free visibility audit.",
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
              Get found first. Get chosen. Get the call.
            </h1>
            <p className="text-lg text-ink-3 leading-relaxed">
              Four core services built around one goal: when someone nearby
              searches for what you do, on Google or with an AI assistant,
              they find you first and call. Every engagement starts with a
              free visibility audit and a fixed quote — no hourly meter, no
              lock-in.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-transparent">
        <div className="max-w-3xl mx-auto px-6 border-t border-hair">
          {services.filter((s) => s.featured).map((service, i) => (
            <Reveal key={service.slug} delayMs={i * 80}>
              <div className="py-10 border-b border-hair">
                <p className="text-xs font-mono text-gold mb-2">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="text-2xl font-bold text-ink tracking-tight mb-2">{service.name}</h2>
                <p className="text-sm font-medium text-ink-2 mb-4">{service.tagline}</p>
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
              Landing pages, care, and the rest of the toolkit.
            </h2>
            <p className="text-sm text-ink-3 leading-relaxed mb-10 max-w-xl">
              Supporting services, usually added alongside one of the four
              above rather than sold on their own. All scoped on a call.
            </p>
          </Reveal>

          <Reveal delayMs={80} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {services.filter((s) => !s.featured).map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="group">
                <h3 className="text-sm font-semibold text-ink mb-1 group-hover:text-gold transition-colors">{s.name} →</h3>
                <p className="text-sm text-ink-3 leading-relaxed">{s.description}</p>
              </Link>
            ))}
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
