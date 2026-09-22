"use client";

import React, { useEffect, useRef } from "react";
import { registerParallax } from "@/lib/scrollFx";

type Variant = "hero" | "cool" | "warm" | "mesh" | "gold";

/**
 * Per-section colour washes, layered over the fixed prism field.
 *
 * These are far fainter than the dark theme's versions were. There, each
 * section had to generate its own light or it read as a black box. Here the
 * prism field behind the whole document is already carrying colour, so a
 * section only needs to lean it slightly one way — anything stronger and the
 * page turns from calm to busy.
 *
 * They blend with `multiply`, not `screen`: on paper, colour has to subtract.
 */
const layers: Record<Variant, React.ReactNode> = {
  hero: (
    <>
      <div className="wash -top-52 left-[6%] w-[44rem] h-[34rem] bg-[#38BDF8] opacity-[0.1]" />
      <div className="wash -top-32 right-[4%] w-[38rem] h-[32rem] bg-[#A78BFA] opacity-[0.09]" />
      <div className="wash -bottom-56 left-[30%] w-[36rem] h-[30rem] bg-[#D4A937] opacity-[0.08]" />
    </>
  ),
  cool: (
    <>
      <div className="wash -top-52 left-[12%] w-[42rem] h-[32rem] bg-[#38BDF8] opacity-[0.08]" />
      <div className="wash -bottom-56 right-[8%] w-[36rem] h-[30rem] bg-[#A78BFA] opacity-[0.08]" />
    </>
  ),
  warm: (
    <>
      <div className="wash -top-48 right-[10%] w-[38rem] h-[30rem] bg-[#D4A937] opacity-[0.09]" />
      <div className="wash -bottom-52 left-[16%] w-[34rem] h-[28rem] bg-[#F472B6] opacity-[0.06]" />
    </>
  ),
  mesh: (
    <>
      <div className="wash -top-40 -left-24 w-[40rem] h-[30rem] bg-[#38BDF8] opacity-[0.07]" />
      <div className="wash -bottom-48 -right-20 w-[40rem] h-[30rem] bg-[#D4A937] opacity-[0.07]" />
    </>
  ),
  gold: (
    <div className="wash top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[32rem] bg-[#D4A937] opacity-[0.09]" />
  ),
};

export const ParallaxBackground: React.FC<{
  variant?: Variant;
  seam?: boolean;
  intensity?: number;
}> = ({ variant = "cool", seam = false, intensity = 1 }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    return registerParallax(outer, (progress) => {
      const scale = 1 + progress * 0.14 * intensity;
      const translateY = (progress - 0.5) * -30 * intensity;
      inner.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    });
  }, [intensity]);

  return (
    <div
      ref={outerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {seam && <div className="seam-top" />}
      <div ref={innerRef} className="absolute inset-0 will-change-transform">
        {layers[variant]}
      </div>
    </div>
  );
};
