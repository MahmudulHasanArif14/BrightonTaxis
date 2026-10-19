"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const vehicles = [
  {
    name: "Saloon",
    seats: "Up to 4",
    bags: "2–3 medium",
    price: "from £35",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
    tag: "Most Popular",
  },
  {
    name: "Estate",
    seats: "Up to 4",
    bags: "Up to 4 medium",
    price: "from £42",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "BMW X5",
    seats: "Up to 5",
    bags: "Large capacity",
    price: "from £65",
    image:
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Range Rover",
    seats: "Up to 5",
    bags: "Premium",
    price: "from £85",
    image:
      "https://images.unsplash.com/photo-1606220838395-ae67f4c1d0d1?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Popular() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pop-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
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
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-green-600 font-semibold text-sm tracking-wider uppercase mb-2">
              Popular Vehicles
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
              Most Loved by Our Customers
            </h2>
            <p className="text-gray-600 mt-2 max-w-lg">
              Explore our top-rated cars, chosen by travellers, families and
              business professionals.
            </p>
          </div>
          <a
            href="https://westerncars.webbooker.icabbi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors"
          >
            View all
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.name}
              className="pop-card group bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {v.tag && (
                  <span className="absolute top-3 left-3 bg-green-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
                    {v.tag}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900">{v.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {v.seats} · {v.bags}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-gray-900">{v.price}</span>
                  <a
                    href="https://westerncars.webbooker.icabbi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-green-500 flex items-center justify-center transition-colors"
                  >
                    <ArrowRight
                      size={16}
                      className="text-gray-600 group-hover:text-black"
                    />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
