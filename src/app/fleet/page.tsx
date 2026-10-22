import type { Metadata } from "next";
import Link from "next/link";
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
import { BUSINESS, PRICING_NOTE, VEHICLES } from "@/lib/business";

const PATH = "/fleet";
const DESCRIPTION =
  "Saloon, estate and multi-seater vehicles for journeys across Brighton and Hove, with passenger and luggage capacity for each. Guide prices, fare confirmed before booking.";

export const metadata: Metadata = {
  title: "Our Fleet — Saloon, Estate & Multi-Seater",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: `Our fleet | ${BUSINESS.name}`,
    description: DESCRIPTION,
    url: PATH,
  },
};

const breadcrumbs = [{ name: "Fleet", path: PATH }];

/**
 * The fleet page.
 *
 * Three classes, described the way the business describes them. No model
 * names, no vehicle count, no registration plates and no fixed fares: the
 * company publishes a class, a capacity, a hedged luggage guide and one
 * pricing rule, and that is the whole of what can be said here truthfully.
 *
 * The luggage figures keep their "subject to actual luggage dimensions"
 * qualifier wherever they appear, because a suitcase count without it reads
 * as a guarantee.
 */
export default function FleetPage() {
  return (
    <>
      <PageJsonLd
        path={PATH}
        name="Our fleet"
        description={DESCRIPTION}
        breadcrumbs={breadcrumbs}
      />

      <Header />

      <main id="main">
        <PageHero
          eyebrow="Our vehicles"
          title="A vehicle to suit every traveller"
          intro="Our vehicles are fully licensed, insured and maintained for comfort and reliability. Three classes cover most journeys; the right one depends on how many of you there are and how much you are carrying."
          breadcrumbs={breadcrumbs}
        />

        <Section tone="white">
          <Container>
            <ul className="grid gap-6 lg:grid-cols-3">
              {VEHICLES.map((vehicle, index) => (
                <Reveal
                  as="li"
                  key={vehicle.slug}
                  delay={Math.min(index, 2) * 70}
                  className="h-full"
                >
                  <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-xl font-bold text-gray-900">
                        {vehicle.name}
                      </h2>
                      {"tag" in vehicle && vehicle.tag ? (
                        <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                          {vehicle.tag}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 flex-1 leading-relaxed text-gray-600">
                      {vehicle.summary}
                    </p>
                    <dl className="mt-5 space-y-3 border-t border-gray-200 pt-5 text-sm">
                      <div>
                        <dt className="font-semibold text-gray-900">
                          Passengers
                        </dt>
                        <dd className="mt-0.5 text-gray-600">
                          {vehicle.passengers}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-gray-900">Luggage</dt>
                        <dd className="mt-0.5 text-gray-600">
                          {vehicle.luggage}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-gray-900">Fares</dt>
                        <dd className="mt-0.5 text-gray-600">
                          {PRICING_NOTE}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        <Section tone="muted">
          <Container width="prose">
            <Reveal>
              <Prose>
                <h2>Choosing a vehicle</h2>
                <p>
                  The passenger count is the firm number; the luggage guide is
                  not. Suitcases vary more than people do, so the figures above
                  are a guide subject to the actual dimensions of what you are
                  carrying. If you are travelling to an airport with a full set
                  of cases, say so when you book and we will send a vehicle with
                  the room for it rather than the minimum that fits the count.
                </p>
                <p>
                  Pushchairs, bicycles, instruments, ski bags and anything else
                  awkward are worth mentioning at the point of booking for the
                  same reason. A journey arranged around the real luggage is a
                  journey that starts on time.
                </p>

                <h2>Wheelchair-accessible vehicles</h2>
                <p>
                  Wheelchair-accessible vehicles are arranged separately and
                  should be booked in advance so the right vehicle is allocated
                  rather than the next one free. The details are on{" "}
                  <Link href="/services/accessible-transport">
                    wheelchair-accessible transport
                  </Link>
                  .
                </p>

                <h2>How fares work</h2>
                <p>
                  Published airport transfer prices are guide prices, and they
                  vary with the pickup address, the destination, the date, the
                  time and the requirements of the journey. Your fare is
                  confirmed before you book rather than run up on a meter.
                  Local metered journeys follow Brighton &amp; Hove City Council
                  tariffs.
                </p>
                <p>
                  Not sure which vehicle fits? Call {BUSINESS.telephone} and
                  describe the journey — it is quicker than working it out from
                  a table.
                </p>
              </Prose>
            </Reveal>
          </Container>
        </Section>

        <RelatedLinks
          links={[
            { label: "Airport transfers", href: "/airport-transfers" },
            { label: "Group & multi-seater travel", href: "/services/group-travel" },
            { label: "Accessible transport", href: "/services/accessible-transport" },
            { label: "How booking works", href: "/how-to-book" },
          ]}
        />

        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
