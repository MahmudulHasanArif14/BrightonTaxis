import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { FaqJsonLd, PageJsonLd } from "@/components/Seo";
import { RelatedLinks } from "@/components/ContentSections";
import {
  ClosingCta,
  Container,
  FaqList,
  PageHero,
  Section,
} from "@/components/ui";
import { BUSINESS } from "@/lib/business";
import {
  ACCESSIBLE_FAQS,
  AIRPORT_FAQS,
  CONTACT_FAQS,
  CORPORATE_FAQS,
  HOME_FAQS,
} from "@/lib/faqs";

const PATH = "/faq";
const DESCRIPTION = `Answers to the questions people ask Western Cars Brighton most often: how to book, airport transfers, accessible vehicles, groups, corporate accounts and how fares are confirmed.`;

export const metadata: Metadata = {
  title: "Questions & Answers",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: `Questions & Answers | ${BUSINESS.name}`,
    description: DESCRIPTION,
    url: PATH,
  },
};

const breadcrumbs = [{ name: "Questions & answers", path: PATH }];

/**
 * Every question on the site, in one place.
 *
 * Only the general booking set is marked up here, and it is marked up here
 * rather than on the homepage: the homepage renders no FAQ text, and FAQ
 * markup has to match questions a visitor can actually read.
 *
 * The other four groups are deliberately left unmarked on this page, because
 * each is already FAQPage markup on the page it belongs to — the airport
 * questions on the airport pages, the accessibility questions on the
 * accessible transport page, and so on. Marking them up twice would put two
 * FAQPage entities on one site asserting the same answers.
 */
const groups = [
  {
    title: "Booking and general",
    faqs: HOME_FAQS,
    owner: { label: "How booking works", href: "/how-to-book" },
  },
  {
    title: "Airport transfers",
    faqs: AIRPORT_FAQS,
    owner: { label: "Airport transfers", href: "/airport-transfers" },
  },
  {
    title: "Wheelchair-accessible travel",
    faqs: ACCESSIBLE_FAQS,
    owner: {
      label: "Wheelchair-accessible transport",
      href: "/services/accessible-transport",
    },
  },
  {
    title: "Corporate accounts",
    faqs: CORPORATE_FAQS,
    owner: {
      label: "Corporate accounts",
      href: "/services/corporate-accounts",
    },
  },
  {
    title: "Contacting us",
    faqs: CONTACT_FAQS,
    owner: { label: "Contact us", href: "/contact" },
  },
];

export default function FaqPage() {
  return (
    <>
      <PageJsonLd
        path={PATH}
        name="Questions and answers"
        description={DESCRIPTION}
        breadcrumbs={breadcrumbs}
      />
      <FaqJsonLd faqs={HOME_FAQS} path={PATH} />

      <Header />

      <main id="main">
        <PageHero
          eyebrow="Questions"
          title="Questions and answers"
          intro={`Everything people ask us before booking, grouped by subject. If your question is not here, call ${BUSINESS.telephone} — the booking line is staffed ${BUSINESS.phoneHours}.`}
          breadcrumbs={breadcrumbs}
        />

        <Section tone="white">
          <Container width="prose">
            {groups.map((group, index) => (
              <div key={group.title} className={index > 0 ? "mt-14" : ""}>
                <Reveal>
                  <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="font-display text-2xl font-bold text-gray-900">
                      {group.title}
                    </h2>
                    <Link
                      href={group.owner.href}
                      className="text-sm font-semibold text-green-700 underline-offset-4 hover:underline"
                    >
                      {group.owner.label} →
                    </Link>
                  </div>
                </Reveal>
                <FaqList faqs={group.faqs} />
              </div>
            ))}
          </Container>
        </Section>

        <RelatedLinks
          links={[
            { label: "Our services", href: "/services" },
            { label: "Areas we cover", href: "/service-areas" },
            { label: "Travel advice & guides", href: "/blog" },
            { label: "About us", href: "/about" },
          ]}
        />

        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
