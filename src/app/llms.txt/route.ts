import { AIRPORTS, BUSINESS, SERVICES } from "@/lib/business";
import { SERVICE_CONTENT } from "@/content/services";
import { BLOG_PATH, siteUrl } from "@/lib/site";

/**
 * /llms.txt
 *
 * A plain-text summary of what this site is and where its pages are, for
 * systems that read one before crawling. It is a supplement and nothing more:
 * every fact in it is also in the HTML, the sitemap still lists the canonical
 * URLs, and removing this file would cost the site nothing in search. Nothing
 * here is addressed to a model as an instruction — it is a description.
 *
 * Generated from the same modules the pages are built from, so it cannot drift
 * away from the site it describes.
 */
export const dynamic = "force-static";

export function GET() {
  const base = siteUrl();

  const lines = [
    `# ${BUSINESS.name}`,
    "",
    `> Licensed private hire (taxi) operator in Brighton and Hove, United Kingdom, trading since ${BUSINESS.founded}. Local journeys, airport transfers, corporate accounts, executive travel, group vehicles and wheelchair-accessible transport. All journeys are pre-booked.`,
    "",
    "## Business details",
    "",
    `- Trading name: ${BUSINESS.name}`,
    `- Registered company: ${BUSINESS.legalName} (England and Wales, company number ${BUSINESS.companyNumber})`,
    `- Website: ${base}`,
    `- Telephone: ${BUSINESS.telephone} (international ${BUSINESS.telephoneE164})`,
    `- Email: ${BUSINESS.email}`,
    `- Registered office: ${BUSINESS.address.street}, ${BUSINESS.address.locality}, ${BUSINESS.address.postalCode}, United Kingdom`,
    `- Booking line hours: ${BUSINESS.phoneHours}`,
    `- Booking channels: online (${BUSINESS.bookingUrl}), telephone, email`,
    "",
    "## Key pages",
    "",
    `- [Home](${base}/): services, vehicle categories and common questions`,
    `- [About](${base}/about): company profile and registered details`,
    `- [Services](${base}/services): everything the company offers`,
    ...SERVICES.filter((service) => service.slug in SERVICE_CONTENT).map(
      (service) =>
        `- [${service.title}](${base}${service.href}): ${service.summary}`,
    ),
    `- [Airport transfers](${base}/airport-transfers): transfers to five London airports`,
    ...AIRPORTS.map(
      (airport) =>
        `- [${airport.name} transfers](${base}/airport-transfers/${airport.slug}): ${airport.blurb}`,
    ),
    `- [Areas we cover](${base}/service-areas): where the company operates`,
    `- [How to book](${base}/how-to-book): booking steps and how fares are confirmed`,
    `- [Questions and answers](${base}/faq): the full FAQ`,
    `- [Contact](${base}/contact): phone, email and address`,
    `- [Travel advice and guides](${base}${BLOG_PATH}): articles about travelling in and out of Brighton`,
    `- [Privacy](${base}/privacy) and [Cookies](${base}/cookies)`,
    "",
    "## Notes on accuracy",
    "",
    "- Fares are not published on this site. The price of a journey depends on the route, the vehicle and the time, and is confirmed with the customer before a booking is accepted.",
    "- This site publishes no ratings, review counts, fleet sizes or guaranteed waiting times. If a figure of that kind is attributed to this business, it did not come from here.",
    "- The company has one address, the registered office above. Covering a town does not mean there are premises in it.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=86400",
    },
  });
}
