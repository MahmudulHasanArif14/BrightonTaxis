import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ShieldCheck, Car } from "lucide-react";
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

const PATH = "/about";
const DESCRIPTION = `Western Cars has provided private hire across Sussex since ${BUSINESS.founded}, trading as ${BUSINESS.legalName}. Our story, our drivers and our fleet.`;

export const metadata: Metadata = {
  title: "Brighton Taxi & Private Hire Since 2007",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: `About | ${BUSINESS.name}`,
    description: DESCRIPTION,
    url: PATH,
  },
};

const breadcrumbs = [{ name: "About", path: PATH }];

/**
 * The company's story.
 *
 * This page used to restate the services, the coverage area and the contact
 * details, which meant /about, /services, /service-areas and /contact were
 * four pages saying three of the same things. Each of those now lives in one
 * place and is linked from here.
 *
 * What is left is the thing only this page can carry: who the company is, how
 * long it has been doing this, and what changed along the way.
 */
const stats = [
  { value: "18+", label: "Years serving" },
  { value: "24/7", label: "Availability" },
  { value: "6+", label: "Vehicle types" },
];

const pillars = [
  {
    icon: ShieldCheck,
    title: "Professional service",
    body: "Every driver is DBS-checked, licensed by Brighton & Hove City Council, and trained to deliver a consistently professional experience.",
  },
  {
    icon: Clock,
    title: "24 hours a day",
    body: "A round-the-clock booking service for local journeys, early-morning airport runs and late-night returns — every day of the year.",
  },
  {
    icon: Car,
    title: "Flexible fleet",
    body: "From executive saloons to 8-seater carriers and wheelchair-accessible vehicles — the right vehicle for every journey.",
  },
];

const milestones = [
  { year: "2007", body: "Founded in Crawley, expanding across Sussex" },
  { year: "2015", body: "Corporate account programme launched" },
  { year: "2020", body: "WAV fleet expanded for accessible travel" },
  { year: "2024", body: "Brighton & Hove dedicated service" },
];

export default function AboutPage() {
  return (
    <>
      <PageJsonLd
        path={PATH}
        name="About Western Cars Brighton"
        description={DESCRIPTION}
        breadcrumbs={breadcrumbs}
      />

      <Header />

      <main id="main">
        <PageHero
          eyebrow={`Established ${BUSINESS.founded} · Brighton & Hove`}
          title="A Brighton private hire service built on reliability"
          intro="Local knowledge, professional drivers, and a fleet designed for everything from everyday journeys to airport and group travel."
          breadcrumbs={breadcrumbs}
        />

        <Section tone="white">
          <Container width="prose">
            <Reveal>
              <Prose>
                <h2>Who we are</h2>
                <p>
                  Western Cars was established in {BUSINESS.founded} to provide
                  private hire across East and West Sussex and the surrounding
                  areas. The service covers Brighton and Hove, major stations,
                  and UK airports including Gatwick, Heathrow, London City,
                  Stansted and Luton.
                </p>
                <p>
                  Our fleet includes executive vehicles, saloons, estates, six-,
                  seven- and eight-seater carriers, and wheelchair-accessible
                  vehicles — so there is always a right-sized option for the
                  journey ahead. The capacities are set out on{" "}
                  <Link href="/fleet">our fleet page</Link>.
                </p>
              </Prose>
            </Reveal>

            <Reveal>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-gray-200 py-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-sm text-gray-600">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </Container>
        </Section>

        <Section tone="muted">
          <Container>
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
                What sets us apart
              </h2>
              <p className="mt-3 max-w-2xl text-gray-600">
                Three things we refuse to compromise on — no matter the journey.
              </p>
            </Reveal>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {pillars.map((pillar, index) => (
                <Reveal
                  as="li"
                  key={pillar.title}
                  delay={Math.min(index, 2) * 70}
                  className="h-full"
                >
                  <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6">
                    <span
                      aria-hidden="true"
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100"
                    >
                      <pillar.icon className="h-6 w-6 text-green-700" />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-gray-900">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {pillar.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>

        <Section tone="white">
          <Container width="prose">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
                Nearly two decades on the road
              </h2>
            </Reveal>
            <ol className="mt-8 space-y-0">
              {milestones.map((milestone, index) => (
                <Reveal
                  as="li"
                  key={milestone.year}
                  delay={Math.min(index, 3) * 60}
                >
                  {/* A hairline rail with a marker on it, rather than a thick
                      coloured edge: the dot is what reads as a point in time. */}
                  <div className="relative grid gap-1 border-l border-gray-200 py-4 pl-6 sm:grid-cols-[88px_1fr] sm:gap-6 sm:pl-8">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[5px] top-[26px] h-2.5 w-2.5 rounded-full bg-green-600 ring-4 ring-white"
                    />
                    <span className="font-display font-bold text-green-800">
                      {milestone.year}
                    </span>
                    <span className="text-gray-700">{milestone.body}</span>
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
                <h2>Local first. Every time.</h2>
                <p>
                  We are not a faceless national app. We are a Brighton
                  business, run by people who live here, drive here, and know
                  the shortcuts between the Lanes and the Amex on a match day.
                  That local knowledge is what our passengers keep coming back
                  for.
                </p>

                <h2>Company details</h2>
                <p>
                  Western Cars Brighton is the trading name of{" "}
                  {BUSINESS.legalName}, registered in England and Wales under
                  company number {BUSINESS.companyNumber}. We are a private hire
                  operator rather than a hackney carriage firm, which means our
                  vehicles are booked through the office rather than hailed in
                  the street or picked up from a rank.
                </p>
                <p>
                  Phone, email and the registered office address are all on{" "}
                  <Link href="/contact">the contact page</Link>.
                </p>
              </Prose>
            </Reveal>
          </Container>
        </Section>

        <RelatedLinks
          links={[
            { label: "Our services", href: "/services" },
            { label: "Our fleet", href: "/fleet" },
            { label: "Areas we cover", href: "/service-areas" },
            { label: "Contact us", href: "/contact" },
          ]}
        />

        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
