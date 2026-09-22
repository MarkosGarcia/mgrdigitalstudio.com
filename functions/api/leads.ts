import { requireAdmin, json, type Env } from "../_utils/auth";

type LeadPayload = {
  source?: string;
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  websiteUrl?: string;
  industry?: string;
  location?: string;
  primaryGoal?: string;
  message?: string;
  hp?: string; // honeypot — real visitors never fill this in
};

// Cloudflare Pages doesn't support the `send_email` binding directly, so
// notifications are relayed through a small standalone Worker that does
// (see email-worker/). EMAIL_WORKER_URL/EMAIL_WORKER_SECRET are Pages
// secrets — see wrangler.toml for how to provision them.
async function notifyNewLead(env: Env, body: LeadPayload): Promise<void> {
  if (!env.EMAIL_WORKER_URL || !env.EMAIL_WORKER_SECRET) return;

  const rows = (
    [
      ["Source", body.source],
      ["Name", body.name],
      ["Business", body.businessName],
      ["Email", body.email],
      ["Phone", body.phone],
      ["Website", body.websiteUrl],
      ["Industry", body.industry],
      ["Location", body.location],
      ["Goal", body.primaryGoal],
      ["Message", body.message],
    ] as [string, string | undefined][]
  ).filter(([, value]) => value);

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<p>New lead from <strong>${body.source}</strong> on mgrdigitalstudio.com:</p><ul>${rows
    .map(([label, value]) => `<li><strong>${label}:</strong> ${value}</li>`)
    .join("")}</ul><p><a href="https://mgrdigitalstudio.com/admin/">View in admin dashboard</a></p>`;

  const res = await fetch(env.EMAIL_WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Notify-Secret": env.EMAIL_WORKER_SECRET,
    },
    body: JSON.stringify({
      subject: `New lead: ${body.businessName || body.name || body.source}`,
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

  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: silently accept without writing anything, so bots think it worked.
  if (body.hp) {
    return json({ ok: true });
  }

  if (!body.source || (!body.email && !body.phone)) {
    return json({ error: "source and an email or phone are required" }, { status: 400 });
  }

  await env.DB.prepare(
    `INSERT INTO leads
      (source, name, email, phone, business_name, website_url, industry, location, primary_goal, message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      body.source,
      body.name ?? null,
      body.email ?? null,
      body.phone ?? null,
      body.businessName ?? null,
      body.websiteUrl ?? null,
      body.industry ?? null,
      body.location ?? null,
      body.primaryGoal ?? null,
      body.message ?? null
    )
    .run();

  // Best-effort: a notification failure should never fail the lead submission
  // itself, since the record is already safely in D1 either way.
  waitUntil(notifyNewLead(env, body).catch((err) => console.error("Lead notification failed", err)));

  return json({ ok: true }, { status: 201 });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const authError = requireAdmin(request, env);
  if (authError) return authError;

  const { results } = await env.DB.prepare(
    `SELECT * FROM leads ORDER BY created_at DESC LIMIT 500`
  ).all();

  return json({ leads: results });
};
