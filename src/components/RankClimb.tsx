"use client";

import React, { useEffect, useState } from "react";

/**
 * The hero's "what we actually do" in one loop: a local search panel where
 * Your Business climbs from fifth to first, and then an AI assistant names it
 * as the top pick. Competitors are deliberately skeleton bars, not invented
 * business names — a made-up name can collide with a real Ottawa company.
 *
 * Rows sit absolutely at `position * ROW` and move with a transform
 * transition, so a swap animates both rows at once without layout thrash.
 * Under prefers-reduced-motion the panel renders the finished state and
 * never animates.
 */

const ROW = 58;
const STEP_MS = 1150;
const HOLD_MS = 3800;

type Query = { text: string; service: string };

const queries: Query[] = [
  { text: "plumber near me", service: "plumbing" },
  { text: "flooring installer ottawa", service: "flooring" },
  { text: "dentist in kanata", service: "a dentist" },
  { text: "electricista cerca de mí", service: "an electrician" },
  { text: "best roofer near me", service: "roofing" },
];

const longestService = queries.reduce(
  (a, q) => (q.service.length > a.length ? q.service : a),
  ""
);

type Row = { id: string; rating: string; bar: string };

const competitors: Row[] = [
  { id: "a", rating: "4.3", bar: "w-28" },
  { id: "b", rating: "4.1", bar: "w-36" },
  { id: "c", rating: "4.4", bar: "w-24" },
  { id: "d", rating: "3.9", bar: "w-32" },
];

const START: string[] = ["a", "b", "c", "d", "you"];
const FINAL: string[] = ["you", "a", "b", "c", "d"];

const Stars: React.FC<{ gold?: boolean }> = ({ gold }) => (
  <span className={`tracking-[-0.05em] ${gold ? "text-amber-500" : "text-slate-300"}`}>
    ★★★★★
  </span>
);

export const RankClimb: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [order, setOrder] = useState<string[]>(START);
  const [queryIndex, setQueryIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const atTop = order[0] === "you";
  const query = queries[queryIndex];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Jump straight to the finished state; no loop.
      timer = setTimeout(() => setOrder(FINAL), 0);
      return () => clearTimeout(timer);
    }

    if (!atTop) {
      timer = setTimeout(() => {
        setOrder((prev) => {
          const i = prev.indexOf("you");
          if (i <= 0) return prev;
          const next = [...prev];
          [next[i - 1], next[i]] = [next[i], next[i - 1]];
          return next;
        });
      }, STEP_MS);
    } else {
      timer = setTimeout(() => {
        setFading(true);
        timer = setTimeout(() => {
          setOrder(START);
          setQueryIndex((q) => (q + 1) % queries.length);
          setFading(false);
        }, 450);
      }, HOLD_MS);
    }

    return () => clearTimeout(timer);
  }, [order, atTop]);

  const rows: (Row & { you?: boolean })[] = [
    ...competitors,
    { id: "you", rating: "4.9", bar: "", you: true },
  ];

  return (
    <div
      role="img"
      aria-label="Animation: your business climbing from fifth place to first in local search results, then being recommended by an AI assistant."
      className={`relative ${className}`}
    >
      <div className="absolute -inset-10 pointer-events-none bg-[radial-gradient(closest-side,rgba(212,169,55,0.2),transparent)]" />

      <div
        aria-hidden="true"
        className="rank-card relative rounded-3xl border border-hair p-4 sm:p-5"
      >
        {/* Search bar */}
        <div className="flex items-center gap-2.5 rounded-full bg-white/90 border border-hair px-4 py-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <svg className="w-4 h-4 text-ink-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" strokeWidth={2} />
            <path strokeLinecap="round" strokeWidth={2} d="M20 20l-3.5-3.5" />
          </svg>
          <span
            key={query.text}
            className={`text-sm text-ink truncate transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
          >
            {query.text}
          </span>
          <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-ink-4 shrink-0">
            <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
            </svg>
            Ottawa, ON
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 mb-2 px-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-4">
            Local results
          </p>
          <p className="text-[11px] text-ink-4">Maps · Search · AI</p>
        </div>

        {/* Results */}
        <div
          className={`relative transition-opacity duration-400 ${fading ? "opacity-0" : "opacity-100"}`}
          style={{ height: ROW * rows.length }}
        >
          {rows.map((row) => {
            const pos = order.indexOf(row.id);
            const isTop = row.you && pos === 0;
            return (
              <div
                key={row.id}
                className={`absolute inset-x-0 top-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${row.you ? "z-10" : ""}`}
                style={{ transform: `translateY(${pos * ROW}px)`, height: ROW }}
              >
                <div
                  className={`h-[52px] flex items-center gap-3 rounded-xl px-3 transition-[background-color,box-shadow] duration-500 ${
                    row.you
                      ? `bg-amber-50/95 ring-1 ${isTop ? "ring-amber-500 shadow-[0_8px_28px_-8px_rgba(212,169,55,0.55)]" : "ring-amber-400/60"}`
                      : "bg-white/55"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-500 ${
                      row.you
                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {pos + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    {row.you ? (
                      <p className="text-sm font-bold text-ink leading-tight truncate">Your Business</p>
                    ) : (
                      <span className={`block h-2.5 rounded-full bg-slate-200 ${row.bar}`} />
                    )}
                    <p className="text-[11px] leading-tight mt-1 flex items-center gap-1.5 whitespace-nowrap">
                      <span className={row.you ? "font-semibold text-ink-2" : "text-slate-400"}>
                        {row.rating}
                      </span>
                      <Stars gold={row.you} />
                      {row.you && <span className="text-emerald-700 font-medium truncate">· Open now</span>}
                    </p>
                  </div>

                  {row.you ? (
                    <span
                      className={`text-[11px] font-semibold rounded-full px-2.5 py-1 shrink-0 transition-all duration-500 ${
                        isTop ? "bg-ink text-white scale-100" : "bg-white text-ink-3 border border-hair"
                      }`}
                    >
                      {isTop ? "Picked first" : "Call"}
                    </span>
                  ) : (
                    <span className="w-10 h-5 rounded-full bg-slate-100 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI answer: "thinking" while the climb runs, then the pick. */}
        <div
          className={`mt-2 rounded-2xl border bg-white/80 p-3.5 transition-[border-color,box-shadow,opacity] duration-500 ${
            fading ? "opacity-0" : "opacity-100"
          } ${atTop ? "border-violet-300/70 shadow-[0_8px_24px_-12px_rgba(109,40,217,0.35)]" : "border-hair"}`}
        >
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-tech-end mb-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" />
            </svg>
            AI assistant
          </p>
          {/* All states share one grid cell, sized by an invisible copy of
              the longest answer, so the box never changes height. A height
              change here shifted everything below it on every loop, and iOS
              Safari has no scroll anchoring to hide that. */}
          <div className="grid [&>*]:[grid-area:1/1]">
            <p className="invisible text-sm leading-snug" aria-hidden="true">
              For {longestService} in Ottawa, a top pick is{" "}
              <span className="font-bold">Your Business</span> — 4.9★ from
              local reviews and open now.
            </p>
            {atTop ? (
              <p key={query.text} className="ai-answer-in text-sm text-ink-2 leading-snug">
                For {query.service} in Ottawa, a top pick is{" "}
                <span className="font-bold text-ink">Your Business</span> — 4.9★ from
                local reviews and open now.
              </p>
            ) : (
              <p className="flex items-start gap-2 text-sm text-ink-4 leading-snug">
                Looking for the best match
                <span className="typing-dots mt-2" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
