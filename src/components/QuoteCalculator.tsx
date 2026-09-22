"use client";

import React, { useMemo, useState } from "react";
import { GoldButton } from "./Buttons";

type ProjectType = "landing-page" | "business-website" | "ecommerce";

const projectTypes: { id: ProjectType; label: string; base: number }[] = [
  { id: "landing-page", label: "Landing Page", base: 1900 },
  { id: "business-website", label: "Business Website", base: 4800 },
  { id: "ecommerce", label: "Business Website + Online Store", base: 8400 },
];

const pageOptions = [
  { id: "1-3", label: "1-3 pages", multiplier: 0 },
  { id: "4-7", label: "4-7 pages", multiplier: 1200 },
  { id: "8-plus", label: "8+ pages", multiplier: 2800 },
];

const addOns = [
  { id: "copywriting", label: "Professional copywriting", cost: 1000 },
  { id: "seo", label: "Local SEO setup", cost: 800 },
  { id: "booking", label: "Online booking integration", cost: 900 },
  { id: "growth", label: "Ongoing Website Growth plan", cost: 1300 },
];

export const QuoteCalculator: React.FC = () => {
  const [projectType, setProjectType] = useState<ProjectType>("business-website");
  const [pages, setPages] = useState(pageOptions[1].id);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const toggleAddOn = (id: string) =>
    setSelectedAddOns((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const estimate = useMemo(() => {
    const base = projectTypes.find((p) => p.id === projectType)?.base ?? 0;
    const pageCost = pageOptions.find((p) => p.id === pages)?.multiplier ?? 0;
    const addOnCost = selectedAddOns.reduce((sum, id) => {
      const addOn = addOns.find((a) => a.id === id);
      return sum + (addOn?.cost ?? 0);
    }, 0);
    const low = base + pageCost + addOnCost;
    const high = Math.round(low * 1.25);
    return { low, high };
  }, [projectType, pages, selectedAddOns]);

  return (
    <div className="rounded-2xl border border-hair glass p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10">
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Project type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {projectTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setProjectType(type.id)}
                  aria-pressed={projectType === type.id}
                  className={`text-left rounded-xl border px-4 py-3 text-sm transition-colors ${
                    projectType === type.id
                      ? "border-amber-500 bg-amber-500/10 text-ink"
                      : "border-hair bg-transparent text-ink-2 hover:border-amber-500/40"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Number of pages</h3>
            <div className="grid grid-cols-3 gap-3">
              {pageOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPages(option.id)}
                  aria-pressed={pages === option.id}
                  className={`rounded-xl border px-4 py-3 text-sm transition-colors ${
                    pages === option.id
                      ? "border-amber-500 bg-amber-500/10 text-ink"
                      : "border-hair bg-transparent text-ink-2 hover:border-amber-500/40"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Add-ons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addOns.map((addOn) => (
                <label
                  key={addOn.id}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
                    selectedAddOns.includes(addOn.id)
                      ? "border-amber-500 bg-amber-500/10 text-ink"
                      : "border-hair bg-transparent text-ink-2 hover:border-amber-500/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addOn.id)}
                    onChange={() => toggleAddOn(addOn.id)}
                    className="accent-amber-500"
                  />
                  {addOn.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-transparent p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-3 mb-2">Estimated investment</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gradient-gold mb-4">
              ${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}
            </p>
            <p className="text-sm text-ink-3 leading-relaxed">
              This is a starting-point estimate. Your free assessment gives
              you a firm, itemized quote based on your exact goals.
            </p>
          </div>
          <div className="mt-8">
            <GoldButton className="w-full">Get My Exact Quote</GoldButton>
          </div>
        </div>
      </div>
    </div>
  );
};
