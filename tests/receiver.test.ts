import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  DEFAULT_TOLERANCE_SECONDS,
  alreadyApplied,
  resetAppliedCache,
  sign,
  signatureHeaderValue,
  verifyWebhook,
} from "../src/lib/webhook-signature";

const SECRET = "test-secret-0123456789abcdef0123456789abcdef";
const BODY = JSON.stringify({
  event: "published",
  location: "brighton",
  slug: "brighton-to-gatwick-taxi-cost",
});

// ---------------------------------------------------------------------------
// Signature verification
// ---------------------------------------------------------------------------

describe("receiver signature verification", () => {
  const now = 1_793_000_000;

  test("accepts a request signed with the shared secret", () => {
    assert.deepEqual(
      verifyWebhook({
        rawBody: BODY,
        secret: SECRET,
        signatureHeader: signatureHeaderValue(BODY, SECRET, now),
        timestampHeader: String(now),
        now,
      }),
      { ok: true, timestamp: now },
    );
  });

  test("rejects a request signed with the wrong secret", () => {
    // This is what a secret rotated on one side only looks like.
    assert.deepEqual(
      verifyWebhook({
        rawBody: BODY,
        secret: SECRET,
        signatureHeader: signatureHeaderValue(BODY, "not-the-secret", now),
        timestampHeader: String(now),
        now,
      }),
      { ok: false, reason: "invalid_signature" },
    );
  });

  test("rejects a body edited after signing", () => {
    // The attack this is really defending against: take a legitimate
    // notification and change which article it revalidates.
    const signature = signatureHeaderValue(BODY, SECRET, now);

    const tampered = JSON.stringify({
      event: "published",
      location: "brighton",
      slug: "some-other-article",
    });

    assert.deepEqual(
      verifyWebhook({
        rawBody: tampered,
        secret: SECRET,
        signatureHeader: signature,
        timestampHeader: String(now),
        now,
      }),
      { ok: false, reason: "invalid_signature" },
    );
  });

  test("rejects a re-serialised body even when semantically identical", () => {
    // Why the route must verify req.text() and parse afterwards. Same data,
    // different key order, different bytes, different HMAC.
    const reordered = JSON.stringify({
      slug: "brighton-to-gatwick-taxi-cost",
      location: "brighton",
      event: "published",
    });

    assert.notEqual(reordered, BODY);

    assert.deepEqual(
      verifyWebhook({
        rawBody: reordered,
        secret: SECRET,
        signatureHeader: signatureHeaderValue(BODY, SECRET, now),
        timestampHeader: String(now),
        now,
      }),
      { ok: false, reason: "invalid_signature" },
    );
  });

  test("fails closed when the receiver has no secret configured", () => {
    // A deployment that forgot the env var must reject everything, not accept
    // everything. This is the single most important assertion in the file.
    assert.deepEqual(
      verifyWebhook({
        rawBody: BODY,
        secret: undefined,
        signatureHeader: signatureHeaderValue(BODY, SECRET, now),
        timestampHeader: String(now),
        now,
      }),
      { ok: false, reason: "not_configured" },
    );

    assert.deepEqual(
      verifyWebhook({
        rawBody: BODY,
        secret: "",
        signatureHeader: signatureHeaderValue(BODY, SECRET, now),
        timestampHeader: String(now),
        now,
      }),
      { ok: false, reason: "not_configured" },
    );
  });

  test("rejects an unsigned request", () => {
    assert.deepEqual(
      verifyWebhook({
        rawBody: BODY,
        secret: SECRET,
        signatureHeader: null,
        timestampHeader: String(now),
        now,
      }),
      { ok: false, reason: "missing_signature" },
    );
  });

  test("rejects an unknown signature version", () => {
    // Forward compatibility: a v2 signature over a different layout must never
    // be mistaken for a valid v1 signature over this one.
    assert.deepEqual(
      verifyWebhook({
        rawBody: BODY,
        secret: SECRET,
        signatureHeader: `v2=${sign(BODY, SECRET, now)}`,
        timestampHeader: String(now),
        now,
      }),
      { ok: false, reason: "unsupported_signature_version" },
    );
  });

  test("rejects a signature that is not 64 hex characters", () => {
    for (const value of ["v1=", "v1=abc", `v1=${"z".repeat(64)}`]) {
      const result = verifyWebhook({
        rawBody: BODY,
        secret: SECRET,
        signatureHeader: value,
        timestampHeader: String(now),
        now,
      });

      assert.equal(result.ok, false, `${value} should be rejected`);
    }
  });

  test("the signature is case-insensitive in its hex", () => {
    const upper = sign(BODY, SECRET, now).toUpperCase();

    assert.equal(
      verifyWebhook({
        rawBody: BODY,
        secret: SECRET,
        signatureHeader: `v1=${upper}`,
        timestampHeader: String(now),
        now,
      }).ok,
      true,
    );
  });
});

// ---------------------------------------------------------------------------
// Replay protection
// ---------------------------------------------------------------------------

