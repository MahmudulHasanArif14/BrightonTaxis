"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BUSINESS, PRICING_NOTE, VEHICLES } from "@/lib/business";
import { useReveal } from "./useReveal";

/**
 * The vehicle strip.
 *
 * This used to list four cards headed "Saloon", "Estate", "BMW X5" and
 * "Range Rover" at prices "from £35" to "from £85", under a heading that said
 * the vehicles were the most loved by our customers.
 *
 * Western Cars publishes none of that. It offers three classes -- saloon,
 * estate and multi-seater -- names no model, and states one pricing rule:
 * guide prices, with the fare confirmed before booking. The two SUV cards,
 * all four prices and the popularity claim were invented, and the photographs
 * underneath them were stock pictures of cars the company had never said it
 * ran. The copy here now says what the business says.
 */
const images: Record<string, string> = {
  saloon:
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
  estate:
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80",
  "multi-seater":
    "https://images.pexels.com/photos/12960352/pexels-photo-12960352.jpeg?auto=compress&cs=tinysrgb&w=800",
};

export default function Popular() {
  const sectionRef = useReveal<HTMLElement>([
    {
      selector: ".pop-card",
      start: 0.75,
      from: { y: 60 },
      duration: 0.8,
      stagger: 0.12,
    },
  ]);

  return (
    <section
      ref={sectionRef}
      data-scroll-section
      className="py-20 md:py-28 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-green-700 font-semibold text-sm tracking-wider uppercase mb-2">
              Our vehicles
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              A Vehicle to Suit Every Traveller
            </h2>
            <p className="text-gray-600 mt-2 max-w-xl">
              Our vehicles are fully licensed, insured and maintained for
              comfort and reliability. Whether you&apos;re travelling alone,
              with family or as part of a larger group, we&apos;ll help you find
              the right vehicle for your journey.
            </p>
          </div>
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition-colors"
          >
            See the full fleet
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VEHICLES.map((v) => (
            <div
              key={v.slug}
              className="pop-card group bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={images[v.slug]}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {"tag" in v && v.tag ? (
                  <span className="absolute top-3 left-3 bg-green-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
                    {v.tag}
                  </span>
                ) : null}
              </div>
              <div className="p-5 flex flex-1 flex-col">
                <h3 className="font-semibold text-lg text-gray-900">
                  {v.name}
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {v.summary}
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-gray-700">
                  <li>{v.passengers}</li>
                  <li>{v.luggage}</li>
                </ul>
                <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                  <span className="text-sm text-gray-600">{PRICING_NOTE}</span>
                  <a
                    href={BUSINESS.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 shrink-0 rounded-full bg-gray-100 group-hover:bg-green-500 flex items-center justify-center transition-colors"
                  >
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="text-gray-600 group-hover:text-black"
                    />
                    <span className="sr-only">Book a {v.name}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-gray-600">
          Not sure which vehicle you need? Call{" "}
          <a
            href={BUSINESS.telHref}
            className="font-semibold text-green-700 underline-offset-4 hover:underline"
          >
            {BUSINESS.telephone}
          </a>{" "}
          and we&apos;ll help you choose. Travelling with a wheelchair?{" "}
          <Link
            href="/services/accessible-transport"
            className="font-semibold text-green-700 underline-offset-4 hover:underline"
          >
            See our wheelchair-accessible taxis
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
