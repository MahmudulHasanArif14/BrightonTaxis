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
import { SERVICE_CONTENT } from "@/content/services";

type Params = { params: Promise<{ slug: string }> };

/**
 * Prerendered, and only the slugs with content exist.
 *
 * `dynamicParams = false` means any other slug under /services/ is a real 404
 * rather than a page rendered from empty content, which is what keeps the
 * section from accumulating soft-404 URLs.
 */
export function generateStaticParams() {
  return Object.keys(SERVICE_CONTENT).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = SERVICE_CONTENT[slug];

  if (!content) {
    return { title: "Not found", robots: { index: false, follow: true } };
  }

  const path = `/services/${slug}`;

  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: content.title,
      description: content.description,
      url: path,
    },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const content = SERVICE_CONTENT[slug];

  if (!content) notFound();

  const path = `/services/${slug}`;
  const breadcrumbs = [
    { name: "Services", path: "/services" },
    { name: content.title, path },
  ];

  return (
    <>
      <PageJsonLd
        path={path}
        name={content.title}
        description={content.description}
        breadcrumbs={breadcrumbs}
      />
      <ServiceJsonLd
        path={path}
        name={content.title}
        description={content.description}
      />
      {/* Only the questions this page actually renders, below. */}
      <FaqJsonLd faqs={content.faqs} path={path} />

      <Header />

      <main id="main">
        <PageHero
          eyebrow="Service"
          title={content.heading}
          intro={content.intro}
          breadcrumbs={breadcrumbs}
        />

        <ContentBody sections={content.sections} />

        <FaqSection>
          <FaqList faqs={content.faqs} />
        </FaqSection>

        <RelatedLinks links={content.related} />

        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
