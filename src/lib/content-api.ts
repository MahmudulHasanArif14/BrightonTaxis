import { LOCATION_SLUG, contentApiOrigin } from "./site";

// The client for the central content platform.
//
// The platform is the source of truth and serves only published articles, so
// this file never asks about status: everything it can see is already
// published. What it does enforce is that only *this* location's articles are
// ever rendered on this domain.

/**
 * Cache tags the webhook receiver revalidates.
 *
 * BLOG_TAG covers anything that lists articles — the blog index, the RSS feed,
 * the sitemap. articleTag() covers one article page, so publishing an article
 * does not throw away every other article's cached HTML.
 */
export const BLOG_TAG = "blog";

export function articleTag(slug: string) {
  return `blog-article-${slug}`;
}

/**
 * How long a listing may be served from cache without anyone asking the API.
 *
 * This is a backstop, not the main path: the webhook revalidates within
 * seconds of publication. Fifteen minutes means that even with the webhook,
 * the scheduler and the reconciler all broken at once, the site still picks up
 * new articles on its own.
 */
const LISTING_REVALIDATE_SECONDS = 900;

/** Article pages change less often than the listing. */
const ARTICLE_REVALIDATE_SECONDS = 3600;

/**
 * How long to wait on the central API.
 *
 * A page that waits indefinitely on another service is a page that goes down
 * with it. Six seconds, then the listing renders empty and the article page
 * 404s rather than hanging a visitor's browser.
 */
const API_TIMEOUT_MS = 6_000;

/** The page size the API accepts. Its own maximum is 50. */
const PAGE_SIZE = 24;

/**
 * Safety rail on pagination. At one article per day platform-wide across
 * thirteen locations, 40 pages of 24 is well over a century of content; it
 * exists so a malformed `totalPages` from the API cannot spin forever.
 */
const MAX_PAGES = 40;

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  meta_description: string;
  canonical_url: string;
  content_url: string;
  published_at: string | null;
  updated_at: string | null;
  location: { slug: string; name: string } | null;
  author: string | null;
  category: string | null;
  tags: string[];
  reading_minutes: number | null;
  sources: string[];
  image_url: string | null;
  image_alt: string | null;
  image_credit: string | null;
  image_source_url: string | null;
  image_license: string | null;
  image_license_url: string | null;
  content?: string | null;
};

type ListResponse = {
  data?: unknown;
  totalPages?: unknown;
  hasNextPage?: unknown;
  total?: unknown;
};

function isArticle(value: unknown): value is Article {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const row = value as Record<string, unknown>;

  return (
    typeof row.slug === "string" &&
    row.slug.length > 0 &&
    typeof row.title === "string" &&
    row.title.length > 0
  );
}

/**
 * The location gate.
 *
 * The API is asked for one location, but every article is re-checked here.
 * An article with no location object is rejected rather than allowed through:
 * the whole point is that an article only appears on this domain when
 * something positively confirms it belongs to this location.
 */
function belongsHere(article: Article) {
  return article.location?.slug === LOCATION_SLUG;
}

async function getJson(
  url: string,
  options: { tags: string[]; revalidate: number },
): Promise<unknown | null> {
  // AbortSignal.timeout rather than a manual controller: it is exactly this,
  // and it does not leak a timer if the request settles first.
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      headers: { Accept: "application/json" },
      next: { revalidate: options.revalidate, tags: options.tags },
    });

    if (response.status === 404) {
      // A real answer, not a failure: there is no such article.
      return null;
    }

    if (!response.ok) {
      console.error("content_api_error:", url, response.status);
      return null;
    }

    return (await response.json()) as unknown;
  } catch (error) {
    // Timeout, DNS failure, malformed JSON. The caller degrades; it must not
    // propagate a 500 to a visitor because the content platform is having a
    // bad minute.
    console.error(
      "content_api_unreachable:",
      url,
      error instanceof Error ? error.message : "unknown error",
    );

    return null;
  }
}

/**
 * Every published article for this location, newest first.
 *
 * Pages through the API rather than taking the first page: the blog index, the
 * sitemap and the RSS feed all need the complete set, and the API's default
 * page size is 10. Pagination stops on the first failed request and returns
 * what it already has, so a mid-pagination outage yields a short list rather
 * than an empty one or a half-built page with a gap in the middle.
 */
export async function listArticles(options: { limit?: number } = {}) {
  const origin = contentApiOrigin();
  const collected: Article[] = [];
  const seen = new Set<string>();

  let page = 1;
  let truncated = false;

  while (page <= MAX_PAGES) {
    const url = `${origin}/api/posts?location=${encodeURIComponent(
      LOCATION_SLUG,
    )}&page=${page}&limit=${PAGE_SIZE}`;

    const body = (await getJson(url, {
      tags: [BLOG_TAG],
      revalidate: LISTING_REVALIDATE_SECONDS,
    })) as ListResponse | null;

    if (!body) {
      // Do not pretend the list is complete when a page failed.
      truncated = page > 1;
      break;
    }

    const rows = Array.isArray(body.data) ? body.data : [];
    const articles = rows.filter(isArticle).filter(belongsHere);

    for (const article of articles) {
      // The API's sort is stable, but a concurrent publish between two page
      // requests can still shift a row across a page boundary and repeat it.
      // Deduping by slug is what stops that becoming a duplicate card and a
      // duplicate sitemap entry.
      if (!seen.has(article.slug)) {
        seen.add(article.slug);
        collected.push(article);
      }
    }

    if (options.limit && collected.length >= options.limit) {
      break;
    }

    const hasNext =
      body.hasNextPage === true ||
      (typeof body.totalPages === "number" && page < body.totalPages);

    // An empty page also ends pagination, so a missing hasNextPage cannot
    // loop to MAX_PAGES.
    if (!hasNext || rows.length === 0) {
      break;
    }

    page += 1;
  }

  const articles = options.limit ? collected.slice(0, options.limit) : collected;

  return { articles, truncated };
}

/**
 * One article, with its body.
 *
 * Returns null for an article that does not exist, is not published, or
 * belongs to another location — the page turns all three into a 404, which is
 * correct: none of them is an article this site has.
 */
export async function getArticle(slug: string): Promise<Article | null> {
  const candidate = slug.trim().toLowerCase();

  // Validate before calling out. The API applies the same rule, but there is
  // no reason to spend a network request discovering that.
  if (
    candidate.length === 0 ||
    candidate.length > 120 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate)
  ) {
    return null;
  }

  const body = (await getJson(
    `${contentApiOrigin()}/api/posts/${encodeURIComponent(candidate)}`,
    {
      // Tagged both ways: a publish revalidates one article precisely, and a
      // bulk recovery can clear the whole section at once.
      tags: [BLOG_TAG, articleTag(candidate)],
      revalidate: ARTICLE_REVALIDATE_SECONDS,
    },
  )) as { data?: unknown } | null;

  if (!body || !isArticle(body.data)) {
    return null;
  }

  const article = body.data;

  if (!belongsHere(article)) {
    // Another location's article, reached by guessing its slug on this domain.
    // Serving it would put the same text on two domains and make them compete
    // with each other in search.
    return null;
  }

  return article;
}

/** Human-readable British date, stable between server and client. */
export function formatDate(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  // An explicit timezone, so the server and the browser cannot disagree about
  // which day an article was published and trip a hydration mismatch.
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(date);
}
