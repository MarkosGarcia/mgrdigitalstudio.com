---
name: cloudflare-pages-deploy
description: >-
  Guides deploying a static/Astro/Next-style site to Cloudflare Pages via
  GitHub, connecting a custom domain, and wiring up Resend for a contact
  form — including the specific dashboard traps that cause silent deploy
  failures. Use this whenever the user wants to deploy a site to Cloudflare
  Pages, mentions "cloudflare pages", "wrangler pages deploy", "pages.dev",
  connecting a custom domain on Cloudflare, or pastes a Cloudflare build
  log/error (especially anything mentioning "wrangler deploy", "Missing
  Pages project name", or an "Authentication error" with code 10000). Also
  use it proactively whenever setting up a new website project that will
  deploy to Cloudflare Pages, before the user hits these problems, since
  the single biggest time-saver here is picking the right creation flow up
  front.
---

# Cloudflare Pages Deploy

## Why this skill exists

Cloudflare's dashboard has two different ways to connect a Git repo that
look almost identical but behave completely differently. Picking the wrong
one produces a working-looking project that fails at the deploy step in
ways that are genuinely confusing to debug — multiple auth-shaped error
messages that aren't about authentication, two different tokens with
similar names, two different "environment variables" sections. This skill
exists so that confusion doesn't have to happen twice.

## Step 0: pick the right creation flow

When connecting a GitHub repo via **Workers & Pages → Create**, look for
two distinct options — usually separate tabs or a fork in the flow:

| | Classic **Pages** | **Workers** Git integration (Workers Builds) |
|---|---|---|
| Fields shown | Build command + Build output directory | Build command **and** Deploy command **and** Build variables |
| How it deploys | Cloudflare uploads the build output directly — no CLI involved | Runs `npx wrangler deploy` (or whatever you set) as a real deploy step |
| Needs a Cloudflare API token? | No | Yes — and it's easy to get its permissions wrong |
| Right choice for a static site (Astro/Next/etc. + optional `functions/` Pages Functions) | **Yes, always pick this** | Only if Pages genuinely isn't offered |

**Always steer toward classic Pages.** It has no deploy command, no
manually-managed token, and no chance of the failure modes below. If the
dashboard only offers the Workers-style flow, or defaults into it, proceed
to Step 1 and expect to spend a few extra rounds on tokens.

If a project already exists in the wrong (Workers) flavor and it's gotten
confusing (competing tokens, repeated auth errors), the fastest real fix
is usually **not** more debugging — it's deleting it and recreating as
classic Pages:

- Project → **Settings** → scroll to **Delete**. This only removes the
  Cloudflare deployment project — it does not touch the GitHub repo, the
  purchased domain, or any DNS records.
- Recreate via **Workers & Pages → Create**, this time picking **Pages**
  specifically.

## Step 1: if you're in the Workers-style flow

Make it work rather than fighting it:

1. **Deploy command**: `npx wrangler pages deploy dist --project-name=<project-name>`
   (swap `dist` for the actual build output directory)
2. **Add `wrangler.toml`** to the repo so the project name isn't only a
   dashboard setting:
   ```toml
   name = "<project-name>"
   pages_build_output_dir = "dist"
   compatibility_date = "<today's date>"
   ```
3. **The API token needs `Account → Cloudflare Pages → Edit` specifically.**
   This is the part that isn't obvious: the "Edit Cloudflare Workers" token
   template (Workers Scripts, KV, R2, D1, Queues, Hyperdrive, etc.) never
   includes Cloudflare Pages. A token built from that template will
   authenticate fine (wrangler prints a valid account and even
   "Super Administrator — All Privileges" for the *user's* account role)
   and still fail every single deploy with an error that reads like a
   generic auth problem. If you already have a Workers-scoped token, either
   edit it to add the missing `Cloudflare Pages : Edit` permission row, or
   create a new one with that permission and use it instead.
4. **Two lookalike variable scopes exist — use the right one for each secret:**
   - **Build variables**: only visible to the build/deploy command while
     it's running. This is where `CLOUDFLARE_API_TOKEN` /
     `CLOUDFLARE_ACCOUNT_ID` go if wrangler itself needs them.
   - **Environment Variables** (sometimes labeled "Variables and Secrets"):
     only visible to the *deployed* site at request time. This is where a
     Pages Function's runtime secrets go (e.g. `RESEND_API_KEY` for a
     contact form) — never the Cloudflare deploy token.
5. **There's also a separate, auto-generated per-project token** (named
   something like `<project-name> build token`, visible in a build's
   "Build settings" panel) that Cloudflare manages itself and is distinct
   from anything manually added as `CLOUDFLARE_API_TOKEN`. When debugging,
   the wrangler log itself says which one is actually in play — see
   `references/error-log-reading.md` for exactly what to look for.

