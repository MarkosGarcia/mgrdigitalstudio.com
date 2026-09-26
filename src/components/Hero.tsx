"use client";

import React from "react";
import { GoldButton, OutlineLink } from "./Buttons";
import { Magnetic } from "./Magnetic";
import { HeroBackdrop } from "./HeroBackdrop";
import { Globe } from "./Globe";
import { RankClimb } from "./RankClimb";

const proof = [
  "Ottawa-based",
  "English & Español",
  "Sites live in days, not months",
  "No lock-in contracts",
];

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-transparent pt-16 pb-20 md:pt-24 md:pb-28">
      <HeroBackdrop />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4 lg:gap-12 items-center">
          <div className="max-w-xl">
            <p className="font-serif italic font-bold text-xl sm:text-2xl md:text-3xl tracking-wide text-gold mb-5">
              Web Design &amp; Marketing · Ottawa
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-ink tracking-tight leading-[1.05] mb-7">
              Get your business{" "}
              <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-[#8a6410] bg-clip-text text-transparent">
                picked first
              </span>{" "}
              on Google and in AI search.
            </h1>

            <p className="text-lg md:text-xl text-ink-3 leading-relaxed mb-10">
              Local SEO, Google Business Profile optimization and AI search
              visibility for local businesses — on a fast website that turns
              the search into a phone call.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 mb-8">
              <Magnetic>
                <GoldButton size="lg" className="w-full sm:w-auto">
                  Get my free visibility audit
                </GoldButton>
              </Magnetic>
              <Magnetic strength={0.25}>
                <OutlineLink href="#what-we-do" size="lg" className="w-full sm:w-auto">
                  See how it works
                </OutlineLink>
              </Magnetic>
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-3">
              {proof.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Phones: the globe rises above the panel in its own space, with
              the panel overlapping its lower half. Desktop: the globe sits
              large behind the panel and peeks out around it. */}
          <div className="relative w-full max-w-md mx-auto lg:mr-0 pt-44 sm:pt-56 lg:pt-0">
            <div
              className="pointer-events-none absolute z-0 left-1/2 top-0 -translate-x-1/2 w-[112%] sm:w-[125%] lg:top-1/2 lg:-translate-x-[30%] lg:-translate-y-[56%] lg:w-[185%] max-w-none"
              aria-hidden="true"
            >
              <Globe />
            </div>
            <RankClimb className="relative z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
