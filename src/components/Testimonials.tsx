"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  {
    name: "Andrea Frontelo",
    location: "East Grinstead · Heathrow Transfer",
    text: "Used Western Cars for our Heathrow transfer. The driver was early, the Mercedes immaculate, and the ride stress-free. Wouldn't use anyone else.",
  },
  {
    name: "James T.",
    location: "Corporate Account",
    text: "Flight delayed by two hours and they waited without charging extra. Brilliant service.",
  },
  {
    name: "Claire W.",
    location: "Lingfield · Gatwick Return",
    text: "Booking was effortless and the chauffeur was fantastic. Will definitely use again.",
  },
  {
    name: "Mr Treharne",
    location: "Brighton",
    text: "Excellent BMW 5 Series. Very clean, punctual and extremely professional chauffeur.",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".review-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scroll-section
      className="py-20 md:py-28 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-green-600 font-semibold text-sm tracking-wider uppercase mb-2">
            Client Reviews
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
            Trusted by Thousands
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-gray-700 font-semibold">5.0</span>
            <span className="text-gray-500 text-sm">
              based on 700+ verified reviews
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="review-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
              <div>
                <p className="font-semibold text-gray-900">{r.name}</p>
                <p className="text-sm text-gray-500">{r.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
