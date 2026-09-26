import React from "react";
import Image from "next/image";

/**
 * The real brand mark, large, in a glass card that matches the browser-frame
 * language used elsewhere on the site. A soft gold glow breathes behind it and
 * the whole thing floats gently, with a light sweep crossing only the mark's
 * own pixels.
 *
 * The shadow is set here rather than with `shadow-2xl`: .glass declares
 * box-shadow and is defined after the Tailwind import, so it would win anyway
 * — and a stock black drop shadow is far too heavy under glass on paper.
 */
export const HeroSignature: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div className={`relative ${className}`} aria-hidden="true">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="signature-glow w-[70%] h-[70%] rounded-full bg-[#D4A937] opacity-[0.3] blur-[100px] mix-blend-multiply" />
    </div>

    <div className="group relative rounded-[2rem] border border-hair glass glass-hero backdrop-blur-xl p-10 md:p-14">
      <div className="relative">
        <Image
          src="/logo-full.webp"
          alt="MGR Digital Studio — Websites, Landing Pages, SEO, Google Business Profile Optimization, Conversion Optimization, AI Search Optimization, Marketing, Marketing Automation, Analytics, Paid Advertising"
          width={1100}
          height={605}
          className="w-full h-auto object-contain drop-shadow-[0_8px_28px_rgba(138,100,16,0.18)] transition-transform duration-500 ease-out float-slow group-hover:-translate-y-1 group-hover:scale-[1.03]"
        />
        <span className="logo-sheen-full" />
      </div>
    </div>
  </div>
);
