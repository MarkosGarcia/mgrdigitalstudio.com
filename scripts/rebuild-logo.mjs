// Rebuilds public/logo-mark.png with genuinely antialiased edges.
//
// The previous pass keyed the background out with a flood fill, which produces
// binary alpha — every pixel is either 0 or 255, so every diagonal in the mark
// is a raster staircase. Measured on the shipped file: 154,435 fully opaque
// pixels, 182,845 fully transparent, and *zero* partial ones. That is the whole
// reason the edges read as cheap, and it gets worse on a light background,
// where there is no dark ground to hide the steps against.
//
// So alpha stops being a yes/no decision:
//   1. take the binary mask as the *shape*, which it gets right
//   2. grow the artwork colour outward, because transparent pixels carry RGB
//      0,0,0 and would otherwise bleed black into every new edge pixel
//   3. build a signed distance field, so each pixel knows how far it is from
//      the true edge rather than only which side of it it sits on
//   4. blur that field slightly, relaxing the staircase without blunting the
//      arrow tip
//   5. denoise the colour, since the artwork came through a JPEG and the
//      mosquito noise both looks cheap up close and wrecks PNG compression
//   6. render at 2x with alpha as a smooth ramp across the boundary
//
// Run: node scripts/rebuild-logo.mjs

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { statSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const IN = join(here, "..", "public", "logo-mark.png");
const OUT = join(here, "..", "public", "logo-mark.png");

const SCALE = 2;
// Edge ramp width in OUTPUT pixels. 1.0 is a crisp single-pixel edge; a little
// over reads as slightly softer and more photographic at small sizes.
const EDGE_SOFTNESS = 1.25;
// Gaussian sigma (source pixels) on the distance field.
const SDF_SIGMA = 0.7;
// Gaussian sigma (source pixels) on the colour. The artwork is flat gradients,
// so this costs no real detail and removes the JPEG grain.
const COLOUR_SIGMA = 0.8;

const src = await sharp(IN).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = src.info;
const px = src.data;
const n = w * h;
console.log(`Source: ${w}x${h}`);

// This script reads and writes the same path. Running it on its own output
// would upscale an already-smooth mark a second time, so refuse: the input is
// meant to be the hard-keyed original, which by definition has no soft pixels.
let softPixels = 0;
for (let i = 3; i < px.length; i += 4) {
  if (px[i] !== 0 && px[i] !== 255) softPixels++;
}
if (softPixels > n * 0.001) {
  console.error(
    `Refusing to run: ${IN} already has ${softPixels} antialiased pixels, so ` +
      `it has been processed. Restore the hard-keyed original first.`
  );
  process.exit(1);
}

// --- 1. binary mask + planar colour ----------------------------------------
const mask = new Uint8Array(n);
const R = new Float32Array(n);
const G = new Float32Array(n);
const B = new Float32Array(n);
const known = new Uint8Array(n);

for (let i = 0; i < n; i++) {
  if (px[i * 4 + 3] > 127) {
    mask[i] = 1;
    known[i] = 1;
    R[i] = px[i * 4];
    G[i] = px[i * 4 + 1];
    B[i] = px[i * 4 + 2];
  }
}

// --- 2. grow colour outward ------------------------------------------------
// Six rings covers the widest reach a resampler can have into the transparent
// side, so no output pixel ever averages in a colour that was never there.
for (let pass = 0; pass < 6; pass++) {
  const nR = R.slice(), nG = G.slice(), nB = B.slice();
  const nKnown = known.slice();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (known[i]) continue;
      let sR = 0, sG = 0, sB = 0, c = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= w) continue;
          const j = ny * w + nx;
          if (!known[j]) continue;
          sR += R[j]; sG += G[j]; sB += B[j]; c++;
        }
      }
      if (c) { nR[i] = sR / c; nG[i] = sG / c; nB[i] = sB / c; nKnown[i] = 1; }
    }
  }
  R.set(nR); G.set(nG); B.set(nB); known.set(nKnown);
}
console.log("Colour grown outward.");

// --- 2b. close the 1px notches the flood fill left in straight edges --------
// JPEG ringing along the top of the browser bar sits right on the fill's
// tolerance, so the mask boundary there nicks in and out by a pixel. A close
// (dilate then erode) fills those without moving a straight edge; an open
// (erode then dilate) clears the matching spurs. Both are radius 1, so the
// arrow tip — about twenty pixels across — is untouched.
function morph(m, grow) {
  const o = new Uint8Array(n);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let hit = grow ? 0 : 1;
      for (let dy = -1; dy <= 1 && hit === (grow ? 0 : 1); dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= w) continue;
          const v = m[ny * w + nx];
          if (grow && v) { hit = 1; break; }
          if (!grow && !v) { hit = 0; break; }
        }
      }
      o[y * w + x] = hit;
    }
  }
  return o;
}

let shape = morph(morph(mask, true), false);   // close
shape = morph(morph(shape, false), true);      // open
console.log("Mask closed and opened.");

// --- 3. signed distance field ----------------------------------------------
// Two-pass chamfer with 3-4 weights, divided by 3 to land back in pixels.
// Accurate to a few percent, far below what a single edge pixel can show.
function chamfer(seed) {
  const INF = 1e9;
  const d = new Float32Array(n);
  for (let i = 0; i < n; i++) d[i] = seed[i] ? 0 : INF;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let v = d[i];
      if (y > 0) {
        if (x > 0) v = Math.min(v, d[i - w - 1] + 4);
        v = Math.min(v, d[i - w] + 3);
        if (x < w - 1) v = Math.min(v, d[i - w + 1] + 4);
      }
      if (x > 0) v = Math.min(v, d[i - 1] + 3);
      d[i] = v;
    }
  }
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      let v = d[i];
      if (y < h - 1) {
        if (x < w - 1) v = Math.min(v, d[i + w + 1] + 4);
        v = Math.min(v, d[i + w] + 3);
        if (x > 0) v = Math.min(v, d[i + w - 1] + 4);
      }
      if (x < w - 1) v = Math.min(v, d[i + 1] + 3);
      d[i] = v;
    }
  }
  for (let i = 0; i < n; i++) d[i] /= 3;
  return d;
}

