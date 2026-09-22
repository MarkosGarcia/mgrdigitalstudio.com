export type Env = {
  SEND_EMAIL: SendEmail;
  NOTIFY_SECRET: string;
};

// Fixed sender/recipient — the caller can only supply the email *content*,
// never who it's from or where it goes. Keeps this from becoming an open
// relay even though the endpoint is reachable from the public internet.
const FROM = "info@mgrdigitalstudio.com";
const TO = "markos.garcia.ramirez@gmail.com";

type NotifyPayload = {
  subject?: string;
  text?: string;
  html?: string;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    if (!env.NOTIFY_SECRET || request.headers.get("X-Notify-Secret") !== env.NOTIFY_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    let body: NotifyPayload;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    if (!body.subject || (!body.text && !body.html)) {
      return new Response("subject and (text or html) are required", { status: 400 });
    }

    try {
      await env.SEND_EMAIL.send({
        from: FROM,
        to: TO,
        subject: body.subject,
        text: body.text,
        html: body.html,
      });
    } catch (err) {
      return new Response(`Send failed: ${err instanceof Error ? err.message : String(err)}`, {
        status: 502,
      });
    }

    return new Response("OK", { status: 200 });
  },
};
