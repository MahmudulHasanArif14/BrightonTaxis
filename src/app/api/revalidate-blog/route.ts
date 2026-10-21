import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { BLOG_TAG, articleTag } from "@/lib/content-api";
import { BLOG_PATH, LOCATION_SLUG } from "@/lib/site";
import {
  IDEMPOTENCY_HEADER,
  SIGNATURE_HEADER,
  TIMESTAMP_HEADER,
  alreadyApplied,
  verifyWebhook,
} from "@/lib/webhook-signature";

export const runtime = "nodejs";
// Never cached, never prerendered: it exists to cause a side effect.
export const dynamic = "force-dynamic";

/**
 * Webhook receiver: the central content platform telling this site that one of
 * its articles has published.
 *
 * POST /api/revalidate-blog
 *
 * The request is authenticated by an HMAC-SHA256 signature over
 * "v1:<timestamp>:<raw body>", using a secret shared with the platform. There
 * is no bearer token and no query-string key: a signature over the body means
 * a captured request cannot be edited to revalidate something else, and the
 * secret itself never crosses the network.
 *
 * It does not trust the payload's contents beyond the slug. The article is
 * fetched from the public API by the page that renders it, so a forged — or
 * simply stale — notification can at worst cause an unnecessary cache purge.
 * It can never put text on this site that the API would not also serve.
 */

type Payload = {
  event?: unknown;
  location?: unknown;
  slug?: unknown;
};

function reject(code: string, message: string, status: number) {
  // Deliberately terse. A detailed explanation of *why* a signature failed is
  // a tool for someone trying to forge one.
  return NextResponse.json(
    { ok: false, code, error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: NextRequest) {
  // The exact bytes, before any parsing. Verifying a re-serialised object
  // instead would break the signature as soon as key order or number
  // formatting changed.
  let rawBody: string;

  try {
    rawBody = await req.text();
  } catch {
    return reject("unreadable_body", "Could not read the request body.", 400);
  }

  // A webhook body is a few hundred bytes. Anything large is either a mistake
  // or an attempt to make this route do expensive HMAC work.
  if (rawBody.length > 16_384) {
    return reject("body_too_large", "The request body is too large.", 413);
  }

  const verification = verifyWebhook({
    rawBody,
    secret: process.env.REVALIDATE_WEBHOOK_SECRET,
    signatureHeader: req.headers.get(SIGNATURE_HEADER),
    timestampHeader: req.headers.get(TIMESTAMP_HEADER),
  });

  if (!verification.ok) {
    // Logged in full for the operator, since this is where a secret mismatch
    // or a clock problem shows up first.
    console.warn("revalidate_rejected:", verification.reason);

    if (verification.reason === "not_configured") {
      // The receiver is misconfigured, not the sender. 503 so the platform
      // retries instead of giving up on a request it sent correctly.
      return reject(
        "not_configured",
        "This receiver has no webhook secret configured.",
        503,
      );
    }

    const status = verification.reason === "stale_timestamp" ? 408 : 401;

    return reject(verification.reason, "Request verification failed.", status);
  }

  // --- The payload is now known to come from the platform ------------------

  let payload: Payload;

  try {
    payload = JSON.parse(rawBody) as Payload;
  } catch {
    return reject("invalid_json", "The request body is not valid JSON.", 400);
  }

  const location =
    typeof payload.location === "string" ? payload.location.toLowerCase() : null;

  // Location isolation. A correctly signed notification for another town must
  // not revalidate this site: the platform serves thirteen locations from one
  // API with one secret per site, but a misrouted delivery is still possible
  // and this is where it stops.
  //
  // 200, not an error: the platform sent a valid request and should not retry
  // it. The response says it was ignored.
  if (location !== LOCATION_SLUG) {
    console.warn("revalidate_wrong_location:", location);

    return NextResponse.json(
      {
        ok: true,
        ignored: true,
        code: "wrong_location",
        message: `This site serves '${LOCATION_SLUG}' only.`,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const event = typeof payload.event === "string" ? payload.event : "published";

  if (event !== "published" && event !== "updated") {
    return NextResponse.json(
      { ok: true, ignored: true, code: "unknown_event", event },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const slug =
    typeof payload.slug === "string" ? payload.slug.trim().toLowerCase() : "";

  // The slug reaches revalidateTag and a path, so it is validated to the same
  // shape the central API enforces rather than being passed through.
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) {
    return reject("invalid_slug", "The payload slug is not a valid slug.", 400);
  }

  // Cheap duplicate suppression. Not the replay defence — see the comment on
  // alreadyApplied for what actually guarantees what.
  const idempotencyKey =
    req.headers.get(IDEMPOTENCY_HEADER)?.trim() || `${event}:${slug}`;

  if (alreadyApplied(idempotencyKey)) {
    return NextResponse.json(
      {
        ok: true,
        duplicate: true,
        slug,
        message: "This notification was already applied.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  // --- Revalidate ----------------------------------------------------------

  const revalidated: string[] = [];

  // Tag first. BLOG_TAG is attached to every listing fetch, so this one call
  // covers the blog index, the RSS feed and the sitemap at once — they all
  // read the same upstream request.
  //
  // The second argument is Next 16's required cacheLife profile, and it sets
  // how long stale content may still be served while the fresh copy is
  // generated in the background. "max" is the documented recommendation for
  // stale-while-revalidate content, and it is right for a blog: a visitor who
  // arrives in the same second as the webhook gets the previous page
  // instantly rather than waiting on a round trip to the central API, and the
  // new article is in place a moment later.
  revalidateTag(BLOG_TAG, "max");
  revalidated.push(BLOG_TAG);

  // The article's own fetch, so the detail page shows the new text rather than
  // an hour-old cached copy.
  revalidateTag(articleTag(slug), "max");
  revalidated.push(articleTag(slug));

  // Paths as well as tags. A tag clears the cached *data*; the rendered HTML
  // for a route is a separate cache entry, and without these the listing page
  // could still be served from the full-route cache with the old articles in
  // it.
  for (const path of [
    BLOG_PATH,
    `${BLOG_PATH}/${slug}`,
    "/feed.xml",
    "/sitemap.xml",
  ]) {
    revalidatePath(path);
    revalidated.push(path);
  }

  console.info("revalidated:", slug, revalidated.join(", "));

  return NextResponse.json(
    {
      ok: true,
      slug,
      event,
      location,
      revalidated,
      at: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * Anything other than POST is refused outright.
 *
 * A GET that revalidated would be a cache-purge endpoint anyone could hit from
 * a browser address bar, and no signature can be carried on a link.
 */
export function GET() {
  return NextResponse.json(
    {
      ok: false,
      code: "method_not_allowed",
      error: "Send a signed POST to this endpoint.",
    },
    { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } },
  );
}
