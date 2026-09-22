import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { blogPosts } from "@/lib/content";
import { ParallaxBackground } from "@/components/ParallaxBackground";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical articles on website conversion, design and strategy for growing businesses.",
};

export default function BlogPage() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-transparent">
      <ParallaxBackground variant="mesh" />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <Reveal className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">Blog</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
            Ideas on building websites that convert.
          </h1>
        </Reveal>

        <div className="space-y-6">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delayMs={i * 80}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-hair glass hover:border-hair-strong transition-colors p-7"
              >
                <div className="flex items-center gap-3 text-xs text-ink-4 mb-3">
                  <span className="text-gold font-medium">{post.category}</span>
                  <span>&middot;</span>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </time>
                  <span>&middot;</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-ink group-hover:text-gold transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-ink-3 leading-relaxed">{post.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
