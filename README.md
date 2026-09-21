# MGR Digital Studio — mgrdigitalstudio.com

Source for the MGR Digital Studio marketing site: Home, Services, Portfolio,
About, Contact, and a Blog, built with [Astro](https://astro.build) and
deployed as a static site with a small serverless contact-form endpoint.

## Stack

- **Astro** (static output) — fast, minimal-JS pages
- **Cloudflare Pages** — hosting (free, unlimited bandwidth, commercial use allowed)
- **Cloudflare Pages Functions** (`functions/api/contact.js`) — handles the
  contact form server-side
- **[Resend](https://resend.com)** — sends the contact form email (free tier:
  3,000 emails/month)
- **GitHub** (private repo, free plan) — source control + auto-deploy trigger

This combo costs **$0/month** at small-business traffic levels and scales to
a paid Cloudflare/Resend plan later without changing the architecture.

## Local development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

The contact form posts to `/api/contact`, which is a Cloudflare Pages
Function. Pages Functions **do not run** under `astro dev`/`astro preview`
directly — to test the function locally you need the Wrangler CLI:

```bash
npm install -g wrangler
npm run build
npx wrangler pages dev dist
```

## Deploying: GitHub + Cloudflare Pages

### 1. Push this repo to GitHub (private)

If you haven't already:

```bash
git remote -v          # confirm the GitHub remote
git push -u origin main
```

GitHub's Free plan includes unlimited private repositories, which is all you
need here — Cloudflare Pages only needs read access to build from it.

### 2. Connect Cloudflare Pages

1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize Cloudflare's GitHub App and select this repository.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**. Cloudflare will install dependencies, run the
   build, and deploy `dist/` plus the `functions/` directory automatically —
   no extra config needed for the contact-form function.

Every push to your production branch (usually `main`) triggers a new deploy
automatically. Pull requests / other branches get their own preview URLs.

### 3. Set environment variables (for the contact form to send email)

In the Cloudflare Pages project → **Settings** → **Environment variables**,
add for the **Production** environment (and Preview, if you want previews to
send mail too):

| Variable             | Example value                                  |
|----------------------|-------------------------------------------------|
| `RESEND_API_KEY`     | `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`                |
| `CONTACT_TO_EMAIL`   | `hello@mgrdigitalstudio.com`                     |
| `CONTACT_FROM_EMAIL` | `MGR Digital Studio <contact@mgrdigitalstudio.com>` |

To get `RESEND_API_KEY`:

1. Sign up at [resend.com](https://resend.com) (free).
2. Under **Domains**, add and verify `mgrdigitalstudio.com` (a few DNS
   records — easy if the domain's DNS is already on Cloudflare).
3. Under **API Keys**, create a key and paste it in as `RESEND_API_KEY`.

Until `RESEND_API_KEY` is set, form submissions will redirect back with a
friendly "not configured yet" message instead of failing silently.

### 4. Connect the domain

In the Pages project → **Custom domains** → **Set up a custom domain**, add
`mgrdigitalstudio.com` (and `www.mgrdigitalstudio.com` if you want both).

- If the domain's nameservers already point to Cloudflare, this is instant.
- If not, Cloudflare will walk you through changing nameservers at your
  registrar (still free — you don't need Cloudflare as your registrar,
  just as your DNS provider).

## Project structure

```
src/
  layouts/Layout.astro       shared <head>, header, footer
  components/                Header, Footer, ContactForm
  pages/                     index, services, about, portfolio, contact,
                              thank-you, blog/index, blog/[...slug]
  content/blog/*.md          blog posts (Astro content collections)
  content.config.ts          blog collection schema
  styles/global.css          design tokens + all site styles
functions/api/contact.js     Cloudflare Pages Function: contact form handler
public/                      favicon, robots.txt
```

## Before you launch (placeholder content to replace)

This is a working, deployable site, but the following are placeholders and
should be updated with real content before it goes live for clients:

- [ ] Client testimonials on the homepage (`src/pages/index.astro`) — either
      replace with real, permissioned quotes or remove the section.
- [ ] Portfolio projects (`src/pages/portfolio.astro`, homepage teaser) —
      swap in real case studies, screenshots instead of gradient placeholders.
- [ ] Calendly link on the thank-you page (`src/pages/thank-you.astro`) —
      point to a real scheduling link or remove the button.
- [ ] Contact email address (`hello@mgrdigitalstudio.com`) throughout —
      confirm this is the address you want public, and that it's verified
      in Resend as the `CONTACT_FROM_EMAIL` sending domain.
- [ ] `About` page copy — personalize with real studio background.
- [ ] Favicon (`public/favicon.svg`) — currently a simple "M" placeholder.

## Contact form spam protection

The form uses a hidden honeypot field (`company_website`) — bots that fill
in every field get silently redirected without an email being sent. If spam
becomes a problem, consider adding [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
(free, unlimited, and integrates naturally since you're already on
Cloudflare) in front of the form.
