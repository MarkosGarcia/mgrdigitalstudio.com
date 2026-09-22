import React from "react";
import { Reveal } from "./Reveal";
import { aFit, notAFit } from "@/lib/content";

export const FitSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-transparent">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-5">
            We&apos;re not right for everyone.
          </h2>
          <p className="text-ink-3 text-lg leading-relaxed">
            Easier to say now than on a call three weeks in.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <Reveal>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-6">
              Probably a good fit
            </h3>
            <ul className="space-y-4">
              {aFit.map((item) => (
                <li key={item} className="text-sm text-ink-2 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delayMs={100}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-4 mb-6">
              Probably not
            </h3>
            <ul className="space-y-4">
              {notAFit.map((item) => (
                <li key={item} className="text-sm text-ink-4 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delayMs={200}>
          <p className="mt-14 text-sm text-ink-4 max-w-2xl leading-relaxed">
            Neither of those rules you out on its own — say so on the first
            call and we&apos;ll figure out the right way to handle it, either
            together or through someone I trust.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
