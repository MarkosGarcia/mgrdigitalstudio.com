import React from "react";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { Spotlight } from "./Spotlight";
import { services } from "@/lib/content";

export const ServicesOverview: React.FC = () => {
  return (
    <section id="services" className="py-24 md:py-32 bg-transparent">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="max-w-2xl mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-5">
            Four things, done properly.
          </h2>
          <p className="text-ink-3 text-lg leading-relaxed">
            Two ways to build something, two ways to keep it working. Most
            people start with one and add the other later.
          </p>
        </Reveal>

        <div className="border-t border-hair">
          {services.map((service, i) => (
            <Reveal key={service.slug} delayMs={i * 70}>
              <Spotlight className="border-b border-hair">
              <Link
                href={`/services/${service.slug}`}
                className="group relative z-10 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 py-7 px-4 -mx-4 transition-colors"
              >
                <div className="sm:w-56 shrink-0">
                  <h3 className="text-lg font-semibold text-ink group-hover:text-gold transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-ink-4 mt-1">{service.startingPrice}</p>
                </div>
                <p className="text-sm text-ink-3 leading-relaxed flex-1">
                  {service.description}
                </p>
                <svg
                  className="hidden sm:block w-4 h-4 shrink-0 text-ink-4 group-hover:text-gold group-hover:translate-x-1 transition-colors self-center"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
