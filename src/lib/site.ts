// One place that knows what this website is and where it lives.
//
// Everything that builds a URL — canonical tags, the sitemap, the RSS feed,
// JSON-LD — reads from here. Before this file the origin was written out by
// hand in layout.tsx and again in the RSS route, and the two had already
// drifted apart.

/**
 * This site's own public origin, with no trailing slash.
 *
 * The default is the domain already declared in the site's metadata. Override
 * it per environment with NEXT_PUBLIC_SITE_URL; it is deliberately public,
 * because the browser needs the canonical origin too, and it is not a secret.
 */
export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  return (configured || "https://www.westerncarsbrighton.co.uk").replace(
    /\/+$/,
    "",
  );
}

/**
 * The location slug this website publishes.
 *
 * This is the single most important constant in the integration. The central
 * platform serves thirteen locations from one API, and this value is what
 * keeps another town's articles off this domain. It is checked twice: when
 * fetching from the API, and again on every article returned, because a
 * server-side filter is only as trustworthy as the request that reached it.
 */
export const LOCATION_SLUG = (
  process.env.NEXT_PUBLIC_CONTENT_LOCATION?.trim() || "brighton"
).toLowerCase();

/** Where the central content platform lives. */
export function contentApiOrigin() {
  const configured = process.env.CONTENT_API_ORIGIN?.trim();

  return (configured || "https://content.westerncars.com").replace(/\/+$/, "");
}

/** Path of the blog section on this site. */
export const BLOG_PATH = "/blog";

/** The absolute URL of one article on *this* domain. */
export function articleUrl(slug: string) {
  return `${siteUrl()}${BLOG_PATH}/${encodeURIComponent(slug)}`;
}

export const SITE_NAME = "Western Cars Brighton";

export const BLOG_TITLE = "Brighton Taxi & Travel Advice";

export const BLOG_DESCRIPTION =
  "Taxi advice, airport transfer guides and local travel information from Western Cars Brighton.";
