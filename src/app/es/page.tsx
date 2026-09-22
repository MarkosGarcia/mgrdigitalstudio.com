import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { GoldButton } from "@/components/Buttons";
import { Magnetic } from "@/components/Magnetic";
import { PHONE_DISPLAY, PHONE_HREF, EMAIL, EMAIL_HREF } from "@/lib/business";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Páginas web en Ottawa — en español",
  description:
    "Diseño de páginas web para negocios pequeños en Ottawa. Atención en español, cotización personalizada, y revisión gratuita de su página actual.",
  alternates: { canonical: "https://mgrdigitalstudio.com/es" },
};

const servicios = [
  {
    nombre: "Página de una sola sección",
    detalle:
      "Una página enfocada en que la gente lo llame. Ideal si apenas está empezando o si necesita algo rápido.",
  },
  {
    nombre: "Página web completa",
    detalle:
      "De cuatro a ocho secciones: qué hace, dónde trabaja, por qué confiar en usted, y cómo contactarlo.",
  },
  {
    nombre: "Mantenimiento",
    detalle:
      "Actualizaciones, respaldos, y cambios pequeños cuando los necesite. Para que su página no se quede abandonada.",
  },
];

const razones = [
  {
    titulo: "La gente lo busca antes de llamarlo",
    texto:
      "Casi nadie llama sin revisar primero. Si su página no se ve bien en el celular, llaman al siguiente de la lista.",
  },
  {
    titulo: "Hablamos el mismo idioma",
    texto:
      "Todo el proceso en español si así lo prefiere: las llamadas, la cotización, y su página también si la quiere bilingüe.",
  },
  {
    titulo: "Precio fijo, sin sorpresas",
    texto:
      "Le doy el precio completo antes de empezar. No cobro por hora ni le mando cuentas que no esperaba.",
  },
];

export default function SpanishPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 bg-transparent">
        <ParallaxBackground variant="hero" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/90 mb-6">
              Páginas web · Ottawa
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-ink tracking-tight leading-[1.1] mb-7">
              Su negocio merece una página que sí traiga clientes.
            </h1>
            <p className="text-lg text-ink-2 leading-relaxed mb-4">
              Hago páginas web para negocios pequeños aquí en Ottawa. Claras,
              rápidas en el celular, y fáciles para que la gente lo contacte.
            </p>
            <p className="text-base text-ink-3 leading-relaxed mb-10">
              Me llamo Marcos, soy de Guadalajara y vivo en Stittsville. Con
              mucho gusto lo atiendo en español — desde la primera llamada
              hasta el día que su página esté lista.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Magnetic>
                <GoldButton size="lg" className="w-full sm:w-auto">
                  Revisión gratuita de su página
                </GoldButton>
              </Magnetic>
              <a
                href={PHONE_HREF}
                className="pressable lift inline-flex items-center justify-center rounded-xl border border-hair glass px-8 py-4 text-base font-medium text-ink w-full sm:w-auto"
              >
                Llamar {PHONE_DISPLAY}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 md:py-28 band border-y border-hair">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="max-w-2xl mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">
              ¿Por qué conmigo?
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {razones.map((r, i) => (
              <Reveal key={r.titulo} delayMs={i * 70}>
                <h3 className="text-ink font-semibold mb-3">{r.titulo}</h3>
                <p className="text-sm text-ink-3 leading-relaxed">{r.texto}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 bg-transparent">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-5">
              Servicios.
            </h2>
            <p className="text-ink-3 leading-relaxed">
              Le doy un precio exacto por escrito después de platicar lo que
              necesita — no antes.
            </p>
          </Reveal>

          <div className="border-t border-hair">
            {servicios.map((s, i) => (
              <Reveal key={s.nombre} delayMs={i * 60}>
                <div className="py-6 border-b border-hair">
                  <p className="text-ink font-semibold mb-1">{s.nombre}</p>
                  <p className="text-sm text-ink-3 leading-relaxed">{s.detalle}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 band border-t border-hair">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-5">
              Mándeme su página y yo le digo qué cambiaría.
            </h2>
            <p className="text-ink-3 leading-relaxed mb-10 max-w-xl mx-auto">
              Sin costo y sin compromiso. Le mando dos o tres cosas concretas
              que yo arreglaría — le sirve aunque no trabaje conmigo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Magnetic>
                <GoldButton size="lg">Pedir mi revisión gratis</GoldButton>
              </Magnetic>
              <a
                href={whatsappLink("¡Hola Marcos! Me gustaría una revisión de mi página.")}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable lift inline-flex items-center justify-center rounded-xl border border-hair glass px-8 py-4 text-base font-medium text-ink"
              >
                Escribir por WhatsApp
              </a>
            </div>

            <div className="text-sm text-ink-3 space-y-1">
              <p>
                <a href={PHONE_HREF} className="hover:text-gold transition-colors">
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p>
                <a href={EMAIL_HREF} className="hover:text-gold transition-colors">
                  {EMAIL}
                </a>
              </p>
            </div>

            <p className="mt-10 text-xs text-ink-4">
              <Link href="/" className="hover:text-gold transition-colors">
                View this site in English →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
