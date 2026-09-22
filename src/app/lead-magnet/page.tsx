import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { LeadMagnetGate } from "@/components/LeadMagnetGate";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "10 Things Every Small Business Website Needs",
  description:
    "A free, practical checklist of the ten things every small business website needs to actually generate calls, leads and sales.",
};

export default function LeadMagnetPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16 bg-transparent">
        <ParallaxBackground variant="warm" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">
              Free Guide
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
              10 Things Every Small Business Website Needs
            </h1>
            <p className="mt-6 text-lg text-ink-3 leading-relaxed">
              A short, practical checklist — no fluff — for anything that
              generates calls, leads or bookings.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 md:pb-28 bg-transparent">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <LeadMagnetGate />
          </Reveal>
        </div>
      </section>

      <CTASection title="Want us to check these against your site?" />
    </>
  );
}