Read `references/error-log-reading.md` before asking the user for another
screenshot — it lists the specific error strings and what they actually
mean, so you can often diagnose from a pasted log without another
round-trip.

## Step 2: connect the custom domain

Once a deploy succeeds (dashboard shows a `*.pages.dev` URL), add the real
domain:

- Project → **Custom domains** → add the domain
- If the domain's DNS is already on Cloudflare (e.g. it was registered
  through Cloudflare), this is usually instant
- The apex domain won't resolve at all until this step is done — don't
  read that as a deploy failure if the `.pages.dev` preview is working

## Step 3: wire up a contact form via Resend

For a Pages Function (e.g. `functions/api/contact.js`) that emails
submissions:

1. Sign up at resend.com (free tier is generous — ~3,000 emails/month)
2. **Domains → Add Domain** → enter the site's domain
3. Add the DNS records Resend displays into **Cloudflare DNS → Records**
   (fast if the domain's DNS is already on Cloudflare — usually minutes)
4. **API Keys → Create API Key** → copy it (shown once)
5. Add three **Environment Variables** (the runtime kind, not build
   variables) to the Pages project:
   - `RESEND_API_KEY` — mark as **Secret**
   - `CONTACT_TO_EMAIL` — where inquiries land. This can be any real
     mailbox (a personal Gmail is fine) — it does **not** need to be on
     the verified domain
   - `CONTACT_FROM_EMAIL` — must match the verified sending domain, e.g.
     `"Business Name <contact@domain.com>"`
6. Redeploy (retry the latest deployment, or just push a commit) so the
   Function picks up the new variables
7. Test by actually submitting the live form and confirming the email
   arrives — a "deployed successfully" status doesn't verify this

## Working within Claude Code's own network constraints

This part is about *this agent's* environment, not Cloudflare's:

- A Claude Code on-the-web session runs in a sandboxed container with a
  default-deny network policy. Direct `curl`/`wrangler`/`dig` to
  `api.cloudflare.com` (or any arbitrary domain, including the site's own
  custom domain) gets rejected by the local egress proxy — this is true
  regardless of whether a valid API token is in hand. Confirm this rather
  than assuming it: `curl -sS http://127.0.0.1:<port>/__agentproxy/status`
  (find the port from the proxy README, usually referenced in the
  environment's system prompt) shows `recentRelayFailures` for anything
  that got blocked.
- **`WebFetch` is blocked the same way** in this environment — it is not
  a workaround for the Bash restriction here. Don't assume it will succeed
  where `curl` failed; test it and expect `EGRESS_BLOCKED`.
- **Before falling back to manual dashboard walkthroughs, check whether an
  actual Cloudflare or Resend MCP connector is available and connected**
  (search the MCP connector registry / check `ListConnectors`). The
  official connectors are named **"Cloudflare Developer Platform"** and
  **"Resend"**. If connected, use those tools directly instead of guiding
  the user through screenshots — connector calls route through different
  infrastructure than this sandbox's blocked egress and should work even
  when raw `curl`/`wrangler` don't. If not connected, tell the user they
  exist and can be connected via their claude.ai connector settings for
  full automation on future projects — it's a real, better answer, not a
  brush-off.
- Without a connector, the user is doing every click themselves, often
  from a phone. Keep instructions concrete: exact tab names, exact button
  labels, what to tap next — not "go to settings and configure it."
- Because this agent can't browse or curl the live site from inside this
  environment, **ask the user to confirm what a live URL actually shows**
  rather than treating a dashboard "Success!" message as proof the site
  renders correctly.
- Buying a domain, or anything that charges real money, always needs the
  human's own login and payment confirmation — this is true even with a
  connector fully connected, and isn't something to attempt to route
  around.

## Reference

- `references/error-log-reading.md` — the exact error strings this
  produces and what each one actually means, for diagnosing a pasted
  build log without another screenshot round-trip.
