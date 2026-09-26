import React from "react";

/**
 * Cinematic hero backdrop: an AI-generated still of gold and ivory silk that
 * drifts very slowly, with a soft light sweep passing over it every few
 * seconds. It gives the hero the feel of a background video at a fraction of
 * the weight (~25KB), and every moving part is a transform on its own
 * compositor layer, so it costs nothing while the page scrolls.
 *
 * A paper-coloured fade on the left keeps the headline on a clean ground.
 * Under prefers-reduced-motion it's a still image.
 */
export const HeroBackdrop: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <picture>
      <source media="(max-width: 767px)" srcSet="/hero-silk-mobile.webp" />
      <img
        src="/hero-silk.webp"
        alt=""
        width={1280}
        height={720}
        decoding="async"
        className="hero-drift absolute inset-0 h-full w-full object-cover object-[right_bottom] opacity-90"
      />
    </picture>
    <div className="hero-sweep absolute inset-y-0 -left-1/3 w-1/3" />
    <div className="absolute inset-0 bg-gradient-to-r from-[var(--paper)] via-[var(--paper)]/80 to-transparent md:via-[var(--paper)]/55" />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[var(--paper)]" />
  </div>
);
