import type { MetadataRoute } from "next";
import { services, blogPosts } from "@/lib/content";

export const dynamic = "force-static";

const siteUrl = "https://mgrdigitalstudio.com";

const staticRoutes = [
  "",
  "about",
  "services",
  "work",
  "reviews",
  "faq",
  "contact",
  "booking",
  "quote-calculator",
  "blog",
  "locations",
  "careers",
  "lead-magnet",
  "ottawa-trades",
  "launch-kit",
  "es",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date(),
  }));

  const serviceEntries = services.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified: new Date(),
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date,
  }));

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
