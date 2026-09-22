import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { QuoteCalculator } from "@/components/QuoteCalculator";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "Quote Calculator",
  description:
    "Get an instant, ballpark estimate for your website or landing page project in under a minute.",
};

export default function QuoteCalculatorPage() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-transparent">
      <ParallaxBackground variant="gold" />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <Reveal className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">
            Quote Calculator
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
            See a ballpark price in under a minute.
          </h1>
          <p className="mt-6 text-lg text-ink-3 leading-relaxed">
            Answer a few quick questions to get an instant estimate. No email
            required to see your range.
          </p>
        </Reveal>

        <Reveal delayMs={100}>
          <QuoteCalculator />
        </Reveal>
      </div>
    </section>
  );
}
