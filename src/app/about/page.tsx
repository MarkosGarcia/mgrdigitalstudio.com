import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { processSteps } from "@/lib/content";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  EMAIL,
  EMAIL_HREF,
  LEGAL_NAME,
  BRAND_NAME,
  HAS_PORTRAIT,
  PORTRAIT_SRC,
} from "@/lib/business";

export const metadata: Metadata = {
  title: "About Marcos",
  description:
    "Marcos Garcia — licensed gas technician, former maintenance company owner, and the person who builds every website at MGR Digital Studio in Ottawa.",
};

const credentials = [
  { label: "Licensed gas technician", detail: "Years on the tools, in customers' homes and businesses." },
  { label: "Ran his own company", detail: "A maintenance business in Mexico serving convenience stores across three states." },
  { label: "Degree in International Business", detail: "The business side isn't guesswork." },
  { label: "English and Spanish", detail: "Every call, quote and website, in either language." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 bg-transparent">
        <ParallaxBackground variant="hero" />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Photo leads on mobile — it's the fastest trust signal on the
              page, and burying it under three paragraphs wastes it. */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
            <Reveal className="order-2 md:order-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/90 mb-6">
                About
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight leading-[1.1] mb-7">
                Hi — I&apos;m Marcos.
              </h1>
              <p className="text-lg text-ink-2 leading-relaxed mb-4">
                I build every website here myself. No account manager, no
                subcontractors you never meet. When you call the number on this
                site, I&apos;m the one who answers.
              </p>
              <p className="text-base text-ink-3 leading-relaxed">
                I&apos;m a licensed gas technician. Before that I ran my own
                maintenance company in Mexico. I know what it&apos;s like to
                wait on a phone that isn&apos;t ringing.
              </p>
            </Reveal>

            <Reveal className="order-1 md:order-2 justify-self-center md:justify-self-end">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-[#D4A937] opacity-[0.22] blur-[60px] mix-blend-multiply" aria-hidden="true" />
                {HAS_PORTRAIT ? (
                  <Image
                    src={PORTRAIT_SRC}
                    alt="Marcos Garcia"
                    width={320}
                    height={320}
                    priority
                    className="relative w-56 h-56 md:w-72 md:h-72 rounded-full object-cover border border-hair-strong"
                  />
                ) : (
                  <div
                    className="relative w-56 h-56 md:w-72 md:h-72 rounded-full border border-hair-strong bg-gradient-to-br from-white/80 to-[#eef1f8] flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-amber-600">
                      MG
                    </span>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-transparent border-t border-hair">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="space-y-6 text-ink-3 leading-relaxed">
              <p>
                I spent years in the trades — licensed to work on gas
                equipment, in and out of people&apos;s homes and businesses.
                Before Canada, I ran a maintenance company in Mexico looking
                after convenience stores across three states. Hiring, quoting,
                scheduling, chasing invoices, the whole thing.
              </p>
              <p>
                So when a plumber tells me the phone went quiet in February, or
                a shop owner says customers keep calling the competitor first,
                I&apos;m not guessing at what that feels like. I&apos;ve run a
                business where the work only arrives if someone picks up the
                phone.
              </p>
              <p>
                That&apos;s the whole reason I build websites the way I do.
                Most small business sites fail at unglamorous things — nobody
                can tell what you do, the phone number is buried, it takes six
                seconds to load on a phone in a parking lot. Fixing those
                isn&apos;t sophisticated work. It&apos;s just the work that
                decides whether the phone rings.
              </p>
              <p>
                I also have a degree in International Business, and I work in
                English and Spanish. If Spanish is easier for you, we&apos;ll do
                the whole thing in Spanish — the calls, the quote, and your
                website too if you want it.
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={80} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
            {credentials.map((c) => (
              <div key={c.label}>
                <p className="text-ink font-semibold text-sm mb-1.5">{c.label}</p>
                <p className="text-sm text-ink-3 leading-relaxed">{c.detail}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delayMs={120} className="mt-12 pt-8 border-t border-hair">
            <p className="text-sm text-ink-3 leading-relaxed mb-4">
              Easiest way to reach me is the phone. I answer it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={PHONE_HREF}
                className="pressable lift inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-semibold text-slate-950"
              >
                Call {PHONE_DISPLAY}
              </a>
              <a
                href={EMAIL_HREF}
                className="pressable lift inline-flex items-center justify-center rounded-xl border border-hair glass px-6 py-3 text-sm text-ink"
              >
                {EMAIL}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-24 band border-y border-hair">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">
              How we work.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-9">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delayMs={i * 60} className="flex gap-5">
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

          <Reveal delayMs={200} className="mt-14 pt-8 border-t border-hair">
            <p className="text-xs text-ink-4 leading-relaxed">
              {BRAND_NAME} is the trading name of {LEGAL_NAME}, based in Ottawa,
              Ontario.
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
