import { requireAdmin, json, type Env } from "../../_utils/auth";

const ALLOWED_STATUSES = ["new", "contacted", "won", "lost"];

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const authError = requireAdmin(request, env);
  if (authError) return authError;

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return json({ error: "Invalid id" }, { status: 400 });
  }

  let body: { status?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.status !== undefined && !ALLOWED_STATUSES.includes(body.status)) {
    return json({ error: `status must be one of ${ALLOWED_STATUSES.join(", ")}` }, { status: 400 });
  }

  const existing = await env.DB.prepare(`SELECT id FROM leads WHERE id = ?`).bind(id).first();
  if (!existing) {
    return json({ error: "Not found" }, { status: 404 });
  }

  await env.DB.prepare(
    `UPDATE leads SET status = COALESCE(?, status), notes = COALESCE(?, notes) WHERE id = ?`
  )
    .bind(body.status ?? null, body.notes ?? null, id)
    .run();

  const updated = await env.DB.prepare(`SELECT * FROM leads WHERE id = ?`).bind(id).first();
  return json({ lead: updated });
};
