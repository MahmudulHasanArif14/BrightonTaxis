# Change record: central blog integration

Context for [#1](https://github.com/MahmudulHasanArif14/BrightonTaxis/pull/1)
(`feat/central-blog-integration`, merged 2026-10-21), written at the time the
work was done. The PR was merged with an auto-generated description, so this is
where the reasoning lives — particularly the honest limits of the webhook
receiver and the two things still undecided at merge.

Environment variables are documented in [`.env.example`](../.env.example).

---

This change replaced the hardcoded article list in the RSS feed with the real blog, served from the central content platform.

## Why this was larger than "fix the feed"

The feed was emitting `/blog/<slug>/` links **and this site had no blog pages at all**, so every link in it 404'd. Fixing the feed in isolation would have produced a valid feed pointing at nothing, so this change builds the blog section the feed was already advertising.

## What this adds

- **`/blog`** and **`/blog/[slug]`** — listing and article pages, fetching from the central API.
- **`/api/revalidate-blog`** — a signature-protected receiver, so a publish on the platform appears here within seconds instead of waiting out a cache TTL.
- **`sitemap.ts`** and **`robots.ts`** — the sitemap degrades to static entries rather than failing a deployment.
- **`feed.xml`** — rewritten to use the live API. Stable slug-based GUIDs, `atom:link rel="self"`, and XML-1.0-illegal control characters stripped.
- Header and footer links to the blog, root-relative so they work from article pages.

## Security of the receiver

Authenticated by HMAC-SHA256 over `v1:<timestamp>:<raw body>`, using a secret shared with the platform. No bearer token and no query-string key: a signature over the body means a captured request cannot be edited to revalidate something else, and the secret never crosses the network. The raw bytes are read before parsing — verifying a re-serialised object would break as soon as key order changed.

It does not trust the payload beyond the slug, which is validated to the same shape the central API enforces. The article is fetched from the public API by the page that renders it, so **a forged notification can at worst cause an unnecessary cache purge. It can never put text on this site that the API would not also serve.**

Status codes are chosen for sender behaviour: `503` when no secret is configured and `408` on a stale timestamp (both retryable — the sender's request was fine), `401` otherwise, and `200 ignored` for another location's article so the sender does not retry something it should stop sending.

**Being honest about replay protection:** this site has no database, so the in-memory idempotency cache is a cheap duplicate suppressor, not a durable defence — it does not survive across serverless instances. What actually protects this endpoint is the signed timestamp window, the sender's unique index, and the fact that revalidation is idempotent. The code says so at the point where it matters.

## Location isolation

Enforced three times: in the request to the central API, on the receiver, and again on every article rendered. A correctly signed notification for another town cannot revalidate this site, and another location's slug returns a 404 here.

## SEO

Canonical URLs point at **this** domain, so the two copies of an article do not compete. `BlogPosting` and `BreadcrumbList` JSON-LD on articles, `Blog` on the listing, `robots: { index: false }` on not-found. Headings are parsed into real `h2`/`h3` **text nodes** — no HTML injection path from article content. Source links carry `rel="noopener noreferrer nofollow"`.

The existing design is matched rather than reinterpreted: same accent, container width, radii, shadows and display font as the rest of the site.

> On discovery: the sitemap, internal links and a valid feed make these pages discoverable. None of them, and no amount of revalidation, guarantees that Google indexes a page or how it ranks.

## Tests

39 tests pass, type-check is clean. Coverage includes signature failures, replay, idempotency, pagination across a page boundary, location isolation, API failures and slug validation. Verified live against a stub API: pagination across a page size of 2, zero cross-location leakage, 404 for another location's slug, and well-formed feed and sitemap XML with unique GUIDs.

## Configuration this site needs

| Variable | Scope | Value |
| --- | --- | --- |
| `REVALIDATE_WEBHOOK_SECRET` | **server-only** | must match the platform's `DELIVERY_WEBHOOK_SECRET_BRIGHTON` byte for byte |
| `CONTENT_API_ORIGIN` | server-only | the platform origin |
| `NEXT_PUBLIC_SITE_URL` | public | this site's confirmed public origin, no trailing slash |
| `NEXT_PUBLIC_CONTENT_LOCATION` | public | `brighton` |

`REVALIDATE_WEBHOOK_SECRET` must never take a `NEXT_PUBLIC_` prefix — that would publish it to every browser.

## Two things still to decide, and one pre-existing risk

**The domain was unconfirmed at merge, and has since been settled.** It is `brightontaxis.westerncars.com`, confirmed 2026-10-21 and now the committed default in `siteUrl()`, still overridable by `NEXT_PUBLIC_SITE_URL` for previews. Until that change landed, every canonical tag, sitemap entry and feed GUID named the wrong origin.

Note this is *this application's* origin and not the company's main domain: `westerncarsbrighton.co.uk` still owns the business email and the `LocalBusiness` `@id` in `components/Seo.tsx`, which renders on blog pages too — so an article now asserts one origin in its canonical and another in its business identity. That needs a decision about which domain is the canonical identity, not a find-replace, and is untouched here.

**Lint:** `lint` was previously `eslint` with no path, so it checked nothing. It is now `eslint .`, which surfaced 10 pre-existing errors. I fixed the 5 my own changes caused; **5 remain** (`no-explicit-any` in `SmoothScroll.tsx` ×4 and `locomotive-scroll.d.ts` ×1), plus 6 `<img>` warnings. Left alone as outside the scope of that work.

**Pre-existing structured-data risk:** `components/Seo.tsx` emits `AggregateRating` and `FAQPage` JSON-LD site-wide, which now includes article pages. Ratings markup on a blog post that has no reviews is a manual-action risk. Not introduced here and not changed here, but this change increases its surface. I'd restrict it to the homepage.
