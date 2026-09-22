import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { GoldButton, OutlineLink } from "@/components/Buttons";
import { PaymentButton } from "@/components/PaymentButton";
import { services } from "@/lib/content";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export async function generateMetadata(
  props: PageProps<"/services/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.description,
  };
}

const siteUrl = "https://mgrdigitalstudio.com";

/**
 * "How much does a small business website cost in Ottawa" is the question this
 * business most wants to be the answer to, and an answer engine will only
 * repeat a number it can read as a number. `From $950` in a heading is prose;
 * an Offer with a price and a currency is a fact it can quote.
 */
function serviceJsonLd(service: NonNullable<ReturnType<typeof getService>>) {
  const price = service.startingPrice.replace(/[^0-9]/g, "");

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/services/${service.slug}/#service`,
    name: service.name,
    serviceType: service.name,
    description: service.longDescription,
    url: `${siteUrl}/services/${service.slug}/`,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: [
      { "@type": "City", name: "Ottawa" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "United States" },
    ],
    availableLanguage: ["en", "es"],
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "CAD",
            // The listed figure is a starting point, not a fixed rate, and
            // saying so in the markup is more honest than publishing it bare.
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: price,
              priceCurrency: "CAD",
              valueAddedTaxIncluded: false,
            },
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/services/${service.slug}/`,
          },
        }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `What's included in ${service.name}`,
      itemListElement: service.features.map((feature) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: feature },
      })),
    },
  };
}

export default async function ServiceDetailPage(
  props: PageProps<"/services/[slug]">
) {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(service)) }}
      />
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 bg-transparent">
        <ParallaxBackground variant="warm" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/90 mb-6">
              {service.name}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight leading-[1.1] mb-7">
              {service.tagline}
            </h1>
            <p className="text-lg text-ink-3 leading-relaxed mb-10">
              {service.longDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <GoldButton size="lg">Get a free website review</GoldButton>
              <OutlineLink href="/services" size="lg">
                All services
              </OutlineLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-24 band border-y border-hair">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14">
          <Reveal>
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-6">
              What&apos;s included
            </h2>
            <ul className="space-y-3.5">
              {service.features.map((feature) => (
                <li key={feature} className="text-sm text-ink-2 leading-relaxed">
                  {feature}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delayMs={100}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-4 mb-6">
              Usually a fit when
            </h2>
            <ul className="space-y-3.5 mb-10">
              {service.idealFor.map((item) => (
                <li key={item} className="text-sm text-ink-3 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>

            <div className="border-t border-hair pt-6">
              <p className="text-2xl font-bold text-ink mb-2">{service.startingPrice}</p>
              <p className="text-sm text-ink-4 leading-relaxed mb-5">
                What moves it is the number of pages and whether you need the
                writing done. You get a fixed number before we start.
              </p>
              <PaymentButton serviceSlug={service.slug} className="w-full" />
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title={`Not sure ${service.name.toLowerCase()} is what you need?`}
        subtitle="Send us your site and what you want more of. We'll tell you which of these actually applies — including when the answer is none of them."
      />
    </>
  );
}
