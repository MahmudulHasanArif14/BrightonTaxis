import { createHmac, timingSafeEqual } from "node:crypto";

// The receiving half of the wire contract with the central content platform.
//
// This is deliberately a copy of the platform's own constants rather than a
// shared package: the two repositories deploy independently, and a shared
// dependency would mean a version of this website could not be deployed
// without also deploying the platform. The cost is that a change to the scheme
// has to be made in both places — which is why the version prefix exists, so
// that change can be rolled out one side at a time.
//
// Platform side: src/lib/webhook-signature.ts in the content platform repo.

export const SIGNATURE_HEADER = "x-westerncars-signature";
export const TIMESTAMP_HEADER = "x-westerncars-timestamp";
export const DELIVERY_HEADER = "x-westerncars-delivery-id";
export const IDEMPOTENCY_HEADER = "x-westerncars-idempotency-key";

export const SIGNATURE_VERSION = "v1";

/**
 * How far the sender's clock may be from this one. Five minutes: shorter and
 * ordinary drift between two hosts starts rejecting good requests, longer and
 * a captured request stays replayable for longer.
 */
export const DEFAULT_TOLERANCE_SECONDS = 300;

function signingString(timestamp: number, rawBody: string) {
  return `${SIGNATURE_VERSION}:${timestamp}:${rawBody}`;
}

export function sign(rawBody: string, secret: string, timestamp: number) {
  return createHmac("sha256", secret)
    .update(signingString(timestamp, rawBody))
    .digest("hex");
}

export function signatureHeaderValue(
  rawBody: string,
  secret: string,
  timestamp: number,
) {
  return `${SIGNATURE_VERSION}=${sign(rawBody, secret, timestamp)}`;
}

function constantTimeEquals(a: string, b: string) {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");

  // timingSafeEqual throws on a length mismatch, which would itself leak the
  // length. The self-comparison keeps the work constant.
  if (left.length !== right.length) {
    timingSafeEqual(left, left);
    return false;
  }

  return timingSafeEqual(left, right);
}

export type VerifyFailure =
  | "missing_signature"
  | "missing_timestamp"
  | "malformed_timestamp"
  | "stale_timestamp"
  | "unsupported_signature_version"
  | "malformed_signature"
  | "invalid_signature"
  | "not_configured";

export type VerifyResult =
  | { ok: true; timestamp: number }
  | { ok: false; reason: VerifyFailure };

/**
 * Verify an incoming webhook.
 *
 * `rawBody` must be the exact bytes as received, which is why the route reads
 * `await req.text()` and parses afterwards. Verifying a re-serialised object
 * is the classic way to break this: JSON.parse followed by JSON.stringify can
 * reorder keys and change number formatting, and any of that changes the HMAC.
 */
export function verifyWebhook(options: {
  rawBody: string;
  secret: string | undefined;
  signatureHeader: string | null;
  timestampHeader: string | null;
  now?: number;
  toleranceSeconds?: number;
}): VerifyResult {
  const {
    rawBody,
    secret,
    signatureHeader,
    timestampHeader,
    now = Math.floor(Date.now() / 1000),
    toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
  } = options;

  // Fails closed. A receiver deployed without its secret rejects everything
  // rather than accepting everything.
  if (!secret) {
    return { ok: false, reason: "not_configured" };
  }

  if (!signatureHeader) {
    return { ok: false, reason: "missing_signature" };
  }

  if (!timestampHeader) {
    return { ok: false, reason: "missing_timestamp" };
  }

  // Number("") is 0 and Number("1e9") is a billion. Rejecting anything that is
  // not a plain run of digits stops either becoming a timestamp an attacker
  // did not have to guess.
  if (!/^\d{1,15}$/.test(timestampHeader.trim())) {
    return { ok: false, reason: "malformed_timestamp" };
  }

  const timestamp = Number(timestampHeader.trim());

  // Absolute difference, so a request from the future is rejected too.
  if (Math.abs(now - timestamp) > toleranceSeconds) {
    return { ok: false, reason: "stale_timestamp" };
  }

  const [version, provided] = signatureHeader.trim().split("=", 2);

  if (version !== SIGNATURE_VERSION) {
    return { ok: false, reason: "unsupported_signature_version" };
  }

  if (!provided || !/^[0-9a-f]{64}$/i.test(provided)) {
    return { ok: false, reason: "malformed_signature" };
  }

  if (!constantTimeEquals(sign(rawBody, secret, timestamp), provided.toLowerCase())) {
    return { ok: false, reason: "invalid_signature" };
  }

  return { ok: true, timestamp };
}

/**
 * Recently applied idempotency keys.
 *
 * WHAT THIS DOES AND DOES NOT GUARANTEE
 * -------------------------------------
 * This website has no database, and serverless instances do not share memory.
 * So this cache catches a repeat that lands on the same warm instance and
 * misses one that lands on a different instance or after a cold start.
 *
 * It is therefore a cheap optimisation, not the replay defence. The actual
 * defences are, in order:
 *
 *   1. The signed timestamp window, which bounds any replay to five minutes.
 *   2. The sending platform's own unique index on (post, event), which is what
 *      guarantees a publication is only ever announced once.
 *   3. Revalidation being idempotent: applying the same revalidation twice
 *      has exactly the same effect as applying it once.
 *
 * A replayed request within the window therefore costs a duplicate cache
 * purge and nothing else. Treating this cache as a security boundary would be
 * a mistake, which is the reason for this comment.
 */
const MAX_REMEMBERED = 500;
const seen = new Map<string, number>();

export function alreadyApplied(key: string, now = Date.now()) {
  const expiry = DEFAULT_TOLERANCE_SECONDS * 1000;
  const at = seen.get(key);

  if (at !== undefined && now - at < expiry) {
    return true;
  }

  // Drop expired entries, then bound the map so a long-lived instance cannot
  // grow it without limit.
  for (const [existing, when] of seen) {
    if (now - when >= expiry) {
      seen.delete(existing);
    }
  }

  if (seen.size >= MAX_REMEMBERED) {
    const oldest = seen.keys().next();

    if (!oldest.done) {
      seen.delete(oldest.value);
    }
  }

  seen.set(key, now);

  return false;
}

/** Test seam. Not used by the route. */
export function resetAppliedCache() {
  seen.clear();
}
