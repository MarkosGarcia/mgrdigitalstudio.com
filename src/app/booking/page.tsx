import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { BookingCalendar } from "@/components/BookingCalendar";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "Book a Discovery Call",
  description:
    "Book a free discovery call to talk through your website goals, timeline and budget with mgrdigitalstudio.com.",
};

const agenda = [
  "Your business, customers and current website (if you have one)",
  "What success looks like — more calls, bookings or sales",
  "Timeline, scope and a clear, no-obligation quote",
];

export default function BookingPage() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-transparent">
      <ParallaxBackground variant="mesh" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">
            Discovery Call
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
            Book a free 20-minute discovery call.
          </h1>
          <p className="mt-6 text-lg text-ink-3 leading-relaxed">
            A short, no-pressure conversation to see if we&apos;re the right
            fit for your project.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12">
          <Reveal>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3 mb-4">
              What we&apos;ll cover
            </h2>
            <ul className="space-y-4">
              {agenda.map((item) => (
                <li key={item} className="flex gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-gold mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-ink-2">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* min-w-0 is load-bearing: the calendar contains a horizontally
              scrolling day strip, whose min-content width would otherwise
              expand this track and crush the column beside it. */}
          <Reveal delayMs={100} className="min-w-0">
            <BookingCalendar />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
