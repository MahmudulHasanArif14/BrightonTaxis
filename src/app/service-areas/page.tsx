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
import { BUSINESS } from "@/lib/business";

const PATH = "/service-areas";
const DESCRIPTION =
  "Where Western Cars Brighton operates: Brighton and Hove including Kemptown, the Marina, Preston Park and Portslade, plus Shoreham-by-Sea, Lewes, Worthing and Haywards Heath.";

export const metadata: Metadata = {
  title: "Areas We Cover",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: `Areas We Cover | ${BUSINESS.name}`,
    description: DESCRIPTION,
    url: PATH,
  },
};

const breadcrumbs = [{ name: "Areas we cover", path: PATH }];

/**
 * One coverage page, not nine town pages.
 *
 * The obvious move here would be a page each for Hove, Kemptown, Portslade,
 * Lewes, Worthing and the rest. We have not done that, for two reasons. There
 * is no verified local information to put on them — no branch, no local
 * number, no area-specific service — so each would be this page with the town
 * name swapped, which is the textbook definition of a doorway page. And the
 * business has not confirmed that it has any presence in those towns beyond
 * driving to them.
 *
 * If the business can supply genuinely local detail for a given town, that
 * town earns a page. Until then, this one tells the truth in less space.
 * See docs/CONTENT_NOTES.md.
 */
const areas = [
  {
    group: "Brighton",
    places: [
      "City centre and The Lanes",
      "Kemptown and Brighton Marina",
      "Preston Park and Fiveways",
      "Hanover and Elm Grove",
      "Hollingbury and Patcham",
      "Moulsecoomb and Bevendean",
    ],
  },
  {
    group: "Hove and west",
    places: [
      "Hove and Brunswick",
      "Portslade and Southwick",
      "Shoreham-by-Sea",
      "Worthing",
    ],
  },
  {
    group: "Out of town",
    places: [
      "Lewes",
      "Haywards Heath",
      "Burgess Hill and the A23 corridor",
      "Longer journeys across the UK, by quote",
    ],
  },
];

export default function ServiceAreasPage() {
  return (
    <>
      <PageJsonLd
        path={PATH}
        name="Areas we cover"
        description={DESCRIPTION}
        breadcrumbs={breadcrumbs}
      />

      <Header />

      <main id="main">
        <PageHero
          eyebrow="Coverage"
          title="Areas we cover"
          intro="Brighton and Hove is where most of our work is. Beyond the city we run regularly to the Sussex towns along the coast and up the A23, and we will quote for journeys anywhere in the UK."
          breadcrumbs={breadcrumbs}
        />

        <Section tone="white">
          <Container>
            <ul className="grid gap-6 md:grid-cols-3">
              {areas.map((area, index) => (
                <Reveal as="li" key={area.group} delay={Math.min(index, 2) * 70}>
                  <div className="h-full rounded-2xl border border-gray-200 bg-white p-6">
                    <h2 className="font-display text-lg font-semibold text-gray-900">
                      {area.group}
                    </h2>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      {area.places.map((place) => (
                        <li key={place} className="flex gap-2">
                          <span aria-hidden="true" className="text-green-600">
                            ·
                          </span>
                          {place}
                        </li>
                      ))}
                    </ul>
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
                <h2>Pickups outside this list</h2>
                <p>
                  The list above is where we work routinely, not a boundary
                  fence. If your pickup or destination is not on it, call{" "}
                  {BUSINESS.telephone} and ask — we would rather tell you
                  honestly that a journey is not one we can cover than take a
                  booking we cannot fulfil.
                </p>
                <h2>Travelling out of the area</h2>
                <p>
                  Journeys that start in Brighton and finish a long way away are
                  routine: the five{" "}
                  <Link href="/airport-transfers">airport transfers</Link> we run are
                  all of that kind. Longer UK journeys are quoted individually,
                  so call or email rather than booking blind.
                </p>
                <h2>A note on offices</h2>
                <p>
                  We have one address, the registered office in Brighton listed
                  on our <Link href="/contact">contact page</Link>. Covering a town
                  does not mean we have premises there, and this site will not
                  tell you otherwise.
                </p>
              </Prose>
            </Reveal>
          </Container>
        </Section>

        <RelatedLinks
          links={[
            { label: "Local journeys", href: "/services/local-journeys" },
            { label: "Airport transfers", href: "/airport-transfers" },
            { label: "How booking works", href: "/how-to-book" },
            { label: "Contact us", href: "/contact" },
          ]}
        />

        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
