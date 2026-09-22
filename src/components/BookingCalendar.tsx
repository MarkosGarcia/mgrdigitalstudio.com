"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SLOT_MS,
  SLOT_MINUTES,
  HORIZON_DAYS,
  LEAD_TIME_MINUTES,
  OWNER_TZ,
  ceilToGrid,
  isBlocked,
  type Block,
  type Exception,
} from "@/lib/scheduling";
import { EMAIL } from "@/lib/business";

type Availability = {
  slotMinutes: number;
  leadTimeMinutes: number;
  horizonDays: number;
  ownerTz: string;
  blocks: Block[];
  exceptions: Exception[];
  booked: string[];
};

type Mode = "video" | "phone";

const inputClasses =
  "w-full bg-white/75 border border-hair-strong rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)] focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/35 outline-none transition-colors";

/**
 * Slots are grouped by part of the visitor's day rather than listed flat.
 * The owner is open around the clock, so most days offer over seventy slots —
 * as one wall of buttons that is genuinely hard to read.
 */
const DAY_PARTS = [
  { key: "night", label: "Overnight", from: 0, to: 6 },
  { key: "morning", label: "Morning", from: 6, to: 12 },
  { key: "afternoon", label: "Afternoon", from: 12, to: 18 },
  { key: "evening", label: "Evening", from: 18, to: 24 },
] as const;

function startOfLocalDay(base: Date, addDays: number): Date {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + addDays, 0, 0, 0, 0);
  return d;
}

