import { ImageResponse } from "next/og";
import { BUSINESS } from "@/lib/business";

/**
 * The social sharing image, rendered by this application.
 *
 * It replaces an `images.unsplash.com` URL that was declared as this site's
 * og:image: a stock photograph on someone else's CDN, subject to their
 * hotlink policy, captioned in the metadata as "Western Cars Brighton -
 * Premium taxi fleet" when it was nothing of the kind.
 *
 * Drawn with the layout engine rather than loaded as a file, so there is no
 * binary asset to lose and nothing to fetch at request time from outside.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${BUSINESS.name} — licensed private hire in Brighton & Hove`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #0f1f17 55%, #0a0a0a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 14,
              height: 56,
              borderRadius: 999,
              background: "#22c55e",
            }}
          />
          <div
            style={{
              fontSize: 30,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#4ade80",
            }}
          >
            {BUSINESS.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
            {"Taxis & airport transfers"}
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: "#4ade80",
              lineHeight: 1.1,
            }}
          >
            {"across Brighton & Hove"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 30,
            color: "rgba(255,255,255,0.72)",
            borderTop: "1px solid rgba(255,255,255,0.16)",
            paddingTop: 28,
          }}
        >
          <div>{`Licensed private hire since ${BUSINESS.founded}`}</div>
          <div style={{ color: "#ffffff", fontWeight: 600 }}>
            {BUSINESS.telephone}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
