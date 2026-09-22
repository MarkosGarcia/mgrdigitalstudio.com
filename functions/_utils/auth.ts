export type Env = {
  DB: D1Database;
  ADMIN_PASSWORD: string;
  EMAIL_WORKER_URL: string;
  EMAIL_WORKER_SECRET: string;
};

const UNAUTHORIZED_HEADERS = {
  "WWW-Authenticate": 'Basic realm="mgrdigitalstudio.com admin"',
  "Content-Type": "application/json",
};

export function requireAdmin(request: Request, env: Env): Response | null {
  const header = request.headers.get("Authorization");
  if (!header || !header.startsWith("Basic ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: UNAUTHORIZED_HEADERS,
    });
  }

  const decoded = atob(header.slice(6));
  const separatorIndex = decoded.indexOf(":");
  const password = separatorIndex === -1 ? decoded : decoded.slice(separatorIndex + 1);

  if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: UNAUTHORIZED_HEADERS,
    });
  }

  return null;
}

export function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
}
