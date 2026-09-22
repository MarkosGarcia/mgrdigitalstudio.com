import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { QuoteCalculator } from "@/components/QuoteCalculator";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell us what you're looking for in your website or landing page project — we'll come back with a fixed, itemized quote within one business day.",
};

export default function QuoteCalculatorPage() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-transparent">
      <ParallaxBackground variant="gold" />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <Reveal className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">
            Request a Quote
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
            Tell us what you&apos;re after.
          </h1>
          <p className="mt-6 text-lg text-ink-3 leading-relaxed">
            A couple of quick questions so we understand the scope, then we&apos;ll
            reply with a fixed, itemized quote — no price list, no obligation.
          </p>
        </Reveal>

        <Reveal delayMs={100}>
          <QuoteCalculator />
        </Reveal>
      </div>
    </section>
  );
}
