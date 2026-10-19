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

export default function Home() {
  return (
    <SmoothScroll>
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
