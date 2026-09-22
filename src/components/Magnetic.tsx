"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Wraps a single child element and gives it a magnetic cursor-follow effect:
 * the element eases toward the pointer while hovered and springs back on
 * leave. Uses gsap.quickTo (a persistent, GPU-accelerated tween) rather than
 * re-creating a tween on every mousemove.
 */
export const Magnetic: React.FC<{
  children: React.ReactElement<{ ref?: React.Ref<HTMLElement> }>;
  strength?: number;
}> = ({ children, strength = 0.35 }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const xTo = gsap.quickTo(node, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(node, "y", { duration: 0.5, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);
    return () => {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return React.cloneElement(children, { ref });
};
