"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAssessmentModal } from "./AssessmentModalContext";

type FormState = {
  websiteUrl: string;
  businessName: string;
  industry: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  primaryGoal: string;
};

const initialState: FormState = {
  websiteUrl: "",
  businessName: "",
  industry: "",
  location: "",
  name: "",
  email: "",
  phone: "",
  primaryGoal: "Show up higher on Google Maps",
};

// Submissions go to our own /api/leads (Cloudflare Pages Function + D1 —
// see functions/api/leads.ts). If that's unreachable, we fall back to a
// pre-filled email so a lead is never silently lost.
const FALLBACK_EMAIL = "info@mgrdigitalstudio.com";

export const AssessmentModal: React.FC = () => {
  const { isOpen, close } = useAssessmentModal();
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    firstFieldRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "assessment", ...form }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      setForm(initialState);
      return;
    } catch {
      // fall through to mailto below
    }

    const subject = encodeURIComponent(
      `Visibility audit request — ${form.businessName || "New lead"}`
    );
    const body = encodeURIComponent(
      `Business Name: ${form.businessName}\n` +
        `Website URL: ${form.websiteUrl}\n` +
        `Industry: ${form.industry}\n` +
        `Location: ${form.location}\n` +
        `Name: ${form.name}\n` +
        `Email: ${form.email}\n` +
        `Phone: ${form.phone}\n` +
        `Primary Goal: ${form.primaryGoal}\n`
    );
    window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("success");
    setForm(initialState);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assessment-modal-title"
    >
      <div
        className="absolute inset-0 bg-[#0b1220]/35 backdrop-blur-[3px]"
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-blur glass-modal border border-hair-strong rounded-2xl p-6 sm:p-8"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-ink-3 hover:text-ink transition-colors p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-ink mb-2">Got it</h2>
            <p className="text-sm text-ink-3 mb-6">
              We&apos;ll check where you show up on Google Maps, in search and in AI answers, and email you back within two business days. If it turns out you don&apos;t need us, we&apos;ll say that too.
            </p>
            <button
              type="button"
              onClick={close}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold px-6 py-2.5 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2
              id="assessment-modal-title"
              className="text-xl sm:text-2xl font-bold text-ink mb-1 tracking-tight"
            >
              Free visibility audit
            </h2>
            <p className="text-sm text-ink-3 mb-6">
              Tell us your business and the area you serve. We&apos;ll check where you show up on Google Maps, in search and in AI answers — and send back what&apos;s holding you back.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" htmlFor="name">
                  <input
                    ref={firstFieldRef}
                    id="name"
                    required
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    className={inputClasses}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email" htmlFor="email">
                  <input
                    id="email"
                    required
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    className={inputClasses}
                    autoComplete="email"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Phone" htmlFor="phone">
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    className={inputClasses}
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Business Name" htmlFor="businessName">
                  <input
                    id="businessName"
                    required
                    type="text"
                    value={form.businessName}
                    onChange={update("businessName")}
                    className={inputClasses}
                  />
                </Field>
              </div>

              <Field label="Current Website URL (if you have one)" htmlFor="websiteUrl">
                <input
                  id="websiteUrl"
                  type="text"
                  placeholder="yourbusiness.com"
                  value={form.websiteUrl}
                  onChange={update("websiteUrl")}
                  className={inputClasses}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="What do customers search for?" htmlFor="industry">
                  <input
                    id="industry"
                    type="text"
                    placeholder="e.g. plumber, dentist, flooring"
                    value={form.industry}
                    onChange={update("industry")}
                    className={inputClasses}
                  />
                </Field>
                <Field label="Area you serve" htmlFor="location">
                  <input
                    id="location"
                    type="text"
                    placeholder="e.g. Ottawa, Kanata, Orléans"
                    value={form.location}
                    onChange={update("location")}
                    className={inputClasses}
                  />
                </Field>
              </div>

              <Field label="Primary Goal" htmlFor="primaryGoal">
                <select
                  id="primaryGoal"
                  value={form.primaryGoal}
                  onChange={update("primaryGoal")}
                  className={inputClasses}
                >
                  <option>Show up higher on Google Maps</option>
                  <option>Get recommended by AI (ChatGPT, Gemini)</option>
                  <option>More Google reviews</option>
                  <option>More calls from my website</option>
                  <option>A new website</option>
                  <option>Not sure yet</option>
                </select>
              </Field>

              {status === "error" && (
                <p className="text-sm text-red-600">
                  Something went wrong sending your request. Please try again, or email{" "}
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
                {status === "submitting" ? "Sending..." : "Get my free audit"}
              </button>
              <p className="text-xs text-ink-4 text-center">
                One reply from a person. We won&apos;t add you to a mailing list.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const inputClasses =
  "w-full bg-white/75 border border-hair-strong rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)] focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/35 outline-none transition-colors";

const Field: React.FC<{
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}> = ({ label, htmlFor, children }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-xs font-medium text-ink-3 mb-1.5">
      {label}
    </label>
    {children}
  </div>
);
