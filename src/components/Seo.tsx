import { AIRPORTS, BUSINESS, SERVICE_AREAS } from "@/lib/business";
import { BLOG_PATH, SITE_NAME, siteUrl } from "@/lib/site";

/**
 * One entity model for the whole site.
 *
 * Every JSON-LD block on every page refers back to two stable identifiers:
 *
 *   <origin>/#business   the company
 *   <origin>/#website    this website
 *
 * They are built from siteUrl() rather than written out, because an @id is an
 * identity claim: if it names a different origin from the canonical tag on the
 * same page, the two are describing two different things. That had already
 * happened once here -- the business block was pinned to
 * www.westerncarsbrighton.co.uk while the canonical pointed at this site.
 *
 * What is deliberately *absent* is as important as what is here. There is no
 * aggregateRating, no reviewCount, no priceRange, no geo block and no licence
 * number. Each of those was previously asserted with a value nothing
 * substantiated (a flat 5.0 from "700" reviews; coordinates for the middle of
 * Brighton rather than the office). Google treats invented review markup as a
 * structured-data violation, so they are gone rather than estimated. See
 * docs/CONTENT_NOTES.md.
 */

export function businessId() {
  return `${siteUrl()}/#business`;
}

export function websiteId() {
  return `${siteUrl()}/#website`;
}

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for the one character that can close
      // a script element early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\u003c"),
      }}
    />
  );
}

/**
 * The company and the website. Rendered once, in the root layout, so every
 * page carries the identity without any page re-declaring it.
 */
export function SiteJsonLd() {
  const origin = siteUrl();

  const business = {
    "@type": ["TaxiService", "LocalBusiness"],
    "@id": businessId(),
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: origin,
    telephone: BUSINESS.telephoneE164,
    email: BUSINESS.email,
    foundingDate: BUSINESS.founded,
    image: `${origin}/logo.png`,
    logo: {
      "@type": "ImageObject",
      url: `${origin}/logo.png`,
      width: 307,
      height: 288,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    areaServed: [...SERVICE_AREAS, ...AIRPORTS.map((a) => a.name)].map(
      (name) => ({ "@type": "Place", name }),
    ),
    sameAs: [...BUSINESS.profiles],
    identifier: {
      "@type": "PropertyValue",
      name: "Companies House company number",
      value: BUSINESS.companyNumber,
    },
    // The telephone line is staffed around the clock. This describes the
    // booking line, which is the thing the business can actually stand behind,
    // rather than claiming a shopfront is open at 4am.
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Reservations",
      telephone: BUSINESS.telephoneE164,
      email: BUSINESS.email,
      areaServed: "GB",
      availableLanguage: "English",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId(),
    url: origin,
    name: SITE_NAME,
    inLanguage: "en-GB",
    publisher: { "@id": businessId() },
  };

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": [business, website] }} />;
}

/**
 * One page, tied back to the site entity.
 *
 * `path` is root-relative and must match the page's canonical exactly, or the
 * page claims one URL in its head and another in its markup.
 */
export function PageJsonLd({
  path,
  name,
  description,
  breadcrumbs,
}: {
  path: string;
  name: string;
  description: string;
  breadcrumbs?: { name: string; path: string }[];
}) {
  const origin = siteUrl();
  const url = `${origin}${path}`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": url,
      url,
      name,
      description,
      inLanguage: "en-GB",
      isPartOf: { "@id": websiteId() },
      about: { "@id": businessId() },
      ...(breadcrumbs?.length
        ? { breadcrumb: { "@id": `${url}#breadcrumb` } }
        : {}),
    },
  ];

  if (breadcrumbs?.length) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { name: "Home", path: "/" },
        ...breadcrumbs,
      ].map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${origin}${crumb.path === "/" ? "" : crumb.path}`,
      })),
    });
  }

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}

/** A service the business offers, described on its own page. */
export function ServiceJsonLd({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${siteUrl()}${path}#service`,
        name,
        description,
        serviceType: "Private hire vehicle service",
        provider: { "@id": businessId() },
        areaServed: SERVICE_AREAS.map((area) => ({
          "@type": "Place",
          name: area,
        })),
        // No `offers` block: the business publishes no fixed fares, and an
        // offer without a price is markup that says nothing.
      }}
    />
  );
}

export type Faq = { question: string; answer: string };

/**
 * FAQ markup.
 *
 * Google requires that every question and answer in this markup is visible on
 * the page, so this component takes the same array the page renders. Never
 * pass it questions the visitor cannot read.
 */
export function FaqJsonLd({ faqs, path }: { faqs: Faq[]; path: string }) {
  if (faqs.length === 0) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${siteUrl()}${path}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }}
    />
  );
}

/** Convenience for linking a blog listing from structured data. */
export const BLOG_URL_PATH = BLOG_PATH;