function icsStamp(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export const BookingCalendar: React.FC = () => {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadError, setLoadError] = useState("");
  const [dayOffset, setDayOffset] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmed, setConfirmed] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    mode: "video" as Mode,
    hp: "",
  });

  const formRef = useRef<HTMLDivElement>(null);

  // Fixed at mount so the grid doesn't shift under the visitor mid-session.
  const [now] = useState(() => Date.now());
  const today = useMemo(() => new Date(now), [now]);

  const visitorTz = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      return "UTC";
    }
  }, []);

  const load = useCallback(async () => {
    setLoadError("");
    try {
      const res = await fetch("/api/availability");
      if (!res.ok) throw new Error(String(res.status));
      setAvailability(await res.json());
    } catch {
      setLoadError("Could not load available times.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const bookedSet = useMemo(
    () => new Set(availability?.booked ?? []),
    [availability]
  );

  const days = useMemo(
    () => Array.from({ length: HORIZON_DAYS }, (_, i) => startOfLocalDay(today, i)),
    [today]
  );

  /**
   * The grid is anchored to the UTC epoch, not to local midnight, so that every
   * visitor is choosing from the same set of instants — see the note in
   * lib/scheduling. In a half-hour-offset zone that means times read 4:10 or
   * 4:30 rather than on the hour, which is honest and still perfectly bookable.
   */
  const slotsForSelectedDay = useMemo(() => {
    if (!availability) return [];
    const dayStart = startOfLocalDay(today, dayOffset).getTime();
    const dayEnd = startOfLocalDay(today, dayOffset + 1).getTime();
    const earliest = now + LEAD_TIME_MINUTES * 60_000;
    const latest = now + HORIZON_DAYS * 86_400_000;

    const out: number[] = [];
    for (let t = ceilToGrid(dayStart); t < dayEnd; t += SLOT_MS) {
      if (t < earliest || t > latest) continue;
      if (bookedSet.has(new Date(t).toISOString())) continue;
      if (isBlocked(t, availability.blocks, availability.exceptions)) continue;
      out.push(t);
    }
    return out;
  }, [availability, today, dayOffset, now, bookedSet]);

  const grouped = useMemo(() => {
    return DAY_PARTS.map((part) => ({
      ...part,
      slots: slotsForSelectedDay.filter((t) => {
        const h = new Date(t).getHours();
        return h >= part.from && h < part.to;
      }),
    })).filter((part) => part.slots.length > 0);
  }, [slotsForSelectedDay]);

  const timeFmt = useMemo(
    () => new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }),
    []
  );
  const ownerFmt = useMemo(
    () =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: OWNER_TZ,
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }),
    []
  );
  const fullFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }),
    []
  );

  const selectSlot = (t: number) => {
    setSelected(t);
    setSubmitError("");
    // The form appears below the grid; on a phone that is off-screen.
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected === null || submitting) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startsAt: new Date(selected).toISOString(),
          name: form.name,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
          mode: form.mode,
          timezone: visitorTz,
          hp: form.hp,
        }),
      });

      if (res.status === 409) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error ?? "That time was just taken. Please pick another.");
        setSelected(null);
        load();
        return;
      }
      if (!res.ok) throw new Error(String(res.status));

      setConfirmed(selected);
    } catch {
      setSubmitError(
        `Something went wrong booking that time. Please email ${EMAIL} and I'll sort it out.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const downloadIcs = () => {
    if (confirmed === null) return;
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//mgrdigitalstudio.com//Discovery Call//EN",
      "BEGIN:VEVENT",
      `UID:${confirmed}@mgrdigitalstudio.com`,
      `DTSTAMP:${icsStamp(Date.now())}`,
      `DTSTART:${icsStamp(confirmed)}`,
      `DTEND:${icsStamp(confirmed + SLOT_MS)}`,
      "SUMMARY:Discovery call — mgrdigitalstudio.com",
      `DESCRIPTION:A ${SLOT_MINUTES}-minute call with Marcos about your website.`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "discovery-call.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (confirmed !== null) {
    return (
      <div className="rounded-2xl border border-amber-500/25 glass p-8 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-ink mb-2">You&apos;re booked</h3>
        <p className="text-sm text-ink-2 mb-1">{fullFmt.format(new Date(confirmed))}</p>
        <p className="text-xs text-ink-4 mb-6">
          That&apos;s {ownerFmt.format(new Date(confirmed))} my time. I&apos;ll{" "}
          {form.mode === "phone" ? "call you" : "send a video link"} just before.
        </p>
        <button
          type="button"
          onClick={downloadIcs}
          className="pressable lift inline-flex items-center justify-center gap-2 rounded-xl border border-hair glass px-5 py-2.5 text-sm font-medium text-ink"
        >
          Add to my calendar
        </button>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-hair glass p-8 text-center">
        <p className="text-sm text-ink-2 mb-4">{loadError}</p>
        <button
          type="button"
          onClick={load}
          className="pressable text-sm font-semibold text-gold link-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!availability) {
    return (
      <div className="rounded-2xl border border-hair glass p-8">
        <div className="h-4 w-40 rounded bg-slate-500/10 mb-6" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-9 rounded-lg bg-slate-500/10" />
          ))}
        </div>
        <span className="sr-only">Loading available times…</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-hair glass p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
        <h2 className="text-sm font-semibold text-ink">Pick a time</h2>
        <p className="text-xs text-ink-4">
          Times in {visitorTz.replace(/_/g, " ")}
        </p>
      </div>

      {/* Day strip. Horizontal scroll rather than a month grid — three weeks of
          days fits, and it keeps the slot list the main thing on the page. */}
      <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto pb-2">
        {days.map((day, i) => {
          const isActive = i === dayOffset;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                setDayOffset(i);
                setSelected(null);
              }}
              aria-pressed={isActive}
              className={`pressable shrink-0 rounded-xl border px-3 py-2 text-center transition-colors ${
                isActive
                  ? "border-amber-600 bg-amber-500/15 text-ink"
                  : "border-hair bg-white/55 text-ink-3 hover:bg-white/80"
              }`}
            >
              <span className="block text-[10px] font-semibold uppercase tracking-wider">
                {day.toLocaleDateString(undefined, { weekday: "short" })}
              </span>
              <span className="block text-sm font-semibold text-ink">{day.getDate()}</span>
              <span className="block text-[10px] text-ink-4">
                {day.toLocaleDateString(undefined, { month: "short" })}
              </span>
            </button>
          );
        })}
      </div>

      {grouped.length === 0 ? (
        <p className="text-sm text-ink-3 py-6">
          Nothing free on this day. Try another — or just{" "}
          <a href={`mailto:${EMAIL}`} className="text-gold link-underline font-medium">
            email me
          </a>{" "}
          and we&apos;ll find a time.
        </p>
      ) : (
        <div className="max-h-[22rem] overflow-y-auto pr-1 space-y-5">
          {grouped.map((part) => (
            <div key={part.key}>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-4 mb-2">
                {part.label}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                {part.slots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => selectSlot(t)}
                    aria-pressed={selected === t}
                    className={`pressable rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                      selected === t
                        ? "border-amber-600 bg-amber-500/20 text-ink"
                        : "border-hair bg-white/55 text-ink-2 hover:bg-white/85"
                    }`}
                  >
                    {timeFmt.format(new Date(t))}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {submitError && (
        <p className="mt-5 text-sm text-red-600" role="alert">
          {submitError}
        </p>
      )}

      <div ref={formRef}>
        {selected !== null && (
          <form onSubmit={submit} className="mt-7 pt-7 border-t border-hair space-y-4">
            <div>
              <p className="text-sm font-semibold text-ink">
                {fullFmt.format(new Date(selected))}
              </p>
              <p className="text-xs text-ink-4 mt-0.5">
                {SLOT_MINUTES} minutes · {ownerFmt.format(new Date(selected))} my time
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bk-name" className="block text-xs font-medium text-ink-3 mb-1.5">
                  Your name
                </label>
                <input
                  id="bk-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClasses}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="bk-email" className="block text-xs font-medium text-ink-3 mb-1.5">
                  Email
                </label>
                <input
                  id="bk-email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClasses}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bk-phone" className="block text-xs font-medium text-ink-3 mb-1.5">
                  Phone or WhatsApp {form.mode === "phone" ? "" : "(optional)"}
                </label>
                <input
                  id="bk-phone"
                  type="tel"
                  required={form.mode === "phone"}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClasses}
                  autoComplete="tel"
                />
              </div>
              <div>
                <span className="block text-xs font-medium text-ink-3 mb-1.5">Call type</span>
                <div className="flex gap-2">
                  {(["video", "phone"] as Mode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setForm({ ...form, mode })}
                      aria-pressed={form.mode === mode}
                      className={`pressable flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        form.mode === mode
                          ? "border-amber-600 bg-amber-500/15 text-ink"
                          : "border-hair bg-white/55 text-ink-3 hover:bg-white/85"
                      }`}
                    >
                      {mode === "video" ? "Video" : "Phone"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="bk-notes" className="block text-xs font-medium text-ink-3 mb-1.5">
                Anything I should know first? (optional)
              </label>
              <textarea
                id="bk-notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className={inputClasses}
              />
            </div>

            {/* Honeypot. Hidden from people, irresistible to bots. */}
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={form.hp}
              onChange={(e) => setForm({ ...form, hp: e.target.value })}
              className="absolute left-[-9999px] w-px h-px opacity-0"
            />

            <button
              type="submit"
              disabled={submitting}
              className="pressable w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(212,169,55,0.25)] transition-colors"
            >
              {submitting ? "Booking…" : "Confirm this time"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
