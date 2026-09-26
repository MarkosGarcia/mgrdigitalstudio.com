import React from "react";
import { Reveal } from "./Reveal";
import { processSteps } from "@/lib/content";

export const ProcessSteps: React.FC = () => {
  return (
    <section id="process" className="py-24 md:py-32 band border-y border-hair">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-5">
            How it works.
          </h2>
          <p className="text-ink-3 text-lg leading-relaxed">
            From &ldquo;where do I actually stand?&rdquo; to climbing — and you
            know the price before any work starts.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
          {processSteps.map((step, i) => (
            <Reveal key={step.title} delayMs={i * 80} className="flex gap-5">
              <span className="text-sm font-mono text-gold/70 pt-1 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-ink font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-ink-3 leading-relaxed">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
