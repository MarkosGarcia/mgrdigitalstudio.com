# MGR Digital Studio — mgrdigitalstudio.com

Source for the MGR Digital Studio marketing site — a full lead-generation
site (not just a brochure): homepage, services, portfolio, an interactive
quote calculator, a self-serve booking calendar, a lead-assessment modal, an
admin CRM dashboard, an English/Spanish split, and a blog.

MGR Digital Studio is the trading name of S&G Marketing — the same
one-person Ottawa web design business previously run as "Websites
Converting" (websitesconverting.ca). This repo was migrated wholesale from
that project's Next.js codebase and rebranded; the old project and its data
are untouched.

## Stack

- **Next.js 16 (App Router, static export — `output: "export"`)** — the
  whole frontend renders to static HTML/CSS/JS at build time, so it deploys
  exactly like a plain static site (no server runtime needed).
- **Tailwind CSS 4** — the "light glass" design system: a near-white paper
  background, drifting soft gradient fields, metallic-gold accents.
- **GSAP** + a small custom `Reveal`/`ParallaxBackground` system — scroll
  motion. `Reveal` only ever animates `transform`, never `opacity`, so
  content is never invisible-by-default for no-JS clients or crawlers.
- **Cloudflare Pages** — hosting the static export (free, unlimited
  bandwidth, commercial use allowed).
- **Cloudflare Pages Functions** (`functions/api/*`) — the backend: leads,
  bookings, availability, all backed by **Cloudflare D1** (`mgrdigitalstudio-leads`,
  a fresh database created for this project — the old business's
  `websitesconverting-leads` database was left alone).
- **A standalone Cloudflare Worker** (`email-worker/`) — Pages doesn't
  support the `send_email` binding, so lead/booking notifications go
  through this small Worker over HTTP instead.
- **Stripe Payment Links** (`src/lib/payments.ts`) — no backend keys, no
  card data touching this repo; each link is created in the Stripe
  dashboard and pasted in. All currently empty (hidden) until you set them.
- **GitHub** (private repo) — source control + Cloudflare's auto-deploy
  trigger on push to `main`.

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # static export to out/
npx serve out     # serve the production build locally
```

`functions/` (Cloudflare Pages Functions) does **not** run under `next dev`
or a plain static server — to test leads/bookings/admin locally you need
Wrangler:

```bash
npm install -g wrangler
npm run build
npx wrangler pages dev out
```

## Deploying: GitHub + Cloudflare Pages

The Cloudflare Pages project (`mgrdigitalstudio-com`) and the
`mgrdigitalstudio.com` custom domain already exist from the previous
(Astro) version of this site and don't need to be recreated — but the
**build settings need updating** for the new framework:

1. Cloudflare dashboard → **Workers & Pages** → the `mgrdigitalstudio-com`
   project → **Settings** → **Builds**.
2. Update:
   - **Framework preset:** Next.js (Static HTML Export) — or "None"
   - **Build command:** `npm run build`
   - **Build output directory:** `out` (it was `dist` for the old Astro
     build — this is the one setting that must change)
3. Push to `main` and confirm the next deploy succeeds with the new output
   directory.

`wrangler.toml` (`name = "mgrdigitalstudio-com"`, `pages_build_output_dir =
"out"`) pins the project name and output dir for `wrangler pages deploy` —
keep `name` matching the dashboard project name if it ever differs.

### D1 database

A fresh D1 database, `mgrdigitalstudio-leads`, was created and
`schema.sql` applied to it already (leads, bookings, availability tables
all exist). It's wired up in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "mgrdigitalstudio-leads"
database_id = "91535f91-b2e0-4a82-92fb-ddfbde3cd17b"
```

No action needed unless you want to inspect/query it yourself:

```bash
npx wrangler d1 execute mgrdigitalstudio-leads --remote --command="select * from leads"
```

### Secrets to provision (not yet set — these are per-project secrets, never committed)

In the Pages project → **Settings** → **Environment variables** (as
**Secrets**, not plain variables):

| Secret                | Purpose                                                          |
|------------------------|-------------------------------------------------------------------|
| `ADMIN_PASSWORD`       | Basic-auth password for `/admin` (the leads/bookings dashboard)  |
| `EMAIL_WORKER_URL`     | URL of the deployed `email-worker` (below)                       |
| `EMAIL_WORKER_SECRET`  | Shared secret the Pages Functions send to the worker             |

