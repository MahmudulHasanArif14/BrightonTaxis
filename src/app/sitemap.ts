import type { MetadataRoute } from "next";
import { listArticles } from "@/lib/content-api";
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
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  // Degrades to the static entries if the content platform is unreachable.
  // A short sitemap beats a 500, which Google treats as a fetch failure.
  const { articles } = await listArticles().catch(() => ({
    articles: [],
    truncated: true,
  }));

  const newest = articles[0]?.updated_at ?? articles[0]?.published_at ?? null;

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}${BLOG_PATH}`,
      // The listing changes when its newest article does.
      lastModified: newest ? new Date(newest) : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${base}${BLOG_PATH}/${article.slug}`,
      lastModified: article.updated_at
        ? new Date(article.updated_at)
        : article.published_at
          ? new Date(article.published_at)
          : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
