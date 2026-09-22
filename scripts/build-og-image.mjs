// Rebuilds public/og-logo.png — the card that shows when someone shares a link
// to the site on LinkedIn, Facebook, WhatsApp or iMessage.
//
// The file it replaces was a much older export of the mark: heavy black
// outlines, blocky edges, a dark halo. It was also 512x512, which every
// large-image card crops or letterboxes. This builds the standard 1200x630 on
// the site's own paper ground, with the current clean mark.
//
// Run: node scripts/build-og-image.mjs

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { statSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const MARK = join(here, "..", "public", "logo-mark.png");
const OUT = join(here, "..", "public", "og-logo.png");

const W = 1200;
const H = 630;

// Paper plus two soft prism fields, matching the site's own background.
const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fcfdff"/>
      <stop offset="100%" stop-color="#eef1f8"/>
    </linearGradient>
    <radialGradient id="cyan" cx="0.12" cy="0.1" r="0.62">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="violet" cx="0.92" cy="0.86" r="0.6">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="#a78bfa" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gold" cx="0.72" cy="0.14" r="0.5">
      <stop offset="0%" stop-color="#d4a937" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#d4a937" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#paper)"/>
  <rect width="${W}" height="${H}" fill="url(#cyan)"/>
  <rect width="${W}" height="${H}" fill="url(#violet)"/>
  <rect width="${W}" height="${H}" fill="url(#gold)"/>
</svg>`);

// The renderer resolves fonts against whatever the build machine has
// installed, so this is deliberately a plain sans stack rather than the site's
// Inter — nothing here depends on a webfont being present, and the result is
// baked into a PNG anyway. Check the output after changing it.
const wordmark = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="560" y="300" font-family="Inter, 'Segoe UI', system-ui, sans-serif"
        font-size="58" font-weight="700" fill="#0b1220" letter-spacing="-1.5">
    MGR <tspan fill="#8a6410">Digital Studio</tspan>
  </text>
  <text x="562" y="352" font-family="Inter, 'Segoe UI', system-ui, sans-serif"
        font-size="26" font-weight="500" fill="#4a5a72">
    Turning visitors into customers.
  </text>
  <text x="562" y="410" font-family="Inter, 'Segoe UI', system-ui, sans-serif"
        font-size="22" font-weight="500" fill="#5b6b82">
    Web design for small business — Ottawa
  </text>
</svg>`);

const mark = await sharp(MARK)
  .resize({ width: 400, height: 400, fit: "inside" })
  .toBuffer();
const markMeta = await sharp(mark).metadata();

await sharp(background)
  .composite([
    { input: mark, left: 110, top: Math.round((H - markMeta.height) / 2) },
    { input: wordmark, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9, effort: 10 })
  .toFile(OUT);

const kb = (statSync(OUT).size / 1024).toFixed(1);
console.log(`Saved ${OUT} -> ${W}x${H}, ${kb} KB`);
