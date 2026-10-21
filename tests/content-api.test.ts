import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import { getArticle, listArticles } from "../src/lib/content-api";

// The client is exercised against a stubbed global fetch. That is the right
// seam: what matters is how it behaves when the central platform paginates,
// returns another location's article, times out or half-fails — none of which
// a live API would reproduce on demand.

const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
});

function article(slug: string, location = "brighton") {
  return {
    id: `id-${slug}`,
    title: `Title for ${slug}`,
    slug,
    excerpt: "An excerpt.",
    meta_description: "A meta description.",
    canonical_url: `https://content.westerncars.com/posts/${slug}`,
    content_url: `https://content.westerncars.com/api/posts/${slug}`,
    published_at: "2026-10-20T09:00:00.000Z",
    updated_at: "2026-10-20T09:00:00.000Z",
    location: { slug: location, name: location },
    author: "Western Cars",
    category: "Guides",
    tags: [],
    reading_minutes: 5,
    sources: [],
    image_url: null,
    image_alt: null,
    image_credit: null,
    image_source_url: null,
    image_license: null,
    image_license_url: null,
    content: "A paragraph.\n\nAnother paragraph.",
  };
}

/** Stub fetch with a per-URL handler, recording every URL requested. */
function stubFetch(handler: (url: string) => Response | Promise<Response>) {
  const urls: string[] = [];

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    urls.push(url);
    return handler(url);
  }) as typeof fetch;

  return urls;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("listing articles", () => {
  test("requests this location only", async () => {
    const urls = stubFetch(() =>
      json({ data: [article("one")], hasNextPage: false, totalPages: 1 }),
    );

    await listArticles();

    assert.equal(urls.length, 1);
    assert.match(urls[0], /location=brighton/);
  });

  test("follows pagination to collect every article", async () => {
    // The API's default page size is 10 and the blog index, the sitemap and
    // the feed all need the complete set, so taking only the first page would
    // silently hide older articles.
    const urls = stubFetch((url) => {
      const page = Number(/page=(\d+)/.exec(url)?.[1] ?? "1");

      if (page === 1) {
        return json({
          data: [article("one"), article("two")],
          hasNextPage: true,
          totalPages: 3,
        });
      }

      if (page === 2) {
        return json({
          data: [article("three")],
          hasNextPage: true,
          totalPages: 3,
        });
      }

      return json({ data: [article("four")], hasNextPage: false, totalPages: 3 });
    });

    const { articles, truncated } = await listArticles();

    assert.equal(urls.length, 3);
    assert.deepEqual(
      articles.map((row) => row.slug),
      ["one", "two", "three", "four"],
    );
    assert.equal(truncated, false);
  });

  test("an article repeated across page boundaries appears once", async () => {
    // A publish landing between two page requests can shift a row across the
    // boundary and repeat it. Without deduping that becomes a duplicate card
    // and a duplicate sitemap entry.
    stubFetch((url) => {
      const page = Number(/page=(\d+)/.exec(url)?.[1] ?? "1");

      return page === 1
        ? json({ data: [article("one"), article("two")], hasNextPage: true })
        : json({ data: [article("two"), article("three")], hasNextPage: false });
    });

    const { articles } = await listArticles();

    assert.deepEqual(
      articles.map((row) => row.slug),
      ["one", "two", "three"],
    );
  });

  test("another location's article is dropped even if the API returns it", async () => {
    // Defence in depth. The request asks for brighton; this is what happens if
    // the server-side filter ever fails or a cache serves the wrong response.
    stubFetch(() =>
      json({
        data: [article("brighton-one"), article("crawley-one", "crawley")],
        hasNextPage: false,
      }),
    );

    const { articles } = await listArticles();

    assert.deepEqual(
      articles.map((row) => row.slug),
      ["brighton-one"],
    );
  });

  test("an article with no location is dropped, not assumed local", async () => {
    stubFetch(() =>
      json({
        data: [{ ...article("no-location"), location: null }],
        hasNextPage: false,
      }),
    );

    const { articles } = await listArticles();

    assert.equal(articles.length, 0);
  });

  test("a malformed row is skipped rather than crashing the page", async () => {
    stubFetch(() =>
      json({
        data: [article("good"), { title: "no slug" }, null, "a string", 42],
        hasNextPage: false,
      }),
    );

    const { articles } = await listArticles();

    assert.deepEqual(
      articles.map((row) => row.slug),
      ["good"],
    );
  });

  test("a total API failure yields an empty list, not an exception", async () => {
    stubFetch(() => json({ error: "server_error" }, 500));

    const { articles } = await listArticles();

    assert.deepEqual(articles, []);
  });

  test("a network error yields an empty list, not an exception", async () => {
    globalThis.fetch = (async () => {
      throw new TypeError("fetch failed");
    }) as typeof fetch;

    const { articles } = await listArticles();

    assert.deepEqual(articles, []);
  });

  test("a failure partway through pagination keeps what it already has", async () => {
    // Better a short list than an empty one: the first page of articles is
    // still worth showing, and `truncated` lets the page say so.
    stubFetch((url) => {
      const page = Number(/page=(\d+)/.exec(url)?.[1] ?? "1");

      return page === 1
        ? json({ data: [article("one")], hasNextPage: true })
        : json({ error: "server_error" }, 503);
    });

    const { articles, truncated } = await listArticles();

    assert.deepEqual(
      articles.map((row) => row.slug),
      ["one"],
    );
    assert.equal(truncated, true, "a partial list must be reported as partial");
  });

  test("an empty page ends pagination even if hasNextPage is missing", async () => {
    // Guards against looping to the page cap on a response that omits the
    // pagination metadata.
    const urls = stubFetch((url) => {
      const page = Number(/page=(\d+)/.exec(url)?.[1] ?? "1");

      return page === 1
        ? json({ data: [article("one")], hasNextPage: true })
        : json({ data: [], hasNextPage: true });
    });

    const { articles } = await listArticles();

    assert.equal(urls.length, 2);
    assert.equal(articles.length, 1);
  });

  test("a limit stops pagination early", async () => {
    const urls = stubFetch(() =>
      json({ data: [article("one"), article("two")], hasNextPage: true }),
    );

    const { articles } = await listArticles({ limit: 2 });

    assert.equal(urls.length, 1);
    assert.equal(articles.length, 2);
  });
});

