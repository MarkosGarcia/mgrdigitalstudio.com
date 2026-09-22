"use client";

import React, { useState } from "react";

type ProjectType = "landing-page" | "business-website" | "ecommerce";

const projectTypes: { id: ProjectType; label: string }[] = [
  { id: "landing-page", label: "Landing Page" },
  { id: "business-website", label: "Business Website" },
  { id: "ecommerce", label: "Business Website + Online Store" },
];

const pageOptions = [
  { id: "1-3", label: "1-3 pages" },
  { id: "4-7", label: "4-7 pages" },
  { id: "8-plus", label: "8+ pages" },
];

const addOns = [
  { id: "copywriting", label: "Professional copywriting" },
  { id: "seo", label: "Local SEO setup" },
  { id: "booking", label: "Online booking integration" },
  { id: "growth", label: "Ongoing Website Growth plan" },
];

const FALLBACK_EMAIL = "info@mgrdigitalstudio.com";

const inputClasses =
  "w-full bg-white/75 border border-hair-strong rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)] focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/35 outline-none transition-colors";

const Field: React.FC<{ label: string; htmlFor: string; children: React.ReactNode }> = ({
  label,
  htmlFor,
  children,
}) => (
  <div>
    <label htmlFor={htmlFor} className="block text-xs font-medium text-ink-3 mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

export const QuoteCalculator: React.FC = () => {
  const [projectType, setProjectType] = useState<ProjectType>("business-website");
  const [pages, setPages] = useState(pageOptions[1].id);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const toggleAddOn = (id: string) =>
    setSelectedAddOns((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const projectLabel = projectTypes.find((p) => p.id === projectType)?.label ?? "";
    const pagesLabel = pageOptions.find((p) => p.id === pages)?.label ?? "";
    const addOnLabels = selectedAddOns
      .map((id) => addOns.find((a) => a.id === id)?.label)
      .filter(Boolean);

    const message = [
      `Pages: ${pagesLabel}`,
      addOnLabels.length ? `Interested in: ${addOnLabels.join(", ")}` : null,
      notes.trim() ? `Notes: ${notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      source: "quote-calculator",
      name,
      email,
      phone,
      businessName,
      primaryGoal: projectLabel,
      message,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      return;
    } catch {
      // fall through to mailto below
    }

    const subject = encodeURIComponent(`Quote request — ${businessName || name || "New project"}`);
    const body = encodeURIComponent(
      `Project type: ${projectLabel}\n${message}\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nBusiness: ${businessName}`
    );
    window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-hair glass p-10 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-ink mb-2">Got it</h3>
        <p className="text-sm text-ink-3 max-w-sm mx-auto">
          I&apos;ll look at what you&apos;ve described and reply within one business day with a
          fixed, itemized quote — no obligation to say yes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-hair glass p-6 sm:p-8 space-y-8">
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
        <h3 className="text-sm font-semibold text-ink mb-3">Roughly how many pages</h3>
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
        <h3 className="text-sm font-semibold text-ink mb-3">Anything else you&apos;re after</h3>
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

      <div className="border-t border-hair pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-ink">Where should the quote go</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" htmlFor="qc-name">
            <input
              id="qc-name"
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
              autoComplete="name"
            />
          </Field>
          <Field label="Email" htmlFor="qc-email">
            <input
              id="qc-email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              autoComplete="email"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone" htmlFor="qc-phone">
            <input
              id="qc-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses}
              autoComplete="tel"
            />
          </Field>
          <Field label="Business Name" htmlFor="qc-business">
            <input
              id="qc-business"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className={inputClasses}
            />
          </Field>
        </div>
        <Field label="Anything I should know before I quote this?" htmlFor="qc-notes">
          <textarea
            id="qc-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={inputClasses}
            placeholder="Optional — timeline, an existing site to look at, anything specific"
          />
        </Field>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong sending this. Please try again, or email{" "}
          <a href={`mailto:${FALLBACK_EMAIL}`} className="underline">
            {FALLBACK_EMAIL}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(212,169,55,0.25)] transition-colors"
      >
        {status === "submitting" ? "Sending..." : "Request my quote"}
      </button>
      <p className="text-xs text-ink-4 text-center">
        A fixed, itemized quote back within one business day — no price list, no obligation.
      </p>
    </form>
  );
};
