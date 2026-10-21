import { NextResponse } from "next/server";
import { listArticles } from "@/lib/content-api";
import {
  BLOG_DESCRIPTION,
  BLOG_PATH,
  BLOG_TITLE,
  SITE_NAME,
  siteUrl,
} from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * RSS 2.0 feed of this location's published articles.
 *
 * Previously this route carried a hardcoded list of five articles whose URLs
 * pointed at /blog/ pages that did not exist on this site. It now reads the
 * same central API the blog pages do, through the same client, so the feed and
 * the website can never disagree about what has been published.
 *
 * A feed is a syndication format, not an indexing mechanism. It lets readers
 * and aggregators follow the blog; it does not cause Google to index anything.
 * Discovery comes from the sitemap and the internal links.
 */

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

/**
 * Strip anything a validator would reject.
 *
 * Control characters are not legal in XML 1.0 at all, not even escaped, and a
 * single stray one makes the whole document unparseable rather than just that
 * one element.
 */
function xmlText(value: string): string {
  // eslint-disable-next-line no-control-regex
  return escapeXml(value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ""));
}

export async function GET() {
  const base = siteUrl();
  const feedUrl = `${base}/feed.xml`;
  const blogUrl = `${base}${BLOG_PATH}`;

  // Never 503 because the platform is slow: listArticles already degrades to
  // what it could fetch, and an empty but valid feed is a better answer to an
  // aggregator than an error it will back off from.
  const { articles } = await listArticles({ limit: 50 }).catch(() => ({
    articles: [],
    truncated: true,
  }));

  const items = articles
    .map((article) => {
      // Links point at this site's own article pages, which now exist.
      const url = `${base}${BLOG_PATH}/${encodeURIComponent(article.slug)}`;
      const description =
        article.meta_description || article.excerpt || article.title;

      const published = article.published_at
        ? new Date(article.published_at)
        : null;

      const pubDate =
        published && !Number.isNaN(published.getTime())
          ? `\n      <pubDate>${published.toUTCString()}</pubDate>`
          : "";

      // An RSS guid must be unique and stable. The slug-based URL is both; the
      // publication date is not, because an edit can change it.
      return `    <item>
      <title>${xmlText(article.title)}</title>
      <description>${xmlText(description)}</description>
      <link>${xmlText(url)}</link>
      <guid isPermaLink="true">${xmlText(url)}</guid>${pubDate}
    </item>`;
    })
    .join("\n");

  const newest = articles[0]?.published_at;

  const lastBuildDate =
    newest && !Number.isNaN(new Date(newest).getTime())
      ? new Date(newest).toUTCString()
      : // Falls back to "now" rather than being omitted: an aggregator uses
        // this to decide whether to re-read, and a feed whose build date never
        // moves looks abandoned.
        new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlText(`${BLOG_TITLE} | ${SITE_NAME}`)}</title>
    <link>${xmlText(blogUrl)}</link>
    <description>${xmlText(BLOG_DESCRIPTION)}</description>
    <language>en-GB</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${xmlText(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // The webhook revalidates this route on publication, so a longer edge
      // cache is safe; the 15-minute floor is the fallback if it never fires.
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
