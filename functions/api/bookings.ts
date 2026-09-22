import { requireAdmin, json, type Env } from "../_utils/auth";
import {
  SLOT_MINUTES,
  SLOT_MS,
  OWNER_TZ,
  HORIZON_DAYS,
  LEAD_TIME_MINUTES,
  isOnGrid,
  isBlocked,
  type Block,
  type Exception,
} from "../../src/lib/scheduling";

/**
 * POST — public. Books a slot.
 * GET  — admin. Lists bookings.
 *
 * The calendar the visitor sees is generated in their browser, so none of what
 * it sends can be trusted: every rule it applied is re-applied here before
 * anything is written. The uniqueness check is the database's partial index on
 * (starts_at) where status = 'confirmed' — two people clicking the same slot at
 * the same moment is exactly the case an application-level "is it free?" query
 * cannot catch.
 */

type BookingPayload = {
  startsAt?: string;
  name?: string;
  email?: string;
  phone?: string;
  mode?: "video" | "phone";
  notes?: string;
  timezone?: string;
  hp?: string; // honeypot — real visitors never fill this in
};

function ownerTimeLabel(ms: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: OWNER_TZ,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(ms));
}

async function notifyNewBooking(
  env: Env,
  startsAtMs: number,
  body: BookingPayload
): Promise<void> {
  if (!env.EMAIL_WORKER_URL || !env.EMAIL_WORKER_SECRET) return;

  const whenOwner = ownerTimeLabel(startsAtMs);
  const whenVisitor = body.timezone
    ? new Intl.DateTimeFormat("en-CA", {
        timeZone: body.timezone,
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(new Date(startsAtMs))
    : null;

  const rows: [string, string | undefined | null][] = [
    ["When (your time)", whenOwner],
    ["When (their time)", whenVisitor],
    ["Name", body.name],
    ["Email", body.email],
    ["Phone", body.phone],
    ["Call type", body.mode === "phone" ? "Phone call" : "Video call"],
    ["Notes", body.notes],
  ];
  const present = rows.filter(([, value]) => value);

  const text = present.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html =
    `<p><strong>${whenOwner}</strong> — discovery call booked on mgrdigitalstudio.com.</p>` +
    `<ul>${present.map(([label, value]) => `<li><strong>${label}:</strong> ${value}</li>`).join("")}</ul>` +
    `<p><a href="https://mgrdigitalstudio.com/admin/">Open the admin dashboard</a></p>`;

  const res = await fetch(env.EMAIL_WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Notify-Secret": env.EMAIL_WORKER_SECRET,
    },
    body: JSON.stringify({
      subject: `Discovery call booked — ${whenOwner}`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    throw new Error(`Email worker responded ${res.status}: ${await res.text()}`);
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env, waitUntil } = context;

  let body: BookingPayload;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: accept silently without writing, so bots believe it worked.
  if (body.hp) return json({ ok: true });

  const name = body.name?.trim();
  const email = body.email?.trim();
  if (!name || !email) {
    return json({ error: "A name and email are required" }, { status: 400 });
  }

  const startsAtMs = Date.parse(body.startsAt ?? "");
  if (Number.isNaN(startsAtMs)) {
    return json({ error: "startsAt must be a valid ISO timestamp" }, { status: 400 });
  }
  if (!isOnGrid(startsAtMs)) {
    return json({ error: "That is not a valid appointment time" }, { status: 400 });
  }

  const now = Date.now();
  if (startsAtMs < now + LEAD_TIME_MINUTES * 60_000) {
    return json({ error: "That time is too soon. Please pick a later slot." }, { status: 409 });
  }
  if (startsAtMs > now + HORIZON_DAYS * 86_400_000) {
    return json({ error: "That time is too far ahead." }, { status: 409 });
  }

  const slotEnd = new Date(startsAtMs + SLOT_MS).toISOString();
  const [blocks, exceptions] = await Promise.all([
    env.DB.prepare(`SELECT weekday, start_min, end_min FROM availability_blocks`).all<Block>(),
    env.DB.prepare(
      `SELECT starts_at, ends_at FROM availability_exceptions
       WHERE starts_at < ? AND ends_at > ?`
    )
      .bind(slotEnd, new Date(startsAtMs).toISOString())
      .all<Exception>(),
  ]);

  if (isBlocked(startsAtMs, blocks.results ?? [], exceptions.results ?? [])) {
    return json({ error: "That time is no longer available." }, { status: 409 });
  }

  const startsAtIso = new Date(startsAtMs).toISOString();

  try {
    await env.DB.prepare(
      `INSERT INTO bookings
         (starts_at, duration_min, name, email, phone, visitor_tz, mode, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        startsAtIso,
        SLOT_MINUTES,
        name,
        email,
        body.phone?.trim() || null,
        body.timezone?.trim() || null,
        body.mode === "phone" ? "phone" : "video",
        body.notes?.trim() || null
      )
      .run();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/UNIQUE|constraint/i.test(message)) {
      return json(
        { error: "Someone just booked that slot. Please pick another time." },
        { status: 409 }
      );
    }
    throw err;
  }

  // A booked call is a lead, so it belongs in the same pipeline as every other
  // enquiry rather than in a list the dashboard doesn't know about.
  await env.DB.prepare(
    `INSERT INTO leads (source, name, email, phone, message)
     VALUES ('booking-calendar', ?, ?, ?, ?)`
  )
    .bind(
      name,
      email,
      body.phone?.trim() || null,
      `Discovery call booked for ${ownerTimeLabel(startsAtMs)}.` +
        (body.notes?.trim() ? `\n\n${body.notes.trim()}` : "")
    )
    .run();

  waitUntil(
    notifyNewBooking(env, startsAtMs, body).catch((err) =>
      console.error("Booking notification failed", err)
    )
  );

  return json({ ok: true, startsAt: startsAtIso }, { status: 201 });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const authError = requireAdmin(request, env);
  if (authError) return authError;

  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();

  const { results } = await env.DB.prepare(
    `SELECT * FROM bookings WHERE starts_at >= ? ORDER BY starts_at ASC LIMIT 300`
  )
    .bind(since)
    .all();

  return json({ bookings: results ?? [] });
};
