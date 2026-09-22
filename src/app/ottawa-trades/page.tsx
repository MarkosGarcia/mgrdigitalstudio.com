import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { GoldButton, OutlineLink } from "@/components/Buttons";
import { Magnetic } from "@/components/Magnetic";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/business";

export const metadata: Metadata = {
  title: "Websites for Ottawa Trades",
  description:
    "Websites for Ottawa plumbers, electricians, roofers, landscapers and flooring contractors. Built by a licensed gas technician who's been on the tools. From $950.",
};

const problems = [
  {
    title: "They call the next guy",
    body: "Someone searches at 7am with a leak. If your number isn't on screen in two seconds, they scroll past you. That's the whole competition.",
  },
  {
    title: "Your work looks better than your site",
    body: "You do good work and the photos prove it. Most trades sites bury them under stock images of someone else's van.",
  },
  {
    title: "Nothing says you're legitimate",
    body: "Licensed. Insured. WSIB. Years in business. Put it where people see it, because that's what they're actually checking.",
  },
];

const included = [
  "A phone number at the top of every page, tappable on a phone",
  "The trades you actually do, in the words customers search for",
  "Your service area — the neighbourhoods you'll drive to",
  "Licence, insurance and WSIB shown up front",
  "Photos of your own work, sized so they load fast on data",
  "A short quote-request form for the people who won't call",
];

export default function OttawaTradesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 bg-transparent">
        <ParallaxBackground variant="warm" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/90 mb-6">
              For Ottawa trades
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight leading-[1.1] mb-7">
              Your customers are holding a phone, not a laptop.
            </h1>
            <p className="text-lg text-ink-2 leading-relaxed mb-4">
              Websites for plumbers, electricians, roofers, landscapers,
              flooring and renovation contractors around Ottawa. One job
              usually covers the whole thing.
            </p>
            <p className="text-base text-ink-3 leading-relaxed mb-10">
              I&apos;m a licensed gas technician. I&apos;ve been in the houses,
              done the quotes, and waited on a phone that wasn&apos;t ringing —
              so we can skip the part where I pretend to understand your
              business.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Magnetic>
                <GoldButton size="lg" className="w-full sm:w-auto">
                  Get a free website review
                </GoldButton>
              </Magnetic>
              <a
                href={PHONE_HREF}
                className="pressable lift inline-flex items-center justify-center rounded-xl border border-hair glass px-8 py-4 text-base font-medium text-ink w-full sm:w-auto"
              >
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 md:py-28 band border-y border-hair">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="max-w-2xl mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-5">
              Where the calls go missing.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {problems.map((p, i) => (
              <Reveal key={p.title} delayMs={i * 70}>
                <h3 className="text-ink font-semibold mb-3">{p.title}</h3>
                <p className="text-sm text-ink-3 leading-relaxed">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 bg-transparent">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-5">
              What you get.
            </h2>
            <p className="text-ink-3 leading-relaxed">
              A trades site doesn&apos;t need to be big. It needs to answer
              four questions fast: what you do, where you work, whether
              you&apos;re legitimate, and how to reach you.
            </p>
          </Reveal>

          <ul className="border-t border-hair">
            {included.map((item, i) => (
              <Reveal key={item} delayMs={i * 50}>
                <li className="flex gap-4 py-4 border-b border-hair text-sm text-ink-2">
                  <span className="text-gold shrink-0 font-mono text-xs pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delayMs={120} className="mt-10 flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6">
            <p className="text-2xl font-bold text-ink">From $950</p>
            <p className="text-sm text-ink-4">
              One page, live in about two weeks. Full site from $2,400.
            </p>
          </Reveal>

          <Reveal delayMs={160} className="mt-10">
            <OutlineLink href="/work" size="lg">
              See a flooring contractor&apos;s site
            </OutlineLink>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Send me your site. Or your Facebook page."
        subtitle="I'll look at it the way a customer would — on a phone — and send back two or three things I'd change. Free, and useful whether you hire me or not."
      />
    </>
  );
}
