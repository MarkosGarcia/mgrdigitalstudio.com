import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { HOURS, HOURS_LONG } from "@/lib/business";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with mgrdigitalstudio.com. Based in Ottawa, Ontario, serving clients across Canada, the U.S. and internationally.",
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-transparent">
      <ParallaxBackground variant="cool" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">Contact</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
            Let&apos;s talk about your website.
          </h1>
          <p className="mt-6 text-lg text-ink-3 leading-relaxed">
            Have a project in mind or a question first? Send a message below,
            or{" "}
            <Link href="/booking" className="text-gold hover:underline">
              book a free discovery call
            </Link>
            .
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12">
          <Reveal className="space-y-8">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3 mb-3">Email</h2>
              <a href="mailto:info@mgrdigitalstudio.com" className="text-ink hover:text-gold transition-colors">
                info@mgrdigitalstudio.com
              </a>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3 mb-3">Phone</h2>
              <a href="tel:+16135137243" className="text-ink hover:text-gold transition-colors">
                {WHATSAPP_DISPLAY}
              </a>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3 mb-3">WhatsApp</h2>
              <WhatsAppButton />
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3 mb-3">Where we are</h2>
              <p className="text-ink">Ottawa, Ontario, Canada</p>
              <p className="text-sm text-ink-3 mt-1">Happy to meet locally, or work with you remotely anywhere in Canada and the U.S.</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3 mb-3">Hours</h2>
              <p className="text-ink">{HOURS}</p>
              <p className="text-sm text-ink-3 mt-1">{HOURS_LONG}</p>
            </div>
          </Reveal>

          <Reveal delayMs={100} className="rounded-2xl border border-hair glass p-8">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
