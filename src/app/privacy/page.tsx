import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageJsonLd } from "@/components/Seo";
import { RelatedLinks } from "@/components/ContentSections";
import { Container, PageHero, Prose, Section } from "@/components/ui";
import { BUSINESS } from "@/lib/business";

const PATH = "/privacy";
const DESCRIPTION = `How this website handles personal information, and how to contact ${BUSINESS.legalName} about data held in connection with a booking.`;

export const metadata: Metadata = {
  title: "Privacy",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `Privacy | ${BUSINESS.name}`, description: DESCRIPTION, url: PATH },
  // Legal pages are indexable but have no business competing for traffic.
  robots: { index: true, follow: true },
};

const breadcrumbs = [{ name: "Privacy", path: PATH }];

/**
 * Privacy information for this website.
 *
 * Scoped deliberately to what can be verified from this codebase: what this
 * application does and does not collect. It does not describe how the
 * operator handles booking records, driver data or call recordings, because
 * none of that is visible from here and inventing it would be worse than
 * omitting it.
 *
 * ACTION REQUIRED BY THE BUSINESS: this needs reviewing against the company's
 * actual data-protection practices and its ICO registration before it can
 * stand as the company's full privacy notice. See docs/CONTENT_NOTES.md.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageJsonLd
        path={PATH}
        name="Privacy"
        description={DESCRIPTION}
        breadcrumbs={breadcrumbs}
      />

      <Header />

      <main id="main">
        <PageHero
          eyebrow="Legal"
          title="Privacy"
          intro="What this website does with personal information — which, as it turns out, is very little."
          breadcrumbs={breadcrumbs}
        />

        <Section tone="white">
          <Container width="prose">
            <Prose>
              <h2>What this website collects</h2>
              <p>
                This website does not ask you for personal information. There
                is no contact form, no account, no newsletter sign-up and no
                comment facility. Nothing you type is sent to us by these pages,
                because there is nowhere on them to type anything.
              </p>
              <p>
                It also carries no analytics, advertising or tracking scripts,
                and it loads no third-party fonts, tag managers or social
                widgets at the time you visit. The fonts used here are served
                from this site itself.
              </p>

              <h2>Cookies</h2>
              <p>
                This website sets no cookies and stores nothing in your
                browser&apos;s local storage. There is more detail, and the
                reason there is no cookie banner, on our{" "}
                <Link href="/cookies">cookies page</Link>.
              </p>

              <h2>Server logs</h2>
              <p>
                Like any website, these pages are served by a hosting provider
                that records ordinary technical request information — such as
                the IP address a request came from, the page requested and the
                time — for security and reliability purposes. We do not use
                those logs to build any profile of visitors.
              </p>

              <h2>When you book</h2>
              <p>
                Bookings are not taken on this website. The{" "}
                <strong>Book online</strong> links on these pages open our
                booking system, which is a separate service operated on our
                behalf, and the details you enter there are held by that service
                and by us so that your journey can be arranged. Information
                given to us by telephone or email is held for the same purpose.
              </p>
              <p>
                In practice that means the things needed to carry out a journey:
                a name, a contact number, pickup and destination addresses, the
                time, and anything you tell us about the vehicle you need.
              </p>

              <h2>Your rights</h2>
              <p>
                Under UK data protection law you can ask what personal
                information is held about you, ask for it to be corrected, and
                ask for it to be erased where there is no overriding reason to
                keep it. To make any of those requests, contact{" "}
                {BUSINESS.legalName} at{" "}
                <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> or on{" "}
                <a href={BUSINESS.telHref}>{BUSINESS.telephone}</a>.
              </p>
              <p>
                If you are not satisfied with how a request has been handled,
                you can complain to the Information Commissioner&apos;s Office,
                the UK&apos;s data protection regulator, at{" "}
                <a
                  href="https://ico.org.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ico.org.uk
                </a>
                .
              </p>

              <h2>Who is responsible</h2>
              <p>
                {BUSINESS.legalName}, trading as {BUSINESS.name},{" "}
                {BUSINESS.address.street}, {BUSINESS.address.locality},{" "}
                {BUSINESS.address.postalCode}. Registered in England and Wales,
                company number {BUSINESS.companyNumber}.
              </p>
            </Prose>
          </Container>
        </Section>

        <RelatedLinks
          links={[
            { label: "Cookies", href: "/cookies" },
            { label: "Contact us", href: "/contact" },
            { label: "About us", href: "/about" },
            { label: "How booking works", href: "/how-to-book" },
          ]}
        />
      </main>

      <Footer />
    </>
  );
}
