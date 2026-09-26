"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

/**
 * Slowly rotating dotted globe (cobe, ~5KB WebGL) used as hero atmosphere.
 * Ottawa is the gold home marker; the arcs are the reach the footer already
 * claims — Canada, the U.S., and Spanish-speaking clients abroad.
 *
 * Rendering is driven by our own rAF loop (cobe v2 has no onRender), which
 * pauses whenever the canvas is off screen or the tab is hidden. Under
 * prefers-reduced-motion the globe is drawn but never rotates. If WebGL is unavailable the canvas simply stays empty; nothing
 * on the page depends on it.
 */

const OTTAWA: [number, number] = [45.4215, -75.6972];

const destinations: [number, number][] = [
  [43.6532, -79.3832], // Toronto
  [40.7128, -74.006], // New York
  [25.7617, -80.1918], // Miami
  [19.4326, -99.1332], // Mexico City
  [40.4168, -3.7038], // Madrid
];

const GOLD: [number, number, number] = [0.83, 0.62, 0.16];

export const Globe: React.FC<{ className?: string }> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = canvas.offsetWidth;
    // cobe centres longitude L at phi = π − (L·π/180 − π/2). Start with
    // Ottawa just past centre so it's in view for the first long stretch.
    let phi = Math.PI - ((OTTAWA[1] * Math.PI) / 180 - Math.PI / 2) - 0.35;

    let globe: ReturnType<typeof createGlobe>;
    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi,
        theta: 0.28,
        dark: 0,
        diffuse: 1.6,
        mapSamples: 18000,
        mapBrightness: 5,
        mapBaseBrightness: 0,
        baseColor: [0.97, 0.97, 0.99],
        markerColor: GOLD,
        glowColor: [1, 0.96, 0.88],
        opacity: 0.9,
        markers: [
          { location: OTTAWA, size: 0.055 },
          ...destinations.map((location) => ({ location, size: 0.025 })),
        ],
        arcs: destinations.map((to) => ({ from: OTTAWA, to })),
        arcColor: GOLD,
        arcWidth: 0.6,
        arcHeight: 0.25,
        markerElevation: 0.01,
      });
    } catch {
      return;
    }

    canvas.style.opacity = "1";

    let frame = 0;
    let visible = true;

    // cobe loads its land texture asynchronously, so a single draw can come
    // out as a blank sphere. Under reduced motion we still redraw (without
    // rotating) for a couple of seconds until the map has arrived, then stop.
    const settleUntil = performance.now() + 2500;

    const tick = (now: number) => {
      if (!reduceMotion) phi += 0.0016;
      globe.update({ phi });
      frame = reduceMotion && now > settleUntil ? 0 : requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || !visible || document.hidden) return;
      if (reduceMotion && performance.now() > settleUntil) return;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      const next = canvas.offsetWidth;
      if (!next || next === size) return;
      size = next;
      globe.update({ width: size * dpr, height: size * dpr });
    });
    ro.observe(canvas);

    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`aspect-square w-full opacity-0 transition-opacity duration-1000 ${className}`}
    />
  );
};
