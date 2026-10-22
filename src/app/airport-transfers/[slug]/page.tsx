import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ContentBody,
  FaqSection,
  RelatedLinks,
} from "@/components/ContentSections";
import { FaqJsonLd, PageJsonLd, ServiceJsonLd } from "@/components/Seo";
import { ClosingCta, FaqList, PageHero } from "@/components/ui";
import { AIRPORTS } from "@/lib/business";
import { AIRPORT_CONTENT } from "@/content/airports";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return AIRPORTS.map((airport) => ({ slug: airport.slug }));
}

/** Only the five airports exist under this path; anything else is a 404. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = AIRPORT_CONTENT[slug];

  if (!content) {
    return { title: "Not found", robots: { index: false, follow: true } };
  }

  const path = `/airport-transfers/${slug}`;

  return {
    title: content.heading,
    description: content.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: content.heading,
      description: content.description,
      url: path,
    },
  };
}

export default async function AirportPage({ params }: Params) {
  const { slug } = await params;
  const content = AIRPORT_CONTENT[slug];
  const airport = AIRPORTS.find((item) => item.slug === slug);

  if (!content || !airport) notFound();

  const path = `/airport-transfers/${slug}`;
  const breadcrumbs = [
    { name: "Airport transfers", path: "/airport-transfers" },
    { name: airport.short, path },
  ];

  // The other four airports, as contextual links. Every airport page links to
  // every other one, which is what keeps the set from being five dead ends.
  const siblings = AIRPORTS.filter((item) => item.slug !== slug).map(
    (item) => ({
      label: `${item.short} transfers`,
      href: `/airport-transfers/${item.slug}`,
    }),
  );

  return (
    <>
      <PageJsonLd
        path={path}
        name={content.heading}
        description={content.description}
        breadcrumbs={breadcrumbs}
      />
      <ServiceJsonLd
        path={path}
        name={content.heading}
        description={content.description}
      />
      <FaqJsonLd faqs={content.faqs} path={path} />

      <Header />

      <main id="main">
        <PageHero
          eyebrow={`${airport.name} · ${airport.code}`}
          title={content.heading}
          intro={content.intro}
          breadcrumbs={breadcrumbs}
        />

        <ContentBody sections={content.sections} />

        <FaqSection title={`${airport.short} transfers: questions and answers`}>
          <FaqList faqs={content.faqs} />
        </FaqSection>

        <RelatedLinks
          heading="Other airports we cover"
          links={[
            ...siblings,
            { label: "All airport transfers", href: "/airport-transfers" },
          ]}
        />

        <ClosingCta title={`Book a transfer to ${airport.short}`} />
      </main>

      <Footer />
    </>
  );
}
