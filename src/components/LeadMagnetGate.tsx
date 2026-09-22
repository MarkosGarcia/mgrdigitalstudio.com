"use client";

import React, { useState } from "react";

const inputClasses =
  "w-full bg-white/75 border border-hair-strong rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)] focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/35 outline-none transition-colors";

const items = [
  { title: "A headline that names the outcome", detail: "Not your industry — the result a visitor gets by working with you." },
  { title: "One clear call to action per page", detail: "A single obvious next step, repeated, not buried in a menu." },
  { title: "Load times under two seconds", detail: "Every extra second measurably increases how many visitors leave." },
  { title: "A mobile-first layout", detail: "Designed for the phone first, since that's where most local traffic lands." },
  { title: "Trust signals above the fold", detail: "Reviews, results and recognizable proof, visible before the first scroll." },
  { title: "Local SEO fundamentals", detail: "Structured data, accurate business info, and location-aware content." },
  { title: "A fast, simple contact path", detail: "Click-to-call, a short form, or both — never a maze to reach you." },
  { title: "Real photography, not generic stock", detail: "Even a few authentic photos build more trust than polished stock art." },
  { title: "A reason to act now", detail: "Urgency or a clear next step — not just information with no direction." },
  { title: "A plan for what happens after launch", detail: "Ongoing care and optimization, not a site left untouched for years." },
];

export const LeadMagnetGate: React.FC = () => {
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "lead-magnet", email }),
      });
    } catch {
      // Non-blocking — still unlock the content on-page even if the
      // save fails, since that's the value being promised here.
    }
    setUnlocked(true);
  };

  if (!unlocked) {
    return (
      <div className="rounded-2xl border border-hair glass p-8 max-w-md mx-auto text-center">
        <p className="text-sm text-ink-3 mb-5">
          Enter your email to unlock the full list instantly.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="lead-magnet-email" className="sr-only">
            Email address
          </label>
          <input
            id="lead-magnet-email"
            type="email"
            required
            placeholder="you@business.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
          />
          <button
            type="submit"
            className="whitespace-nowrap bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Unlock the List
          </button>
        </form>
        <p className="mt-3 text-xs text-ink-4">No spam. Unsubscribe anytime.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {items.map((item, i) => (
        <div key={item.title} className="flex gap-4 rounded-xl border border-hair glass p-5">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] flex items-center justify-center text-xs font-bold text-white">
            {i + 1}
          </span>
          <div>
            <p className="text-ink font-semibold mb-1">{item.title}</p>
            <p className="text-sm text-ink-3">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
