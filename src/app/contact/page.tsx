import type { Metadata } from "next";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { FaqJsonLd, PageJsonLd } from "@/components/Seo";
import { FaqSection, RelatedLinks } from "@/components/ContentSections";
import {
  ClosingCta,
  Container,
  FaqList,
  PageHero,
  Section,
} from "@/components/ui";
import { BUSINESS } from "@/lib/business";
import { CONTACT_FAQS } from "@/lib/faqs";

const PATH = "/contact";
const DESCRIPTION = `Contact Western Cars Brighton: call ${BUSINESS.telephone} (booking line open ${BUSINESS.phoneHours}), email ${BUSINESS.email}, or book online.`;

export const metadata: Metadata = {
  title: "Contact Us",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: `Contact | ${BUSINESS.name}`,
    description: DESCRIPTION,
    url: PATH,
  },
};

const breadcrumbs = [{ name: "Contact", path: PATH }];

/**
 * Contact details.
 *
 * Deliberately not a contact form. A form here would be a fourth channel that
 * nothing in this application is wired to deliver — there is no mail
 * transport configured in this project — and a form that silently goes nowhere
 * is worse than no form. The three real channels are phone, email and the
 * booking system.
 */
export default function ContactPage() {
  const channels = [
    {
      icon: Phone,
      title: "Phone",
      value: BUSINESS.telephone,
      href: BUSINESS.telHref,
      note: "Answered 24/7 by a real person",
      body: `Staffed ${BUSINESS.phoneHours}. The right route for a journey today, a change to an existing booking, or anything with a flight attached.`,
      external: false,
    },
    {
      icon: Mail,
      title: "Email",
      value: BUSINESS.email,
      href: `mailto:${BUSINESS.email}`,
      note: "We reply within a few hours",
      body: "Best for account enquiries, quotes for journeys some way off, and anything with details worth putting in writing.",
      external: false,
    },
    {
      icon: ExternalLink,
      title: "Book online",
      value: "Web booking",
      href: BUSINESS.bookingUrl,
      note: "Book in under a minute",
      body: "Our booking system, open at any hour. Enter the pickup, the destination and the time, and the fare is confirmed as part of the booking.",
      external: true,
    },
  ];

  return (
    <>
      <PageJsonLd
        path={PATH}
        name="Contact Western Cars Brighton"
        description={DESCRIPTION}
        breadcrumbs={breadcrumbs}
      />
      <FaqJsonLd faqs={CONTACT_FAQS} path={PATH} />

      <Header />

      <main id="main">
        <PageHero
          eyebrow="Contact"
          title="Get in touch"
          intro={`Three ways to reach us. For anything time-sensitive, phone ${BUSINESS.telephone} — the line is staffed ${BUSINESS.phoneHours}.`}
          breadcrumbs={breadcrumbs}
        />

        <Section tone="white">
          <Container>
            <ul className="grid gap-6 md:grid-cols-3">
              {channels.map((channel, index) => (
                <Reveal
                  as="li"
                  key={channel.title}
                  delay={Math.min(index, 2) * 70}
                >
                  <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6">
                    <span
                      aria-hidden="true"
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100"
                    >
                      <channel.icon className="h-6 w-6 text-green-700" />
                    </span>
                    <h2 className="font-display text-lg font-semibold text-gray-900">
                      {channel.title}
                    </h2>
                    <a
                      href={channel.href}
                      {...(channel.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="mt-1 break-words font-semibold text-green-700 underline-offset-4 hover:underline"
                    >
                      {channel.value}
                    </a>
                    <p className="mt-1 text-xs font-medium text-gray-500">
                      {channel.note}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                      {channel.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        <Section tone="muted">
          <Container width="prose">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-gray-900">
                Based in Brighton, serving Sussex
              </h2>
              <p className="mt-4 leading-relaxed text-gray-700">
                Our office is in central Brighton, a short walk from Brighton
                station. We serve the whole of Brighton &amp; Hove, plus East
                and West Sussex, and all major UK airports.
              </p>

              <dl className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
                <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold text-gray-600">
                    Brighton office
                  </dt>
                  <dd>
                    <address className="flex items-start gap-3 not-italic leading-relaxed text-gray-900">
                      <MapPin
                        aria-hidden="true"
                        className="mt-1 h-5 w-5 shrink-0 text-green-700"
                      />
                      <span>
                        {BUSINESS.address.street}
                        <br />
                        {BUSINESS.address.locality}
                        <br />
                        {BUSINESS.address.postalCode}
                      </span>
                    </address>
                    <p className="mt-2 text-sm text-gray-600">
                      Visits by appointment — please book by phone or online
                      rather than calling in.
                    </p>
                  </dd>
                </div>
                <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold text-gray-600">Hours</dt>
                  <dd className="text-gray-900">
                    {BUSINESS.phoneHours}
                    <span className="mt-1 block text-sm text-gray-600">
                      Including bank holidays
                    </span>
                  </dd>
                </div>
                <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold text-gray-600">
                    Company registration
                  </dt>
                  <dd className="text-gray-900">
                    {BUSINESS.legalName} · No. {BUSINESS.companyNumber}
                  </dd>
                </div>
                <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold text-gray-600">
                    Service area
                  </dt>
                  <dd className="text-gray-900">
                    Brighton · Hove · Kemptown · Preston Park · Brighton Marina
                    · East &amp; West Sussex
                  </dd>
                </div>
              </dl>
            </Reveal>
          </Container>
        </Section>

        <FaqSection>
          <FaqList faqs={CONTACT_FAQS} />
        </FaqSection>

        <RelatedLinks
          links={[
            { label: "How booking works", href: "/how-to-book" },
            { label: "Corporate accounts", href: "/services/corporate-accounts" },
            { label: "Questions and answers", href: "/faq" },
            { label: "About us", href: "/about" },
          ]}
        />

        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
