import React from "react";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { projects } from "@/lib/content";

export const WorkPreview: React.FC = () => (
  <section className="py-24 md:py-32 bg-transparent">
    <div className="max-w-6xl mx-auto px-6">
      <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-4">
            Recent work
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight leading-tight">
            Real Ottawa businesses. Real sites you can visit.
          </h2>
        </div>
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:gap-2.5 transition-all shrink-0"
        >
          See the case studies
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {projects.map((p, i) => (
          <Reveal key={p.url} delayMs={i * 80}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group lift flex h-full flex-col rounded-3xl border border-hair glass p-7 hover:border-amber-500/50 transition-colors"
            >
              <p className="text-[11px] font-mono uppercase tracking-wider text-ink-4 mb-4">
                {p.sector}
              </p>
              <h3 className="text-xl font-bold text-ink tracking-tight mb-3 group-hover:text-gold transition-colors">
                {p.business}
              </h3>
              <p className="text-sm text-ink-3 leading-relaxed mb-6 line-clamp-4">{p.summary}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-gold">
                {p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H8M17 7v9" />
                </svg>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