describe("fetching one article", () => {
  test("returns the article for this location", async () => {
    stubFetch(() => json({ data: article("brighton-to-gatwick-taxi-cost") }));

    const found = await getArticle("brighton-to-gatwick-taxi-cost");

    assert.equal(found?.slug, "brighton-to-gatwick-taxi-cost");
    assert.ok(found?.content);
  });

  test("returns null for an unpublished or unknown article", async () => {
    // The platform makes a draft, a held article and a slug that never existed
    // indistinguishable from outside, all 404. All three must 404 here too.
    stubFetch(() => json({ error: "post_not_found" }, 404));

    assert.equal(await getArticle("never-existed"), null);
  });

  test("returns null for another location's article", async () => {
    // Reached by guessing a Crawley slug on the Brighton domain. Serving it
    // would put the same text on two domains competing in search.
    stubFetch(() => json({ data: article("crawley-article", "crawley") }));

    assert.equal(await getArticle("crawley-article"), null);
  });

  test("rejects a malformed slug without calling the API", async () => {
    const urls = stubFetch(() => json({ data: article("x") }));

    for (const bad of ["", "../secrets", "a b", "a/b", "A".repeat(200)]) {
      assert.equal(await getArticle(bad), null, `${bad} should be rejected`);
    }

    assert.equal(urls.length, 0, "no request should be made for a bad slug");
  });

  test("an API failure is a null, not an exception", async () => {
    stubFetch(() => json({ error: "server_error" }, 500));

    assert.equal(await getArticle("a-real-slug"), null);
  });

  test("malformed JSON is a null, not an exception", async () => {
    globalThis.fetch = (async () =>
      new Response("<html>gateway timeout</html>", {
        status: 200,
        headers: { "Content-Type": "text/html" },
      })) as typeof fetch;

    assert.equal(await getArticle("a-real-slug"), null);
  });
});
