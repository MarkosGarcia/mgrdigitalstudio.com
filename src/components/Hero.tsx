"use client";

import React from "react";
import { GoldButton, OutlineLink } from "./Buttons";
import { Magnetic } from "./Magnetic";
import { BeamsBackground } from "./BeamsBackground";
import { HeroSignature } from "./HeroSignature";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-transparent pt-20 pb-24 md:pt-28 md:pb-32">
      <BeamsBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-14 lg:gap-16 items-center">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/90 mb-3">
              Web design · Ottawa
            </p>
            <p className="text-sm md:text-base font-bold uppercase tracking-[0.1em] text-gold mb-6">
              Turning Visitors Into Customers
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-ink tracking-tight leading-[1.08] mb-7">
              Most people look you up before they call.
            </h1>

            <p className="text-lg md:text-xl text-ink-3 leading-relaxed mb-10">
              I build small business websites for that moment. Clear about what
              you do, quick on a phone, easy to get in touch.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
              <Magnetic>
                <GoldButton size="lg" className="w-full sm:w-auto">
                  Get a free website review
                </GoldButton>
              </Magnetic>
              <Magnetic strength={0.25}>
                <OutlineLink href="/services" size="lg" className="w-full sm:w-auto">
                  What we do
                </OutlineLink>
              </Magnetic>
            </div>

            <p className="text-sm text-ink-4">
              Fixed quotes. No lock-in. You talk to the person building it.
            </p>

            <HeroSignature className="lg:hidden mt-14 w-full max-w-sm" />
          </div>

          <HeroSignature className="hidden lg:block w-[26rem] xl:w-[30rem] shrink-0" />
        </div>
      </div>
    </section>
  );
};
