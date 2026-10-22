import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Fleet from "@/components/Fleet";
import WhyUs from "@/components/WhyUs";
import Popular from "@/components/Popular";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { PageJsonLd } from "@/components/Seo";
import { BUSINESS } from "@/lib/business";

const DESCRIPTION = `Licensed private hire taxis in Brighton & Hove since ${BUSINESS.founded}. Airport transfers to Gatwick, Heathrow, London City, Stansted and Luton, local journeys, corporate accounts and wheelchair-accessible vehicles. Call ${BUSINESS.telephone}.`;

/**
 * Homepage metadata.
 *
 * This page used to carry `"use client"`, which meant it could not export
 * metadata at all — no canonical, no page-level description. The marker was
 * never needed: every section below is its own client component, and a server
 * component can render those perfectly well. Removing it changes nothing about
 * the design and gives the site's most important page its canonical back.
 */
export const metadata: Metadata = {
  title: {
    absolute: `Taxis & Airport Transfers in Brighton & Hove | ${BUSINESS.name}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: `Taxis & Airport Transfers in Brighton & Hove | ${BUSINESS.name}`,
    description: DESCRIPTION,
    url: "/",
  },
};

export default function Home() {
  return (
    <SmoothScroll>
      {/* The business entity is declared once for the whole site, in the root
          layout, so it is no longer repeated here.

          The FAQPage markup that used to sit on this page has moved to /faq.
          Google requires every question in FAQ markup to be visible on the
          page carrying it, and this page renders no FAQ text — it never did,
          which is why the markup did not belong here. /faq shows all of it. */}
      <PageJsonLd
        path="/"
        name={`${BUSINESS.name} — taxis and airport transfers`}
        description={DESCRIPTION}
      />
      <Header />
      <main id="main">
        <Hero />
        <Fleet />
        <WhyUs />
        <Popular />
        <Services />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
