import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageJsonLd } from "@/components/Seo";
import { RelatedLinks } from "@/components/ContentSections";
import { Container, PageHero, Prose, Section } from "@/components/ui";
import { BUSINESS } from "@/lib/business";

const PATH = "/cookies";
const DESCRIPTION =
  "This website sets no cookies and runs no tracking scripts. What that means, and what happens when you open the booking system.";

export const metadata: Metadata = {
  title: "Cookies",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `Cookies | ${BUSINESS.name}`, description: DESCRIPTION, url: PATH },
};

const breadcrumbs = [{ name: "Cookies", path: PATH }];

/**
 * The cookie page.
 *
 * It says the site sets no cookies because, as this application is built, it
 * does not: there is no analytics, no tag manager, no embedded video, no
 * social widget, no consent tool and no session. If anything of that kind is
 * ever added, this page and the privacy page have to be updated in the same
 * change — and a consent banner will be needed with it.
 */
export default function CookiesPage() {
  return (
    <>
      <PageJsonLd
        path={PATH}
        name="Cookies"
        description={DESCRIPTION}
        breadcrumbs={breadcrumbs}
      />

      <Header />

      <main id="main">
        <PageHero
          eyebrow="Legal"
          title="Cookies"
          intro="There is no cookie banner on this site, and that is not an oversight."
          breadcrumbs={breadcrumbs}
        />

        <Section tone="white">
          <Container width="prose">
            <Prose>
              <h2>This website sets no cookies</h2>
              <p>
                These pages set no cookies, store nothing in your browser&apos;s
                local storage, and carry no analytics, advertising or tracking
                scripts. There is no consent banner because there is nothing to
                consent to.
              </p>
              <p>
                There are no third-party embeds either — no maps, no video
                players, no social feeds, no externally hosted fonts. Everything
                these pages need is served from this site.
              </p>

              <h2>The booking system is a separate site</h2>
              <p>
                When you follow a <strong>Book online</strong> link you leave
                this website and arrive at our booking system, which is operated
                on our behalf at a different address. That system is a working
                application rather than a set of pages, and it may well set
                cookies in order to function. Its own notices apply once you are
                there.
              </p>

              <h2>Links out to other sites</h2>
              <p>
                The same goes for any other external link on this site, such as
                our Google listing or Facebook page: once you follow one, you
                are on somebody else&apos;s site under their terms.
              </p>

              <h2>If this changes</h2>
              <p>
                If analytics or any other cookie-setting tool is ever added to
                this website, this page will say so and a consent mechanism will
                be added at the same time. If you have a question in the
                meantime, email{" "}
                <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
              </p>
            </Prose>
          </Container>
        </Section>

        <RelatedLinks
          links={[
            { label: "Privacy", href: "/privacy" },
            { label: "Contact us", href: "/contact" },
            { label: "How booking works", href: "/how-to-book" },
            { label: "About us", href: "/about" },
          ]}
        />
      </main>

      <Footer />
    </>
  );
}
