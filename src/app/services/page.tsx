import type { Metadata } from "next";
import {
  Accessibility,
  PartyPopper,
  Briefcase,
  Building2,
  Car,
  Plane,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { PageJsonLd } from "@/components/Seo";
import { RelatedLinks } from "@/components/ContentSections";
import {
  ClosingCta,
  Container,
  LinkCard,
  PageHero,
  Prose,
  Section,
} from "@/components/ui";
import { BUSINESS, SERVICES } from "@/lib/business";

const PATH = "/services";
const DESCRIPTION =
  "Everything Western Cars Brighton does: airport transfers, local private hire across Brighton and Hove, corporate accounts, executive travel, group vehicles and wheelchair-accessible transport.";

export const metadata: Metadata = {
  title: "Our Services",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `Our Services | ${BUSINESS.name}`, description: DESCRIPTION, url: PATH },
};

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  "airport-transfers": Plane,
  "local-journeys": Car,
  "corporate-accounts": Building2,
  "executive-travel": Briefcase,
  "group-travel": Users,
  "event-hire": PartyPopper,
  "accessible-transport": Accessibility,
};

export default function ServicesHub() {
  return (
    <>
      <PageJsonLd
        path={PATH}
        name="Our Services"
        description={DESCRIPTION}
        breadcrumbs={[{ name: "Services", path: PATH }]}
      />

      <Header />

      <main id="main">
        <PageHero
          eyebrow="Services"
          title="What we do"
          intro="Every service here is pre-booked. If you are not sure which one fits your journey, call the booking line and describe it — that is usually quicker than reading."
          breadcrumbs={[{ name: "Services", path: PATH }]}
        />

        <Section tone="white">
          <Container>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service, index) => (
                <Reveal
                  as="li"
                  key={service.slug}
                  delay={Math.min(index, 5) * 60}
                  className="h-full"
                >
                  <LinkCard
                    href={service.href}
                    title={service.title}
                    description={service.summary}
                    icon={icons[service.slug]}
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
                <h2>One thing they all have in common</h2>
                <p>
                  Western Cars Brighton is a private hire operator, so every
                  journey on this list is booked through the office rather than
                  hailed in the street. In practice that means the vehicle is
                  allocated before you need it and the fare is agreed before the
                  journey is accepted.
                </p>
                <p>
                  Bookings are taken online, by phone on {BUSINESS.telephone},
                  and by email at {BUSINESS.email}. The booking line is staffed{" "}
                  {BUSINESS.phoneHours}.
                </p>
              </Prose>
            </Reveal>
          </Container>
        </Section>

        <RelatedLinks
          heading="Where to next"
          links={[
            { label: "How booking works", href: "/how-to-book" },
            { label: "Areas we cover", href: "/service-areas" },
            { label: "Airport transfer destinations", href: "/airport-transfers" },
            { label: "Questions and answers", href: "/faq" },
          ]}
        />

        <ClosingCta />
      </main>

      <Footer />
    </>
  );
}
