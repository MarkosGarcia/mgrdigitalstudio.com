import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-24 md:py-36 bg-transparent">
      <div className="max-w-lg mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-gold mb-3">404</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-4">
          Page not found.
        </h1>
        <p className="text-ink-3 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
