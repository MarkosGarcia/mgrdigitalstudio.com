// Cloudflare Pages Function: handles POST /api/contact from the site's contact forms.
//
// Required environment variables (set in Cloudflare Pages > Settings > Environment variables):
//   RESEND_API_KEY    - API key from https://resend.com (free tier is enough for a small studio)
//   CONTACT_TO_EMAIL  - where inquiries should be delivered, e.g. hello@mgrdigitalstudio.com
//   CONTACT_FROM_EMAIL - verified sender, e.g. "MGR Digital Studio <contact@mgrdigitalstudio.com>"
//                         (must be on a domain verified in Resend; falls back to a Resend
//                         sandbox address if not set, which only works for testing)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 5000;

function redirectTo(path, request) {
  const url = new URL(path, request.url);
  return Response.redirect(url.toString(), 303);
}

function safeRedirectTarget(value, request) {
  // Only allow same-site relative paths as the post-submit redirect target.
  if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }
  return '/thank-you';
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return redirectTo('/contact?error=validation', request);
  }

  const referer = request.headers.get('referer');
  const fallbackPage = referer ? new URL(referer).pathname : '/contact';

  const honeypot = (formData.get('company_website') || '').toString().trim();
  const redirectTarget = safeRedirectTarget(formData.get('redirect'), request);

  // Bots tend to fill every field, including hidden ones. Pretend success without
  // sending an email so the bot doesn't learn its submission was rejected.
  if (honeypot.length > 0) {
    return redirectTo(redirectTarget, request);
  }

  const name = (formData.get('name') || '').toString().trim().slice(0, MAX_FIELD_LENGTH);
  const email = (formData.get('email') || '').toString().trim().slice(0, MAX_FIELD_LENGTH);
  const message = (formData.get('message') || '').toString().trim().slice(0, MAX_FIELD_LENGTH);
  const source = (formData.get('source') || 'unknown').toString().trim().slice(0, 100);

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return redirectTo(`${fallbackPage}?error=validation`, request);
  }

  if (!env.RESEND_API_KEY) {
    // Email delivery isn't configured yet — tell the visitor rather than silently failing.
    return redirectTo(`${fallbackPage}?error=config`, request);
  }

  const toEmail = env.CONTACT_TO_EMAIL || 'hello@mgrdigitalstudio.com';
  const fromEmail = env.CONTACT_FROM_EMAIL || 'MGR Digital Studio <onboarding@resend.dev>';

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `New website inquiry from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Source: ${source}`,
          '',
          'Message:',
          message,
        ].join('\n'),
      }),
    });

    if (!resendResponse.ok) {
      return redirectTo(`${fallbackPage}?error=send`, request);
    }
  } catch {
    return redirectTo(`${fallbackPage}?error=send`, request);
  }

  return redirectTo(redirectTarget, request);
}

export async function onRequestGet() {
  return new Response('Method Not Allowed', { status: 405 });
}
