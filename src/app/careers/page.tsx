import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "We're always interested in hearing from talented designers, developers and strategists. See how to get in touch.",
};

const values = [
  { title: "Remote-first", description: "I work remotely across time zones, based in Ottawa." },
  { title: "Craft matters", description: "We care about the details that make a site fast, clear and genuinely convert." },
  { title: "Client results over vanity metrics", description: "We measure our work the same way our clients do — calls, bookings and sales." },
];

export default function CareersPage() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-transparent">
      <ParallaxBackground variant="cool" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">Careers</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
            We&apos;re always open to great people.
          </h1>
          <p className="mt-6 text-lg text-ink-3 leading-relaxed">
            We don&apos;t have specific openings listed right now, but
            we&apos;re always interested in hearing from designers,
            developers and strategists who care about building websites that
            genuinely perform.
          </p>
        </Reveal>

        <Reveal delayMs={100} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 mb-14 text-left">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-hair glass p-6">
              <h3 className="text-ink font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-ink-3 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delayMs={200}>
          <a
            href="mailto:info@mgrdigitalstudio.com"
            className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(212,169,55,0.25)] transition-colors"
          >
            Introduce Yourself
          </a>
          <p className="mt-3 text-xs text-ink-4">info@mgrdigitalstudio.com</p>
        </Reveal>
      </div>
    </section>
  );
}
