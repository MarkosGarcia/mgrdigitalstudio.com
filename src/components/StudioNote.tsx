import React from "react";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { HeroSignature } from "./HeroSignature";

const points = [
  "You deal directly with the person doing the work — no account managers.",
  "Plain-English monthly reports: where you rank, what changed, what's next.",
  "English and Spanish, for clients in Canada, the U.S. and beyond.",
];

export const StudioNote: React.FC = () => (
  <section className="py-24 md:py-32 band border-y border-hair">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
      <Reveal>
        <HeroSignature className="w-full max-w-md mx-auto" />
      </Reveal>

      <Reveal delayMs={100}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold mb-4">
          The studio
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight leading-tight mb-6">
          A boutique studio, not a call centre.
        </h2>
        <p className="text-ink-3 text-lg leading-relaxed mb-8">
          MGR Digital Studio is based in Ottawa and deliberately small. Every
          client gets senior attention, honest advice about what will
          actually move the needle, and fast turnaround — some sites have gone
          live the day after we started.
        </p>
        <ul className="space-y-3 mb-8">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-ink-2">
              <svg className="w-5 h-5 mt-0.5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {p}
            </li>
          ))}
        </ul>
        <Link href="/about" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:gap-2.5 transition-all">
          Meet the founder
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </Reveal>
    </div>
  </section>
);
