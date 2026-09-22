import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { GoldButton, OutlineLink } from "@/components/Buttons";
import { Magnetic } from "@/components/Magnetic";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/business";

export const metadata: Metadata = {
  title: "New Business Launch Kit",
  description:
    "Everything a new Ottawa business needs to look real online, in one decision: domain, business email, one-page website, Google Business Profile, social profiles and a QR business card. $2,900.",
};

const kit = [
  { item: "Your domain", detail: "Bought and configured properly, in your name — not mine." },
  { item: "Business email", detail: "you@yourbusiness.ca, set up and working on your phone." },
  { item: "A one-page website", detail: "What you do, who you serve, proof you're real, and how to reach you." },
  { item: "Google Business Profile", detail: "Created and verified, so you show up in Maps and local search." },
  { item: "Social profiles", detail: "Set up consistently, with the same name, logo and details everywhere." },
  { item: "QR business card design", detail: "Print-ready. People scan it and land on your site." },
];

const faqs = [
  {
    q: "I don't have a logo yet.",
    a: "That's fine — plenty of businesses launch without one. We can work with clean type for now, and you can add a logo later without rebuilding anything.",
  },
  {
    q: "How long does it take?",
    a: "Usually about two weeks from the day I have your details and photos. The domain and Google profile can be live sooner than the site.",
  },
  {
    q: "What if I grow out of one page?",
    a: "Then we add pages. The one-page site is built so it extends into a full site later — you don't start over, and you don't pay twice for the same work.",
  },
  {
    q: "Do I own everything?",
    a: "Yes. Domain, site, content, Google profile — all registered in your name, and yours to take elsewhere if you ever want to.",
  },
];

export default function LaunchKitPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 bg-transparent">
        <ParallaxBackground variant="cool" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/90 mb-6">
              New business launch kit
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight leading-[1.1] mb-7">
              Everything you need to look real online. One decision.
            </h1>
            <p className="text-lg text-ink-2 leading-relaxed mb-4">
              Opening a business means about forty small decisions at once.
              This is the one that takes six of them off your list.
            </p>
            <p className="text-base text-ink-3 leading-relaxed mb-10">
              Domain, business email, a one-page site, your Google listing,
              social profiles, and a QR business card — set up together so
              everything matches and nothing gets forgotten.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Magnetic>
                <GoldButton size="lg" className="w-full sm:w-auto">
                  Start your launch kit
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
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-5">
              What&apos;s in it.
            </h2>
          </Reveal>

          <div className="border-t border-hair">
            {kit.map((k, i) => (
              <Reveal key={k.item} delayMs={i * 55}>
                <div className="flex flex-col sm:flex-row sm:gap-8 py-6 border-b border-hair">
                  <p className="text-ink font-semibold sm:w-56 shrink-0 mb-1 sm:mb-0">
                    {k.item}
                  </p>
                  <p className="text-sm text-ink-3 leading-relaxed">{k.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delayMs={120} className="mt-12">
            <div className="rounded-2xl border border-amber-500/25 glass p-8">
              <p className="text-4xl font-bold text-ink mb-2">$2,900</p>
              <p className="text-sm text-ink-3 leading-relaxed mb-6">
                All six, done together. Bought separately this is closer to
                $4,000 and four different conversations.
              </p>
              <p className="text-xs text-ink-4">
                50% to start, 50% at launch. Website Care optional afterwards at
                $199/month.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 md:py-28 bg-transparent">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">
              Fair questions.
            </h2>
          </Reveal>

          <div className="border-t border-hair">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delayMs={i * 55}>
                <div className="py-6 border-b border-hair">
                  <p className="text-ink font-semibold mb-2">{f.q}</p>
                  <p className="text-sm text-ink-3 leading-relaxed">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delayMs={120} className="mt-10">
            <OutlineLink href="/services" size="lg">
              Compare with the other services
            </OutlineLink>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Opening soon?"
        subtitle="Tell me what you're starting and roughly when. I'll tell you what actually needs to be ready on day one — and what can wait."
      />
    </>
  );
}
