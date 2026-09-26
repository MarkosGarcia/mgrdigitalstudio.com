"use client";

import React from "react";
import { Reveal } from "./Reveal";
import { GoldButton } from "./Buttons";
import { Magnetic } from "./Magnetic";

export const CTASection: React.FC<{
  title?: string;
  subtitle?: string;
}> = ({
  title = "Find out where you rank — free.",
  subtitle = "Tell us your business and the area you serve. We'll check Google Maps, regular search and AI answers, then send back what's holding you back and what we'd fix first. Useful whether you hire us or not.",
}) => {
  return (
    <section className="py-24 md:py-32 band border-t border-hair">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-5">
            {title}
          </h2>
          <p className="text-ink-3 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {subtitle}
          </p>
          <Magnetic>
            <GoldButton size="lg">Get my free visibility audit</GoldButton>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
};
