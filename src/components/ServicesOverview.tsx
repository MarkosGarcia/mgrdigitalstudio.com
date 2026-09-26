import React from "react";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { services } from "@/lib/content";

const icons: Record<string, React.ReactNode> = {
  "local-seo": (
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor" />
  ),
  "ai-search-optimization": (
    <>
      <path d="M11 2l1.9 6.1L19 10l-6.1 1.9L11 18l-1.9-6.1L3 10l6.1-1.9z" fill="currentColor" />
      <path d="M19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9z" fill="currentColor" />
    </>
  ),
  "business-websites": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth={2} />
      <path d="M3 9h18" stroke="currentColor" strokeWidth={2} />
      <circle cx="6.5" cy="6.5" r="0.9" fill="currentColor" />
      <circle cx="9.5" cy="6.5" r="0.9" fill="currentColor" />
      <path d="M8 15l2.5-2.5L13 15l3-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "review-growth": (
    <path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z" fill="currentColor" />
  ),
};

export const ServicesOverview: React.FC = () => {
  const core = services.filter((s) => s.featured);

  return (
    <section id="what-we-do" className="relative py-24 md:py-32 bg-transparent scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-4">
            What we do
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-ink tracking-tight leading-[1.1] mb-5">
            Four ways we make your business the obvious choice.
          </h2>
          <p className="text-ink-3 text-lg leading-relaxed">
            Local search now happens in two places — the map results on
            Google, and the answers AI assistants give. We work on both, and
            on the website and reviews they send people to.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {core.map((service, i) => (
            <Reveal key={service.slug} delayMs={i * 80}>
              <Link
                href={`/services/${service.slug}`}
                className="group lift relative flex h-full flex-col rounded-3xl border border-hair glass p-7 md:p-8 transition-colors hover:border-amber-500/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(212,169,55,0.6)]">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
                      {icons[service.slug]}
                    </svg>
                  </span>
                  <span className="text-sm font-mono text-ink-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-ink tracking-tight mb-2 group-hover:text-gold transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm font-medium text-ink-2 mb-3">{service.tagline}</p>
                <p className="text-sm text-ink-3 leading-relaxed mb-6">{service.description}</p>

                <ul className="space-y-2 mb-7">
                  {service.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-ink-3">
                      <svg className="w-4 h-4 mt-0.5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                  Learn more
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
