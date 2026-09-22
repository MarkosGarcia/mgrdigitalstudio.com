"use client";

type Entry = {
  el: HTMLElement;
  onProgress: (progress: number) => void;
};

const registry = new Set<Entry>();
let ticking = false;
let started = false;
let reduced = false;

function computeAndApply() {
  ticking = false;
  const viewportHeight = window.innerHeight;

  registry.forEach((entry) => {
    const rect = entry.el.getBoundingClientRect();
    // 0 when the element's top is at the viewport bottom, 1 when it's at
    // the viewport top — a continuous progress value used to drive a subtle
    // scale/drift on the background layer as the section scrolls through.
    const raw = 1 - rect.top / (viewportHeight || 1);
    const progress = Math.min(1.4, Math.max(-0.4, raw));
    entry.onProgress(progress);
  });
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(computeAndApply);
}

function ensureStarted() {
  if (started) return;
  started = true;
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  computeAndApply();
}

export function registerParallax(el: HTMLElement, onProgress: (progress: number) => void) {
  ensureStarted();
  const entry: Entry = { el, onProgress };
  registry.add(entry);
  if (!reduced) onProgress(0.5);
  return () => {
    registry.delete(entry);
  };
}

export function isReducedMotion() {
  return reduced;
}
