import { requireAdmin, json, type Env } from "../../_utils/auth";

/**
 * DELETE — admin. Cancels a booking.
 *
 * Cancelling flips the status rather than deleting the row: the partial unique
 * index only covers confirmed bookings, so the slot is released either way, and
 * keeping the record means a cancelled call is still visible when you are
 * trying to remember what happened with someone.
 */
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const authError = requireAdmin(request, env);
  if (authError) return authError;

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return json({ error: "Invalid id" }, { status: 400 });
  }

  const { results } = await env.DB.prepare(
    `UPDATE bookings SET status = 'cancelled' WHERE id = ? RETURNING *`
  )
    .bind(id)
    .all();

  if (!results?.length) {
    return json({ error: "Not found" }, { status: 404 });
  }

  return json({ booking: results[0] });
};
