"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Plane,
  Building2,
  PartyPopper,
  Accessibility,
  Car,
  Map,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Plane,
    title: "Airport Transfers",
    desc: "Gatwick, Heathrow, Stansted, Luton & London City. Meet & greet + flight tracking.",
  },
  {
    icon: Car,
    title: "Local Journeys",
    desc: "Everyday rides across Brighton, Hove and the surrounding areas.",
  },
  {
    icon: Building2,
    title: "Corporate Accounts",
    desc: "Priority booking, monthly billing and executive vehicles for businesses.",
  },
  {
    icon: PartyPopper,
    title: "Event Hire",
    desc: "Weddings, Amex Stadium, festivals and nights out. Group vehicles available.",
  },
  {
    icon: Accessibility,
    title: "Accessible Taxis",
    desc: "Wheelchair-accessible vehicles with trained drivers across Brighton & Hove.",
  },
  {
    icon: Map,
    title: "Long Distance",
    desc: "Reliable transfers anywhere in the UK with fixed guide prices.",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".service-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      data-scroll-section
      className="py-20 md:py-28 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-green-600 font-semibold text-sm tracking-wider uppercase mb-2">
            What We Offer
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
            Taxi Services Built Around You
          </h2>
          <p className="text-gray-600 mt-3">
            From airport transfers to everyday journeys, Western Cars provides
            reliable private hire across Brighton, Hove and beyond.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="service-card group p-6 rounded-2xl border border-gray-100 bg-white hover:border-green-200 hover:shadow-lg transition-all card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 group-hover:bg-green-500 flex items-center justify-center transition-colors mb-4">
                <s.icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {s.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
