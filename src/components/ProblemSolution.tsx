import React from "react";
import { Reveal } from "./Reveal";

const points = [
  {
    stat: "Top 3",
    title: "You're not in the map results",
    body: "When someone nearby searches for what you do, Google shows three businesses on a map before any website. Fourth place might as well be page two.",
  },
  {
    stat: "AI",
    title: "AI assistants don't mention you",
    body: "When someone asks ChatGPT or Gemini who to call, it recommends businesses it can clearly understand and trust. A thin profile and a vague website leave you out of the answer.",
  },
  {
    stat: "1 tap",
    title: "The click doesn't become a call",
    body: "Even when someone finds you, a slow or unclear website sends them straight back to the next result. The phone number should be one tap away.",
  },
];

export const ProblemSolution: React.FC = () => {
  return (
    <section className="py-24 md:py-32 band border-y border-hair">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-6 leading-tight">
            Being great at what you do isn&apos;t enough if nobody finds you.
          </h2>
          <p className="text-ink-3 text-lg leading-relaxed">
            Most of the local businesses we look at do excellent work.
            They&apos;re just invisible at the exact moment someone nearby is
            ready to hire — and the call goes to whoever shows up first.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {points.map((point, i) => (
            <Reveal key={point.title} delayMs={i * 90}>
              <p className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-500 to-[#8a6410] bg-clip-text text-transparent mb-3">
                {point.stat}
              </p>
              <h3 className="text-ink font-semibold mb-3">{point.title}</h3>
              <p className="text-sm text-ink-3 leading-relaxed">{point.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
