import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { Spotlight } from "@/components/Spotlight";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Websites built for Ottawa businesses — Courtney Janelle Studio and BBJ Flooring Corp. Real clients, real sites you can visit.",
};

const ArrowIcon = () => (
  <svg
    className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default function WorkPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 bg-transparent">
        <ParallaxBackground variant="mesh" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/90 mb-6">
              Our work
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight leading-[1.1] mb-7">
              Sites you can actually go and look at.
            </h1>
            <p className="text-lg text-ink-3 leading-relaxed">
              Two Ottawa businesses, both live. Click through and judge the
              work directly — that&apos;s more useful than anything I could
              claim about it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-transparent">
        <div className="max-w-3xl mx-auto px-6 border-t border-hair">
          {projects.map((project, i) => (
            <Reveal key={project.url} delayMs={i * 80}>
              <Spotlight className="border-b border-hair">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative z-10 block py-10 px-4 -mx-4"
                >
                  <p className="text-xs font-mono uppercase tracking-wider text-ink-4 mb-3">
                    {project.sector}
                  </p>

                  <h2 className="text-2xl font-semibold text-ink mb-1 group-hover:text-gold transition-colors">
                    {project.business}
                  </h2>
                  <p className="text-sm text-ink-4 mb-5">{project.client}</p>

                  <p className="text-sm text-ink-3 leading-relaxed mb-6 max-w-xl">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {project.built.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-ink-3 border border-hair rounded-full px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-2 text-sm font-medium text-gold">
                    {project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    <ArrowIcon />
                  </span>
                </a>
              </Spotlight>
            </Reveal>
          ))}

          <Reveal delayMs={200}>
            <p className="mt-12 text-sm text-ink-4 leading-relaxed">
              This page grows as projects launch. If you want to talk to either
              of these owners before hiring me, ask and I&apos;ll put you in
              touch.
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
