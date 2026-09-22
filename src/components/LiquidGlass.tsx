"use client";

import React, { useEffect, useRef } from "react";

/**
 * The fixed prism field behind the entire document.
 *
 * Each prism reads `--sp` and travels a different distance in a different
 * direction, so scrolling doesn't slide one flat picture — the fields move
 * past each other and the colour where they overlap actually changes. That
 * difference is the whole effect; matching rates would just read as a
 * background scrolling slightly slower than the page.
 *
 * `--sp` is scroll *progress*, 0 to 1, not a pixel offset. Driving it from
 * raw scrollY was the obvious version and it breaks on long pages: at a fixed
 * px-per-px rate a prism has left the viewport entirely a few thousand pixels
 * down, and the bottom of a long article ends up colourless. Normalising
 * bounds the travel, so every page gets the same amount of movement spread
 * across however tall it happens to be.
 *
 * The floor on the divisor matters too — a page barely taller than the
 * viewport would otherwise burn the full travel in one flick of the wheel.
 *
 * The value is written to this element rather than :root. A custom property
 * on the root invalidates style for every element in the document on every
 * frame; scoped here it touches five.
 */
const MIN_RANGE = 900;

export const LiquidGlass: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const apply = () => {
      ticking = false;
      const range = Math.max(
        MIN_RANGE,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / range));
      el.style.setProperty("--sp", progress.toFixed(4));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="liquid" aria-hidden="true">
      <span className="prism prism-1" />
      <span className="prism prism-2" />
      <span className="prism prism-3" />
      <span className="prism prism-4" />
      <span className="liquid-sheen" />
    </div>
  );
};
