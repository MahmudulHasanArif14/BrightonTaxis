"use client";

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
import { LocalBusinessJsonLd, FaqJsonLd } from "@/components/Seo";

export default function Home() {
  return (
    <SmoothScroll>
      {/* Homepage only. The TaxiService entity describes this site as a whole
          and the FAQPage answers the homepage's own questions, so repeating
          either on an article or a listing page would assert both about a page
          that is not the business's front door. */}
      <LocalBusinessJsonLd />
      <FaqJsonLd />
      <Header />
      <main>
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
