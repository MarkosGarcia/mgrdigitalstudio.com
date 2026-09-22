"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  OWNER_TZ,
  WEEKDAY_NAMES,
  formatBlockRange,
  timeValueToMinutes,
  type Block,
  type Exception,
} from "@/lib/scheduling";

type Booking = {
  id: number;
  starts_at: string;
  duration_min: number;
  name: string;
  email: string;
  phone: string | null;
  visitor_tz: string | null;
  mode: string;
  notes: string | null;
  status: string;
};

const inputClasses =
  "w-full bg-white/75 border border-hair-strong rounded-lg px-3 py-2 text-sm text-ink shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)] focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/35 outline-none transition-colors";

/**
 * Times here are entered and shown in the owner's own zone, because that is how
 * the schedule is actually thought about — "Thursdays, six till half nine".
 * Recurring blocks are stored as weekday plus minutes-past-midnight for exactly
 * that reason; see lib/scheduling for why they are not converted to UTC.
 */
export const AvailabilityManager: React.FC<{ authHeader: string }> = ({ authHeader }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [blockForm, setBlockForm] = useState({
    weekday: 4,
    start: "18:00",
    end: "21:20",
    label: "",
  });
  const [exceptionForm, setExceptionForm] = useState({ start: "", end: "", label: "" });

  const load = useCallback(async () => {
    setError("");
    try {
      const [availRes, bookRes] = await Promise.all([
        fetch("/api/availability"),
        fetch("/api/bookings", { headers: { Authorization: authHeader } }),
      ]);
      if (availRes.ok) {
        const data = await availRes.json();
        setBlocks(data.blocks ?? []);
        setExceptions(data.exceptions ?? []);
      }
      if (bookRes.ok) {
        const data = await bookRes.json();
        setBookings(data.bookings ?? []);
      }
    } catch {
      setError("Could not load the schedule.");
    }
  }, [authHeader]);

  useEffect(() => {
    load();
  }, [load]);

  const post = async (payload: unknown) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "That didn't save.");
        return false;
      }
      await load();
      return true;
    } catch {
      setError("Could not reach the server.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const addBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const startMin = timeValueToMinutes(blockForm.start);
    const endRaw = timeValueToMinutes(blockForm.end);
    if (startMin === null || endRaw === null) {
      setError("Those times don't look right.");
      return;
    }
    // A block ending earlier than it starts means it ran past midnight; store
    // that as minutes beyond 1440 rather than splitting it into two rows.
    const endMin = endRaw <= startMin ? endRaw + 1440 : endRaw;
    const ok = await post({
      kind: "block",
      weekday: blockForm.weekday,
      startMin,
      endMin,
      label: blockForm.label,
    });
    if (ok) setBlockForm({ ...blockForm, label: "" });
  };

  const addException = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exceptionForm.start || !exceptionForm.end) {
      setError("Pick a start and an end.");
      return;
    }
    // datetime-local gives a wall-clock string with no zone; the browser reads
    // it as local, which is the owner's own time. That is what we want.
    const ok = await post({
      kind: "exception",
      startsAt: new Date(exceptionForm.start).toISOString(),
      endsAt: new Date(exceptionForm.end).toISOString(),
      label: exceptionForm.label,
    });
    if (ok) setExceptionForm({ start: "", end: "", label: "" });
  };

  const remove = async (kind: "block" | "exception", id?: number) => {
    if (!id) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/availability?kind=${kind}&id=${id}`, {
        method: "DELETE",
        headers: { Authorization: authHeader },
      });
      if (res.ok) await load();
    } finally {
      setBusy(false);
    }
  };

  const cancelBooking = async (id: number) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: authHeader },
      });
      if (res.ok) await load();
    } finally {
      setBusy(false);
    }
  };

  const blocksByDay = useMemo(() => {
    const map = new Map<number, Block[]>();
    for (const block of blocks) {
      const list = map.get(block.weekday) ?? [];
      list.push(block);
      map.set(block.weekday, list);
    }
    return map;
  }, [blocks]);

  const ownerFmt = useMemo(
    () =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: OWNER_TZ,
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    []
  );

  const upcoming = (bookings ?? []).filter(
    (b) => b.status === "confirmed" && Date.parse(b.starts_at) > Date.now()
  );

  return (
    <div className="space-y-10">
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <section>
        <h2 className="text-lg font-bold text-ink mb-1">Upcoming calls</h2>
        <p className="text-xs text-ink-4 mb-4">
          Shown in your time ({OWNER_TZ.split("/")[1].replace("_", " ")}).
        </p>

        {bookings === null ? (
          <p className="text-sm text-ink-3">Loading…</p>
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-ink-4">Nothing booked yet.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((booking) => (
              <li
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hair glass px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {ownerFmt.format(new Date(booking.starts_at))}
                    <span className="ml-2 text-xs font-medium text-ink-4">
                      {booking.duration_min} min · {booking.mode}
                    </span>
                  </p>
                  <p className="text-sm text-ink-2 truncate">
                    {booking.name} · {booking.email}
                    {booking.phone ? ` · ${booking.phone}` : ""}
                  </p>
                  {booking.notes && (
                    <p className="text-xs text-ink-4 mt-1 whitespace-pre-wrap">{booking.notes}</p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => cancelBooking(booking.id)}
                  className="pressable shrink-0 text-xs font-medium text-red-600 border border-red-500/30 bg-red-500/5 rounded-lg px-3 py-1.5"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-ink mb-1">Weekly busy hours</h2>
        <p className="text-xs text-ink-4 mb-4">
          Times you&apos;re never free. Everything else on the calendar stays bookable, around
          the clock.
        </p>

        <form
          onSubmit={addBlock}
          className="grid grid-cols-2 sm:grid-cols-[1.4fr_repeat(2,0.8fr)_1.4fr_auto] gap-3 items-end mb-5"
        >
          <label className="block">
            <span className="block text-xs font-medium text-ink-3 mb-1.5">Day</span>
            <select
              value={blockForm.weekday}
              onChange={(e) => setBlockForm({ ...blockForm, weekday: Number(e.target.value) })}
              className={inputClasses}
            >
              {WEEKDAY_NAMES.map((name, i) => (
                <option key={name} value={i}>
                  Every {name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-ink-3 mb-1.5">From</span>
            <input
              type="time"
              step={60}
              value={blockForm.start}
              onChange={(e) => setBlockForm({ ...blockForm, start: e.target.value })}
              className={inputClasses}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-ink-3 mb-1.5">To</span>
            <input
              type="time"
              step={60}
              value={blockForm.end}
              onChange={(e) => setBlockForm({ ...blockForm, end: e.target.value })}
              className={inputClasses}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-ink-3 mb-1.5">Label (optional)</span>
            <input
              type="text"
              placeholder="Night shift"
              value={blockForm.label}
              onChange={(e) => setBlockForm({ ...blockForm, label: e.target.value })}
              className={inputClasses}
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="pressable rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            Add
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {WEEKDAY_NAMES.map((name, weekday) => {
            const dayBlocks = blocksByDay.get(weekday) ?? [];
            return (
              <div key={name} className="rounded-xl border border-hair glass p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-4 mb-2">
                  {name}
                </p>
                {dayBlocks.length === 0 ? (
                  <p className="text-xs text-ink-4">Free all day</p>
                ) : (
                  <ul className="space-y-1.5">
                    {dayBlocks.map((block) => (
                      <li key={block.id} className="flex items-start justify-between gap-2">
                        <span className="text-xs text-ink-2">
                          {formatBlockRange(block)}
                          {block.label && (
                            <span className="block text-[11px] text-ink-4">{block.label}</span>
                          )}
                        </span>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => remove("block", block.id)}
                          aria-label={`Remove ${name} ${formatBlockRange(block)}`}
                          className="pressable shrink-0 text-ink-4 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-ink mb-1">One-off unavailable</h2>
        <p className="text-xs text-ink-4 mb-4">
          A trip, a holiday, a week that broke the pattern. Entered in your own time.
        </p>

        <form
          onSubmit={addException}
          className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end mb-5"
        >
          <label className="block">
            <span className="block text-xs font-medium text-ink-3 mb-1.5">From</span>
            <input
              type="datetime-local"
              value={exceptionForm.start}
              onChange={(e) => setExceptionForm({ ...exceptionForm, start: e.target.value })}
              className={inputClasses}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-ink-3 mb-1.5">To</span>
            <input
              type="datetime-local"
              value={exceptionForm.end}
              onChange={(e) => setExceptionForm({ ...exceptionForm, end: e.target.value })}
              className={inputClasses}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-ink-3 mb-1.5">Label (optional)</span>
            <input
              type="text"
              placeholder="Away"
              value={exceptionForm.label}
              onChange={(e) => setExceptionForm({ ...exceptionForm, label: e.target.value })}
              className={inputClasses}
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="pressable rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            Add
          </button>
        </form>

        {exceptions.length === 0 ? (
          <p className="text-sm text-ink-4">None set.</p>
        ) : (
          <ul className="space-y-2">
            {exceptions.map((exception) => (
              <li
                key={exception.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-hair glass px-4 py-3"
              >
                <span className="text-sm text-ink-2">
                  {ownerFmt.format(new Date(exception.starts_at))} →{" "}
                  {ownerFmt.format(new Date(exception.ends_at))}
                  {exception.label && (
                    <span className="ml-2 text-xs text-ink-4">{exception.label}</span>
                  )}
                </span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => remove("exception", exception.id)}
                  className="pressable shrink-0 text-xs font-medium text-ink-4 hover:text-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
