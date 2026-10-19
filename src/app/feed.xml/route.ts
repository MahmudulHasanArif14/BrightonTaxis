import { NextResponse } from "next/server";

const siteUrl = "https://www.westerncarsbrighton.co.uk";

const posts = [
  {
    title: "Which Vehicle Do You Need for an Airport Transfer?",
    description:
      "A practical guide to choosing the right vehicle for an airport transfer, including saloons, estates, multi-seaters and accessible taxis.",
    path: "/blog/which-vehicle-for-an-airport-transfer/",
    date: "2026-10-15",
  },
  {
    title: "Getting Home Safely After a Night Out in Brighton",
    description:
      "Practical advice on pre-booking, choosing safe pickup points and checking your driver.",
    path: "/blog/getting-home-after-a-night-out-in-brighton/",
    date: "2026-10-12",
  },
  {
    title: "How Much Does a Taxi from Brighton to Gatwick Airport Cost?",
    description:
      "A guide to Brighton to Gatwick taxi fares, vehicle options and the factors that affect your price.",
    path: "/blog/brighton-to-gatwick-taxi-cost/",
    date: "2024-08-15",
  },
  {
    title: "Best Ways to Get to the Amex Stadium on Match Day",
    description:
      "Explore transport options for Brighton & Hove Albion match days, including taxis, trains and park and ride.",
    path: "/blog/amex-stadium-taxi-guide/",
    date: "2024-08-10",
  },
  {
    title: "A Guide to Brighton & Hove's Taxi Ranks and Rules",
    description:
      "Learn about taxi ranks in Brighton and Hove, licensing rules and the difference between taxis and private hire vehicles.",
    path: "/blog/brighton-taxi-ranks-guide/",
    date: "2024-08-05",
  },
];

function escapeXml(value: string) {
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

export async function GET() {
  const items = posts
    .map((post) => {
      const url = `${siteUrl}${post.path}`;

      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <description>${escapeXml(post.description)}</description>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate>
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Western Cars Brighton Blog</title>
    <link>${siteUrl}/blog/</link>
    <description>Taxi advice, airport transfer guides and local travel information from Western Cars Brighton.</description>
    <language>en-GB</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
