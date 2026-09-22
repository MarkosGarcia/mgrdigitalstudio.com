import { requireAdmin, json, type Env } from "../_utils/auth";
import {
  SLOT_MINUTES,
  OWNER_TZ,
  HORIZON_DAYS,
  LEAD_TIME_MINUTES,
} from "../../src/lib/scheduling";

/**
 * GET  — public. Everything the calendar needs to draw itself.
 * POST — admin. Adds a recurring weekly block or a one-off unavailable range.
 * DELETE — admin. Removes one of either, by ?kind=block|exception&id=N.
 *
 * The public response deliberately sends *rules*, not a list of free slots.
 * Three weeks of 20-minute slots is a little over 1,500 entries; the rules that
 * produce them are a few dozen rows, and the client can expand them instantly.
 * It also means the same code decides availability on both ends.
 */

type BlockRow = {
  id: number;
  weekday: number;
  start_min: number;
  end_min: number;
  label: string | null;
};

type ExceptionRow = {
  id: number;
  starts_at: string;
  ends_at: string;
  label: string | null;
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  const now = Date.now();
  const horizonEnd = new Date(now + HORIZON_DAYS * 86_400_000).toISOString();
  const windowStart = new Date(now - 86_400_000).toISOString();

  const [blocks, exceptions, booked] = await Promise.all([
    env.DB.prepare(
      `SELECT id, weekday, start_min, end_min, label FROM availability_blocks
       ORDER BY weekday, start_min`
    ).all<BlockRow>(),
    env.DB.prepare(
      `SELECT id, starts_at, ends_at, label FROM availability_exceptions
       WHERE ends_at >= ? ORDER BY starts_at`
    )
      .bind(windowStart)
      .all<ExceptionRow>(),
    env.DB.prepare(
      `SELECT starts_at FROM bookings
       WHERE status = 'confirmed' AND starts_at >= ? AND starts_at <= ?`
    )
      .bind(windowStart, horizonEnd)
      .all<{ starts_at: string }>(),
  ]);

  return json(
    {
      slotMinutes: SLOT_MINUTES,
      leadTimeMinutes: LEAD_TIME_MINUTES,
      horizonDays: HORIZON_DAYS,
      ownerTz: OWNER_TZ,
      blocks: blocks.results ?? [],
      exceptions: exceptions.results ?? [],
      // Normalised so the client can compare against its own generated grid
      // without worrying about how SQLite rendered the timestamp.
      booked: (booked.results ?? []).map((row) => new Date(row.starts_at).toISOString()),
    },
    {
      // Short, because a stale response means showing a slot someone just took.
      // The booking endpoint re-checks anyway, so this is only about politeness.
      headers: { "Cache-Control": "public, max-age=30" },
    }
  );
};

type CreatePayload = {
  kind?: "block" | "exception";
  weekday?: number;
  startMin?: number;
  endMin?: number;
  startsAt?: string;
  endsAt?: string;
  label?: string;
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const authError = requireAdmin(request, env);
  if (authError) return authError;

  let body: CreatePayload;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.kind === "block") {
    const { weekday, startMin, endMin } = body;
    if (
      typeof weekday !== "number" ||
      weekday < 0 ||
      weekday > 6 ||
      typeof startMin !== "number" ||
      typeof endMin !== "number"
    ) {
      return json({ error: "weekday (0-6), startMin and endMin are required" }, { status: 400 });
    }
    if (startMin < 0 || startMin >= 1440 || endMin <= startMin || endMin > 2880) {
      return json(
        { error: "startMin must be within the day and endMin must be after it" },
        { status: 400 }
      );
    }

    const { results } = await env.DB.prepare(
      `INSERT INTO availability_blocks (weekday, start_min, end_min, label)
       VALUES (?, ?, ?, ?) RETURNING *`
    )
      .bind(weekday, startMin, endMin, body.label?.trim() || null)
      .all<BlockRow>();

    return json({ block: results?.[0] }, { status: 201 });
  }

  if (body.kind === "exception") {
    const start = Date.parse(body.startsAt ?? "");
    const end = Date.parse(body.endsAt ?? "");
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
      return json({ error: "startsAt and endsAt must be valid, with end after start" }, { status: 400 });
    }

    const { results } = await env.DB.prepare(
      `INSERT INTO availability_exceptions (starts_at, ends_at, label)
       VALUES (?, ?, ?) RETURNING *`
    )
      .bind(new Date(start).toISOString(), new Date(end).toISOString(), body.label?.trim() || null)
      .all<ExceptionRow>();

    return json({ exception: results?.[0] }, { status: 201 });
  }

  return json({ error: "kind must be 'block' or 'exception'" }, { status: 400 });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const authError = requireAdmin(request, env);
  if (authError) return authError;

  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const id = Number(url.searchParams.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return json({ error: "A numeric id is required" }, { status: 400 });
  }

  const table =
    kind === "block"
      ? "availability_blocks"
      : kind === "exception"
        ? "availability_exceptions"
        : null;

  if (!table) {
    return json({ error: "kind must be 'block' or 'exception'" }, { status: 400 });
  }

  // `table` is chosen from a fixed set above, never taken from user input.
  const result = await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();

  if (!result.meta.changes) {
    return json({ error: "Not found" }, { status: 404 });
  }

  return json({ ok: true });
};
