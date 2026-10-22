import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { PageJsonLd } from "@/components/Seo";
import { RelatedLinks } from "@/components/ContentSections";
import {
  ClosingCta,
  Container,
  PageHero,
  Prose,
  Section,
} from "@/components/ui";
import { BUSINESS } from "@/lib/business";

const PATH = "/how-to-book";
const DESCRIPTION = `How to book a taxi with Western Cars Brighton: online, by phone on ${BUSINESS.telephone}, or by email. What we need from you and how the fare is confirmed.`;

export const metadata: Metadata = {
  title: "How to Book",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: `How to Book | ${BUSINESS.name}`,
    description: DESCRIPTION,
    url: PATH,
  },
};

const breadcrumbs = [{ name: "How to book", path: PATH }];

const steps = [
  {
    title: "Choose a channel",
    body: `Online through our booking system, by phone on ${BUSINESS.telephone}, or by email at ${BUSINESS.email}. The phone is the right choice for anything happening today or anything unusual; online suits a straightforward journey booked ahead.`,
  },
  {
    title: "Tell us the journey",
    body: "Pickup address with a flat or building number, destination, date and time, how many passengers and how much luggage. If it is an airport run, the flight number as well.",
  },
  {
    title: "Flag anything that changes the vehicle",
    body: "A wheelchair, a child seat, a bike box, a large instrument, an assistance dog, more than one pickup point. Any of these decides which vehicle is suitable, so they belong in the booking rather than in a conversation on the doorstep.",
  },
  {
    title: "Have the fare confirmed",
    body: "The fare is confirmed with you before the booking is accepted. It depends on the route, the vehicle and the time of travel, which is why this site does not publish a fixed price list.",
  },
  {
    title: "Tell us if anything changes",
    body: `Call ${BUSINESS.telephone}. The booking line is staffed ${BUSINESS.phoneHours}, which is the point of it — a flight that slips at three in the morning still reaches a person.`,
  },
];

export default function HowToBookPage() {
  return (
    <>
      <PageJsonLd
        path={PATH}
        name="How to book a taxi with Western Cars Brighton"
        description={DESCRIPTION}
        breadcrumbs={breadcrumbs}
      />

      <Header />

      <main id="main">
        <PageHero
          eyebrow="Booking"
          title="How to book"
          intro="Five steps, none of them complicated. The short version: tell us where, when, how many and anything unusual — and we will confirm the fare before the booking is accepted."
          breadcrumbs={breadcrumbs}
        />

        <Section tone="white">
          <Container width="prose">
            <ol className="space-y-6">
              {steps.map((step, index) => (
                <Reveal as="li" key={step.title} delay={Math.min(index, 4) * 60}>
                  <div className="flex gap-5 rounded-2xl border border-gray-200 bg-white p-6">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 font-display text-lg font-bold text-white"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-semibold text-gray-900">
                        {step.title}
                      </h2>
                      <p className="mt-2 leading-relaxed text-gray-600">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </Container>
        </Section>

        <Section tone="muted">
          <Container width="prose">
            <Reveal>
              <Prose>
                <h2>How pricing works</h2>
                <p>
                  There is no fare table on this website. The price of a journey
                  depends on the route, the vehicle allocated and the time of
                  travel, and a figure printed here would be wrong for a good
                  proportion of journeys — which is worse than no figure at all.
                </p>
                <p>
                  Instead, the fare is quoted and agreed before the booking is
                  accepted. If you want to know what a journey will cost before
                  committing to anything, call {BUSINESS.telephone} and ask for
                  a quote for that specific journey.
                </p>
                <h2>How far ahead to book</h2>
                <p>
                  For an ordinary local journey, whenever suits you. For an
                  airport transfer, a wheelchair-accessible vehicle, a group, or
                  anything leaving in the small hours, book as early as you
                  reasonably can. Those are the bookings where the vehicle has
                  to be allocated rather than simply found.
                </p>
              </Prose>
            </Reveal>
          </Container>
        </Section>

        <RelatedLinks
          links={[
            { label: "Our services", href: "/services" },
            { label: "Airport transfers", href: "/airport-transfers" },
            { label: "Questions and answers", href: "/faq" },
            { label: "Contact us", href: "/contact" },
          ]}
        />

        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