```bash
npx wrangler pages secret put ADMIN_PASSWORD --project-name=mgrdigitalstudio-com
npx wrangler pages secret put EMAIL_WORKER_URL --project-name=mgrdigitalstudio-com
npx wrangler pages secret put EMAIL_WORKER_SECRET --project-name=mgrdigitalstudio-com
```

### Deploy the email-worker (separate from the Pages project)

This hasn't been deployed yet under the MGR Digital Studio name — it needs
its own `wrangler deploy` from inside `email-worker/`:

```bash
cd email-worker
npx wrangler deploy
npx wrangler secret put NOTIFY_SECRET   # same value as EMAIL_WORKER_SECRET above
```

It also needs the Cloudflare **Email Routing** "Send email" binding enabled
for `mgrdigitalstudio.com` so `info@mgrdigitalstudio.com` is allowed as a
`from` address (Cloudflare dashboard → your domain → **Email** → **Email
Routing**). Notifications currently send **to**
`markos.garcia.ramirez@gmail.com` (kept as the personal inbox that's
definitely working) — switch `TO` in `email-worker/src/index.ts` to
`info@mgrdigitalstudio.com` once that Zoho mailbox is fully verified, if
you'd rather they land there.

### Optional: Google Analytics

`src/components/Analytics.tsx` only loads GA4 if
`NEXT_PUBLIC_GA_MEASUREMENT_ID` is set as a **build variable** (not secret)
in Cloudflare Pages. Unset today — add it once you've created a GA4
property for the new brand (the old site's, if any, belongs to Websites
Converting).

## Project structure

```
src/
  app/            Next.js App Router pages — every route under the site,
                  including admin/, booking/, es/ (Spanish), quote-calculator/
  components/     Header, Footer, Hero, BookingCalendar, QuoteCalculator,
                  AdminDashboard, AssessmentModal, WhatsAppButton, Logo, ...
  lib/
    business.ts   single source of truth for brand name, phone, email,
                  legal name, address — change contact info here, not per-page
    content.ts    services, pricing, testimonials, FAQs, blog posts
    payments.ts   Stripe Payment Link URLs (empty until you create them)
    scheduling.ts booking/availability logic
functions/api/    Cloudflare Pages Functions: leads.ts, bookings.ts,
                  availability.ts — the D1-backed backend
email-worker/     standalone Cloudflare Worker for outbound email
schema.sql        D1 schema (already applied to mgrdigitalstudio-leads)
public/
  logo-mark.png   the gold MGR monogram, cut from the supplied artwork with
                  real transparency (see git history for the cutout method)
  marcos.jpg      real portrait, About page
  llms.txt        plain-language business facts for AI crawlers/answer engines
```

## Reviews / past work — a decision still open

`src/lib/content.ts` has two real, named past-client projects (with live
site links) carried over from the Websites Converting era, both currently
`approved: false` so neither the `/reviews` nor `/work` page shows them (a
generic "two clients so far" fallback shows instead). The work is real and
done by the same person, but showing a client's name under the *new* brand
without asking them again is a judgment call — flip `approved: true` in
`content.ts` once you're comfortable with that, or leave as-is.

## Before you launch

- [x] Contact info (`src/lib/business.ts`): email, phone/WhatsApp, address
      are real.
- [x] D1 database created and schema applied.
- [ ] Deploy `email-worker/` under the new name and set the three Pages
      secrets above — until then, lead/booking notification emails will
      fail silently (the lead/booking itself still saves to D1 either way).
- [ ] Cloudflare Pages build output directory: change `dist` → `out`.
- [ ] Decide on the reviews/work approval question above.
- [ ] Stripe Payment Links (`src/lib/payments.ts`) — currently empty/hidden;
      add real links if you want in-site deposit payments.
- [ ] Resend / Zoho email setup from the previous (Astro) version of this
      site — domain verification and mailbox setup are independent of the
      framework and should already be in progress; not affected by this
      migration.
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` — add once a GA4 property exists for
      the new brand.

## SEO

Every page sets its own metadata (`src/app/**/page.tsx`), and
`src/app/layout.tsx` injects a linked `ProfessionalService` + `Person` +
`WebSite` JSON-LD graph with a real address, phone, email, languages, and
booking action — `areaServed` covers Ottawa, Ontario, Canada, and the U.S.
`public/llms.txt` gives AI answer engines the same facts in plain English.

On-page SEO only goes so far for local search:

- [ ] Create/verify a Google Business Profile with this same address/phone.
- [ ] A few Ottawa/Ontario business directory listings with identical
      name/address/phone.
- [ ] Ask happy clients for Google reviews once there are some.