const inv = new Uint8Array(n);
for (let i = 0; i < n; i++) inv[i] = shape[i] ? 0 : 1;
const distToOut = chamfer(inv);    // from inside pixels
const distToIn = chamfer(shape);   // from outside pixels

const sdf = new Float32Array(n);
for (let i = 0; i < n; i++) {
  // Positive inside, negative outside, zero on the boundary itself.
  sdf[i] = shape[i] ? distToOut[i] - 0.5 : -(distToIn[i] - 0.5);
}
console.log("Distance field built.");

// --- 4. separable gaussian -------------------------------------------------
function blur(field, sigma) {
  const radius = Math.ceil(sigma * 3);
  const k = new Float32Array(radius * 2 + 1);
  let sum = 0;
  for (let t = -radius; t <= radius; t++) {
    const v = Math.exp(-(t * t) / (2 * sigma * sigma));
    k[t + radius] = v;
    sum += v;
  }
  for (let t = 0; t < k.length; t++) k[t] /= sum;

  const tmp = new Float32Array(n);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let t = -radius; t <= radius; t++) {
        acc += field[y * w + Math.min(w - 1, Math.max(0, x + t))] * k[t + radius];
      }
      tmp[y * w + x] = acc;
    }
  }
  const out = new Float32Array(n);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let acc = 0;
      for (let t = -radius; t <= radius; t++) {
        acc += tmp[Math.min(h - 1, Math.max(0, y + t)) * w + x] * k[t + radius];
      }
      out[y * w + x] = acc;
    }
  }
  return out;
}

const sdfSmooth = blur(sdf, SDF_SIGMA);
console.log(`Distance field smoothed (sigma ${SDF_SIGMA}).`);

// Colour is blurred across the whole grown field, so the boundary itself never
// becomes a discontinuity the resampler has to guess at.
const Rs = blur(R, COLOUR_SIGMA);
const Gs = blur(G, COLOUR_SIGMA);
const Bs = blur(B, COLOUR_SIGMA);
console.log(`Colour denoised (sigma ${COLOUR_SIGMA}).`);

// --- 5. resample colour to 2x with a real filter ---------------------------
const rgb1x = Buffer.alloc(n * 3);
for (let i = 0; i < n; i++) {
  rgb1x[i * 3] = Math.max(0, Math.min(255, Math.round(Rs[i])));
  rgb1x[i * 3 + 1] = Math.max(0, Math.min(255, Math.round(Gs[i])));
  rgb1x[i * 3 + 2] = Math.max(0, Math.min(255, Math.round(Bs[i])));
}

const ow = w * SCALE, oh = h * SCALE;
const rgb2x = await sharp(rgb1x, { raw: { width: w, height: h, channels: 3 } })
  .resize(ow, oh, { kernel: "lanczos3" })
  .raw()
  .toBuffer();

// --- 6. compose alpha from the field at output resolution ------------------
const out = Buffer.alloc(ow * oh * 4);
let partial = 0;
for (let Y = 0; Y < oh; Y++) {
  const sy = (Y + 0.5) / SCALE - 0.5;
  const y0 = Math.floor(sy), fy = sy - y0;
  const y0c = Math.min(h - 1, Math.max(0, y0));
  const y1 = Math.min(h - 1, Math.max(0, y0 + 1));
  for (let X = 0; X < ow; X++) {
    const sx = (X + 0.5) / SCALE - 0.5;
    const x0 = Math.floor(sx), fx = sx - x0;
    const x0c = Math.min(w - 1, Math.max(0, x0));
    const x1 = Math.min(w - 1, Math.max(0, x0 + 1));

    const d00 = sdfSmooth[y0c * w + x0c], d10 = sdfSmooth[y0c * w + x1];
    const d01 = sdfSmooth[y1 * w + x0c], d11 = sdfSmooth[y1 * w + x1];
    const dTop = d00 + (d10 - d00) * fx;
    const dBot = d01 + (d11 - d01) * fx;
    const dd = dTop + (dBot - dTop) * fy;

    // dd is in source pixels; scale into output pixels, then spread the
    // transition across EDGE_SOFTNESS of them, centred on the boundary.
    let a = (dd * SCALE) / EDGE_SOFTNESS + 0.5;
    if (a <= 0) a = 0;
    else if (a >= 1) a = 1;
    else partial++;

    const o = (Y * ow + X) * 4;
    const s = (Y * ow + X) * 3;
    out[o] = rgb2x[s];
    out[o + 1] = rgb2x[s + 1];
    out[o + 2] = rgb2x[s + 2];
    out[o + 3] = Math.round(a * 255);
  }
}

// Full colour, not a palette. A 220-colour palette does get the file smaller,
// but the mark is two long gradients and quantising them posterises the gold
// into visible blotches — which is the same class of cheapness the edges had.
await sharp(out, { raw: { width: ow, height: oh, channels: 4 } })
  .png({ compressionLevel: 9, effort: 10 })
  .toFile(OUT);

const kb = (statSync(OUT).size / 1024).toFixed(1);
console.log(`Saved ${OUT} -> ${ow}x${oh}, ${kb} KB, ${partial} antialiased edge pixels.`);
