import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * robots.txt.
 *
 * The blog is deliberately not excluded — the whole point of the integration
 * is for those pages to be indexable. The only disallowed path is the webhook
 * receiver, which is a POST-only endpoint with nothing to crawl.
 *
 * Note that robots.txt is a crawl directive, not an access control. It is here
 * to avoid wasted crawl budget on a 405, not to protect the endpoint; the
 * endpoint protects itself with a signature check.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
