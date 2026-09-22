import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "mgrdigitalstudio.com is headquartered in Ottawa, Ontario, and serves clients across Canada, the United States and internationally — fully remote.",
};

const regions = [
  {
    title: "Ontario",
    places: ["Ottawa", "Toronto", "Kingston", "London", "Hamilton"],
  },
  {
    title: "Canada-wide",
    places: ["British Columbia", "Alberta", "Quebec", "Atlantic Canada"],
  },
  {
    title: "United States",
    places: ["Northeast", "Midwest", "South", "West Coast"],
  },
];

export default function LocationsPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-20 bg-transparent">
        <ParallaxBackground variant="cool" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">
              Locations
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
              Based in Ottawa. Working everywhere.
            </h1>
            <p className="mt-6 text-lg text-ink-3 leading-relaxed">
              We&apos;re in Ottawa, so if you&apos;re local we can meet for a
              coffee. If you&apos;re not, none of this actually requires being
              in the same room — calls and reviews happen over video, and it
              works fine.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 md:pb-28 bg-transparent">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="rounded-2xl border border-hair glass p-8 mb-12 text-center">
            <h2 className="text-lg font-bold text-ink mb-2">Home base</h2>
            <p className="text-ink-3">Ottawa, Ontario, Canada</p>
          </Reveal>

          <Reveal delayMs={100} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((region) => (
              <div key={region.title} className="rounded-2xl border border-hair glass p-7">
                <h3 className="text-ink font-semibold mb-4">{region.title}</h3>
                <ul className="space-y-2 text-sm text-ink-3">
                  {region.places.map((place) => (
                    <li key={place}>{place}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
