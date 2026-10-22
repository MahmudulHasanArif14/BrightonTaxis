import type { MetadataRoute } from "next";
import { listArticles } from "@/lib/content-api";
import { AIRPORTS } from "@/lib/business";
import { SERVICE_CONTENT } from "@/content/services";
import { BLOG_PATH, siteUrl } from "@/lib/site";

// On demand, not at build time. A sitemap that queries another service at
// build time can fail a deployment, and a sitemap must never be able to do
// that. The webhook revalidates /sitemap.xml on publication, so it is current
// without being built in.
export const dynamic = "force-dynamic";

/**
 * This site's sitemap: its own URLs on its own domain only.
 *
 * It never lists the central hub's URLs. The same article exists in both
 * places, each canonical to its own domain, and advertising the hub's copy
 * from here would set the two against each other in search.
 *
 * The static entries are derived from the same modules the pages are built
 * from, so a new service or airport page appears here automatically rather
 * than waiting for somebody to remember. Only canonical, indexable URLs go in:
 * the 404 page is noindex and is not listed, and neither is /api.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  // Degrades to the static entries if the content platform is unreachable.
  // A short sitemap beats a 500, which Google treats as a fetch failure.
  const { articles } = await listArticles().catch(() => ({
    articles: [],
    truncated: true,
  }));

  const newest = articles[0]?.updated_at ?? articles[0]?.published_at ?? null;

  const staticPages: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.8, changeFrequency: "monthly" },
    ...Object.keys(SERVICE_CONTENT).map((slug) => ({
      path: `/services/${slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    { path: "/airport-transfers", priority: 0.9, changeFrequency: "monthly" },
    ...AIRPORTS.map((airport) => ({
      path: `/airport-transfers/${airport.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    { path: "/fleet", priority: 0.7, changeFrequency: "monthly" },
    { path: "/service-areas", priority: 0.6, changeFrequency: "monthly" },
    { path: "/how-to-book", priority: 0.7, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
  ];

  return [
    ...staticPages.map((page) => ({
      url: page.path === "/" ? base : `${base}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    {
      url: `${base}${BLOG_PATH}`,
      // The listing changes when its newest article does.
      lastModified: newest ? new Date(newest) : now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${base}${BLOG_PATH}/${article.slug}`,
      lastModified: article.updated_at
        ? new Date(article.updated_at)
        : article.published_at
          ? new Date(article.published_at)
          : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
