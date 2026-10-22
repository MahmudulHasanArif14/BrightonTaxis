import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Container, PageHero, Section } from "@/components/ui";
import { BUSINESS } from "@/lib/business";

/**
 * The 404 page.
 *
 * Noindex, because a 404 that search engines index becomes a soft-404 problem
 * later. It carries real navigation rather than a dead end: most people who
 * land here followed a stale link and still want a taxi.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const destinations = [
  { label: "Home", href: "/", note: "Start again from the front page." },
  {
    label: "Our services",
    href: "/services",
    note: "Local journeys, corporate accounts, group and accessible travel.",
  },
  {
    label: "Airport transfers",
    href: "/airport-transfers",
    note: "Gatwick, Heathrow, London City, Stansted and Luton.",
  },
  {
    label: "How to book",
    href: "/how-to-book",
    note: "What we need from you, and how the fare is confirmed.",
  },
  {
    label: "Questions and answers",
    href: "/faq",
    note: "The things people ask us most often.",
  },
  {
    label: "Contact us",
    href: "/contact",
    note: `Or just call ${BUSINESS.telephone}.`,
  },
];

export default function NotFound() {
  return (
    <>
      <Header />

      <main id="main">
        <PageHero
          eyebrow="404"
          title="We could not find that page"
          intro="The link may be out of date, or the address may have a typo in it. Everything on the site is one of the links below — or call us and we will book the journey for you."
        />

        <Section tone="white">
          <Container>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination) => (
                <li key={destination.href}>
                  <Link
                    href={destination.href}
                    className="block h-full rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-green-300"
                  >
                    <span className="font-display text-lg font-semibold text-gray-900">
                      {destination.label}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-gray-600">
                      {destination.note}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
