import React from "react";
import { Reveal } from "./Reveal";

const points = [
  {
    title: "It isn't clear what you do",
    body: "A visitor should know your trade, your area, and your next step before they scroll. Most sites bury all three under a slogan.",
  },
  {
    title: "It's slow on a phone",
    body: "That's where nearly all your traffic is. A site that takes six seconds on mobile data loses people who'll never know they nearly called you.",
  },
  {
    title: "There's nothing to do",
    body: "No obvious button, no number at the top, a contact form four clicks deep. Interest fades fast when acting on it takes effort.",
  },
];

export const ProblemSolution: React.FC = () => {
  return (
    <section className="py-24 md:py-32 band border-y border-hair">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-6 leading-tight">
            A website can look fine and still do nothing.
          </h2>
          <p className="text-ink-3 text-lg leading-relaxed">
            Most of the small business sites we look at aren&apos;t ugly. They
            were built once, a few years ago, by someone competent, and then
            left alone. The problem is rarely how it looks. It&apos;s that
            nothing on the page helps a stranger decide to call you.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {points.map((point, i) => (
            <Reveal key={point.title} delayMs={i * 90}>
              <h3 className="text-ink font-semibold mb-3">{point.title}</h3>
              <p className="text-sm text-ink-3 leading-relaxed">{point.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
