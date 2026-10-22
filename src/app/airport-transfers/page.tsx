import type { Metadata } from "next";
import { Plane } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { FaqJsonLd, PageJsonLd, ServiceJsonLd } from "@/components/Seo";
import { FaqSection, RelatedLinks } from "@/components/ContentSections";
import {
  ClosingCta,
  Container,
  FaqList,
  LinkCard,
  PageHero,
  Prose,
  Section,
} from "@/components/ui";
import { AIRPORTS, BUSINESS } from "@/lib/business";
import { AIRPORT_FAQS } from "@/lib/faqs";

const PATH = "/airport-transfers";
const DESCRIPTION =
  "Pre-booked airport transfers from Brighton and Hove to Gatwick, Heathrow, London City, Stansted and Luton. Fares confirmed before travel. Call 01273 220220.";

export const metadata: Metadata = {
  title: "Airport Transfers from Brighton & Hove",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: `Airport Transfers from Brighton & Hove | ${BUSINESS.name}`,
    description: DESCRIPTION,
    url: PATH,
  },
};

const breadcrumbs = [{ name: "Airport transfers", path: PATH }];

export default function AirportTransfersHub() {
  return (
    <>
      <PageJsonLd
        path={PATH}
        name="Airport transfers from Brighton & Hove"
        description={DESCRIPTION}
        breadcrumbs={breadcrumbs}
      />
      <ServiceJsonLd
        path={PATH}
        name="Airport transfer service"
        description={DESCRIPTION}
      />
      <FaqJsonLd faqs={AIRPORT_FAQS} path={PATH} />

      <Header />

      <main id="main">
        <PageHero
          eyebrow="Airport transfers"
          title="Airport transfers from Brighton & Hove"
          intro="Door-to-terminal transfers to the five airports Brighton passengers normally use. Each one is a different journey, so each has its own page."
          breadcrumbs={breadcrumbs}
          image={{
            src: "https://images.pexels.com/photos/16292057/pexels-photo-16292057.jpeg?auto=compress&cs=tinysrgb&w=1920",
          }}
        />

        <Section tone="white">
          <Container>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {AIRPORTS.map((airport, index) => (
                <Reveal
                  as="li"
                  key={airport.slug}
                  delay={Math.min(index, 4) * 60}
                  className="h-full"
                >
                  <LinkCard
                    href={`${PATH}/${airport.slug}`}
                    title={airport.name}
                    description={airport.blurb}
                    icon={Plane}
                  />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        <Section tone="muted">
          <Container width="prose">
            <Reveal>
              <Prose>
                <h2>How an airport transfer is booked</h2>
                <p>
                  Give us the pickup address, the airport, the flight number and
                  the time, plus how many are travelling and how much luggage.
                  The flight number matters more than people expect: it is what
                  lets the pickup be planned around the flight rather than
                  around a time on a ticket.
                </p>
                <p>
                  The fare is confirmed with you before the booking is accepted.
                  There is no fixed fare table on this site — the price depends
                  on the route, the vehicle and the time, and a printed figure
                  would be wrong for a good share of journeys. Call{" "}
                  {BUSINESS.telephone} for a quote on a specific journey.
                </p>
                <h2>If plans change</h2>
                <p>
                  Call us. The booking line is staffed {BUSINESS.phoneHours},
                  which is the entire reason it is worth having when a flight
                  slips at two in the morning.
                </p>
              </Prose>
            </Reveal>
          </Container>
        </Section>

        <FaqSection>
          <FaqList faqs={AIRPORT_FAQS} />
        </FaqSection>

        <RelatedLinks
          links={[
            { label: "Group and multi-seater travel", href: "/services/group-travel" },
            { label: "Wheelchair-accessible transport", href: "/services/accessible-transport" },
            { label: "Corporate accounts", href: "/services/corporate-accounts" },
            { label: "How booking works", href: "/how-to-book" },
          ]}
        />

        <ClosingCta title="Book an airport transfer" />
      </main>

      <Footer />
    </>
  );
}
