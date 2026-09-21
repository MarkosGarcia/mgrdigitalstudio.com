# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** MGR Digital Studio
**Updated:** 2026-09-21 (hand-corrected after implementation — see note below)
**Concept:** Cinematic luxury digital studio — editorial, dark, restrained

> **Note:** The `ui-ux-pro-max --design-system` auto-suggestion for this query
> (Brutalism, pink/cyan palette) didn't fit a "cinematic luxury $20K studio"
> brief. We manually combined two of its other style matches instead —
> `exaggerated-minimalism` (oversized editorial type, black/white + single
> accent, luxury/portfolio) and `parallax-storytelling` (scroll-driven,
> cinematic, layered depth) — plus its `color` domain's "E-commerce Luxury"
> and "Auction Platform" palettes as the basis for the dark/gold palette
> below, and its `typography` domain's "Classic Elegant" pairing
> (Playfair Display + Inter). This file reflects what was actually built,
> not the raw `--design-system` output.

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#0B0A08` | `--color-bg` |
| Background Alt | `#100E0A` | `--color-bg-alt` |
| Surface (cards) | `#161310` | `--color-surface` |
| Surface 2 (elevated) | `#1E1A14` | `--color-surface-2` |
| Text | `#F4EFE4` | `--color-text` |
| Text Muted | `#A89D8A` | `--color-text-muted` |
| Border | `#2A251D` | `--color-border` |
| Border Strong | `#3A3327` | `--color-border-strong` |
| Accent (gold) | `#C39A5F` | `--color-accent` |
| Accent Bright | `#E3BD82` | `--color-accent-bright` |
| Accent Ink (on-accent text) | `#1A1409` | `--color-accent-ink` |

Verified contrast: muted text on bg ≈ 7.4:1, accent-ink on accent button ≈ 7.1:1 (WCAG AAA for normal text).

### Typography

- **Display/Headings:** Playfair Display (serif, oversized, editorial)
- **Body/UI:** Inter (light weight, 300–600)
- **Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
```
- H1: `clamp(2.75rem, 6vw, 5.5rem)`; Hero H1: `clamp(3rem, 7.5vw, 6.75rem)`
- Fallback stack includes Georgia/system serif and system sans so the page
  degrades gracefully if Google Fonts is blocked.

### Spacing (density: spacious)

- `--section-pad`: `clamp(5rem, 9vw, 9rem)` vertical section padding
- Card/grid gaps use a 1px hairline-grid technique (see Components) rather
  than a numeric gap token — cards butt against a shared border color.

### Radius & Shadow

- `--radius: 2px` — near-sharp corners throughout (editorial, not app-like)
- No drop shadows; depth comes from the hairline grid and surface color
  steps (`--color-bg` → `--color-surface` → `--color-surface-2`), not blur.

---

## Component Specs

### Buttons (`.btn`, `.btn-primary`, `.btn-outline`)

Uppercase, letter-spaced, pill-free (2px radius), min 48px tap target.
`.btn-primary` = solid gold bg + ink text. `.btn-outline` = transparent +
border, brightens on hover. Add `.magnetic` for the pointer-only magnetic
hover pull (see Motion).

### Cards (`.card`)

No border/shadow of their own — sit inside a `.grid` (hairline background
trick: `gap: 1px; background: var(--color-border)` with each `.card`
opaque) or a `.stack` (top/bottom hairline borders) so dividers read as a
single continuous editorial grid, not boxed SaaS cards. Background steps to
`--color-surface` on hover.

### Hero (`.hero`, `Hero.astro`)

Full-viewport (`100svh`), layered scene: two blurred radial "glow" shapes
(`.hero-glow`) with independent parallax speeds, one horizontal scanline,
and a vignette. Headline supports an `<em>` emphasis word in
accent-bright italic. Always paired with a `.scroll-cue` at the bottom-left.

### Forms (`.form-card`, `ContactForm.astro`)

Dark surface card, hairline borders on inputs, gold focus ring. Kept to 3
fields (name/email/message) with autocomplete + a honeypot field per the
conversion-optimization pass — cinematic redesign changed the look, not the
lead-gen mechanics.

---

## Motion System

Implemented with GSAP + ScrollTrigger (`gsap` npm package, free since 3.12+
including ScrollTrigger/SplitText). Two layers:

1. **Hero entrance** (`Hero.astro` own `<script>`): one-shot timeline on
   load — headline fades/rises in first, then kicker/lead/CTAs/scroll-cue
   stagger in. Ambient parallax on the glow/scanline layers tied to
   `scroll`.
2. **Site-wide scroll reveal** (`Layout.astro` `<script>`): any element
   tagged `data-reveal` (or `data-reveal-group` for a stagger over its
   direct children) slides up 24px on scroll into view via ScrollTrigger
   (`start: 'top 88%'`).

**Critical rule — do not regress this:** the site-wide reveal animates
**`y` only, never `opacity`**. An earlier version used `gsap.from(el, {
opacity: 0, y: 24, scrollTrigger: {...} })`, which sets `opacity: 0`
immediately on page load for every matched element — including ones far
below the fold — and only restores it once an actual scroll event fires
ScrollTrigger. A full-page screenshot (no real scroll events) showed entire
below-the-fold sections rendering as blank gaps because of this: exactly
the anti-pattern this skill's own `ux` domain data warns against
("Don't reveal below-the-fold content needed for SEO/crawlers as
invisible-by-default without a no-JS fallback"). Keeping the reveal to a
`y`-only slide means content is always present/visible/readable — for
no-JS clients, `prefers-reduced-motion` clients, and crawlers alike — and
still reads as a deliberate cinematic motion.

Also implemented: a `.magnetic` hover pull on buttons (pointer/hover-
capable devices only, via `matchMedia('(hover: hover)')`), tweening
`x`/`y` toward the cursor within the element and springing back on
`mouseleave`.

Both scripts check `matchMedia('(prefers-reduced-motion: reduce)')` first
and skip all GSAP calls entirely when true — verified with
`page.emulateMedia({ reducedMotion: 'reduce' })` that every page still
renders fully, immediately, with no layout difference.

---

## Anti-Patterns (Do NOT Use)

- ❌ Opacity-based scroll reveals on below-the-fold content (see Motion above)
- ❌ Emojis as icons
- ❌ Drop shadows / rounded "app" cards — this system uses hairline
  dividers and sharp corners instead
- ❌ Corporate light-mode SaaS look, hidden/thin portfolio content
- ❌ Missing `cursor: pointer`, invisible focus states, low contrast text

## Pre-Delivery Checklist

- [x] No emojis as icons
- [x] `cursor: pointer` on all clickable elements (native `<button>`/`<a>`)
- [x] Hover states with smooth transitions
- [x] Contrast verified ≥ 7:1 on body text and button text
- [x] Focus states visible (default outline preserved on inputs/links)
- [x] `prefers-reduced-motion` respected end-to-end (verified via screenshot)
- [x] Responsive down to 375px (mobile nav tested at 390px)
- [x] No content hidden behind the fixed header (`main > .section:first-child`
      gets header-height top padding; the hero has its own)
- [x] No horizontal scroll (`overflow-x: clip` on body; parallax layers
      confined inside `overflow: hidden` hero scene)
