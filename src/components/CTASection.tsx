"use client";

import React from "react";
import { Reveal } from "./Reveal";
import { GoldButton } from "./Buttons";
import { Magnetic } from "./Magnetic";

export const CTASection: React.FC<{
  title?: string;
  subtitle?: string;
}> = ({
  title = "Send me your website.",
  subtitle = "I'll come back with two or three specific things I'd change, and why. It's free, and it's useful whether you hire me or not.",
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
            <GoldButton size="lg">Get a free website review</GoldButton>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
};
