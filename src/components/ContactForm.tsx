"use client";

import React, { useState } from "react";

type State = { name: string; email: string; phone: string; message: string };
const initial: State = { name: "", email: "", phone: "", message: "" };
const FALLBACK_EMAIL = "info@mgrdigitalstudio.com";

const inputClasses =
  "w-full bg-white/75 border border-hair-strong rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)] focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/35 outline-none transition-colors";

export const ContactForm: React.FC = () => {
  const [form, setForm] = useState<State>(initial);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const update =
    (field: keyof State) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "contact", ...form }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm(initial);
      return;
    } catch {
      // fall through to mailto below
    }

    const subject = encodeURIComponent(`New message from ${form.name || "website contact form"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("success");
    setForm(initial);
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-amber-500/20 glass p-8 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-ink mb-1">Message sent</h3>
        <p className="text-sm text-ink-3">We&apos;ll get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-medium text-ink-3 mb-1.5">
            Full Name
          </label>
          <input id="contact-name" required type="text" value={form.name} onChange={update("name")} className={inputClasses} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-xs font-medium text-ink-3 mb-1.5">
            Email
          </label>
          <input id="contact-email" required type="email" value={form.email} onChange={update("email")} className={inputClasses} autoComplete="email" />
        </div>
      </div>
      <div>
        <label htmlFor="contact-phone" className="block text-xs font-medium text-ink-3 mb-1.5">
          Phone (optional)
        </label>
        <input id="contact-phone" type="tel" value={form.phone} onChange={update("phone")} className={inputClasses} autoComplete="tel" />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-xs font-medium text-ink-3 mb-1.5">
          How can we help?
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          className={inputClasses}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong. Please try again, or email{" "}
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
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};