describe("receiver replay protection", () => {
  const now = 1_793_000_000;

  test("rejects a captured request replayed after the window", () => {
    const captured = now - DEFAULT_TOLERANCE_SECONDS - 1;

    assert.deepEqual(
      verifyWebhook({
        rawBody: BODY,
        secret: SECRET,
        // Perfectly valid for its own timestamp. Only its age is wrong, which
        // is precisely the replay case.
        signatureHeader: signatureHeaderValue(BODY, SECRET, captured),
        timestampHeader: String(captured),
        now,
      }),
      { ok: false, reason: "stale_timestamp" },
    );
  });

  test("rejects a request dated in the future", () => {
    const ahead = now + DEFAULT_TOLERANCE_SECONDS + 1;

    assert.deepEqual(
      verifyWebhook({
        rawBody: BODY,
        secret: SECRET,
        signatureHeader: signatureHeaderValue(BODY, SECRET, ahead),
        timestampHeader: String(ahead),
        now,
      }),
      { ok: false, reason: "stale_timestamp" },
    );
  });

  test("accepts ordinary clock drift inside the window", () => {
    for (const offset of [-60, -1, 0, 1, 60, DEFAULT_TOLERANCE_SECONDS]) {
      const stamp = now + offset;

      assert.equal(
        verifyWebhook({
          rawBody: BODY,
          secret: SECRET,
          signatureHeader: signatureHeaderValue(BODY, SECRET, stamp),
          timestampHeader: String(stamp),
          now,
        }).ok,
        true,
        `offset ${offset} should be accepted`,
      );
    }
  });

  test("refuses to coerce a non-integer timestamp", () => {
    // Number("") is 0 and Number("1e9") is a billion; either would be a
    // timestamp the attacker did not have to guess.
    for (const value of [" ", "abc", "1e9", "-1", "1.5", "0x10"]) {
      const result = verifyWebhook({
        rawBody: BODY,
        secret: SECRET,
        signatureHeader: signatureHeaderValue(BODY, SECRET, now),
        timestampHeader: value,
        now,
      });

      assert.equal(result.ok, false, `${JSON.stringify(value)} should fail`);
      assert.equal(
        (result as { reason: string }).reason,
        "malformed_timestamp",
      );
    }
  });
});

// ---------------------------------------------------------------------------
// Idempotency
// ---------------------------------------------------------------------------

describe("duplicate suppression", () => {
  test("the same key twice is recognised as a duplicate", () => {
    resetAppliedCache();

    assert.equal(alreadyApplied("key-1"), false, "first delivery is new");
    assert.equal(alreadyApplied("key-1"), true, "second is a duplicate");
  });

  test("different keys do not suppress each other", () => {
    resetAppliedCache();

    assert.equal(alreadyApplied("key-a"), false);
    assert.equal(alreadyApplied("key-b"), false);
  });

  test("a key becomes applicable again once it has expired", () => {
    // Entries are only held for the signature window, because nothing outside
    // that window can be accepted anyway.
    resetAppliedCache();

    const start = 1_700_000_000_000;

    assert.equal(alreadyApplied("key-1", start), false);
    assert.equal(alreadyApplied("key-1", start + 1_000), true);
    assert.equal(
      alreadyApplied("key-1", start + DEFAULT_TOLERANCE_SECONDS * 1000 + 1),
      false,
    );
  });

  test("the cache stays bounded on a long-lived instance", () => {
    resetAppliedCache();

    const start = 1_700_000_000_000;

    // 1200 distinct keys through a cache that keeps 500. The assertion that
    // matters is that it does not grow without limit and does not throw;
    // evicting an entry only costs a duplicate cache purge.
    for (let index = 0; index < 1200; index += 1) {
      assert.equal(alreadyApplied(`key-${index}`, start), false);
    }

    // The most recent key is still remembered.
    assert.equal(alreadyApplied("key-1199", start), true);
  });
});

// ---------------------------------------------------------------------------
// The payload checks the route applies after verification
// ---------------------------------------------------------------------------
//
// These mirror the route's own validation. They are asserted here rather than
// by booting Next, because the interesting logic is the predicate, not the
// framework: a slug reaches revalidateTag and a URL path, and a location
// decides whether anything is revalidated at all.

const LOCATION_SLUG = "brighton";

function locationAccepted(value: unknown) {
  return (
    (typeof value === "string" ? value.toLowerCase() : null) === LOCATION_SLUG
  );
}

function slugAccepted(value: unknown) {
  const slug = typeof value === "string" ? value.trim().toLowerCase() : "";

  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 120;
}

describe("location isolation", () => {
  test("this site accepts only its own location", () => {
    assert.equal(locationAccepted("brighton"), true);
    assert.equal(locationAccepted("Brighton"), true, "case is normalised");
  });

  test("another location's notification is not accepted", () => {
    // The central platform serves thirteen locations from one API. A correctly
    // signed notification for Crawley must not revalidate Brighton.
    for (const other of [
      "crawley",
      "london",
      "haywards-heath",
      "gatwick",
      "",
      null,
      undefined,
      123,
      { slug: "brighton" },
      ["brighton"],
    ]) {
      assert.equal(
        locationAccepted(other),
        false,
        `${JSON.stringify(other)} must be rejected`,
      );
    }
  });
});

describe("slug validation", () => {
  test("accepts a well-formed slug", () => {
    assert.equal(slugAccepted("brighton-to-gatwick-taxi-cost"), true);
    assert.equal(slugAccepted("amex-stadium-taxi-guide"), true);
    assert.equal(slugAccepted("a1"), true);
  });

  test("normalises case and surrounding whitespace before validating", () => {
    // The central API lowercases a slug before looking it up, so the receiver
    // does the same. A slug that differs only in case is the same article, not
    // a malformed request.
    assert.equal(slugAccepted("Brighton-To-Gatwick"), true);
    assert.equal(slugAccepted("  brighton-to-gatwick  "), true);
  });

  test("rejects anything that could escape the path or the tag", () => {
    for (const bad of [
      "",
      "../../etc/passwd",
      "a/b",
      "a b",
      "trailing-",
      "-leading",
      "double--hyphen",
      "a.b",
      "a%2fb",
      "<script>",
      "a".repeat(121),
      null,
      42,
    ]) {
      assert.equal(
        slugAccepted(bad),
        false,
        `${JSON.stringify(bad)} must be rejected`,
      );
    }
  });
});
