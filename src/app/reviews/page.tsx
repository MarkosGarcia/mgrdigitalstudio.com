import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { reviewPlatforms, approvedTestimonials, projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What clients say about working with MGR Digital Studio in Ottawa — and the real projects behind those words.",
};

export default function ReviewsPage() {
  const livePlatforms = reviewPlatforms.filter((p) => p.href);
  const quotes = approvedTestimonials();

  return (
    <>
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 bg-transparent">
        <ParallaxBackground variant="gold" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/90 mb-6">
              Reviews
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight leading-[1.1] mb-7">
              {quotes.length > 0
                ? "What clients say."
                : "Two clients so far. Both sites are live."}
            </h1>
            <p className="text-lg text-ink-3 leading-relaxed">
              {quotes.length > 0
                ? "Every quote here is a client's own words, published with their permission."
                : "Written reviews are being collected now. Rather than put words in anyone's mouth in the meantime, here's the actual work — go and look at it."}
            </p>
          </Reveal>
        </div>
      </section>

      {quotes.length > 0 && (
        <section className="pb-8 md:pb-12 bg-transparent">
          <div className="max-w-3xl mx-auto px-6 grid gap-6">
            {quotes.map((t, i) => (
              <Reveal key={t.url} delayMs={i * 80}>
                <figure className="rounded-2xl border border-hair glass p-8">
                  <blockquote className="text-lg text-ink-2 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="text-ink font-semibold">{t.client}</span>
                    <span className="text-ink-4"> — </span>
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline"
                    >
                      {t.business}
                    </a>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="pb-24 md:pb-32 bg-transparent">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="border-t border-hair pt-10">
            <h2 className="text-ink font-semibold mb-5">The work itself</h2>
            <div className="grid gap-4">
              {projects.map((p) => (
                <a
                  key={p.url}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lift pressable group flex items-baseline justify-between gap-4 rounded-xl border border-hair glass px-5 py-4"
                >
                  <span>
                    <span className="block text-ink font-medium group-hover:text-gold transition-colors">
                      {p.business}
                    </span>
                    <span className="block text-xs text-ink-4 mt-0.5">{p.sector}</span>
                  </span>
                  <span className="text-xs text-gold shrink-0">Visit →</span>
                </a>
              ))}
            </div>
          </Reveal>

          {livePlatforms.length > 0 ? (
            <Reveal delayMs={100} className="border-t border-hair pt-10 mt-10">
              <h2 className="text-ink font-semibold mb-5">Find us on</h2>
              <div className="flex flex-wrap gap-3">
                {livePlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable lift inline-flex items-center gap-2 text-sm font-medium text-ink-2 hover:text-gold glass border border-hair rounded-full px-5 py-2.5 transition-colors"
                  >
                    {platform.name}
                  </a>
                ))}
              </div>
            </Reveal>
          ) : (
            <Reveal delayMs={100} className="border-t border-hair pt-10 mt-10">
              <h2 className="text-ink font-semibold mb-3">
                Want to check me out properly?
              </h2>
              <p className="text-sm text-ink-3 leading-relaxed mb-4">
                Ask for the free review of your own site. You&apos;ll see how I
                think and how I write before you&apos;ve paid or signed
                anything — a better signal than a wall of quotes.
              </p>
              <p className="text-sm text-ink-3 leading-relaxed">
                Or read{" "}
                <Link href="/about" className="text-gold hover:underline">
                  who you&apos;d actually be working with
                </Link>
                .
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
