import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTASection } from "@/components/CTASection";
import { faqs } from "@/lib/content";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about pricing, timelines, and how we build websites and landing pages that convert.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-20 bg-transparent">
        <ParallaxBackground variant="mesh" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">FAQ</span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
              Frequently asked questions.
            </h1>
            <p className="mt-6 text-lg text-ink-3 leading-relaxed">
              Can&apos;t find what you&apos;re looking for?{" "}
              <a href="/contact" className="text-gold hover:underline">
                Get in touch
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 md:pb-28 bg-transparent">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <FAQAccordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
